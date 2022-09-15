const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const YOUR_DOMAIN = process.env.DOMAIN
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
const StripeAccount = require('../models/stripeAccountModel')

const getUserStripeCustomer = async (req, res) => {
    const user_id = req.user._id
    const stripeCustomer = await StripeAccount.findOne({ user_id: user_id })

    if (!stripeCustomer) {
        return res.status(400).json({ error: 'No such stripe customer' })
    }

    res.status(200).json(stripeCustomer)
}

const checkoutUser = async (req, res) => {
    const priceId = req.body.priceId

    try {
        const { customerId } = await StripeAccount.findOne({ user_id: req.user._id })
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

const createPortalSession = async (req, res) => {
    let customerId = req.body.customerId

    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${YOUR_DOMAIN}/account/profile`,
    })

    res.json(session.url)
}

const webhook = async (req, res) => {
    const payload = req.body
    const sig = req.headers['stripe-signature']
    let event

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`)
        return
    }

    switch (event.type) {
        case 'customer.created':
            console.log('==== customer.created ====')
            const customer = event.data.object

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
            const subscription = event.data.object

            await StripeAccount.findOneAndUpdate(
                { customerId: subscription.customer },
                {
                    subscriptionId: subscription.id,
                    subscriptionStart: new Date(subscription.current_period_start * 1000),
                    subscriptionEnd: new Date(subscription.current_period_end * 1000),
                    subscriptionPlanId: subscription.plan.id,
                    subscriptionFrequency: subscription.plan.interval,
                    subscriptionStatus: 'incomplete',
                },
            )
            break
        case 'customer.subscription.updated':
            const updated = event.data.object
            console.log('==== customer.subscription.updated ====')

            await StripeAccount.findOneAndUpdate(
                { customerId: updated.customer },
                {
                    subscriptionPlanId: updated.plan.id,
                    subscriptionStart: new Date(updated.current_period_start * 1000),
                    subscriptionEnd: new Date(updated.current_period_end * 1000),
                },
            )
            break
        default:
            console.log(`Unhandled event type ${event.type}`)
    }
    res.send()
}

module.exports = {
    checkoutUser,
    createPortalSession,
    getUserStripeCustomer,
    webhook,
}
