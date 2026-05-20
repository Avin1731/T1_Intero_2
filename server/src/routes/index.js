const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { register } = require('../controllers/registrationController');
const satusehatRoutes = require('./satusehat');

router.get('/health', healthController.checkHealth);
router.post('/register', register);
router.use('/satusehat', satusehatRoutes);

module.exports = router;
