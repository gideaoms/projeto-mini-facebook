const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
  async me(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  },
  async feed(req, res, next) {
    try {
      const me = await User.findById(req.user.id);
      const { friends } = me;

      const posts = await Post
        .find({
          user: { $in: [me.id, ...friends] },
        })
        .populate([
          { path: 'user', select: 'name' },
          { path: 'likes', select: 'name' },
        ])
        .limit(50)
        .sort('-createdAt');

      return res.json(posts);
    } catch (err) {
      return next(err);
    }
  },
  async friend(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (user.id === req.user.id) {
        return res.status(400).json({ error: 'You can not be friends with yourself.' });
      }

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      user.friends.push(user.id);
      await user.save();

      const me = await User.findById(req.user.id);
      me.friends.push(user.id);
      await me.save();

      return res.json(me);
    } catch (err) {
      return next(err);
    }
  },
};
