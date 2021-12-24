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
    this.name = 'InvalidParamKeyError';
    super(`${this.name}: '${this.invalidKey}' is not a valid param key`);
  }

  toJson() {
    return {
      message: this.message,
      help: `The allowed filter keys are: '${this.allowedkeys}'`,
    };
  }
}

class InvalidSortFieldError extends LemonMartError {
  constructor(sortField, allowedFields) {
    this.name = 'InvalidSortFieldError';
    super(`${this.name}: '${this.sortField}' is not a valid sort field`);
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
