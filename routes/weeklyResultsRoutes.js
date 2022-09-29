const express = require('express')
const authController = require('../middleware/authMiddleware')
const weeklyResultsController = require('../controllers/weeklyResultsController')
const { weeklyResultsValidator } = require('../validators/weeklyResultsValidator')

const router = express.Router()

router
    .route('/')
    .post(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        weeklyResultsValidator,
        weeklyResultsController.createWeeklyResults,
    )
    .get(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        weeklyResultsController.getWeeklyResults,
    )

router
    .route('/:id')
    .delete(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        weeklyResultsController.deleteWeeklyResults,
    )
    .patch(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        weeklyResultsValidator,
        weeklyResultsController.updateWeeklyResults,
    )

module.exports = router
