const axios = require('axios');
const config = require('../config');
const { getAccessToken } = require('./satusehatAuthService');

const FHIR_BASE = `${config.satusehat.baseUrl}/fhir-r4/v1`;

/**
 * Mencari IHS Number pasien berdasarkan NIK.
 * @returns {{ ihsNumber: string, name: string }}
 */
const getPatientByNik = async (nik) => {
  const token = await getAccessToken();

  let response;
  try {
    response = await axios.get(`${FHIR_BASE}/Patient`, {
      params: { identifier: `https://fhir.kemkes.go.id/id/nik|${nik}` },
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    if (err.response?.status === 401) {
      const authErr = new Error('Token SATUSEHAT tidak valid atau telah kadaluarsa');
      authErr.statusCode = 401;
      throw authErr;
    }
    throw err;
  }

  const bundle = response.data;

  if (!bundle.entry || bundle.entry.length === 0) {
    const notFound = new Error(`Pasien dengan NIK ${nik} tidak ditemukan`);
    notFound.statusCode = 404;
    throw notFound;
  }

  const patient = bundle.entry[0].resource;
  const ihsNumber = patient.id;
  const nameEntry = patient.name?.[0];
  const name = nameEntry?.text || nameEntry?.family || 'Pasien';

  return { ihsNumber, name };
};

module.exports = { getPatientByNik };
