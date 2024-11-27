const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const clientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'User must have a first name!'],
    },
    lastName: {
      type: String,
      required: [true, 'User must have a last name!'],
    },
    age: {
      type: Number,
      required: [true, 'User must submit his age!'],
    },
    date_of_birth: {
      type: Date,
      required: [true, 'User must submit his date of birth !'],
    },
    place_of_birth: {
      type: String,
      required: [true, 'User must submit his place of birth!'],
    },
    CNIB_number: {
      type: Number,
      required: [true, 'User must submit his CNIB number!'],
    },
    email_address: {
      type: String,
      required: [true, 'User must have an email address!'],
      unique: [true, 'Sorry, email already exists! Try another one!'],
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email!',
      },
    },
    phone_number: {
      type: String,
      unique: [true, 'Sorry, phone number already exists! Try another one!'],
      required: [true, 'User must have a phone number!'],
    },
    role: {
      type: String,
      enum: ['client'],
      default: 'client',
    },
    secret_word: {
      type: String,
      required: [true, 'User must submit his secret word!'],
      unique: [true, 'Sorry, secret word already exists! Try another one!'],
      status: {
        type: String,
        enum: ['active', 'innactive'],
        default: 'active',
      },
    },
    profession: {
      type: String,
    },
    location: String,
    password: {
      type: String,
      required: [true, 'User must have a password!'],
      minlength: [8, 'Your password must have a minimum of 8 characters!'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'User must have a password!'],
      validate: {
        //only works on CREATE and SAVE
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are differents!',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    lastLogin: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    acountSatus: {
      type: String,
      enum: ['healthy', 'warning', 'banned'],
      default: 'healthy',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

clientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

clientSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1500;
  next();
});

clientSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

clientSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

clientSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

clientSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
