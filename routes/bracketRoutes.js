const express = require('express')
const bracketController = require('../controllers/bracketController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router({ mergeParams: true })

// PUBLIC ROUTES
router.route('/').get(bracketController.getAllBrackets)

// AUTH ROUTES
router.use(authMiddleware.requireSignin, authMiddleware.restrictTo('user', 'subscriber'))
router.route('/').post(bracketController.createBracket)
router
    .route('/:id')
    .delete(bracketController.deleteBracket)
    .patch(bracketController.updateBracket)
    .get(bracketController.getBracket)

module.exports = router
