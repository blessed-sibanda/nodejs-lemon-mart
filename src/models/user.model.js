const mongoose = require('mongoose');
const crypto = require('crypto');
const merge = require('lodash/merge');
const {
  removeUndefinedFields,
  InvalidParamKeyError,
  InvalidSortFieldError,
} = require('../utils');
const debug = require('debug')('lemon-mart-server:user-model');

const nameSchema = {
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
  },
  middleName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
  },
};

const addressSchema = {
  line1: {
    type: String,
    required: [true, 'Address line1 is required'],
  },
  line2: String,
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  state: {
    type: String,
    required: [true, 'State/Province is required'],
  },
  zip: String,
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
};

const phoneSchema = {
  type: {
    type: String,
    default: 'mobile',
    enum: {
      values: ['mobile', 'work', 'home'],
      message: '{VALUE} is not a valid phone type',
    },
  },
  digits: {
    type: String,
    required: [true, 'Phone number digits is required'],
  },
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: [true, 'Email is required'],
    match: [/.+\@.+\..+/, 'Email address is invalid'],
    validate: {
      validator: async function (v) {
        let users = await mongoose.model('User', userSchema).find({ email: v });
        return users.length == 0;
      },
      message: (props) => 'Email address has been taken',
    },
  },
  name: nameSchema,
  address: addressSchema,
  userStatus: Boolean,
  level: {
    type: Number,
    default: 0,
  },
  dateOfBirth: Date,
  role: {
    type: String,
    default: 'none',
    enum: {
      values: ['none', 'cashier', 'clerk', 'manager'],
      message: '{VALUE} is not a valid role',
    },
  },
  phones: [phoneSchema],
  salt: String,
  picture: {
    type: String,
    default: '',
  },
  hashedPassword: {
    type: String,
    required: 'Password is required',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.virtual('fullName').get(function () {
  if (this.name.middleName && this.name.middleName != '') {
    return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
  }
  return `${this.name.firstName} ${this.name.lastName}`;
});

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.path('hashedPassword').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.');
  }
});

userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    } catch (err) {
      return '';
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
};

const nestedFields = [
  'firstName',
  'lastName',
  'middleName',
  'address',
  'city',
  'state',
  'country',
];

userSchema.statics.filterFields = [...nestedFields, 'email', 'role'];

userSchema.statics.normalizeObject = function (object) {
  let queryFields = [...this.filterFields, 'sort'];
  Object.keys(object).forEach((key) => {
    if (!queryFields.includes(key)) {
      throw new InvalidParamKeyError(key, this.filterFields);
    }
  });

  let userData = {
    'name.firstName': object['firstName'],
    'name.middleName': object['middleName'],
    'name.lastName': object['lastName'],
    'address.line1': object['address'],
    'address.line2': object['address'],
    'address.city': object['city'],
    'address.country': object['country'],
    'address.state': object['state'],
  };

  nestedFields.forEach((field) => delete object[field]);
  let normalizedObject = merge(removeUndefinedFields(userData), object);

  return normalizedObject;
};

userSchema.statics.queryParams = function (object) {
  let normalizedObject = this.normalizeObject(object);
  const filters = {};
  Object.keys(normalizedObject).forEach((field) => {
    filters[field] = { $regex: normalizedObject[field], $options: 'i' };
  });
  return filters;
};

userSchema.statics.lookUpNested = {
  firstName: 'name.firstName',
  middleName: 'name.middleName',
  lastName: 'name.lastName',
  address: 'address.line1',
  city: 'address.city',
  country: 'address.country',
  state: 'address.state',
};

userSchema.statics.sortFields = function (sortKey = '') {
  if (sortKey.length == 0) return [];
  let sortObj = {};
  sortKey.split(',').forEach((key) => {
    let newKey = key.startsWith('-') ? key.split('').splice(1).join('') : key;
    if (!this.filterFields.includes(newKey))
      throw new InvalidSortFieldError(newKey, this.filterFields);
    if (nestedFields.includes(newKey)) newKey = this.lookUpNested[newKey];
    sortObj[newKey] = key.startsWith('-') ? -1 : 1;
  });

  return Object.keys(sortObj).map((key) => [key, sortObj[key]]);
};

module.exports = mongoose.model('User', userSchema);
