const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

const connect = async () => {
  const mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  await mongoose.connect(mongoUri, { dbName: "testingDb" })
  // console.log(`mongodb connected to ${mongoUri}`)
}

const disConnectDb = async () => {
  await mongoose.connection.close()
}

module.exports = {
  connect,
  disConnectDb
}