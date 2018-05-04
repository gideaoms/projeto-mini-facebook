const Post = require('../models/post');

module.exports = {
  async create(req, res, next) {
    try {
      const post = await Post.create({ ...req.body, user: req.user.id });

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },
  async like(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(400).json({ error: 'Post not found' });
      }

      post.likes.push(req.user.id);

      await post.save();

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },
};
