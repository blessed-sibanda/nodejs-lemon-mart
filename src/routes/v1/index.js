var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.json({ message: 'Welcome to LemonMart API v1' });
});

module.exports = router;
