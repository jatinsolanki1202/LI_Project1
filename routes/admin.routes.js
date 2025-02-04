const express = require('express')
const { restrictAuth, basicAuth } = require('../middlewares/auth.js')
const { userList, deleteUser } = require('../controllers/admin.controller.js')

const router = express.Router()

router.get('/users', basicAuth, restrictAuth('admin'), userList)
router.get('/delete/:id', basicAuth, restrictAuth('admin'), deleteUser)

module.exports = router