const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const StripeAccount = require('../models/stripeAccountModel')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)

        res.status(200).json({
            stripeCustomerId: user.stripeCustomerId,
            stripeSubscriptionStatus: user.stripeSubscriptionStatus,
            stripeSubscriptionStart: user.stripeSubscriptionStart,
            stripeSubscriptionEnd: user.stripeSubscriptionEnd,
            stripeSubscriptionPlan: user.stripeSubscriptionPlan,
            stripeUserFreeTrial: user.stripeUserFreeTrial,
            stripeSubscriptionId: user.stripeSubscriptionId,
            stripeSubscriptionFrequency: user.stripeSubscriptionFrequency,
            fullName: user.fullName,
            email,
            token,
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const signupUser = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.signup(req.body)
        const token = createToken(user._id)
        const customer = await stripe.customers.create({ email })
        await StripeAccount.create({
            user_id: user._id,
            user_email: email,
            customerId: customer.id,
        })
        res.status(200).json({
            // stripeCustomerId: user.stripeCustomerId,
            // stripeSubscriptionStatus: user.stripeSubscriptionStatus,
            // stripeSubscriptionStart: user.stripeSubscriptionStart,
            // stripeSubscriptionEnd: user.stripeSubscriptionEnd,
            // stripeSubscriptionPlan: user.stripeSubscriptionPlan,
            // stripeUserFreeTrial: user.stripeUserFreeTrial,
            // stripeSubscriptionId: user.stripeSubscriptionId,
            // stripeSubscriptionFrequency: user.stripeSubscriptionFrequency,
            fullName: user.fullName,
            email,
            token,
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { signupUser, loginUser }
