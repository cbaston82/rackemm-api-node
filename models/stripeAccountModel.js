const mongoose = require('mongoose')

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
        },
        user_email: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    },
)

module.exports = mongoose.model('StripeAccount', stripeAccountSchema)
