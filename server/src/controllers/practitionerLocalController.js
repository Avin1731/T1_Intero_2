const { Op } = require('sequelize');
const Practitioner = require('../models/Practitioner');
const { sendSuccess, sendError } = require('../utils/response');

const listPractitioners = async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    const practitioners = await Practitioner.findAll({
      where,
      attributes: ['nik', 'name', 'ihsNumber'], // Only return requested fields
      order: [['name', 'ASC']],
    });

    return sendSuccess(res, practitioners, 'Daftar practitioner berhasil diambil');
  } catch (err) {
    next(err);
  }
};

const getPractitionerByNik = async (req, res, next) => {
  try {
    const { nik } = req.params;
    const practitioner = await Practitioner.findOne({
      where: { nik },
      attributes: ['nik', 'name', 'ihsNumber'],
    });

    if (!practitioner) {
      return sendError(res, 'Practitioner tidak ditemukan di database lokal', 404);
    }

    return sendSuccess(res, practitioner, 'Data practitioner ditemukan');
  } catch (err) {
    next(err);
  }
};

module.exports = { listPractitioners, getPractitionerByNik };
