const { getPatientByNik } = require('./patientService');
const { getPractitionerByNik } = require('./practitionerService');
const { createLocation } = require('./locationService');
const { createEncounter } = require('./encounterService');
const EncounterRecord = require('../models/EncounterRecord');
const PractitionerLocal = require('../models/Practitioner');
const LocationLocal = require('../models/Location');

const DUMMY_PATIENT_NIK = '1000000000000001';
const DUMMY_PRACTITIONER_NIK = '1000000000000002';

/**
 * Orkestrasi pendaftaran pasien rawat jalan sesuai standar SATUSEHAT.
 * Langkah: Auth → Cari IHS Pasien → Cari IHS Dokter → Buat Location → Buat Encounter
 * Setelah Encounter berhasil dibuat di SATUSEHAT, data disimpan ke DB lokal (dual-write).
 *
 * @param {object} options
 * @param {string} [options.patientNik]       - NIK pasien (default: dummy)
 * @param {string} [options.practitionerNik]  - NIK dokter (default: dummy)
 * @param {string} [options.locationId]       - ID lokasi lokal (opsional)
 * @param {string} [options.locationName]     - Nama lokasi (default: 'Ruang Poli Umum')
 * @returns {object} Ringkasan hasil pendaftaran
 */
const registerPatient = async ({
  patientNik = DUMMY_PATIENT_NIK,
  patientIhsNumber = null,
  patientName = null,
  practitionerNik = DUMMY_PRACTITIONER_NIK,
  practitionerIhsNumber = null,
  practitionerName = null,
  locationId = null,
  locationName = 'Ruang Poli Umum',
} = {}) => {
  // Langkah 1: Cari IHS Pasien (Gunakan data langsung jika ada, misal Pasien Baru)
  let patientData;
  if (patientIhsNumber && patientName) {
    patientData = { ihsNumber: patientIhsNumber, name: patientName };
  } else {
    patientData = await getPatientByNik(patientNik);
  }

  // Langkah 2: Cari IHS Dokter (Gunakan data langsung jika ada)
  let practitionerData;
  if (practitionerIhsNumber && practitionerName) {
    practitionerData = { ihsNumber: practitionerIhsNumber, name: practitionerName };
  } else {
    practitionerData = await PractitionerLocal.findOne({ where: { nik: practitionerNik } });
    if (!practitionerData) {
      practitionerData = await getPractitionerByNik(practitionerNik);
    }
  }

  // Langkah 3: Cari Location (Prioritaskan DB Lokal)
  const DUMMY_LIDS = [
    'a9f3c2d1-5e4b-4a7f-b123-8c0e1d2f3a4b', 
    'b8e2c1d0-4d3a-3b6e-a012-7b9d0c1e2f3a', 
    'c7d1b0c9-3c29-2a5d-9f01-6a8c9b0d1e2f'
  ];

  if (locationId && DUMMY_LIDS.includes(locationId)) {
    // Hapus dummy record dari DB lokal agar bersih
    try {
      await LocationLocal.destroy({ where: { locationId } });
    } catch (_) {}
  }

  let locationData;
  if (locationId && !DUMMY_LIDS.includes(locationId)) {
    locationData = await LocationLocal.findOne({ where: { locationId } });
  } else if (locationName) {
    const { Op } = require('sequelize');
    locationData = await LocationLocal.findOne({ 
      where: { 
        name: locationName,
        locationId: { [Op.notIn]: DUMMY_LIDS }
      } 
    });
  }

  if (locationData) {
    // Sesuaikan format dengan output createLocation
    locationData = {
      locationId: locationData.locationId,
      locationName: locationData.name
    };
  } else {
    // Fallback jika tidak ada di DB lokal (Create or Get di SATUSEHAT)
    locationData = await createLocation(locationName);
  }

  // Langkah 4: Buat Encounter
  const encounterData = await createEncounter({
    patientIhsNumber: patientData.ihsNumber,
    patientName: patientData.name,
    practitionerIhsNumber: practitionerData.ihsNumber,
    practitionerName: practitionerData.name,
    locationId: locationData.locationId,
    locationName: locationData.locationName,
  });

  const registeredAt = new Date();

  // ── Dual-Write: Simpan ke DB lokal setelah SATUSEHAT berhasil ─────
  // Jika DB gagal, log warning saja — jangan batalkan response sukses.
  // SATUSEHAT adalah sumber kebenaran; DB lokal hanya untuk riwayat & query cepat.
  try {
    await EncounterRecord.create({
      patientNik,
      patientIhsNumber: patientData.ihsNumber,
      patientName: patientData.name,
      practitionerNik,
      practitionerIhsNumber: practitionerData.ihsNumber,
      practitionerName: practitionerData.name,
      locationId: locationData.locationId,
      locationName: locationData.locationName,
      encounterId: encounterData.encounterId,
      encounterStatus: encounterData.status,
      registeredAt,
    });
    console.log(`[DB] Encounter ${encounterData.encounterId} tersimpan ke database lokal.`);
  } catch (dbErr) {
    console.warn(`[DB] Gagal menyimpan encounter ke database: ${dbErr.message}`);
  }
  // ─────────────────────────────────────────────────────────────────

  return {
    patient: {
      nik: patientNik,
      ihsNumber: patientData.ihsNumber,
      name: patientData.name,
    },
    practitioner: {
      nik: practitionerNik,
      ihsNumber: practitionerData.ihsNumber,
      name: practitionerData.name,
    },
    location: {
      id: locationData.locationId,
      name: locationData.locationName,
    },
    encounter: {
      id: encounterData.encounterId,
      status: encounterData.status,
      timestamp: registeredAt.toISOString(),
    },
  };
};

module.exports = { registerPatient };

