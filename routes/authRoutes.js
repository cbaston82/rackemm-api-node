const express = require('express')
const authController = require('../controllers/authController')
const { createUserValidator } = require('../validators/createUserValidator')

const router = express.Router()

router.post('/login', authController.loginUser)
router.post('/signup', createUserValidator, authController.signUp)

module.exports = router
