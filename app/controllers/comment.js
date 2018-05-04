const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = {
  async create(req, res, next) {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(400).json({ error: 'Post not found' });
      }

      const me = await User.findById(req.user.id);
      const isPostOfMyFrind = me.friends.indexOf(post.user);

      if (isPostOfMyFrind === -1) {
        return res.status(400).json({ error: 'The owner of this post is not your friend' });
      }

      const comment = await Comment.create({ ...req.body, user: req.user.id, post: post.id });

      return res.json(comment);
    } catch (err) {
      return next(err);
    }
  },
};
