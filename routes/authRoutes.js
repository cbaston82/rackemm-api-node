const express = require('express')
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// PUBLIC ROUTES
router.post('/login', authController.loginUser)
router.post('/signup', authController.signUp)
router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)

// AUTH ROUTES
router.use(authMiddleware.requireSignin, authMiddleware.restrictTo('subscriber', 'administrator'))

router.patch('/update-password/', authController.updatePassword)

module.exports = router
