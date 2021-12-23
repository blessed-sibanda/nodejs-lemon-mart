const express = require('express');
const router = express.Router();
const User = require('../../models/user.model');
const { formatError } = require('../../utils/error-util');

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    let users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ error: formatError(err) });
  }
});

router.post('/', async (req, res) => {
  try {
    user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: formatError(err) });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: formatError(err) });
  }
});

router.put('/:userId', async (req, res) => {});

module.exports = router;
