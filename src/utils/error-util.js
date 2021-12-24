const { Error } = require('mongoose');
const { LemonMartError } = require('./exceptions');

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
    let formattedError;
    if (error instanceof Error.ValidationError)
      formattedError = {
        message: error._message,
        errors: getValidationErrors(error),
      };
    else if (error instanceof Error.CastError)
      formattedError = { message: 'Invalid ObjectId' };
    else if (error instanceof LemonMartError) formattedError = error.toJson();
    else {
      formattedError = { message: error.message || error };
    }
    return { error: formattedError };
  },
};
