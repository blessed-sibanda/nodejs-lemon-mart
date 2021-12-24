console.log(require('./collection')['/v2/users']['get']['parameters']);

module.exports = {
  ...require('./collection'),
  ...require('./member'),
};
