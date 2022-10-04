const express = require('express')
const eventController = require('../controllers/eventController')
const eventsMiddleware = require('../middleware/eventsMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const reviewRouter = require('./reviewRouter')

const router = express.Router()

// MOUNT ROUTER REVIEWS
router.use('/:eventId/reviews', reviewRouter)

// PUBLIC ROUTES
router.get('/get-stats', eventsMiddleware.getWeekly, eventController.getEventStats)
router.get('/weekly-events/public', eventsMiddleware.getWeekly, eventController.getEventsPublic)
router.get('/yearly-events/public', eventsMiddleware.getYearly, eventController.getEventsPublic)
router.get('/public', eventController.getEventsPublic)
router.get('/public/:id', eventController.getEventPublic)

// AUTH ROUTES
router.post(
    '/',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('subscriber', 'administrator'),
    eventController.createEvent,
)

router.get(
    '/weekly-events',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('subscriber', 'administrator'),
    eventsMiddleware.getWeekly,
    eventController.getEvents,
)

router.get(
    '/yearly-events',
    authMiddleware.requireSignin,
    authMiddleware.restrictTo('subscriber', 'administrator'),
    eventsMiddleware.getYearly,
    eventController.getEvents,
)

router
    .route('/:id')
    .patch(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('subscriber', 'administrator'),
        eventController.updateEvent,
    )
    .delete(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('subscriber', 'administrator'),
        eventController.deleteEvent,
    )
    .get(
        authMiddleware.requireSignin,
        authMiddleware.restrictTo('subscriber', 'administrator'),
        eventController.getEvent,
    )

module.exports = router
