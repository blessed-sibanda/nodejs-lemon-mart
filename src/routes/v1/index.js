const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

router.use('/auth', authRoutes);

router.get('/', function (req, res, next) {
  res.json({ message: 'Welcome to LemonMart API v1' });
});

module.exports = router;
