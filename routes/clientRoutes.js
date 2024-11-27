const express = require('express');
const router = express.Router();
const {
  fetchCurrentUserAndRandomOthers,
  verifyUserInformation,
} = require('../controllers/clientController');
const authenticatioController = require('../controllers/authenticationController');

router.post('/signup', authenticatioController.signUp);
router.post('/signin', authenticatioController.logIn);

// GET Route to Fetch OTP
router.use(authenticatioController.protect);

// router.post('/your-phone-number', storeCurrentUserPhoneNumber);
router.post('/verify-user-info', verifyUserInformation);
// router.get('/send-comparison-result', sendComparisonResult);
router.post('/your-phone-number', fetchCurrentUserAndRandomOthers);

module.exports = router;
