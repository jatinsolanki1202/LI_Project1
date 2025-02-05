const jwt = require('jsonwebtoken')
require('dotenv').config()
const createToken = (id, role) => {
  let token = jwt.sign({ id, role }, process.env.JWT_SECRET);
  return token
}

const verifyToken = (token) => {
  let decoded = jwt.verify(token, process.env.JWT_SECRET)
  return decoded
}

module.exports = {
  createToken,
  verifyToken
}