const express = require('express')
const passport = require('passport')
const PostController = require('../../controllers/post')

const router = express.Router()

// @route GET /api/posts
// @desc Get posts
// @access Public
router.get('/', PostController.allPost)

// @route GET /api/posts/:post_id
// @desc Get post by id
// @access Public
router.get('/:post_id', PostController.getPost)

// @route POST /api/posts
// @desc Create posts
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  PostController.createPost
)

// @route DELETE /api/posts/:post_id
// @desc Delete post
// @access Private
router.delete(
  '/:post_id',
  passport.authenticate('jwt', { session: false }),
  PostController.deletePost
)

// @route POST /api/posts/like/:post_id
// @desc Like posts
// @access Private
router.post(
  '/like/:post_id',
  passport.authenticate('jwt', { session: false }),
  PostController.likePost
)

// @route POST /api/posts/unlike/:post_id
// @desc Unlike posts
// @access Private
router.post(
  '/unlike/:post_id',
  passport.authenticate('jwt', { session: false }),
  PostController.unlikePost
)

// @route POST /api/posts/comment/:post_id
// @desc Comment posts
// @access Private
router.post(
  '/comment/:post_id',
  passport.authenticate('jwt', { session: false }),
  PostController.commentPost
)

// @route DELETE /api/posts/comment/:post_id/:comment_id
// @desc Delete Comment from post
// @access Private
router.delete(
  '/comment/:post_id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  PostController.deleteCommentPost
)

module.exports = router
