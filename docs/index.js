const basic = require('./basic');
const components = require('./components');
const auth = require('./auth');
const users = require('./users');

module.exports = {
  ...basic,
  ...components,
  paths: {
    ...auth,
    ...users,
  },
  security: [
    {
      jwt: [],
    },
  ],
};
