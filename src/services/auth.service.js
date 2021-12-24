const jwt = require('jsonwebtoken');
const config = require('../../config');
const { User } = require('../models');
const { LoginError } = require('../utils');

module.exports.login = async (email, password) => {
  let user = await User.findOne({ email });
  if (user && user.authenticate(password)) {
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      picture: user.picture,
    };
    const token = jwt.sign(payload, config.jwtSecret, {
      subject: user._id.toString(),
      expiresIn: '1d',
    });
    return token;
  } else {
    throw new LoginError();
  }
};
