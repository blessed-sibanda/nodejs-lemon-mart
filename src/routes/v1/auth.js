const jwt = require('jsonwebtoken');
const config = require('../../../config');
const { Router } = require('express');
const User = require('../../models/user.model');
const { requireSignIn } = require('../../middleware/auth.middleware');

const router = Router();

router.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user && user.authenticate(req.body.password)) {
      const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        picture: user.picture,
      };
      const token = jwt.sign(payload, config.jwtSecret, {
        subject: user._id.toString(),
        expiresIn: '1d',
      });
      return res.json({
        accessToken: token,
      });
    } else {
      return res.status(401).json({ error: 'Invalid email/password' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/auth/me', requireSignIn, async (req, res) => {
  res.json({ user: req.auth });
});

module.exports = router;
