const express = require('express')
const stripeController = require('../controllers/stripeController')
const authController = require('../middleware/authMiddleware')

const router = express.Router()

// PUBLIC ROUTES

// AUTH ROUTES
router.use(authController.requireSignin)
router.post('/create-portal-session', stripeController.createPortalSession)
router.post('/checkout-user', stripeController.checkoutUser)
router.get('/get-user-stripe-customer', stripeController.getUserStripeCustomer)

module.exports = router
