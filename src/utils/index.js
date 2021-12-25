const exceptions = require('./exceptions');
const errorUtil = require('./error-util');
const seedDb = require('./seed-db');

const removeUndefinedFields = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeUndefinedFields(obj[key]);
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
};

module.exports = {
  ...exceptions,
  ...errorUtil,
  removeUndefinedFields,
  ...seedDb,
};
