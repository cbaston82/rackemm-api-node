const express = require('express')
const stripeController = require('../controllers/stripeController')
const authController = require('../middleware/authMiddleware')

const router = express.Router()

// PUBLIC ROUTES
router.post('/checkout-user', authController.requireSignin, stripeController.checkoutUser)

// AUTH ROUTES
router.use(authController.requireSignin)
router.post('/create-portal-session', stripeController.createPortalSession)
router.get('/get-user-stripe-customer', stripeController.getUserStripeCustomer)

module.exports = router
