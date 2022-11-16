const mongoose = require('mongoose')
const unixTimestamp = require('mongoose-unix-timestamp')

const { Schema } = mongoose

const mediaSchema = new Schema(
    {
        secureUrl: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
        folder: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Must belong to a user'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

mediaSchema.plugin(unixTimestamp)

module.exports = mongoose.model('Media', mediaSchema)
