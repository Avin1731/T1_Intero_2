const axios = require('axios');
const config = require('../config');
const { getAccessToken } = require('./satusehatAuthService');

const FHIR_BASE = `${config.satusehat.baseUrl}/fhir-r4/v1`;

/**
 * Membuat resource Location FHIR di SATUSEHAT.
 * @param {string} locationName - Nama ruangan/lokasi
 * @returns {{ locationId: string, locationName: string }}
 */
const createLocation = async (locationName = 'Ruang Poli Umum') => {
  const token = await getAccessToken();
  const orgId = config.satusehat.orgId;

  const payload = {
    resourceType: 'Location',
    status: 'active',
    name: locationName,
    description: locationName,
    mode: 'instance',
    physicalType: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          code: 'ro',
          display: 'Room',
        },
      ],
    },
    managingOrganization: {
      reference: `Organization/${orgId}`,
    },
  };

  let response;
  try {
    response = await axios.post(`${FHIR_BASE}/Location`, payload, {
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

  const locationId = response.data.id;
  return { locationId, locationName };
};

module.exports = { createLocation };
