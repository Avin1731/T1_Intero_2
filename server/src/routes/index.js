const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { register } = require('../controllers/registrationController');
const authRoutes = require('./auth');
const satusehatRoutes = require('./satusehat');
const encounterRoutes = require('./encounters');

router.get('/health', healthController.checkHealth);
router.use('/auth', authRoutes);
router.post('/register', register);
router.use('/satusehat', satusehatRoutes);
router.use('/encounters', encounterRoutes);

module.exports = router;

