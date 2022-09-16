require('dotenv').config({ path: './.env' })
const express = require('express')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const bodyParser = require('body-parser')
const {
    webhook,
    createPortalSession,
    checkoutUser,
    getUserStripeCustomer,
} = require('./controllers/stripeController')
const {
    getAllYearlyEvents,
    getSingleYearlyEvent,
    getYearlyEvents,
    getYearlyEvent,
    createYearlyEvent,
    deleteYearlyEvent,
    updateYearlyEvent,
} = require('./controllers/yearlyEventController')
const requireSignin = require('./middleware/requireSignin')
const { yearlyEventValidator } = require('./validators/yearlyEventValidator')
const {
    getWeeklyEvents,
    getWeeklyEvent,
    createWeeklyEvent,
    deleteWeeklyEvent,
    updateWeeklyEvent,
    getAllWeeklyEvents,
    getSingleWeeklyEvent,
} = require('./controllers/weeklyEventController')
const { weeklyEventValidator } = require('./validators/weeklyEventValidator')
const { loginUser, signupUser } = require('./controllers/userController')
const { uploadMedia, getUserMedia, deleteMedia } = require('./controllers/mediaController')

// connect to db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connect to Mongo Database')
    })
    .catch((error) => {
        console.log(error)
    })
const app = express()

// before middleware to get raw payload for stripe verification
app.post('/api/v1/stripe/webhook', bodyParser.raw({ type: 'application/json' }), webhook)
// middleware
// app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '512MB' }))
app.use(expressValidator())

// open yearly events routes
app.get('/api/v1/yearly-events/get/', getAllYearlyEvents)
app.get('/api/v1/yearly-events/get/:id', getSingleYearlyEvent)

// open weekly event routes
app.get('/api/v1/weekly-events/get/', getAllWeeklyEvents)
app.get('/api/v1/weekly-events/get/:id', getSingleWeeklyEvent)

// open user routes
app.post('/api/v1/user/login', loginUser)
app.post('/api/v1/user/signup', signupUser)

// open stripe routes

app.use(requireSignin)
// authenticated yearly events routes
app.get('/api/v1/yearly-events/', getYearlyEvents)
app.get('/api/v1/yearly-events/:id', getYearlyEvent)
app.post('/api/v1/yearly-events/', yearlyEventValidator, createYearlyEvent)
app.delete('/api/v1/yearly-events/:id', deleteYearlyEvent)
app.patch('/api/v1/yearly-events/:id', yearlyEventValidator, updateYearlyEvent)

// authenticated weekly events routes
app.get('/api/v1/weekly-events/', getWeeklyEvents)
app.get('/api/v1/weekly-events/:id', getWeeklyEvent)
app.post('/api/v1/weekly-events/', weeklyEventValidator, createWeeklyEvent)
app.delete('/api/v1/weekly-events/:id', deleteWeeklyEvent)
app.patch('/api/v1/weekly-events/:id', weeklyEventValidator, updateWeeklyEvent)

// authenticated stripe routes
app.post('/api/v1/stripe/create-portal-session', createPortalSession)
app.post('/api/v1/stripe/checkout-user', checkoutUser)
app.get('/api/v1/stripe/get-user-stripe-customer', getUserStripeCustomer)

app.post('/api/v1/media/upload', uploadMedia)
app.get('/api/v1/media/', getUserMedia)
app.delete('/api/v1/media/:id', deleteMedia)

app.listen(process.env.PORT, () => {
    console.log(`connected to db and listening on port ${process.env.PORT}`)
})
