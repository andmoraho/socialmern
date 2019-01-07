const validator = require('validator')
const isEmpty = require('../utils/isEmpty')

const validateExperienceInput = data => {
  let errors = {}

  data.title = !isEmpty(data.title) ? data.title : ''
  data.company = !isEmpty(data.company) ? data.company : ''
  data.from = !isEmpty(data.from) ? data.from : ''

  // Title
  if (validator.isEmpty(data.title)) {
    errors.title = 'Job title field is required'
  }

  // Company
  if (validator.isEmpty(data.company)) {
    errors.company = 'Company field is required'
  }

  if (!validator.isLength(data.company, { min: 2 })) {
    errors.company = 'Password must at least 2 characters'
  }

  // From
  if (validator.isEmpty(data.from)) {
    errors.from = 'From date field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateExperienceInput
