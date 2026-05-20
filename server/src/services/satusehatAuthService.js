const axios = require('axios');
const config = require('../config');

let cachedToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const { baseUrl, clientId, clientSecret } = config.satusehat;

  if (!clientId || !clientSecret) {
    const err = new Error('SATUSEHAT_CLIENT_ID and SATUSEHAT_CLIENT_SECRET must be set in .env');
    err.statusCode = 500;
    throw err;
  }

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  const response = await axios.post(
    `${baseUrl}/oauth2/v1/accesstoken?grant_type=client_credentials`,
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  cachedToken = response.data.access_token;
  // Gunakan 90% dari expires_in agar token tidak expired saat dipakai
  const expiresIn = response.data.expires_in || 3600;
  tokenExpiry = Date.now() + expiresIn * 0.9 * 1000;

  return cachedToken;
};

// Paksa refresh token (untuk keperluan testing)
const clearTokenCache = () => {
  cachedToken = null;
  tokenExpiry = null;
};

module.exports = { getAccessToken, clearTokenCache };
