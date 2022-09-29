const express = require('express')
const weeklyEventController = require('../controllers/weeklyEventController')
const authController = require('../middleware/authMiddleware')
const { weeklyEventValidator } = require('../validators/weeklyEventValidator')

const router = express.Router()

router.get('/get/', weeklyEventController.getAllWeeklyEvents)
router.get('/get/:id', weeklyEventController.getSingleWeeklyEvent)

router
    .route('/')
    .get(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        weeklyEventController.getWeeklyEvents,
    )
    .post(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        weeklyEventValidator,
        weeklyEventController.createWeeklyEvent,
    )

router
    .route('/:id')
    .delete(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        weeklyEventController.deleteWeeklyEvent,
    )
    .patch(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        weeklyEventValidator,
        weeklyEventController.updateWeeklyEvent,
    )
    .get(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        weeklyEventController.getWeeklyEvent,
    )

module.exports = router
