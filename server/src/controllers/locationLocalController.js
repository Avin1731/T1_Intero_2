const Location = require('../models/Location');
const { sendSuccess, sendError } = require('../utils/response');

const listLocations = async (req, res, next) => {
  try {
    const locations = await Location.findAll({
      attributes: ['locationId', 'name'],
      order: [['name', 'ASC']],
    });

    return sendSuccess(res, locations, 'Daftar location berhasil diambil');
  } catch (err) {
    next(err);
  }
};

const getLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const location = await Location.findOne({
      where: { locationId: id },
      attributes: ['locationId', 'name'],
    });

    if (!location) {
      return sendError(res, 'Location tidak ditemukan di database lokal', 404);
    }

    return sendSuccess(res, location, 'Data location ditemukan');
  } catch (err) {
    next(err);
  }
};

module.exports = { listLocations, getLocationById };
