const mongoose = require('mongoose')
const unixTimestamp = require('mongoose-unix-timestamp')

const { Schema } = mongoose

const stripeAccountSchema = new Schema(
    {
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
            type: Number,
            default: '',
        },
        subscriptionEnd: {
            type: Number,
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
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Must belong to a user'],
        },
        user_email: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

stripeAccountSchema.plugin(unixTimestamp)

module.exports = mongoose.model('StripeAccount', stripeAccountSchema)
