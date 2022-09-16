const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    user_id: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Media', mediaSchema)
