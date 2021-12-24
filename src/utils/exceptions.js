const debug = require('debug')('lemon-mart-server:exceptions');

/**
 * Abstract class 'LemonMartError'
 */

class LemonMartError extends Error {
  constructor(message, status = 400) {
    super(message);
    if (this.constructor == LemonMartError) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.message = message;
    this.statusCode = status;
  }

  toJson() {
    throw new Error("Method 'toJson()' must be implemented.");
  }
}

class InvalidParamKeyError extends LemonMartError {
  constructor(invalidKey, allowedKeys) {
    super(`'${invalidKey}' is not a valid param key`);
    this.allowedKeys = allowedKeys;
  }

  toJson() {
    return {
      message: this.message,
      help: `The allowed filter params are: '${this.allowedKeys}'`,
    };
  }
}

class InvalidSortFieldError extends LemonMartError {
  constructor(sortField, allowedFields) {
    super(`'${sortField}' is not a valid sort field`);
    this.allowedFields = allowedFields;
  }

  toJson() {
    return {
      message: this.message,
      help: `The allowed sort fields are: '${this.allowedFields}'`,
    };
  }
}

class LoginError extends LemonMartError {
  constructor() {
    super('Invalid Email/Password', 401);
  }

  toJson() {
    return {
      message: this.message,
    };
  }
}

module.exports = {
  LemonMartError,
  InvalidParamKeyError,
  InvalidSortFieldError,
  LoginError,
};
