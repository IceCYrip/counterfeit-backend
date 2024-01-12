const express = require('express')
const Product = require('../models/Product')
const router = express.Router()
const qr = require('qrcode')

const frontendServerURL = 'http://localhost:3000'

//Route 1: Create a product
router.post('/createProduct', async (req, res) => {
  try {
    if (
      !!req.body.brand &&
      !!req.body.productID &&
      !!req.body.batchNo &&
      !!req.body.price &&
      !!req.body.userID &&
      !!req.body.dateOfManufacture
    ) {
      // Check whether the user with this email exists already
      let product = await Product.findOne({ productID: req.body.productID })
      if (product) {
        return res.status(400).json({
          error: 'Sorry a product with this product id already exists',
        })
      } else {
        // Create a new product
        product = await Product.create({
          productID: req.body.productID,
          brand: req.body.brand,
          batchNo: req.body.batchNo,
          price: req.body.price,
          dateOfManufacture: req.body.dateOfManufacture,
          userID: req.body.userID,
          qrCode: '',
        })
      }

      // The URL you want to encode in the QR code
      const urlToRedirect = `${frontendServerURL}/product-details?id=${product?._id}`

      // Generate the QR code as a data URL
      qr.toDataURL(urlToRedirect, async (err, data_url) => {
        if (err) {
          console.error(err)
          res.status(500).send('Error occurred while generating QR Code')
        } else {
          // Store the QR code as a data URL in the qrCodeURL variable

          const updatedData = {
            qrCode: data_url,
          }

          product = await Product.findByIdAndUpdate(product?._id, updatedData, {
            new: true,
          })
        }
        const data = {
          message: 'Product created Successfully',
          id: product?._id,
          qrCode: product?.qrCode,
        }
        res.status(200).json(data)
      })
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
})

//Route 2: Get product details
router.post('/getProduct', async (req, res) => {
  try {
    if (!!req.body.productID) {
      let product = await Product.findById(req.body.productID)
      if (product) {
        const data = {
          id: product._id,
          brand: product.brand,
          productID: product.productID,
          batchNo: product.batchNo,
          price: product.price,
          dateOfManufacture: product.dateOfManufacture,
          qrCode: product.qrCode,
        }

        res.status(200).json(data)
      } else {
        res.status(404).send('Product not found')
      }
    } else {
      res.status(400).json({ message: 'Product ID not found' })
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
})

//Route 3: Get product details
router.post('/getUserWiseProducts', async (req, res) => {
  try {
    if (!!req.body.userID) {
      let product = await Product.find({ userID: req.body.userID })
      if (product) {
        const data = product?.map((j) => ({
          id: j?._id,
          brand: j?.brand,
          productID: j?.productID,
          batchNo: j?.batchNo,
          price: j?.price,
          dateOfManufacture: j?.dateOfManufacture,
          qrCode: j?.qrCode ?? 'No QR Code',
        }))

        res.status(200).json(data)
      } else {
        res.status(404).send('Product not found')
      }
    } else {
      res.status(400).json({ message: 'Product ID not found' })
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
})

//Route 4: Get product's QR Code
router.post('/getQRCode', async (req, res) => {
  try {
    if (!!req.body.productID) {
      let product = await Product.findOne({ _id: req.body.productID })
      if (product) {
        res.status(200).send(product?.qrCode)
      } else {
        res.status(404).send('Product not found')
      }
    } else {
      res.status(400).json({ message: 'Product ID not found' })
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
})

//Route 5: Download product's QR Code
router.post('/download', async (req, res) => {
  try {
    if (!!req.body.productID) {
      let product = await Product.findOne({ _id: req.body.productID })
      if (product) {
        // res.status(200).send(product?.qrCode)
        res.status(200).download('E:\tempp', product?.qrCode)
      } else {
        res.status(404).send('Product not found')
      }
    } else {
      res.status(400).json({ message: 'Product ID not found' })
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router
