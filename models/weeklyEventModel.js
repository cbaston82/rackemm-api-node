const mongoose = require('mongoose')

const Schema = mongoose.Schema

const weeklyEventSchema = new Schema(
    {
        type: {
            type: String,
            trim: true,
            required: true,
        },
        title: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        pointOfContact: {
            type: String,
            trim: true,
            required: true,
        },
        pointOfContactPhone: {
            type: String,
            trim: true,
        },
        buyIn: {
            type: Number,
            required: true,
        },
        day: {
            type: String,
            required: true,
        },
        game: {
            type: String,
            required: true,
        },
        startTime: {
            type: String,
        },
        venue: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
            required: true,
        },
        ratingSystem: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        posterImage: {
            type: String,
            required: false,
            default: '',
        },
        user_id: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('WeeklyEvent', weeklyEventSchema)
