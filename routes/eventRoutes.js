const express = require('express')
const eventController = require('../controllers/eventController')
const authController = require('../middleware/authMiddleware')
const { weeklyEventValidator } = require('../validators/weeklyEventValidator')
const eventsMiddleware = require('../middleware/eventsMiddleware')
const { yearlyEventValidator } = require('../validators/yearlyEventValidator')

const router = express.Router()

// PUBLIC

router.get('/get-stats', eventsMiddleware.getWeekly, eventController.getEventStats)
router.get('/weekly-events/public', eventsMiddleware.getWeekly, eventController.getEventsPublic)
router.get('/yearly-events/public', eventsMiddleware.getYearly, eventController.getEventsPublic)
router.get('/weekly-events/public/:id', eventsMiddleware.getWeekly, eventController.getEventsPublic)
router.get('/yearly-events/public/:id', eventsMiddleware.getYearly, eventController.getEventsPublic)

// AUTH WEEKLY
router.post(
    '/weekly-events',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    weeklyEventValidator,
    eventController.createEvent,
)

router.get(
    '/weekly-events',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    eventsMiddleware.getWeekly,
    eventController.getEvents,
)

router.patch(
    '/weekly-events/:id',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    weeklyEventValidator,
    eventController.updateEvent,
)

// AUTH YEARLY
router.post(
    '/yearly-events',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    yearlyEventValidator,
    eventController.createEvent,
)

router.get(
    '/yearly-events',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    eventsMiddleware.getYearly,
    eventController.getEvents,
)

router.patch(
    '/yearly-events/:id',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    yearlyEventValidator,
    eventController.updateEvent,
)

// AUTh GLOBAL
router.delete(
    '/:id',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    eventController.deleteEvent,
)

router.get(
    '/:id',
    authController.requireSignin,
    authController.restrictTo('subscribed-user', 'admin-user'),
    eventController.getEvent,
)

module.exports = router
