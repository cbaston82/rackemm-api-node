const mongoose = require('mongoose')

const { Schema } = mongoose

const eventSchema = new Schema(
    {
        type: {
            type: String,
            trim: true,
            required: [true, 'Type is required'],
            enum: ['weekly', 'yearly'],
        },
        title: {
            type: String,
            trim: true,
            required: [true, 'Title is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        pointOfContact: {
            type: String,
            trim: true,
            required: [true, 'Point of contact is required'],
        },
        pointOfContactPhone: {
            type: String,
            trim: true,
            required: [true, 'Point of contact phone is required'],
        },
        buyIn: {
            type: Number,
            required: [true, 'BuyIn is required'],
        },
        game: {
            type: String,
            required: [true, 'Game is required'],
        },
        venue: {
            type: String,
            required: [true, 'Venue is required'],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        state: {
            type: String,
            required: [true, 'State is required'],
        },
        zipCode: {
            type: String,
            required: [true, 'Zipcode is required'],
        },
        ratingSystem: {
            type: String,
            required: [true, 'Rating system is required'],
        },
        posterImage: {
            type: String,
            default: '',
        },
        day: {
            type: String,
            default: '',
        },
        startTime: {
            type: String,
            required: [true, 'Start is required'],
        },
        endTime: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            required: [true, 'Status is required'],
            enum: ['active', 'inactive'],
        },
        bracket: {
            type: String,
            trim: true,
            default: '',
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
