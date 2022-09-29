const mongoose = require('mongoose')

const { Schema } = mongoose

const mediaSchema = new Schema({
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
    createdAt: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
})

module.exports = mongoose.model('Media', mediaSchema)
