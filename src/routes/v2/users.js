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
var debug = require('debug')('lemon-mart-server:users-route');

router.get('/', requireSignIn, async (req, res) => {
  const allowedFilters = ['firstName', 'lastName', 'middleName'];
  const allowedQueryParams = [...allowedFilters, 'sortKey'];
  debug(req.query);
  let invalidKey;
  Object.keys(req.query).forEach((key) => {
    if (!allowedQueryParams.includes(key)) {
      invalidKey = key;
    }
  });
  if (invalidKey)
    return res.status(404).json({
      error: `'${invalidKey}' is not a valid filter param.`,
      help: `The allowed filter params are: '${allowedFilters}'`,
    });
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

    let sortKey = req.query['sortKey'];
    let sortOrder;
    let sortBy;

    if (sortKey) {
      sortOrder = sortKey.startsWith('-') ? -1 : 1;
      sortBy = sortOrder == 1 ? sortKey : sortKey.split('').splice(1).join('');
    }

    let users;
    if (sortKey) {
      if (filters.length == 0) {
        users = await User.find({}).sort([[sortBy, sortOrder]]);
      } else {
        users = await User.find({
          $or: filters,
        }).sort([[sortBy, sortOrder]]);
      }
    } else {
      if (filters.length == 0) {
        users = await User.find();
      } else {
        users = await User.find({
          $or: filters,
        });
      }
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
