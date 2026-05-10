const healthService = require('../services/healthService');
const { sendSuccess } = require('../utils/response');

const checkHealth = (req, res, next) => {
  try {
    const data = healthService.getHealthStatus();
    return sendSuccess(res, data, 'Server is healthy');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkHealth
};
