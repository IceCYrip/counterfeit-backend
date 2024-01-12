const express = require('express')
const User = require('../models/User')
const router = express.Router()

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', async (req, res) => {
  try {
    if (!!req.body.fullName && !!req.body.email && !!req.body.password) {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        return res
          .status(400)
          .json({ error: 'Sorry a user with this email already exists' })
      } else {
        // Create a new user
        user = await User.create({
          fullName: req.body.fullName,
          password: req.body.password,
          email: req.body.email,
          userType: req.body.userType,
        })
      }

      const data = { fullName: user.fullName, userType: user.userType }
      res.status(200).json(data)
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
})

//Route 2: Login authentication
router.post('/login', async (req, res) => {
  if (!!req.body.email && !!req.body.password) {
    let user = await User.findOne({ email: req.body.email })

    if (user) {
      if (user.password == req.body.password) {
        const data = {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
        }
        res.status(200).json(data)
      } else {
        res.status(400).json({ message: 'Incorrect credentials' })
      }
    } else {
      res.status(400).json({ message: 'Incorrect credentials' })
    }
  } else {
    res.status(400).json({ message: 'Incorrect credentials' })
  }
})

module.exports = router
