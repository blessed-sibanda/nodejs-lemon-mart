const User = require('../models/user.model');

const userById = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: formatError(err) });
  }
};

module.exports = { userById };
