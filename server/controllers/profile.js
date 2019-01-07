const _ = require('lodash')
const Profile = require('../models/Profile')
const User = require('../models/User')

// Load Input Validation
const validateProfileInput = require('../validation/profile')
const validateExperienceInput = require('../validation/experience')
const validateEducationInput = require('../validation/education')

const validateObjectId = require('../utils/validateObjectId')

// @route GET /api/profile
// @desc Get current users profile
// @access Private
const myProfile = async (req, res) => {
  try {
    const errors = {}

    const profile = await Profile.findOne({ _user: req.user.id }).populate(
      '_user',
      ['name', 'avatar']
    )

    if (!profile) {
      errors.noprofile = 'Profile not found'
      return res.status(404).json(errors)
    }

    res.status(200).json(profile)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route GET /api/profile/all
// @desc Get all profiles
// @access Public
const allProfile = async (req, res) => {
  try {
    const errors = {}

    const profiles = await Profile.find().populate('_user', ['name', 'avatar'])

    if (!profiles) {
      errors.noprofile = 'There are no profiles'
      return res.status(404).json(errors)
    }

    res.status(200).json(profiles)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route GET /api/profile/handle/:handle
// @desc Get profile by handle
// @access Public
const handleProfile = async (req, res) => {
  try {
    const errors = {}

    const profile = await Profile.findOne({
      handle: req.params.handle
    }).populate('_user', ['name', 'avatar'])

    if (!profile) {
      errors.noprofile = 'Profile not found'
      return res.status(404).json(errors)
    }

    res.status(200).json(profile)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route GET /api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public
const userProfile = async (req, res) => {
  try {
    const errors = {}

    const userId = req.params.user_id

    if (!validateObjectId(userId)) {
      errors.user_id = 'Unable to find user'
      return res.status(400).json(errors)
    }

    const profile = await Profile.findOne({
      _user: userId
    }).populate('_user', ['name', 'avatar'])

    if (!profile) {
      errors.noprofile = 'Profile not found'
      return res.status(404).json(errors)
    }

    res.status(200).json(profile)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route POST /api/profile
// @desc Create or Edit user profile
// @access Private
const createProfile = async (req, res) => {
  try {
    const { errors, isValid } = validateProfileInput(req.body)

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    // Get profile fields
    const profileFields = {}

    profileFields._user = req.user.id
    profileFields.handle = req.body.handle || ''
    profileFields.company = req.body.company || ''
    profileFields.website = req.body.website || ''
    profileFields.status = req.body.status || ''
    profileFields.location = req.body.location || ''
    profileFields.bio = req.body.bio || ''
    profileFields.githubusername = req.body.githubusername || ''
    // Skills
    if (typeof req.body.skills !== undefined) {
      profileFields.skills = req.body.skills.split(',')
    }
    // Social
    profileFields.social = {}
    profileFields.social.youtube = req.body.youtube || ''
    profileFields.social.twitter = req.body.twitter || ''
    profileFields.social.facebook = req.body.facebook || ''
    profileFields.social.instagram = req.body.instagram || ''
    profileFields.social.linkedin = req.body.linkedin || ''

    const profile = await Profile.findOne({ _user: req.user.id })

    if (profile) {
      // Update
      const updatedProfile = await Profile.findOneAndUpdate(
        { _user: req.user.id },
        { $set: profileFields },
        { new: true }
      )
      res.status(200).json({ updatedProfile })
    } else {
      // Create

      // Check if handle exixts
      const handleExists = await Profile.findOne({
        handle: profileFields.handle
      })

      if (handleExists) {
        errors.handle = 'That handle already exists'
        res.status(400).json(errors)
      }

      // Save Profile
      const savedProfile = await new Profile(profileFields).save()

      res.status(200).json(savedProfile)
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route POST /api/profile/experience
// @desc Add experience to profile
// @access Private
const experienceProfile = async (req, res) => {
  try {
    const { errors, isValid } = validateExperienceInput(req.body)

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    const profile = await Profile.findOne({ _user: req.user.id })

    if (!profile) {
      errors.noprofile = 'Profile not found'
      return res.status(404).json(errors)
    }

    const newExp = _.pick(req.body, [
      'title',
      'company',
      'location',
      'from',
      'to',
      'current',
      'description'
    ])

    profile.experience.unshift(newExp)

    const updatedProfile = await profile.save()

    res.status(200).json(updatedProfile)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route POST /api/profile/education
// @desc Add education to profile
// @access Private
const educationProfile = async (req, res) => {
  try {
    const { errors, isValid } = validateEducationInput(req.body)

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    const profile = await Profile.findOne({ _user: req.user.id })

    if (!profile) {
      errors.noprofile = 'Profile not found'
      return res.status(404).json(errors)
    }

    const newEdu = _.pick(req.body, [
      'school',
      'degree',
      'fieldofstudy',
      'from',
      'to',
      'current',
      'description'
    ])

    profile.education.unshift(newEdu)

    const updatedProfile = await profile.save()

    res.status(200).json(updatedProfile)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route DELETE /api/profile
// @desc delete user and profile
// @access Private
const deleteProfile = async (req, res) => {
  try {
    const delProfile = await Profile.findOneAndRemove({ _user: req.user.id })

    const delUser = await User.findOneAndRemove({ _id: req.user.id })

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route DELETE /api/profile/experience/:exp_id
// @desc delete experience from profile
// @access Private
const deleteExperienceProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _user: req.user.id })

    if (!profile) {
      errors.noprofile = 'Profile not found'
      return res.status(404).json(errors)
    }

    const expId = req.params.exp_id

    if (!validateObjectId(expId)) {
      errors.exp_id = 'Unable to find experience'
      return res.status(400).json(errors)
    }

    const removeIndex = profile.experience.map(item => item.id).indexOf(expId)

    profile.experience.splice(removeIndex, 1)

    const updatedProfile = await profile.save()

    res.status(200).json(updatedProfile)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

// @route DELETE /api/profile/education/:edu_id
// @desc delete experience from profile
// @access Private
const deleteEducationProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _user: req.user.id })

    if (!profile) {
      errors.noprofile = 'Profile not found'
      return res.status(404).json(errors)
    }

    const eduId = req.params.edu_id

    if (!validateObjectId(eduId)) {
      errors.exp_id = 'Unable to find education'
      return res.status(400).json(errors)
    }

    const removeIndex = profile.education.map(item => item.id).indexOf(eduId)

    profile.education.splice(removeIndex, 1)

    const updatedProfile = await profile.save()

    res.status(200).json(updatedProfile)
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
}

module.exports = {
  myProfile,
  createProfile,
  handleProfile,
  userProfile,
  allProfile,
  deleteProfile,
  experienceProfile,
  educationProfile,
  deleteExperienceProfile,
  deleteEducationProfile
}
