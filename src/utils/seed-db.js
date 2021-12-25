const faker = require('faker');
const User = require('../models/user.model');
const { connectDb } = require('../models');
const config = require('../../config');

const generateUsers = (n) => {
  let users = [];
  const ROLES = ['none', 'clerk', 'cashier', 'manager'];
  const PHONE_TYPES = ['mobile', 'work', 'home'];

  for (let i = 1; i <= n; i++) {
    var noOfPhones = 1 + Math.floor(Math.random() * 4);
    let phones = [];
    let insertedPhoneTypes = [];
    for (let i = 1; i <= noOfPhones; i++) {
      let type = PHONE_TYPES[Math.floor(Math.random() * PHONE_TYPES.length)];
      if (!insertedPhoneTypes.includes(type)) {
        insertedPhoneTypes.push(type);
        phones.push({
          type,
          digits: faker.phone.phoneNumber(),
        });
      }
    }
    users.push({
      email: faker.internet.email(),
      password: '1234pass',
      name: {
        first: faker.name.firstName(),
        last: faker.name.lastName(),
        middle: faker.name.middleName().toUpperCase(),
      },
      address: {
        line1: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        country: faker.address.country(),
      },
      role: ROLES[Math.floor(Math.random() * ROLES.length)],
      phones,
      dateOfBirth: faker.date.between(
        new Date('1960-01-01'),
        new Date('2000-01-01'),
      ),
    });
  }

  return users;
};

module.exports = { generateUsers };
