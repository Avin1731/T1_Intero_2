const express = require('express');
const router = express.Router();
const {
  getToken,
  getPatient,
  getPractitioner,
  postLocation,
  postEncounter,
  debugSearchPractitioner,
} = require('../controllers/registrationController');

router.get('/token', getToken);
router.get('/patient/:nik', getPatient);
router.get('/practitioner/:nik', getPractitioner);
router.post('/location', postLocation);
router.post('/encounter', postEncounter);

// Debug: cari practitioner by name atau list semua
router.get('/debug/practitioner', debugSearchPractitioner);

module.exports = router;
