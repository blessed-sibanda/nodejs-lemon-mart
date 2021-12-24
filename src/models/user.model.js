const mongoose = require('mongoose');
const crypto = require('crypto');

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

module.exports = mongoose.model('User', userSchema);
