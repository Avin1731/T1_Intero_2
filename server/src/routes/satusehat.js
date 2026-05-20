const express = require('express');
const router = express.Router();
const {
  getToken,
  getPatient,
  getPractitioner,
  postLocation,
  postEncounter,
} = require('../controllers/registrationController');

router.get('/token', getToken);
router.get('/patient/:nik', getPatient);
router.get('/practitioner/:nik', getPractitioner);
router.post('/location', postLocation);
router.post('/encounter', postEncounter);

module.exports = router;
