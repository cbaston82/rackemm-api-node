const express = require('express')
const mediaController = require('../controllers/mediaController')

const router = express.Router()
const authController = require('../middleware/authMiddleware')

// AUTH ROUTES
router
    .route('/')
    .post(
        authController.requireSignin,
        authController.restrictTo('subscriber', 'administrator'),
        mediaController.uploadMedia,
    )
    .get(
        authController.requireSignin,
        authController.restrictTo('subscriber', 'administrator'),
        mediaController.getUserMedia,
    )

router.delete(
    '/:id',
    authController.requireSignin,
    authController.restrictTo('subscriber', 'administrator'),
    mediaController.deleteMedia,
)

module.exports = router
