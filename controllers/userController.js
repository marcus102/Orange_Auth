const validator = require('validator');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('../utils/appError');
const factory = require('./handlerFactory');
const filterParams = require('./../utils/filterParams');

exports.setRequiredIds = (req, res, next) => {
  const setIfUndefined = (field, value) => {
    if (!req.body[field]) req.body[field] = value;
  };
  setIfUndefined('targetUserId', req.params.user_id);
  setIfUndefined('user', req.user.id);

  next();
};

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'Cannot create a user with this url! Please Sigup'
  });
});

exports.assignUserRole = catchAsync(async (req, res, next) => {
  const targetUser = await User.findById(req.body.targetUserId);

  if (!targetUser) {
    return next(appError('The target user for the role has not been found!', 404));
  }

  const filteredBody = filterParams.allowedFields(req.body, 'role');

  const assignRole = await User.findByIdAndUpdate(req.body.targetUserId, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: assignRole
    }
  });
});

exports.getAllUsers = factory.getAll(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Check for password update attempt
  if (req.body.password || req.body.passwordConfirm) {
    return next(appError('This route is not for password update!', 400));
  }

  // Filter the fields from the request body
  const filteredBody = filterParams.allowedFields(
    req.body,
    'firstName',
    'lastName',
    'username',
    'phone',
    'email',
    'profession',
    'bio',
    'location',
    'link1',
    'link2',
    'link3',
    'link4'
  );
  // Update the user with the filtered body
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  // Respond with the updated user data
  res.status(200).json({
    status: 'success',
    data: {
      updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});
