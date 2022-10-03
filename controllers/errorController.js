const AppError = require('../utils/appError')

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}

function handleDuplicateFieldsEB(err) {
    const message = `Duplicate field value: ${
        Object.values(err.keyValue)[0]
    }. Please use another value`
    return new AppError(message, 400)
}

function handleValidationErrorDB(err) {
    const errors = Object.values(err.errors).map((el) => el.message)
    const message = `Invalid input data. ${errors.pop()}`
    return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
    console.log(err.status, err.message)
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    })
}

const sendErrorProd = (err, res) => {
    // Operational, trusted error for client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        // 1) Log error
        console.log('ERROR', err)

        // 2) Send generic message
        res.status(500).json({ status: 'error', message: 'Something went very wrong!' })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { message: err.message, ...err }

        if (err.name === 'CastError') error = handleCastErrorDB(err)
        if (err.code === 11000) error = handleDuplicateFieldsEB(err)
        if (err.name === 'ValidationError') error = handleValidationErrorDB(err)

        sendErrorProd(error, res)
    }
}
