const config = require('../../../config');
const { Router } = require('express');
const { User } = require('../../models');
const { requireSignIn } = require('../middleware');
const { authService } = require('../../services');
const { formatError } = require('../../utils');

const router = Router();

router.post('/login', async (req, res) => {
  try {
    let token = await authService.login(req.body.email, req.body.password);
    res.json({ accessToken: token, status: 200 });
  } catch (err) {
    res.status(err.statusCode || 400).json(formatError(err));
  }
});

router.get('/me', requireSignIn, async (req, res) => {
  try {
    let user = await User.findOne({ email: req.auth.email });
    res.json(user);
  } catch (err) {
    res.status(err.statusCode || 400).json(formatError(err));
  }
});

module.exports = router;
