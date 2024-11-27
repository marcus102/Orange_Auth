const express = require('express');
const router = express.Router();
const { generateOTP } = require('../controllers/OTPController');
const authenticatioController = require('../controllers/authenticationController');

router.use(authenticatioController.protect);

// POST Route to Generate OTP
router.post('/generate-otp', generateOTP);


module.exports = router;
