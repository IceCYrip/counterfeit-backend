const mongoose = require('mongoose')

const mongoURI =
  'mongodb+srv://karansable:karan123@counterfeitproductrecog.nlz2zsq.mongodb.net/counterfeit'

const connectToMongo = () => {
  mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000, // Set a longer timeout value
  })
}

module.exports = connectToMongo
