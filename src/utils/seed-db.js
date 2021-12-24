const faker = require('faker');
const User = require('../models/user.model');
const { connectDb } = require('./db');
const config = require('../../config');

connectDb(config.mongoUri);

let users = [];
const ROLES = ['none', 'clerk', 'cashier', 'manager'];
const PHONE_TYPES = ['mobile', 'work', 'home'];

for (let i = 1; i <= 50; i++) {
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
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      middleName: faker.name.middleName().toUpperCase(),
    },
    address: {
      line1: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      country: faker.address.country(),
    },
    role: ROLES[Math.floor(Math.random() * ROLES.length)],
    phones,
    dateOfBirth: faker.date.between(new Date('1960-01-01'), new Date('2000-01-01')),
  });
  process.stdout.write(`${i},`);
}

User.insertMany(users, onInsert);

function onInsert(err, docs) {
  if (err) {
    console.error('Error occured: ' + err);
  } else {
    console.info('\n%d users were successfully inserted.', docs.length);
    process.exit(0);
  }
}
