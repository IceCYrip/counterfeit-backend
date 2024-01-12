const mongoose = require('mongoose')
const { Schema } = mongoose

const ProductSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  productID: {
    type: String,
    required: true,
    unique: true,
  },
  batchNo: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  dateOfManufacture: {
    type: String,
    require: true,
  },
  userID: {
    type: String,
    require: true,
  },
  qrCode: {
    type: String,
    require: false,
  },
})
const Product = mongoose.model('product', ProductSchema)
module.exports = Product
