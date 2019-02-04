const validator = require('validator')
const isEmpty = require('../utils/isEmpty')

const validateProfileInput = data => {
  let errors = {}

  data.handle = !isEmpty(data.handle) ? data.handle : ''
  data.status = !isEmpty(data.status) ? data.status : ''
  data.skills = !isEmpty(data.skills) ? data.skills : ''

  // Handle
  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Name must be between 2 and 40 characters'
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is required'
  }

  // Status
  if (validator.isEmpty(data.status)) {
    errors.status = 'Status field is required'
  }

  // Skills
  if (validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required'
  }

  // Website
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = 'Not a valid URL'
    }
  }

  // Youtube
  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid URL'
    }
  }
  // Twitter
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid URL'
    }
  }
  // Facebook
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid URL'
    }
  }
  // Instagram
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = 'Not a valid URL'
    }
  }
  // LinkedIn
  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = 'Not a valid URL'
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateProfileInput
