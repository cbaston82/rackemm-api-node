const express = require('express')
const stripeController = require('../controllers/stripeController')
const authController = require('../middleware/authMiddleware')

const router = express.Router()

router.post(
    '/create-portal-session',
    authController.requireSignin,
    stripeController.createPortalSession,
)

router.get(
    '/get-user-stripe-customer',
    authController.requireSignin,
    stripeController.getUserStripeCustomer,
)

router.post('/checkout-user', authController.requireSignin, stripeController.checkoutUser)

module.exports = router
