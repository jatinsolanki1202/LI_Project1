const postmodel = require('../models/post.model.js')
const usermodel = require('../models/user.model.js')

const userList = async (req, res) => {
  let admin = await usermodel.findOne({ _id: req.user.id })
  const users = await usermodel.find({}).populate("posts")
  // let posts = await postModel.find({}).populate("user")

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

const deletePost = async (req, res) => {
  try {
    let postId = req.params.id
    let post = await postmodel.findOne({ _id: postId })

    let user = await usermodel.findOne({ _id: post.user })

    let deleted = await user.posts.splice(user.posts.indexOf(postId), 1)
    console.log("deleted post: ", deleted)

    await user.save()
    await postmodel.findOneAndDelete({ _id: postId })
    return res.redirect(`/admin/users`)
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = {
  userList,
  deleteUser,
  deletePost
}