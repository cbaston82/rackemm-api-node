const mongoose = require('mongoose')

const { Schema } = mongoose

const weeklyResultSchema = new Schema(
    {
        date: {
            type: Number,
            required: true,
        },
        url: {
            type: String,
            trim: true,
            required: true,
        },
        weeklyEvent: {
            type: Schema.Types.ObjectId,
            ref: 'WeeklyEvent',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('WeeklyResult', weeklyResultSchema)
