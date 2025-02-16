require('dotenv').config({ path: './config.env' })

const mongoose = require('mongoose')

process.on('uncaughtException', (err) => {
    console.log('UNHANDLED EXCEPTION! Shutting down.')
    console.log(err.name, err.message)
})

const app = require('./app')

if (process.env.NODE_ENV === 'development') {
    mongoose.connect(process.env.MONGO_URI_LOCAL).then(() => {
        console.log('connect to Mongo Database - Development')
    })
} else {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('connect to Mongo Database - Production')
    })
}

const server = app.listen(process.env.PORT || 4000, () => {
    // eslint-disable-next-line no-console
    console.log(`connected to db and listening on port ${process.env.PORT}`)
})

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down.')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})
