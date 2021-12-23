const { Router } = require('express');
var usersRoute = require('./users');
const router = Router();

router.use('/users', usersRoute);

router.get('/', async (req, res) =>
  res.json({
    message: 'Welcome to LemonMart Server v2',
  }),
);

module.exports = router;
