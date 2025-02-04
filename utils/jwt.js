const jwt = require('jsonwebtoken')
require('dotenv').config()

const createToken = async (id, role) => {
  let token = await jwt.sign({ id, role }, process.env.JWT_SECRET)
  return token
}

const verifyToken = async (token) => {
  let decoded = await jwt.verify(token, process.env.JWT_SECRET)
  return decoded
}

module.exports = {
  createToken,
  verifyToken
}