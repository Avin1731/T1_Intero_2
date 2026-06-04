const express = require('express');
const router = express.Router();
const { listLocations, getLocationById } = require('../controllers/locationLocalController');

router.get('/', listLocations);
router.get('/:id', getLocationById);

module.exports = router;
