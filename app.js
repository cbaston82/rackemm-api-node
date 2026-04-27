const express = require('express')
const expressValidator = require('express-validator')
const morgan = require('morgan')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const userRouter = require('./routes/userRoutes')
const filterRouter = require('./routes/filterRoutes')
const bracketRouter = require('./routes/bracketRoutes')
const eventRouter = require('./routes/eventRoutes')
const stripeRouter = require('./routes/stripeRoutes')
const mediaRouter = require('./routes/mediaRoutes')
const authRouter = require('./routes/authRoutes')
const reviewRouter = require('./routes/reviewRouter')
const stripeController = require('./controllers/stripeController')

const app = express()

// cannot run through jsonParser
app.post('/api/v1/stripe/webhook', express.raw({ type: '*/*' }), stripeController.webhook)

if (process.env.NODE_ENV === 'production') {
    const whitelist = [
        'https://www.rackemm.com',
        'https://rackemm.netlify.app',
        'https://web-production-897fe.up.railway.app',
        'a.stripecdn.com',
        'api.stripe.com',
        'atlas.stripe.com',
        'auth.stripe.com',
        'b.stripecdn.com',
        'billing.stripe.com',
        'buy.stripe.com',
        'c.stripecdn.com',
        'checkout.stripe.com',
        'climate.stripe.com',
        'connect.stripe.com',
        'dashboard.stripe.com',
        'express.stripe.com',
        'files.stripe.com',
        'hooks.stripe.com',
        'invoice.stripe.com',
        'invoicedata.stripe.com',
        'js.stripe.com',
        'm.stripe.com',
        'm.stripe.network',
        'manage.stripe.com',
        'pay.stripe.com',
        'payments.stripe.com',
        'q.stripe.com',
        'qr.stripe.com',
        'r.stripe.com',
        'verify.stripe.com',
        'stripe.com',
        'terminal.stripe.com',
        'uploads.stripe.com',
    ]

    const corsOptions = {
        origin: function (origin, callback) {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
    }

    app.use(cors(corsOptions))
} else if (process.env.NODE_ENV !== 'production') {
    app.use(cors())
    app.use(morgan('dev'))
}

// SET SECURITY HTTP HEADERS
app.use(helmet())

// SET LIMIT REQUEST FROM SAME IP
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 100,
    message: 'Too many requests from your IP, try again in an hour',
})
app.use('/api', limiter)

// BODY PARSER, TAKES PAYLOAD BODY AND PUTS IT IN REQ.BODY
app.use(express.json({ limit: '512MB' }))
app.use(expressValidator())

// SANITIZE DATA AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize())

// SANITIZE  AGAINST XSS
app.use(xss())

// PREVENT PARAMETER POLLUTION
app.use(
    hpp({
        whitelist: [
            'game',
            'type',
            'pointOfContact',
            'buyIn',
            'venue',
            'city',
            'day',
            'ratingSystem',
        ],
    }),
)

// ROUTES
app.use('/api/v1/events', eventRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/filters', filterRouter)
app.use('/api/v1/brackets', bracketRouter)
app.use('/api/v1/stripe', stripeRouter)
app.use('/api/v1/media', mediaRouter)
app.use('/api/v1/reviews', reviewRouter)

// TEMPORARY — remove after running once
const Event = require('./models/eventModel')
app.get('/api/v1/maintenance/fix-event-dates', async (req, res) => {
    const futureDates = [
        { startTime: '2026-05-10T16:00', endTime: '2026-05-11T23:59' },
        { startTime: '2026-05-24T14:00', endTime: '2026-05-25T23:59' },
        { startTime: '2026-06-07T16:00', endTime: '2026-06-08T23:59' },
        { startTime: '2026-06-21T12:00', endTime: '2026-06-22T23:59' },
        { startTime: '2026-07-04T16:00', endTime: '2026-07-05T23:59' },
    ]
    const events = await Event.find({ type: 'special' }).sort({ startTime: 1 })
    for (let i = 0; i < events.length; i++) {
        events[i].startTime = futureDates[i].startTime
        events[i].endTime = futureDates[i].endTime
        await events[i].save()
    }
    res.json({ status: 'success', updated: events.length })
})

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404))
})

app.use(globalErrorHandler)

module.exports = app
