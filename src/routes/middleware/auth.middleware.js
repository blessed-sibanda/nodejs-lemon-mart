const jwt = require('express-jwt');
const config = require('../../../config');

const requireSignIn = jwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  userProperty: 'auth',
});

const IsProfileOwner = (req, res, next) => {
  if (req.profile && req.auth && req.profile._id == req.auth._id) next();
  else
    return res.status(403).json({
      error: 'User is not authorized',
    });
};

module.exports = {
  requireSignIn,
  IsProfileOwner,
};
