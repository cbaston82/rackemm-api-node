const bodyParser = require('body-parser')
const express = require('express')
const expressValidator = require('express-validator')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const userRouter = require('./routes/userRoutes')
const filterRouter = require('./routes/filterRoutes')
const eventRouter = require('./routes/eventRoutes')
const stripeRouter = require('./routes/stripeRoutes')
const mediaRouter = require('./routes/mediaRoutes')
const authRouter = require('./routes/authRoutes')
const stripeController = require('./controllers/stripeController')

const app = express()
// SET SECURITY HTTP HEADERS
app.use(helmet())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// SET LIMIT REQUEST FROM SAME IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 100,
    message: 'Too many requests from your IP, try again in an hour',
})
app.use('/api', limiter)

// cannot run through jsonParser
app.post(
    '/api/v1/stripe/webhook',
    bodyParser.raw({ type: 'application/json' }),
    stripeController.webhook,
)

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
        whitelist: ['game'],
    }),
)

// ROUTES
app.use('/api/v1/events', eventRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/filters', filterRouter)
app.use('/api/v1/stripe', stripeRouter)
app.use('/api/v1/media', mediaRouter)

app.all('*', (req, res, next) => {
    res.status(404).json({ error: `Can't find ${req.originalUrl}` })
})

module.exports = app
