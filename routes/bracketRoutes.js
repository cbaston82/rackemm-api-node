const express = require('express')
const bracketController = require('../controllers/bracketController')
const authController = require('../middleware/authMiddleware')

const router = express.Router()

// AUTH ROUTES
router.use(authController.requireSignin, authController.restrictTo('subscriber', 'administrator'))
router.route('/').post(bracketController.createBracket).get(bracketController.getAllBrackets)
router
    .route('/:id')
    .get(bracketController.getABracket)
    .delete(bracketController.deleteABracket)
    .patch(bracketController.updateBracket)

module.exports = router
