const express = require('express')
const { restrictAuth, basicAuth } = require('../middlewares/auth.js')
const { userList, deleteUser, deletePost } = require('../controllers/admin.controller.js')

const router = express.Router()

router.get('/users', basicAuth, restrictAuth('admin'), userList)
router.get('/delete/:id', basicAuth, restrictAuth('admin'), deleteUser)
router.get('/post/delete/:id', basicAuth, restrictAuth('admin'), deletePost)

module.exports = router