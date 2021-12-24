const { Router } = require('express');
const { User } = require('../../models');
const { formatError } = require('../../utils');
const { userById, requireSignIn, IsProfileOwner } = require('../middleware');
const debug = require('debug')('lemon-mart-server:users-route');
const { userService } = require('../../services');

const router = Router();

router.get('/', requireSignIn, async (req, res) => {
  try {
    let result = await userService.findUsers(req.query);
    res.json({
      meta: {
        page: result.page,
        perPage: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        nextPage: result.nextPage,
        hasPrevPage: result.hasPrevPage,
        prevPage: result.prevPage,
        totalCount: result.totalDocs,
        total: result.docs.length,
      },
      data: result.docs,
    });
  } catch (err) {
    res.status(err.statusCode || 400).json(formatError(err));
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
      res.status(err.statusCode || 400).json(formatError(err));
    }
  });

module.exports = router;
