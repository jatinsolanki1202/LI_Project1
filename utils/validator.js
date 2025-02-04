const loginValidator = (req) => {
  try {
    let { email, password } = req.body
    if (!email || !password) throw new Error("invalid email or password")
    let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email != email.match(emailFormat)) throw new Error("enter valid email")

  } catch (err) {
    console.log('Not valid info: ', err.message)
  }
}

module.exports = { loginValidator }