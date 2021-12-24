const { Router } = require('express');
const { User } = require('../../models');
const { formatError } = require('../../utils');
const { userById, requireSignIn, IsProfileOwner } = require('../../middleware');
const debug = require('debug')('lemon-mart-server:users-route');
const { userService } = require('../../services');

const router = Router();

router.get('/', requireSignIn, async (req, res) => {
  const allowedFilters = [
    'firstName',
    'lastName',
    'middleName',
    'role',
    'city',
    'country',
  ];
  const allowedQueryParams = [...allowedFilters, 'sort'];
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
      middleNameFilter = middleNameFilter[middleNameFilter.length - 1];

    let roleFilter = req.query['role'];
    if (roleFilter instanceof Array) roleFilter = roleFilter[roleFilter.length - 1];

    let countryFilter = req.query['country'];
    if (countryFilter instanceof Array)
      countryFilter = countryFilter[countryFilter.length - 1];

    let cityFilter = req.query['city'];
    if (cityFilter instanceof Array) cityFilter = cityFilter[cityFilter.length - 1];

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
    if (cityFilter) {
      filters.push({
        'address.city': { $regex: cityFilter, $options: 'i' },
      });
    }
    if (countryFilter) {
      filters.push({
        'address.country': { $regex: countryFilter, $options: 'i' },
      });
    }
    if (roleFilter) {
      filters.push({
        role: { $regex: roleFilter, $options: 'i' },
      });
    }

    let sortKey = req.query['sort'];
    let sortOrder;
    let sortBy;

    if (sortKey) {
      sortOrder = sortKey.startsWith('-') ? -1 : 1;
      sortBy = sortOrder == 1 ? sortKey : sortKey.split('').splice(1).join('');

      if (!allowedFilters.includes(sortBy))
        return res.status(400).json({
          error: `'${sortBy}' is not a valid sort field`,
          help: `The allowed sort fields are: '${allowedFilters}'`,
        });

      switch (sortBy) {
        case 'firstName':
          sortBy = 'name.firstName';
          break;
        case 'lastName':
          sortBy = 'name.lastName';
          break;
        case 'middleName':
          sortBy = 'name.middleName';
          break;
        case 'city':
          sortBy = 'address.city';
          break;
        case 'country':
          sortBy = 'address.country';
          break;
        default:
          break;
      }
    }

    let users;
    if (sortKey) {
      if (filters.length == 0) {
        users = await User.find({}).sort([[sortBy, sortOrder]]);
      } else {
        users = await User.find({
          $and: filters,
        }).sort([[sortBy, sortOrder]]);
      }
    } else {
      if (filters.length == 0) {
        users = await User.find().sort('-createdAt');
      } else {
        users = await User.find({
          $and: filters,
        }).sort('-createdAt');
      }
    }

    res.json(users);
  } catch (err) {
    res.json({ error: formatError(err) });
  }
});

router.post('/', async (req, res) => {
  try {
    let user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json(formatError(err));
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
      let user = await userService.updateUser(req.profile, req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json(formatError(err));
    }
  });

module.exports = router;
