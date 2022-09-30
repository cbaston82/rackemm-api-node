const express = require('express')
const authController = require('../controllers/authController')
const { createUserValidator } = require('../validators/createUserValidator')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/login', authController.loginUser)
router.post('/signup', createUserValidator, authController.signUp)

router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)
router.patch('/update-password/', authMiddleware.requireSignin, authController.updatePassword)

module.exports = router
