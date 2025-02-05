const usermodel = require('../models/user.model.js')
const postmodel = require('../models/post.model.js')
const { hashPassword, verifyPassword } = require('../utils/bcrypt.js')
const { createToken } = require('../utils/jwt.js')

// LOGIN Conrollers
const login = (req, res) => {
  try {
    res.render("login")
  } catch (error) {
    console.log(error.message)
  }
}

const handleLogin = async (req, res) => {
  try {
    // validation
    let { email, password } = req.body
    if (!email || !password) return res.status(400).json({ data: null, message: 'all fields are required', status: 400 })
    let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email != email.match(emailFormat)) return res.status(400).json({ data: null, message: 'enter valid email', status: 400 })

    let existingUser = await usermodel.findOne({ email })
    if (!existingUser) return res.status(400).json({ data: null, message: 'invalid email or password', status: 400 })

    // login
    let isValidPassword = await verifyPassword(password, existingUser.password)
    if (!isValidPassword) return res.status(400).json({ data: null, message: 'invalid email or password', status: 400 })

    const token = createToken(existingUser._id, existingUser.role)

    // res.setHeader('Authorization', `Bearer ${token}`);
    res.cookie("token", token)
    // return res.json({ token, message: 'login successfull', status: 200 })
    res.status(302).redirect(`/user/profile/${existingUser._id}`)
  } catch (error) {
    res.status(500).json({ message: 'Server error', status: 500 });
  }
}

// REGISTER Controllers
const register = (req, res) => {
  try {
    res.render('register')
  } catch (error) {
    console.log(err.messages)
  }
}

const handleRegister = async (req, res) => {
  // validation
  let { fname, lname, email, password, cnfPassword, gender } = req.body
  if (!fname, !lname, !email, !password, !cnfPassword, !gender)
    return res.json({ data: null, message: 'all fields are required', status: 400 })

  if (password != cnfPassword) return res.status(400).json({ data: null, message: "password and confirm password doesn't match", status: 400 })

  let existingUser = await usermodel.findOne({ email })
  if (existingUser) return res.json({ data: null, message: "user already registered", status: 401 })

  // hashing
  let hashedPassword = await hashPassword(password)

  // user creation
  const newUser = await usermodel.create({
    fname, lname, email, password: hashedPassword, gender
  })

  let token = await createToken(newUser._id, newUser.role)
  res.cookie('token', token)
  res.status(200).redirect(`/user/profile/${newUser._id}`)
  // res.json({ data: newUser.email, message: "user regisered", status: 200 })
}

// PROFILE Controllers
const profile = async (req, res) => {
  const id = req.params.id
  if (!id) return res.json({ message: "Bad request, id expected", status: 400 })

  if (id != req.user.id) return res.status(400).redirect('/user/login')
  let user = await usermodel.findOne({ _id: id }).populate('posts')
  if (!user) return res.json({ data: null, message: "invalid user id", status: 400 })

  return res.status(200).render('profile', { user })
}

const logout = (req, res) => {
  res.clearCookie('token')
  res.status(302).redirect('/user/login')
}

const createPost = async (req, res) => {
  let user = await usermodel.findOne({ _id: req.user.id })
  let { content } = req.body

  if (!content) return res.json({ data: null, message: "post cannot be empty", status: 400 })

  let post = await postmodel.create({
    user: req.user.id,
    content
  })

  await user.posts.push(post._id)
  await user.save()
  return res.status(200).redirect(`/user/profile/${req.user.id}`)
}


// DELETE Controllers
const deleteProfile = async (req, res) => {
  try {
    let user = await usermodel.findOne({ _id: req.user.id })
    res.render('deleteProfile', { user })
  } catch (err) {
    console.log(err.message)
  }
}

const handleDeleteProfile = async (req, res) => {
  let { password } = req.body
  if (!password) return res.json({ message: "password is required", status: 400 })
  let user = await usermodel.findOne({ _id: req.user.id })

  let isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) return res.status(401).redirect('/user/delete-profile')

  await postmodel.deleteMany({ user: user._id })
  await usermodel.findOneAndDelete({ _id: req.user.id })
  return res.status(302).redirect('/user/register')
}


// USER UPDATE Controllers
const updateProfile = async (req, res) => {
  try {
    let user = await usermodel.findOne({ _id: req.user.id })
    res.render("updateProfile", { user })
  } catch (err) {
    res.status(500).json({ message: `${err.message}`, status: 500 })
  }
}

const handleUpdateProfile = async (req, res) => {
  try {
    let { fname, lname, password, gender } = req.body

    if (password) var hashedPassword = await hashPassword(password)

    await usermodel.findOneAndUpdate({ _id: req.user.id }, {
      fname, lname, gender, password: hashedPassword
    })

    res.status(302).redirect(`/user/profile/${req.user.id}`)
  } catch (err) {
    console.log("error updating profile: ", err.message)
  }
}

// Post Controllers
const likePost = async (req, res) => {
  try {
    let id = req.params.id;
    let post = await postmodel.findOne({ _id: id }).populate("user")

    if (post.likes.indexOf(req.user.id) == -1) {
      post.likes.push(req.user.id)
    } else {
      post.likes.splice(req.user.id, 1)
    }

    await post.save()
    return res.redirect(`/user/profile/${req.user.id}`)
  } catch (err) {
    console.log(err.message)
  }
}

const deletePost = async (req, res) => {
  try {
    let postId = req.params.id
    let user = await usermodel.findOne({ _id: req.user.id })

    await user.posts.splice(user.posts.indexOf(postId), 1)
    await postmodel.findOneAndDelete({ _id: postId })

    await user.save()
    return res.redirect(`/user/profile/${req.user.id}`)
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = {
  login,
  handleLogin,
  register,
  handleRegister,
  profile,
  logout,
  createPost,
  deleteProfile,
  handleDeleteProfile,
  updateProfile,
  handleUpdateProfile,
  likePost,
  deletePost
}