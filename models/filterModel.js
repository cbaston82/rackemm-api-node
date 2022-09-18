const mongoose = require('mongoose')
const Schema = mongoose.Schema

const filterSchema = new Schema({
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
    user_id: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Filter', filterSchema)
