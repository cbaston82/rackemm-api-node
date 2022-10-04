const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const reviewController = require('../controllers/reviewController')

const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('free-user', 'subscribed-user', 'admin-user'),
        reviewController.createReview,
    )

router
    .route('/:id')
    .delete(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('free-user', 'subscribed-user', 'admin-user'),
        reviewController.deleteReview,
    )
    .patch(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('free-user', 'subscribed-user', 'admin-user'),
        reviewController.updateReview,
    )

module.exports = router
