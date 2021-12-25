const User = require('./user.model');
const { connectDb } = require('./db');

module.exports = { User, connectDb };
