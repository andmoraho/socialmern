const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

const generateToken = user => {
  const payload = { id: user.id, name: user.name, avatar: user.avatar }
  return jwt.sign(payload, keys.JWT_SECRET, {
    expiresIn: '7 days'
  })
}

module.exports = generateToken
