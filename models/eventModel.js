const mongoose = require('mongoose')

const { Schema } = mongoose

const eventSchema = new Schema(
    {
        type: {
            type: String,
            trim: true,
        },
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
        },
        pointOfContact: {
            type: String,
            trim: true,
        },
        pointOfContactPhone: {
            type: String,
            trim: true,
        },
        buyIn: {
            type: Number,
        },
        game: {
            type: String,
        },
        venue: {
            type: String,
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        ratingSystem: {
            type: String,
        },
        posterImage: {
            type: String,
        },
        day: {
            type: String,
        },
        startTime: {
            type: String,
        },
        endTime: {
            type: String,
        },
        status: {
            type: String,
        },
        bracket: {
            type: String,
            trim: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

eventSchema.virtual('fullAddress').get(function () {
    return `${this.address}, ${this.city}, ${this.state} ${this.zipCode}`
})

module.exports = mongoose.model('Event', eventSchema)
