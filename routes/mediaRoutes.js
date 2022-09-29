const express = require('express')
const mediaController = require('../controllers/mediaController')

const router = express.Router()
const authController = require('../middleware/authMiddleware')

router
    .route('/')
    .post(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        mediaController.uploadMedia,
    )
    .get(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        mediaController.getUserMedia,
    )

router.delete(
    '/:id',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    mediaController.deleteMedia,
)

module.exports = router
