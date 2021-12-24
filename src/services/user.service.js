const merge = require('lodash/merge');
const { User } = require('../models');

module.exports.findUsers = async (req, res) => {};

module.exports.updateUser = async (user, newData) => {
  // un-editable fields
  delete newData._id;
  delete newData.hashedPassword;
  delete newData.salt;

  let updatedUser = merge(user, newData);
  return await updatedUser.save();
};
