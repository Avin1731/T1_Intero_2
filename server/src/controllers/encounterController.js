const { Op } = require('sequelize');
const EncounterRecord = require('../models/EncounterRecord');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * GET /api/v1/encounters
 * Ambil daftar riwayat pendaftaran dari SQLite.
 * Mendukung filter: ?patientNik=, ?page=, ?limit=
 */
const getEncounters = async (req, res, next) => {
  try {
    const { patientNik, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (patientNik) {
      where.patientNik = patientNik.trim();
    }

    const { count: total, rows: encounters } = await EncounterRecord.findAndCountAll({
      where,
      order: [['registeredAt', 'DESC']], // terbaru dulu
      limit: limitNum,
      offset,
    });

    return sendSuccess(
      res,
      {
        encounters,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Riwayat encounter berhasil diambil'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/encounters/:encounterId
 * Ambil detail satu encounter berdasarkan encounterId dari SATUSEHAT.
 */
const getEncounterById = async (req, res, next) => {
  try {
    const { encounterId } = req.params;

    const record = await EncounterRecord.findOne({ where: { encounterId } });

    if (!record) {
      return sendError(
        res,
        `Encounter dengan ID '${encounterId}' tidak ditemukan di database lokal`,
        404
      );
    }

    return sendSuccess(res, record, 'Detail encounter ditemukan');
  } catch (err) {
    next(err);
  }
};

module.exports = { getEncounters, getEncounterById };
