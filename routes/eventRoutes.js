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
router.get('/public', eventController.getEventsPublic)
router.get('/public/:id', eventController.getEventPublic)

// AUTH ROUTES
router.use(authMiddleware.requireSignin, authMiddleware.restrictTo('subscriber', 'administrator'))

router.post('/', eventController.createEvent)
router.get('/', eventController.getEvents)
router
    .route('/:id')
    .patch(eventController.updateEvent)
    .delete(eventController.deleteEvent)
    .get(eventController.getEvent)

module.exports = router
