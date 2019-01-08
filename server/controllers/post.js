const _ = require('lodash')
const Post = require('../models/Post')
const Profile = require('../models/Profile')
const User = require('../models/User')

// Load Input Validation
const validatePostInput = require('../validation/post')

const validateObjectId = require('../utils/validateObjectId')

// @route GET /api/profile/all
// @desc Get all profiles
// @access Public
const allPost = async (req, res) => {
  try {
    const errors = {}

    const posts = await Post.find().sort({ date: -1 })

    if (!posts) {
      errors.noprofile = 'There are no posts'
      return res.status(404).json(errors)
    }

    res.status(200).json(posts)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route GET /api/posts/:id
// @desc Get post by id
// @access Public
const getPost = async (req, res) => {
  try {
    const errors = {}

    const postId = req.params.post_id

    if (!validateObjectId(postId)) {
      errors.post_id = 'Unable to find Post'
      return res.status(400).json(errors)
    }

    const post = await Post.findById(postId).sort({ date: -1 })

    if (!post) {
      errors.nopost = 'Unable to find Post'
      return res.status(404).json(errors)
    }

    res.status(200).json(post)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route POST /api/posts
// @desc Create posts
// @access Private
const createPost = async (req, res) => {
  try {
    const { errors, isValid } = validatePostInput(req.body)

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      _user: req.user.id
    })

    const savedPost = await newPost.save()

    res.status(200).json(savedPost)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route DELETE /api/posts/:post_id
// @desc Delete post
// @access Private
const deletePost = async (req, res) => {
  try {
    const postId = req.params.post_id

    if (!validateObjectId(postId)) {
      errors.post_id = 'Unable to find Post'
      return res.status(400).json(errors)
    }

    const profile = await Profile.findOne({ _user: req.user.id })

    const post = await Post.findOne({ _id: postId })

    if (!post) {
      return res.status(404).json({ nopost: 'Unable to find post' })
    }

    if (post._user.toString() !== profile._user.toString()) {
      return res.status(400).json({ unauthorized: 'User not authorized' })
    }

    await post.remove()

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route POST /api/posts/like/:post_id
// @desc Like posts
// @access Private
const likePost = async (req, res) => {
  try {
    const postId = req.params.post_id

    if (!validateObjectId(postId)) {
      errors.post_id = 'Unable to find Post'
      return res.status(400).json(errors)
    }

    const profile = await Profile.findOne({ _user: req.user.id })

    const post = await Post.findOne({ _id: postId })

    if (!post) {
      return res.status(404).json({ nopost: 'Unable to find post' })
    }

    if (
      post.likes.filter(like => like._user.toString() === req.user.id).length >
      0
    ) {
      return res
        .status(400)
        .json({ alreadyliked: 'User already liked this post' })
    }

    post.likes.unshift({ _user: req.user.id })

    const updatedPost = await post.save()

    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route POST /api/posts/unlike/:post_id
// @desc Unlike posts
// @access Private
const unlikePost = async (req, res) => {
  try {
    const postId = req.params.post_id

    if (!validateObjectId(postId)) {
      errors.post_id = 'Unable to find Post'
      return res.status(400).json(errors)
    }

    const profile = await Profile.findOne({ _user: req.user.id })

    const post = await Post.findOne({ _id: postId })

    if (!post) {
      return res.status(404).json({ nopost: 'Unable to find post' })
    }

    if (
      post.likes.filter(like => like._user.toString() === req.user.id)
        .length === 0
    ) {
      return res
        .status(400)
        .json({ notliked: 'You have not yet liked this post' })
    }

    const removeIndex = post.likes
      .map(item => item._user.toString())
      .indexOf(req.user.id)

    post.likes.splice(removeIndex, 1)

    const updatedPost = await post.save()

    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route POST /api/posts/comment/:post_id
// @desc Comment posts
// @access Private
const commentPost = async (req, res) => {
  try {
    const { errors, isValid } = validatePostInput(req.body)

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    const postId = req.params.post_id

    if (!validateObjectId(postId)) {
      errors.post_id = 'Unable to find Post'
      return res.status(400).json(errors)
    }

    const profile = await Profile.findOne({ _user: req.user.id })

    const post = await Post.findOne({ _id: postId })

    if (!post) {
      return res.status(404).json({ nopost: 'Unable to find post' })
    }

    const newComment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      _user: req.user.id
    }

    post.comments.unshift(newComment)

    const updatedPost = await post.save()

    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route DELETE /api/posts/comment/:post_id/:comment_id
// @desc Delete Comment from post
// @access Private
const deleteCommentPost = async (req, res) => {
  try {
    const postId = req.params.post_id
    const commentId = req.params.comment_id

    if (!validateObjectId(postId)) {
      errors.post_id = 'Unable to find Post'
      return res.status(400).json(errors)
    }

    if (!validateObjectId(commentId)) {
      errors.comment_id = 'Unable to find Comment'
      return res.status(400).json(errors)
    }

    const profile = await Profile.findOne({ _user: req.user.id })

    const post = await Post.findOne({ _id: postId })

    if (!post) {
      return res.status(404).json({ nopost: 'Unable to find post' })
    }

    if (
      (post.comments.filter(
        comment => comment._id.toString() === commentId
      ).length = 0)
    ) {
      return res
        .status(404)
        .json({ commentnotexixts: 'Unable to find comment' })
    }

    const removeIndex = post.comments
      .map(item => item._id.toString())
      .indexOf(commentId)

    post.comments.splice(removeIndex, 1)

    const updatedPost = await post.save()

    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

module.exports = {
  createPost,
  allPost,
  getPost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  deleteCommentPost
}
