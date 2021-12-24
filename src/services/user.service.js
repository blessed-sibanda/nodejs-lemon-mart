const merge = require('lodash/merge');
const users = require('../../docs/users');
const { User } = require('../models');
const { InvalidSortFieldError, InvalidParamKeyError } = require('../utils');
const debug = require('debug')('lemon-mart-server:user-service');

module.exports.findUsers = async (params) => {
  let filters = User.normalizedFilterParams(params);
  let sortArr = User.normalizedSortFields(params['sort']);

  if (sortArr.length != 0) {
    if (Object.keys(filters).length == 0)
      return await User.find({}).sort([[sortBy, sortOrder]]);
    else {
      return await User.find(filters).sort(sortArr);
    }
  } else {
    if (Object.keys(filters).length == 0)
      return await User.find().sort('-createdAt');
    else {
      return await User.find(filters).sort('-createdAt');
    }
  }
};

module.exports.updateUser = async (user, newData) => {
  // un-editable fields
  delete newData._id;
  delete newData.hashedPassword;
  delete newData.salt;

  let updatedUser = merge(user, newData);
  return await updatedUser.save();
};
