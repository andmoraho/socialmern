const express = require('express')
const UserController = require('../../controllers/user')
const passport = require('passport')

const router = express.Router()

// @route GET /api/users/test
// @desc Test users route
// @access Public
router.get('/test', (req, res) => {
  res.json({
    message: 'Users works'
  })
})

// @route POST /api/users/register
// @desc Register user
// @access Public
router.post('/register', UserController.register)

// @route POST /api/users/login
// @desc Login user / Returning JWT token
// @access Public
router.post('/login', UserController.login)

// @route GET /api/users/me
// @desc  Return user
// @access Private
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  UserController.me
)

module.exports = router
