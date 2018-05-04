const router = require('express').Router();
const requireDir = require('require-dir');
const authMiddleware = require('./middlewares/auth');

const controllers = requireDir('./controllers');

/** *** Unauthenticated *** */

/**
 * Auth
 */
router.post('/signup', controllers.auth.signup);
router.post('/signin', controllers.auth.signin);

/** *** Authenticated *** */

router.use(authMiddleware);

/**
 * User
 */
router.post('/user/:id/friend', controllers.user.friend);
router.get('/user/me', controllers.user.me);
router.get('/user/feed', controllers.user.feed);

/**
 * Post
 */
router.post('/posts', controllers.post.create);
router.post('/posts/:id/like', controllers.post.like);

/**
 * Comment
 */
router.post('/comments/:postId', controllers.comment.create);

module.exports = router;
