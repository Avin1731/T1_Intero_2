const express = require('express');
const router = express.Router();
const { getEncounters, getEncounterById } = require('../controllers/encounterController');

// GET /api/v1/encounters?patientNik=&page=1&limit=10
router.get('/', getEncounters);

// GET /api/v1/encounters/:encounterId
router.get('/:encounterId', getEncounterById);

module.exports = router;
