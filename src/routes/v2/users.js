var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ message: 'Welcome to Users Service' });
});

router.post('/', async (req, res) => {});
router.get('/:userId', async (req, res) => {});
router.put('/:userId', async (req, res) => {});

module.exports = router;
