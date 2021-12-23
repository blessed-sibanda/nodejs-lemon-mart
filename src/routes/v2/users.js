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
    let firstNameFilter = req.query['firstName'];
    if (firstNameFilter instanceof Array)
      firstNameFilter = firstNameFilter[firstNameFilter.length - 1];
    let lastNameFilter = req.query['lastName'];
    if (lastNameFilter instanceof Array)
      lastNameFilter = lastNameFilter[lastNameFilter.length - 1];
    let middleNameFilter = req.query['middleName'];
    if (middleNameFilter instanceof Array)
      middleNameFilter = middleNameFilter[lastNameFilter.length - 1];

    const filters = [];
    if (firstNameFilter) {
      filters.push({
        'name.firstName': { $regex: firstNameFilter, $options: 'i' },
      });
    }
    if (lastNameFilter) {
      filters.push({
        'name.lastName': { $regex: lastNameFilter, $options: 'i' },
      });
    }
    if (middleNameFilter) {
      filters.push({
        'name.middleName': { $regex: middleNameFilter, $options: 'i' },
      });
    }

    let users;
    if (filters.length == 0) {
      users = await User.find();
    } else {
      users = await User.find({
        $or: filters,
      });
    }

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
