const express = require('express')
const passport = require('passport')
const ProfileController = require('../../controllers/profile')

const router = express.Router()

// @route GET /api/profile
// @desc Get current users profile
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  ProfileController.myProfile
)

// @route GET /api/profile/all
// @desc Get all profiles
// @access Public
router.get('/all', ProfileController.allProfile)

// @route GET /api/profile/handle/:handle
// @desc Get profile by handle
// @access Public
router.get('/handle/:handle', ProfileController.handleProfile)

// @route GET /api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public
router.get('/user/:user_id', ProfileController.userProfile)

// @route POST /api/profile
// @desc Create or Edit user profile
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  ProfileController.createProfile
)

// @route DELETE /api/profile
// @desc delete user and profile
// @access Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  ProfileController.deleteProfile
)

// @route POST /api/profile/experience
// @desc Add experience to profile
// @access Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  ProfileController.experienceProfile
)

// @route POST /api/profile/education
// @desc Add education to profile
// @access Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  ProfileController.educationProfile
)

// @route DELETE /api/profile/experience/:exp_id
// @desc delete experience from profile
// @access Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  ProfileController.deleteExperienceProfile
)

// @route DELETE /api/profile/education/:edu_id
// @desc delete experience from profile
// @access Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  ProfileController.deleteEducationProfile
)

module.exports = router
