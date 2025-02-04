const usermodel = require('../models/user.model.js')
const router = require('../routes/user.routes.js')
const { hashPassword, verifyPassword } = require('../utils/bcrypt.js')
const { createToken } = require('../utils/jwt.js')

const userList = async (req, res) => {
  let admin = await usermodel.findOne({ _id: req.user.id })
  const users = await usermodel.find({})

  res.render('allUsers', { users, admin })
}

const deleteUser = async (req, res) => {
  let id = req.params.id
  if (!id) return res.json({ data: null, message: "id is required", status: 400 })

  let user = await usermodel.findOne({ _id: id })
  if (user.role == 'admin') return res.status(403).json({ data: null, message: "cannot delete an admin", status: 403 })

  await usermodel.findOneAndDelete({ _id: id })
  return res.status(302).redirect('/admin/users')
}

module.exports = {
  userList,
  deleteUser
}