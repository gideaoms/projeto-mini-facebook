const User = require('../models/user');

const emailIsAlreadyInUse = email => User.findOne({ email });

module.exports = {
  async signup(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (await emailIsAlreadyInUse(email)) {
        return res.status(400).json({ error: 'Email already exist' });
      }

      const user = await User.create({ name, email, password });

      return res.json({ user, token: user.generateToken() });
    } catch (err) {
      return next(err);
    }
  },
  async signin(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: 'E-mail not found' });
      }

      if (!await user.compareHash(password)) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      return res.json({ user, token: user.generateToken() });
    } catch (err) {
      return next(err);
    }
  },
};
