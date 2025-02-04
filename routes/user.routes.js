const express = require('express')
const router = express.Router()
const { login, handleLogin, register, handleRegister, profile, logout, createPost, deleteProfile, handleDeleteProfile, updateProfile, handleUpdateProfile } = require('../controllers/user.controller.js')
const { basicAuth } = require('../middlewares/auth.js')

//GET Routes
router.get('/login', login)
router.get('/register', register)
router.get('/profile/:id', basicAuth, profile)
router.get('/logout', logout)
router.get('/delete-profile', basicAuth, deleteProfile)
router.get('/update-profile', basicAuth, updateProfile)

//POST Routes
router.post('/login', handleLogin)
router.post('/register', handleRegister)
router.post('/post', basicAuth, createPost)
router.post('/delete-profile', basicAuth, handleDeleteProfile)
router.post('/update-profile', basicAuth, handleUpdateProfile)

module.exports = router