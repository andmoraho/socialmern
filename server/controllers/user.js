const _ = require('lodash')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const hashPassword = require('../utils/hashPassword')
const generateToken = require('../utils/generateToken')

// Load Input Validation
const validateRegisterInput = require('../validation/register')

// @route POST /api/users/register
// @desc Register user
// @access Public
const register = async (req, res) => {
  try {
    const body = _.pick(req.body, [
      'name',
      'email',
      'password',
      'password2',
      'avatar'
    ])

    const { errors, isValid } = validateRegisterInput(body)

    if (!isValid) {
      return res.status(400).json(errors)
    }

    const emailExists = await User.findOne({ email: body.email })

    if (emailExists) {
      errors.email = 'Email already exists'
      return res.status(400).json(errors)
    }

    const avatar = gravatar.url(body.email, {
      s: '200', // Size
      r: 'pg', // Rating
      d: 'mm' // Default
    })

    const password = await hashPassword(body.password)

    const newUser = new User({
      name: body.name,
      email: body.email,
      avatar,
      password
    })
    await newUser.save()

    res.status(200).json(newUser)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route POST /api/users/login
// @desc Login user / Returning JWT token
// @access Public
const login = async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password'])
    const userExists = await User.findOne({ email: body.email })

    if (!userExists) {
      throw new Error('User not found')
    }

    const isMatch = await bcrypt.compare(body.password, userExists.password)

    if (!isMatch) {
      throw new Error('Unable to Login')
    }

    const token = generateToken(userExists)

    res.status(200).json({ token })
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route GET /api/users/me
// @desc  Return user
// @access Private
const me = async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
}

module.exports = {
  register,
  login,
  me
}
