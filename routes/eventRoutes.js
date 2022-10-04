const express = require('express')
const eventController = require('../controllers/eventController')
const eventsMiddleware = require('../middleware/eventsMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const reviewRouter = require('./reviewRouter')

const router = express.Router()

// MOUNT ROUTER REVIEWS
router.use('/:eventId/reviews', reviewRouter)

// PUBLIC
router.get('/get-stats', eventsMiddleware.getWeekly, eventController.getEventStats)
router.get('/weekly-events/public', eventsMiddleware.getWeekly, eventController.getEventsPublic)
router.get('/yearly-events/public', eventsMiddleware.getYearly, eventController.getEventsPublic)
router.get('/public/:id', eventController.getEventPublic)

// AUTH WEEKLY
router.post(
    '/',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('subscribed-user', 'admin-user'),
    eventController.createEvent,
)

router.get(
    '/weekly-events',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('subscribed-user', 'admin-user'),
    eventsMiddleware.getWeekly,
    eventController.getEvents,
)

router.get(
    '/yearly-events',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('subscribed-user', 'admin-user'),
    eventsMiddleware.getYearly,
    eventController.getEvents,
)

router
    .route('/:id')
    .patch(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('subscribed-user', 'admin-user'),
        eventController.updateEvent,
    )
    .delete(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('subscribed-user', 'admin-user'),
        eventController.deleteEvent,
    )
    .get(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('subscribed-user', 'admin-user'),
        eventController.getEvent,
    )

module.exports = router
