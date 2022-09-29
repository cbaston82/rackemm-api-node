const express = require('express')
const yearlyEventController = require('../controllers/yearlyEventController')
const authController = require('../middleware/authMiddleware')
const { yearlyEventValidator } = require('../validators/yearlyEventValidator')

const router = express.Router()

router.get('/get/', yearlyEventController.getAllYearlyEvents)
router.get('/get/:id', yearlyEventController.getSingleYearlyEvent)

router
    .route('/')
    .get(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        yearlyEventController.getYearlyEvents,
    )
    .post(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        yearlyEventValidator,
        yearlyEventController.createYearlyEvent,
    )

router
    .route('/:id')
    .get(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        yearlyEventController.getYearlyEvent,
    )
    .delete(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        yearlyEventController.deleteYearlyEvent,
    )
    .patch(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        yearlyEventValidator,
        yearlyEventController.updateYearlyEvent,
    )

module.exports = router
