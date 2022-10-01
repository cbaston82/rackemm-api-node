/* eslint-disable */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const YOUR_DOMAIN = process.env.DOMAIN
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
const mongoose = require('mongoose')
const StripeAccount = require('../models/stripeAccountModel')
const User = require('../models/userModel')

const toId = mongoose.Types.ObjectId

exports.getUserStripeCustomer = async (req, res) => {
    const user = toId(req.user._id)
    const stripeCustomer = await StripeAccount.findOne({ user })

    if (!stripeCustomer) {
        return res.status(400).json({ error: 'No such stripe customer' })
    }

    res.status(200).json(stripeCustomer)
}

exports.checkoutUser = async (req, res) => {
    const { priceId } = req.body
    const user = toId(req.user._id)

    try {
        const { customerId } = await StripeAccount.findOne({ user })
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer: customerId,
            success_url: `${YOUR_DOMAIN}/account/profile?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/pricing?canceled=true`,
        })
        res.json(session.url)
    } catch (error) {
        console.log('non')
    }
}

exports.createPortalSession = async (req, res) => {
    const { customerId } = req.body

    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${YOUR_DOMAIN}/account/profile`,
    })

    res.json(session.url)
}

exports.webhook = async (req, res) => {
    const payload = req.body
    const sig = req.headers['stripe-signature']
    let event

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`)
        return
    }

    let customer
    let subscription
    let updated

    switch (event.type) {
        case 'customer.created':
            console.log('==== customer.created ====')
            customer = event.data.object

            await StripeAccount.findOneAndUpdate(
                { user_email: customer.email },
                {
                    customerId: customer.id,
                    customerName: customer.name,
                    customerEmail: customer.email,
                },
            )

            break
        case 'customer.subscription.created':
            console.log('==== customer.subscription.created ====')
            subscription = event.data.object

            const stripeCustomer = await StripeAccount.findOneAndUpdate(
                { customerId: subscription.customer },
                {
                    subscriptionId: subscription.id,
                    subscriptionStart: subscription.current_period_start,
                    subscriptionEnd: subscription.current_period_end * 1000,
                    subscriptionPlanId: subscription.plan.id,
                    subscriptionFrequency: subscription.plan.interval,
                    subscriptionStatus: 'incomplete',
                },
            )

            await User.findOneAndUpdate(
                {
                    user: stripeCustomer.user,
                },
                { role: 'subscribed-user' },
            )
            break
        case 'customer.subscription.updated':
            updated = event.data.object
            console.log('==== customer.subscription.updated ====')

            await StripeAccount.findOneAndUpdate(
                { customerId: updated.customer },
                {
                    subscriptionPlanId: updated.plan.id,
                    subscriptionStart: updated.current_period_start,
                    subscriptionEnd: updated.current_period_end,
                },
            )
            break
        default:
            console.log(`Unhandled event type ${event.type}`)
    }
    res.send()
}
