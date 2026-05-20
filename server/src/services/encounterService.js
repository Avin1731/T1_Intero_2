const axios = require('axios');
const config = require('../config');
const { getAccessToken } = require('./satusehatAuthService');

const FHIR_BASE = `${config.satusehat.baseUrl}/fhir-r4/v1`;

/**
 * Membuat resource Encounter FHIR di SATUSEHAT.
 * @param {object} params
 * @param {string} params.patientIhsNumber
 * @param {string} params.patientName
 * @param {string} params.practitionerIhsNumber
 * @param {string} params.practitionerName
 * @param {string} params.locationId
 * @param {string} params.locationName
 * @returns {{ encounterId: string, status: string }}
 */
const createEncounter = async ({
  patientIhsNumber,
  patientName,
  practitionerIhsNumber,
  practitionerName,
  locationId,
  locationName,
}) => {
  const token = await getAccessToken();
  const orgId = config.satusehat.orgId;

  // ISO 8601 UTC+0 saat request dijalankan
  const startTimestamp = new Date().toISOString();

  const payload = {
    resourceType: 'Encounter',
    status: 'arrived',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
      display: 'ambulatory',
    },
    subject: {
      reference: `Patient/${patientIhsNumber}`,
      display: patientName,
    },
    participant: [
      {
        type: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                code: 'ATND',
                display: 'attender',
              },
            ],
          },
        ],
        individual: {
          reference: `Practitioner/${practitionerIhsNumber}`,
          display: practitionerName,
        },
      },
    ],
    period: {
      start: startTimestamp,
    },
    location: [
      {
        location: {
          reference: `Location/${locationId}`,
          display: locationName,
        },
      },
    ],
    serviceProvider: {
      reference: `Organization/${orgId}`,
    },
  };

  let response;
  try {
    response = await axios.post(`${FHIR_BASE}/Encounter`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    if (err.response?.status === 401) {
      const authErr = new Error('Token SATUSEHAT tidak valid atau telah kadaluarsa');
      authErr.statusCode = 401;
      throw authErr;
    }
    throw err;
  }

  const encounterId = response.data.id;
  return { encounterId, status: response.data.status };
};

module.exports = { createEncounter };
