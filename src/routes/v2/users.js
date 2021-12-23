const express = require('express');
const router = express.Router();
const merge = require('lodash/merge');
const User = require('../../models/user.model');
const { formatError } = require('../../utils/error-util');
const {
  requireSignIn,
  IsProfileOwner,
} = require('../../middleware/auth.middleware');
const { userById } = require('../../middleware/user.middleware');

router.get('/', requireSignIn, async (req, res) => {
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

router.param('userId', userById);

router
  .route('/:userId')
  .get(requireSignIn, async (req, res) => {
    return res.json({ user: req.profile });
  })
  .put(requireSignIn, IsProfileOwner, async (req, res) => {
    try {
      let user = req.profile;

      // un-editable fields
      delete req.body._id;
      delete req.body.hashedPassword;
      delete req.body.salt;

      user = merge(user, req.body);
      await user.save();
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: formatError(err) });
    }
  });

module.exports = router;
