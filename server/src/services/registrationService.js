const { getPatientByNik } = require('./patientService');
const { getPractitionerByNik } = require('./practitionerService');
const { createLocation } = require('./locationService');
const { createEncounter } = require('./encounterService');
const EncounterRecord = require('../models/EncounterRecord');

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
 * @param {string} [options.locationName]     - Nama lokasi (default: 'Ruang Poli Umum')
 * @returns {object} Ringkasan hasil pendaftaran
 */
const registerPatient = async ({
  patientNik = DUMMY_PATIENT_NIK,
  practitionerNik = DUMMY_PRACTITIONER_NIK,
  locationName = 'Ruang Poli Umum',
} = {}) => {
  // Langkah 2: Cari IHS Pasien dan IHS Dokter secara berurutan (sekuensial) untuk mencegah 429 Too Many Requests
  const patientData = await getPatientByNik(patientNik);
  const practitionerData = await getPractitionerByNik(practitionerNik);

  // Langkah 3: Buat Location
  const locationData = await createLocation(locationName);

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

