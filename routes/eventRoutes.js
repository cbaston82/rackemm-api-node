const express = require('express')
const eventController = require('../controllers/eventController')
const authController = require('../middleware/authMiddleware')
const eventsMiddleware = require('../middleware/eventsMiddleware')

const router = express.Router()

// PUBLIC
router.get('/get-stats', eventsMiddleware.getWeekly, eventController.getEventStats)
router.get('/weekly-events/public', eventsMiddleware.getWeekly, eventController.getEventsPublic)
router.get('/yearly-events/public', eventsMiddleware.getYearly, eventController.getEventsPublic)
router.get('/public/:id', eventController.getEventPublic)

// AUTH WEEKLY
router.post(
    '/',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    eventController.createEvent,
)

router.get(
    '/weekly-events',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    eventsMiddleware.getWeekly,
    eventController.getEvents,
)

router.get(
    '/yearly-events',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    eventsMiddleware.getYearly,
    eventController.getEvents,
)

router
    .route('/:id')
    .patch(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        eventController.updateEvent,
    )
    .delete(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        eventController.deleteEvent,
    )
    .get(
        authController.requireSignin,
        authController.restrictTo('subscribed-user', 'admin-user'),
        eventController.getEvent,
    )

module.exports = router
