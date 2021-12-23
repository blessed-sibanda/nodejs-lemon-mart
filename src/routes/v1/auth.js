const jwt = require('jsonwebtoken');
const config = require('../../../config');
const { Router } = require('express');
const User = require('../../models/user.model');

const router = Router();

router.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user == null) {
      return res.status(401).json({ error: 'Invalid email/password' });
    } else {
      const payload = {
        email: user.email,
        role: user.role,
        picture: user.picture,
      };
      const token = jwt.sign(payload, config.jwtSecret, {
        subject: user._id.toString(),
        expiresIn: '1d',
      });
      res.json({
        accessToken: token,
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
