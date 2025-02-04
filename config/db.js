const mongoose = require("mongoose")

const dbConnection = async () => {
  const connect = await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      if (process.env.NODE_ENV == 'DEV') console.log("DB Connected")
    })
    .catch((err) => console.log("DB Connection error: ", err.message))
}

module.exports = dbConnection