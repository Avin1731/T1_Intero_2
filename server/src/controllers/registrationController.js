const axios = require('axios');
const config = require('../config');
const { debugPractitionerNik } = require('../services/debugService');
const { registerPatient } = require('../services/registrationService');
const { getPatientByNik } = require('../services/patientService');
const { getPractitionerByNik } = require('../services/practitionerService');
const { createLocation } = require('../services/locationService');
const { createEncounter } = require('../services/encounterService');
const { getAccessToken } = require('../services/satusehatAuthService');
const { sendSuccess, sendError } = require('../utils/response');

// POST /api/v1/register — Orkestrasi penuh pendaftaran pasien
const register = async (req, res, next) => {
  try {
    const {
      patientNik,
      practitionerNik,
      locationName,
    } = req.body;

    const result = await registerPatient({ patientNik, practitionerNik, locationName });
    return sendSuccess(res, result, 'Pendaftaran pasien berhasil', 201);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/satusehat/token — Ambil access token (debug/testing)
const getToken = async (req, res, next) => {
  try {
    const token = await getAccessToken();
    return sendSuccess(res, { access_token: token }, 'Token berhasil diambil');
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/satusehat/patient/:nik — Cari pasien berdasarkan NIK
const getPatient = async (req, res, next) => {
  try {
    const { nik } = req.params;
    const data = await getPatientByNik(nik);
    return sendSuccess(res, data, 'Data pasien ditemukan');
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/satusehat/practitioner/:nik — Cari dokter berdasarkan NIK
const getPractitioner = async (req, res, next) => {
  try {
    const { nik } = req.params;
    const data = await getPractitionerByNik(nik);
    return sendSuccess(res, data, 'Data dokter ditemukan');
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/satusehat/location — Buat resource Location
const postLocation = async (req, res, next) => {
  try {
    const { locationName } = req.body;
    const data = await createLocation(locationName);
    return sendSuccess(res, data, 'Location berhasil dibuat', 201);
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/satusehat/encounter — Buat resource Encounter
const postEncounter = async (req, res, next) => {
  try {
    const {
      patientIhsNumber,
      patientName,
      practitionerIhsNumber,
      practitionerName,
      locationId,
      locationName,
    } = req.body;

    if (!patientIhsNumber || !practitionerIhsNumber || !locationId) {
      return sendError(res, 'patientIhsNumber, practitionerIhsNumber, dan locationId wajib diisi', 400);
    }

    const data = await createEncounter({
      patientIhsNumber,
      patientName,
      practitionerIhsNumber,
      practitionerName,
      locationId,
      locationName,
    });
    return sendSuccess(res, data, 'Encounter berhasil dibuat', 201);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/satusehat/debug/practitioner-nik/:nik — Coba semua format identifier
const debugPractitioner = async (req, res, next) => {
  try {
    const { nik } = req.params;
    const results = await debugPractitionerNik(nik);
    return sendSuccess(res, results, 'Debug: hasil semua percobaan identifier');
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/satusehat/debug/practitioner?name=... — Cari practitioner by name (debug)
const debugSearchPractitioner = async (req, res, next) => {
  try {
    const { name } = req.query;
    const token = await getAccessToken();
    const FHIR_BASE = `${config.satusehat.baseUrl}/fhir-r4/v1`;

    const queryString = name ? `name=${encodeURIComponent(name)}` : `_count=10`;
    const response = await axios.get(`${FHIR_BASE}/Practitioner?${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const bundle = response.data;
    const entries = (bundle.entry || []).map((e) => {
      const r = e.resource;
      const nikIdentifier = r.identifier?.find(
        (id) => id.system === 'https://fhir.kemkes.go.id/id/nik'
      );
      return {
        ihsNumber: r.id,
        name: r.name?.[0]?.text || r.name?.[0]?.family || '-',
        nik: nikIdentifier?.value || '(tidak ada NIK)',
      };
    });

    return sendSuccess(res, { total: bundle.total, practitioners: entries }, 'Debug: daftar practitioner');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  getToken,
  getPatient,
  getPractitioner,
  postLocation,
  postEncounter,
  debugPractitioner,
  debugSearchPractitioner,
};
