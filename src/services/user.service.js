const merge = require('lodash/merge');
const users = require('../../docs/users');
const { User } = require('../models');
const { InvalidSortFieldError, InvalidParamKeyError } = require('../utils');
const debug = require('debug')('lemon-mart-server:user-service');

module.exports.findUsers = async (params) => {
  let filters = User.normalizedFilterParams(params);
  let sortArr = User.normalizedSortFields(params['sort']);

  let paginationOptions = {
    page: params['page'] || 1,
    limit: User.perPage,
    select: '-hashedPassword -salt -__v',
  };

  if (sortArr.length != 0) {
    if (Object.keys(filters).length == 0)
      return await User.paginate({}, { sort: sortArr, ...paginationOptions });
    else
      return await User.paginate(filters, { sort: sortArr, ...paginationOptions });
  } else {
    if (Object.keys(filters).length == 0)
      return await User.paginate({}, { sort: '-createdAt', ...paginationOptions });
    else
      return await User.paginate(filters, {
        sort: '-createdAt',
        ...paginationOptions,
      });
  }
};

module.exports.updateUser = async (user, newData) => {
  // un-editable fields
  delete newData._id;
  delete newData.hashedPassword;
  delete newData.salt;

  debug(JSON.stringify(newData));

  let updatedUser = merge(user, newData);
  return await updatedUser.save();
};
