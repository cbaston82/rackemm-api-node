const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const reviewController = require('../controllers/reviewController')

const router = express.Router({ mergeParams: true })

// PUBLIC ROUTES
router.route('/public').get(reviewController.getAllReviews)

// AUTH ROUTES
router
    .route('/')
    .post(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('free', 'subscriber', 'administrator'),
        reviewController.createReview,
    )

router
    .route('/:id')
    .delete(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('free', 'subscriber', 'administrator'),
        reviewController.deleteReview,
    )
    .patch(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('free', 'subscriber', 'administrator'),
        reviewController.updateReview,
    )

module.exports = router
