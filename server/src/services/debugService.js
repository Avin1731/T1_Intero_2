const axios = require('axios');
const config = require('../config');
const { getAccessToken } = require('./satusehatAuthService');

const FHIR_BASE = `${config.satusehat.baseUrl}/fhir-r4/v1`;

/**
 * Coba berbagai format identifier untuk Practitioner
 * dan kembalikan raw response dari SATUSEHAT
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
    {
      label: 'nik (encoded via params)',
      url: null,
      params: { identifier: `https://fhir.kemkes.go.id/id/nik|${nik}` },
    },
    {
      label: 'list semua (tanpa filter, max 5)',
      url: `${FHIR_BASE}/Practitioner?_count=5`,
    },
  ];

  const results = [];

  for (const attempt of attempts) {
    try {
      let res;
      if (attempt.url) {
        res = await axios.get(attempt.url, { headers });
      } else {
        res = await axios.get(`${FHIR_BASE}/Practitioner`, { params: attempt.params, headers });
      }

      const bundle = res.data;
      results.push({
        label: attempt.label,
        actualUrl: res.request?.path || attempt.url || '(encoded)',
        httpStatus: res.status,
        total: bundle.total ?? '(tidak ada field total)',
        entryCount: bundle.entry?.length ?? 0,
        entries: (bundle.entry || []).slice(0, 3).map((e) => {
          const r = e.resource;
          return {
            id: r.id,
            name: r.name?.[0]?.text || r.name?.[0]?.family || '-',
            identifiers: r.identifier?.map((id) => `${id.system}|${id.value}`) || [],
          };
        }),
      });
    } catch (err) {
      results.push({
        label: attempt.label,
        actualUrl: attempt.url || '(encoded)',
        httpStatus: err.response?.status ?? 'network error',
        error: err.response?.data?.issue?.[0]?.diagnostics || err.message,
      });
    }
  }

  return results;
};

module.exports = { debugPractitionerNik };
