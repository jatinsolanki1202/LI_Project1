const { verifyToken } = require('../utils/jwt.js')

const basicAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token
    if (!token) return res.status(403).redirect('/user/login')

    let user = await verifyToken(token)

    if (!user) return res.json({ data: null, message: "Invalid token. Login again" })
    req.user = user

    next()
  } catch (err) {
    console.log('auth error: ', err.message)
  }
}

const restrictAuth = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.json({ data: null, message: "Unauthorized", status: 403 })
    }
    next()
  }
}

module.exports = {
  basicAuth, restrictAuth
}