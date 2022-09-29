const bodyParser = require('body-parser')
const express = require('express')
const expressValidator = require('express-validator')
const morgan = require('morgan')
const userRouter = require('./routes/userRoutes')
const weeklyResultsRouter = require('./routes/weeklyResultsRoutes')
const filterRouter = require('./routes/filterRoutes')
const yearlyEventRouter = require('./routes/yearlyEventRoutes')
const weeklyEventRouter = require('./routes/weeklyEventRoutes')
const stripeRouter = require('./routes/stripeRoutes')
const mediaRouter = require('./routes/mediaRoutes')
const authRouter = require('./routes/authRoutes')
const stripeController = require('./controllers/stripeController')

const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// cannot run through jsonParser
app.post(
    '/api/v1/stripe/webhook',
    bodyParser.raw({ type: 'application/json' }),
    stripeController.webhook,
)

app.use(express.json({ limit: '512MB' }))
app.use(expressValidator())

app.use('/api/v1/yearly-events', yearlyEventRouter)
app.use('/api/v1/weekly-events', weeklyEventRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/results/weekly', weeklyResultsRouter)
app.use('/api/v1/filters', filterRouter)
app.use('/api/v1/stripe', stripeRouter)
app.use('/api/v1/media', mediaRouter)

app.all('*', (req, res, next) => {
    res.status(404).json({ error: `Can't find ${req.originalUrl}` })
})

module.exports = app
