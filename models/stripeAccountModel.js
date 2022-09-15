const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stripeAccountSchema = new Schema({
    subscriptionId: {
        type: String,
        default: '',
    },
    subscriptionPlanId: {
        type: String,
        default: '',
    },
    subscriptionStatus: {
        type: String,
        default: 'inactive',
    },
    subscriptionFrequency: {
        type: String,
        default: '',
    },
    subscriptionStart: {
        type: Date,
        default: '',
    },
    subscriptionEnd: {
        type: Date,
        default: '',
    },
    userFreeTrial: {
        type: String,
        default: 'no',
    },
    customerId: {
        type: String,
        default: '',
    },
    customerEmail: {
        type: String,
        default: '',
    },
    customerName: {
        type: String,
        default: '',
    },
    user_id: {
        type: String,
        required: true,
    },
    user_email: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('StripeAccount', stripeAccountSchema)
