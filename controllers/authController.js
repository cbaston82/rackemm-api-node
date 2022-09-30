const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const StripeAccount = require('../models/stripeAccountModel')
const User = require('../models/userModel')
const sendEmail = require('../utils/email')

const toId = mongoose.Types.ObjectId

const createToken = (_id) =>
    jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
    })

function sendToken(user, res, email) {
    const token = createToken(user._id)

    return res.status(200).json({
        fullName: user.fullName,
        email,
        token,
    })
}

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(401).json({ error: 'Invalid login credentials' })
        }

        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(401).json({ error: 'Invalid login credentials' })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.status(401).json({ error: 'Invalid login credentials' })
        }

        return sendToken(user, res, email)
    } catch (error) {
        res.status(400).json({ error: 'Something went wrong' })
    }
}

exports.signUp = async (req, res, next) => {
    try {
        const user = await User.create({
            email: req.body.email,
            fullName: req.body.fullName,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        })

        const customer = await stripe.customers.create({ email: req.body.email })

        await StripeAccount.create({
            user: toId(user._id),
            user_email: req.body.email,
            customerId: customer.id,
        })

        return sendToken(user, res, req.body.email)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

exports.forgotPassword = async (req, res, next) => {
    let user

    try {
        user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status('400').json({ error: 'That user was not found' })
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
        })

        res.status(200).json({ message: 'Token sent. Check your email.' })
    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()

        res.status(400).json({ error: 'No user found with that email' })
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        })

        if (!user) {
            return res
                .status(400)
                .json({ error: 'Token is invalid or has expired. Request a new token' })
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
    } catch (error) {
        res.status(400).json({ erro: error })
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ user: toId(req.user._id) }).select('+password')

        if (!user) {
            return res.status(400).json({ error: 'Could not update your password' })
        }

        if (!(await user.correctPassword(req.body.password, user.password))) {
            return res.status(400).json({ error: 'Wrong password.' })
        }

        if (req.body.newPassword !== req.body.newPasswordConfirm) {
            return res.status(400).json({ error: 'Passwords do not match' })
        }

        user.password = req.body.newPassword
        user.passwordConfirm = req.body.newPasswordConfirm
        await user.save()

        return sendToken(user, res, user.email)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
