const validator = require('validator')

const validateObjectId = objectId => {
  return validator.isMongoId(objectId)
}

module.exports = validateObjectId
