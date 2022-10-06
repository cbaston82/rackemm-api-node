const mongoose = require('mongoose')
const unixTimestamp = require('mongoose-unix-timestamp')

const filterSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Must belong to a user'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

filterSchema.plugin(unixTimestamp)

module.exports = mongoose.model('Filter', filterSchema)
