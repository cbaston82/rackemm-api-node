const express = require('express')
const mediaController = require('../controllers/mediaController')

const router = express.Router()
const authController = require('../middleware/authMiddleware')

// AUTH ROUTES
router.use(authController.requireSignin, authController.restrictTo('subscriber', 'administrator'))
router.route('/').post(mediaController.uploadMedia).get(mediaController.getUserMedia)
router.delete('/:id', mediaController.deleteMedia)

module.exports = router
