require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const dbConnection = require('./config/db.js')
const path = require('path')
const userRouter = require('./routes/user.routes.js')
const adminRouter = require('./routes/admin.routes.js')
const helmet = require('helmet')
const { basicAuth } = require('./middlewares/auth.js')
const { connect } = require('./config/testDb.js')

const app = express()

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "/public/js/bootstrap.bundle.min.js"],
      scriptSrcAttr: ["'unsafe-inline'"], // Enables inline event handlers
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "/public/css/bootstrap.min.css", "cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"],
    },
  },
}))

dbConnection()

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs")

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/user', userRouter)
app.use('/admin', adminRouter)

app.get('/', basicAuth, (req, res) => {
  try {
    let id = req.user.id
    res.redirect(`/user/profile/${id}`)
  } catch (err) {
    console.log(err.message)
  }
})

// testing db connection
// connect()
//   .then(() => {
//     app.listen(process.env.PORT, () => {
//       if (process.env.NODE_ENV == 'DEV') console.log(`server running on port ${process.env.PORT}`)
//     })
//   })
//   .catch((err) => {
//     console.log(`invalid database connection: `, err.message)
//   })

// production db connection
app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`)
})

module.exports = app