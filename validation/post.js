const validator = require('validator')
const isEmpty = require('../utils/isEmpty')

const validatePostInput = data => {
  let errors = {}

  data.text = !isEmpty(data.text) ? data.text : ''

  // Text
  if (!validator.isLength(data.text, { min: 2, max: 300 })) {
    errors.text = 'Text must be between 2 and 300 characters'
  }

  if (validator.isEmpty(data.text)) {
    errors.text = 'Text field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validatePostInput
