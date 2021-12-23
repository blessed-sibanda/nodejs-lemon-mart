const mongoose = require('mongoose');

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

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'Email is required'],
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
  },
  { timestamps: true },
);

userSchema.virtual('fullName').get(function () {
  if (this.name.middleName && this.name.middleName != '') {
    return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
  }
  return `${this.name.firstName} ${this.name.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
