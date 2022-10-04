const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const reviewController = require('../controllers/reviewController')

const router = express.Router({ mergeParams: true })

// PUBLIC ROUTES
router.route('/public').get(reviewController.getAllReviews)

// AUTH ROUTES
router.use(
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('free', 'subscriber', 'administrator'),
)
router.route('/').post(reviewController.createReview)
router.route('/:id').delete(reviewController.deleteReview).patch(reviewController.updateReview)

module.exports = router
