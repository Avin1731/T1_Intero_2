const axios = require('axios');
const config = require('../config');
const { getAccessToken } = require('./satusehatAuthService');

const FHIR_BASE = `${config.satusehat.baseUrl}/fhir-r4/v1`;

/**
 * Mencari IHS Number dokter (Practitioner) berdasarkan NIK.
 * @returns {{ ihsNumber: string, name: string }}
 */
const getPractitionerByNik = async (nik) => {
  const token = await getAccessToken();

  const requestUrl = `${FHIR_BASE}/Practitioner?identifier=https://fhir.kemkes.go.id/id/nik|${nik}`;
  console.log('[Practitioner] Request URL:', requestUrl);

  let response;
  try {
    response = await axios.get(`${FHIR_BASE}/Practitioner`, {
      params: { identifier: `https://fhir.kemkes.go.id/id/nik|${nik}` },
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    if (err.response?.status === 401) {
      const authErr = new Error('Token SATUSEHAT tidak valid atau telah kadaluarsa');
      authErr.statusCode = 401;
      throw authErr;
    }
    console.error('[Practitioner] API error:', err.response?.status, JSON.stringify(err.response?.data));
    throw err;
  }

  const bundle = response.data;
  console.log('[Practitioner] Bundle total:', bundle.total, '| Entries:', bundle.entry?.length ?? 0);

  if (!bundle.entry || bundle.entry.length === 0) {
    const notFound = new Error(`Dokter dengan NIK ${nik} tidak ditemukan`);
    notFound.statusCode = 404;
    throw notFound;
  }

  const practitioner = bundle.entry[0].resource;
  const ihsNumber = practitioner.id;
  const nameEntry = practitioner.name?.[0];
  const name = nameEntry?.text || nameEntry?.family || 'Dokter';

  return { ihsNumber, name };
};

module.exports = { getPractitionerByNik };
