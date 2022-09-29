const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const StripeAccount = require('../models/stripeAccountModel')
const User = require('../models/userModel')

const toId = mongoose.Types.ObjectId

const createToken = (_id) =>
    jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
    })

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

        const token = createToken(user._id)

        return res.status(200).json({
            fullName: user.fullName,
            email,
            token,
        })
    } catch (error) {
        res.status(400).json({ error: 'Something went wrong' })
    }
}

exports.signUp = async (req, res, next) => {
    try {
        const newUser = await User.create({
            email: req.body.email,
            fullName: req.body.fullName,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        })

        const token = createToken(newUser._id)
        const customer = await stripe.customers.create({ email: req.body.email })

        await StripeAccount.create({
            user: toId(newUser._id),
            user_email: req.body.email,
            customerId: customer.id,
        })

        res.status(201).json({
            fullName: newUser.fullName,
            email: newUser.email,
            token,
        })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
