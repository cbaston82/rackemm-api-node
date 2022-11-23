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
    console.log('cors 2')
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'rackemm.com') // update to match the domain you will make the request from
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        next()
    })
} else if (process.env.NODE_ENV !== 'production') {
    app.use(cors())
    app.use(morgan('dev'))
}

// SET SECURITY HTTP HEADERS
app.use(helmet())

// SET LIMIT REQUEST FROM SAME IP
const limiter = rateLimit({
    max: 100,
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

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404))
})

app.use(globalErrorHandler)

module.exports = app
