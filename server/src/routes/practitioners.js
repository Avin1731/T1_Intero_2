const express = require('express');
const router = express.Router();
const { listPractitioners, getPractitionerByNik } = require('../controllers/practitionerLocalController');

router.get('/', listPractitioners);
router.get('/:nik', getPractitionerByNik);

module.exports = router;
