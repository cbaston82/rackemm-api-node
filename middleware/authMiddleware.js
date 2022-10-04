const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.requireSignin = catchAsync(async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return next(new AppError('Authorization failed', 400))
    }

    const token = authorization.split(' ')[1]

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded._id)

    if (!user) {
        return next(new AppError('Authorization failed', 400))
    }

    if (user.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('Authorization failed', 400))
    }

    req.user = user

    next()
})

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log(req.user.role)
            return res.status(403).json({ status: 'error', message: 'You do not have permission' })
        }

        next()
    }
