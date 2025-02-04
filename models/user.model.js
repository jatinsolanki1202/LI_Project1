const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    required: true,
    type: String
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "user"],
      message: `{VALUE} is not a valid role`
    },
    default: "user"
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post"
  }]
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)