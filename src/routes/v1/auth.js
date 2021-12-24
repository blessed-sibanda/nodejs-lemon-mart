const config = require('../../../config');
const { Router } = require('express');
const User = require('../../models/user.model');
const { requireSignIn } = require('../../middleware/auth.middleware');
const { authService } = require('../../services');
const { formatError } = require('../../utils');

const router = Router();

router.post('/login', async (req, res) => {
  try {
    let token = await authService.login(req.body.email, req.body.password);
    res.json({ token });
  } catch (err) {
    res.status(err.statusCode || 400).json(formatError(err));
  }
});

router.get('/auth/me', requireSignIn, async (req, res) => {
  res.json({ user: req.auth });
});

module.exports = router;
