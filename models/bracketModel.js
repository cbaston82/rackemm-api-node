const mongoose = require('mongoose')
const unixTimestamp = require('mongoose-unix-timestamp')

const { Schema } = mongoose
const bracketSchema = new Schema({
    Title: {
        type: String,
        required: [true, 'Title is required'],
    },
    url: {
        type: String,
        trim: true,
        required: [true, 'URL is required'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Must belong to a user'],
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Must belong to an event'],
    },
})

bracketSchema.plugin(unixTimestamp)

const Bracket = mongoose.model('Bracket', bracketSchema)
module.exports = Bracket
