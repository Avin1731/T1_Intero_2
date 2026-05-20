const axios = require('axios');
const config = require('../config');
const { getAccessToken } = require('./satusehatAuthService');

const FHIR_BASE = `${config.satusehat.baseUrl}/fhir-r4/v1`;

const formatEntries = (bundle) =>
  (bundle.entry || []).slice(0, 5).map((e) => {
    const r = e.resource;
    const nikId = r.identifier?.find((id) =>
      id.system?.includes('nik')
    );
    return {
      ihsNumber: r.id,
      name: r.name?.[0]?.text || r.name?.[0]?.family || '-',
      nik: nikId?.value || '(tidak ada NIK)',
      identifierSystem: nikId?.system || '-',
    };
  });

/**
 * Coba berbagai format identifier untuk NIK tertentu
 */
const debugPractitionerNik = async (nik) => {
  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };

  const attempts = [
    {
      label: 'nik (raw URL)',
      url: `${FHIR_BASE}/Practitioner?identifier=https://fhir.kemkes.go.id/id/nik|${nik}`,
    },
    {
      label: 'nik-nakes (raw URL)',
      url: `${FHIR_BASE}/Practitioner?identifier=https://fhir.kemkes.go.id/id/nik-nakes|${nik}`,
    },
  ];

  const results = [];

  for (const attempt of attempts) {
    try {
      const res = await axios.get(attempt.url, { headers });
      const bundle = res.data;
      results.push({
        label: attempt.label,
        httpStatus: res.status,
        total: bundle.total ?? 0,
        entryCount: bundle.entry?.length ?? 0,
        entries: formatEntries(bundle),
      });
    } catch (err) {
      results.push({
        label: attempt.label,
        httpStatus: err.response?.status ?? 'network error',
        error: err.response?.data?.issue?.[0]?.diagnostics || err.message,
      });
    }
  }

  return results;
};

/**
 * Cari Practitioner berdasarkan nama + tanggal lahir.
 * Format birthdate: YYYY-MM-DD
 * Ini adalah cara yang didukung SATUSEHAT untuk menemukan NIK dokter yang valid di sandbox.
 */
const searchPractitionerByName = async ({ name, birthdate, gender }) => {
  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };

  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (birthdate) params.append('birthdate', birthdate);
  if (gender) params.append('gender', gender);

  const url = `${FHIR_BASE}/Practitioner?${params.toString()}`;

  try {
    const res = await axios.get(url, { headers });
    const bundle = res.data;
    return {
      httpStatus: res.status,
      total: bundle.total ?? 0,
      entryCount: bundle.entry?.length ?? 0,
      practitioners: formatEntries(bundle),
    };
  } catch (err) {
    return {
      httpStatus: err.response?.status ?? 'network error',
      error: err.response?.data?.issue?.[0]?.diagnostics || err.message,
      hint: 'Coba kombinasi: name + birthdate (YYYY-MM-DD), atau name + gender (male/female)',
    };
  }
};

module.exports = { debugPractitionerNik, searchPractitionerByName };
