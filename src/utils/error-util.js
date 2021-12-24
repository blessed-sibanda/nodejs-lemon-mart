const { Error } = require('mongoose');

function getValidationErrors(error) {
  let errors = error.errors;
  let outerKeys = [];

  Object.keys(errors).forEach((key) => {
    if (key.includes('.')) {
      let first = key.split('.')[0];
      if (!outerKeys.includes(first)) outerKeys.push(first);
    } else {
      if (!outerKeys.includes(key)) outerKeys.push(key);
    }
  });

  let result = {};

  outerKeys.forEach((key) => {
    result[key] = {};
  });

  Object.keys(errors).forEach((key) => {
    if (key.includes('.')) {
      let first = key.split('.')[0];
      let last = key.split('.')[1];
      let errObj = {};
      errObj[last] = errors[key]['message'];
      if (Object.keys(result[first]).length > 0) {
        result[first] = { ...result[first], ...errObj };
      } else {
        result[first] = { ...errObj };
      }
    } else {
      result[key] = errors[key]['message'];
    }
  });
  return result;
}

module.exports = {
  formatError: (error) => {
    if (error instanceof Error.ValidationError)
      return { message: error._message, errors: getValidationErrors(error) };
    else if (error instanceof Error.CastError)
      return { message: 'Invalid ObjectId' };
    else {
      return { message: error.message || error };
    }
  },
};
