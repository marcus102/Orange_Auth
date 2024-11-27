const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

// In-memory store for OTPs (for simplicity, replace with Redis or similar for production)
const otpStore = new Map();

// Models
const Client = require('../model/clientModel');

// POST Route to Generate OTP
exports.generateOTP = catchAsync(async (req, res, next) => {
  const { response, phone_number } = req.body;
  const user_id = req.user.id;

  if (!response || !phone_number) {
    return res.status(400).json({ error: 'Invalid request data.' });
  }

  const current_user = await Client.findById(user_id);

  if (!current_user) {
    return next(appError('User not found!', 404));
  }

  if (current_user.phone_number !== phone_number) {
    return next(appError('Phone number mismatch!', 400));
  }

  // Find user by phone number
  const user = await Client.findOne({ phone_number });

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (response === true) {
    // Generate a 4-digit OTP
    const otp = crypto.randomInt(1000, 9999); // Generates a random integer between 1000 and 9999

    // Here, you might send the OTP via SMS or any other delivery mechanism.
    // For now, returning it in the response for demonstration purposes.
    return res.status(200).json({
      message: 'OTP generated successfully.',
      otp,
      expiresAt: Date.now() + 1 * 60 * 1000, // Inform the client about the expiration time
    });
  } else {
    return res.status(200).json({ message: 'Response is false; OTP not generated.' });
  }
});

// GET Route to Fetch OTP
// exports.getOTP = async (req, res) => {
//   try {
//     const { phone_number } = req.query;

//     if (!phone_number) {
//       return res.status(400).json({ error: 'Phone number is required.' });
//     }

//     const otpData = otpStore.get(phone_number);

//     if (!otpData) {
//       return res.status(404).json({ error: 'No OTP found for this phone number.' });
//     }

//     // Check if the OTP is expired
//     if (Date.now() > otpData.expiresAt) {
//       otpStore.delete(phone_number);
//       return res.status(410).json({ error: 'OTP expired.' });
//     }

//     return res.status(200).json({ otp: otpData.otp });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'An error occurred.' });
//   }
// };
