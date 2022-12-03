const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const StripeAccount = require('../models/stripeAccountModel')
const User = require('../models/userModel')
const sendEmail = require('../utils/email')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const toId = mongoose.Types.ObjectId

const createToken = (_id) =>
    jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
    })

function sendToken(user, res, email) {
    const token = createToken(user._id)

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
    res.cookie('jwt', token, cookieOptions)

    return res.status(200).json({
        status: 'success',
        data: {
            token,
        },
    })
}

exports.loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Invalid login credentials', 404))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new AppError('Invalid login credentials', 404))
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        return next(new AppError('Invalid login credentials', 404))
    }

    return sendToken(user, res, email)
})

exports.signUp = catchAsync(async (req, res, next) => {
    const user = await User.create({
        email: req.body.email,
        fullName: req.body.fullName,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })

    const customer = await stripe.customers.create({
        email: req.body.email,
        name: req.body.fullName,
    })

    if (!customer) {
        return next(new AppError('Something went wrong!', 400))
    }

    const stripeCustomer = await StripeAccount.create({
        user: toId(user._id),
        user_email: req.body.email,
        customerId: customer.id,
        customerEmail: req.body.email,
        customerName: req.body.fullName,
    })

    if (!stripeCustomer) {
        return next(new AppError('Something went wrong!', 400))
    }

    return sendToken(user, res, req.body.email)
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
    let user

    try {
        user = await User.findOne({ email: req.body.email })

        if (!user) {
            return next(new AppError('That user was not found', 400))
        }

        const resetToken = user.createPasswordResetToken()

        await user.save()

        const resetURL = `${req.protocol}://${req.get(
            'host',
        )}/api/v1/auth/reset-password/${resetToken}`

        const message = `You requested to reset your password. Click on the link to be redirected ${resetURL}. \nIf you didn't request a password reset please ignore this email.`

        await sendEmail({
            email: req.body.email,
            subject: 'Your password reset token',
            message,
            supportEmail: process.env.SUPPORT_EMAIL,
        })

        res.status(200).json({ status: 'success', message: 'Token sent. Check your email.' })
    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()

        return next(AppError('No user found with that email'))
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
        return next(new AppError('Token is invalid or has expired. Request a new token', 400))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()

    const token = createToken(user._id)

    res.status(201).json({
        fullName: user.fullName,
        email: user.email,
        token,
    })
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(toId(req.user._id)).select('+password')

    if (!user) {
        return next(new AppError('Could not update password', 400))
    }

    if (!(await user.correctPassword(req.body.password, user.password))) {
        return next(new AppError('Wrong password', 400))
    }

    if (req.body.newPassword !== req.body.newPasswordConfirm) {
        return next(new AppError('Passwords do not match', 400))
    }

    user.password = req.body.newPassword
    user.passwordConfirm = req.body.newPasswordConfirm
    await user.save()

    return sendToken(user, res, user.email)
})
