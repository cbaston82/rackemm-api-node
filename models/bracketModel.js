const mongoose = require('mongoose')
const unixTimestamp = require('mongoose-unix-timestamp')

const { Schema } = mongoose
const bracketSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
        },
        url: {
            type: String,
            trim: true,
            required: [true, 'URL is required'],
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'Event is required'],
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

bracketSchema.plugin(unixTimestamp)

const Bracket = mongoose.model('Bracket', bracketSchema)
module.exports = Bracket
