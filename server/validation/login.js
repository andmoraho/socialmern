const validator = require('validator')
const isEmpty = require('../utils/isEmpty')

const validateLoginInput = data => {
  let errors = {}

  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''

  // Email
  if (validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }

  // Password
  if (validator.isEmpty(data.password)) {
    errors.password = 'Password field is required'
  }

  if (!validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = 'Password must at least 8 characters'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateLoginInput
