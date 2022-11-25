const mongoose = require('mongoose')
const unixTimestamp = require('mongoose-unix-timestamp')

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
        phoneNumber: {
            type: String,
            trim: true,
            required: [true, 'Phone number is required'],
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
            require: true,
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
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
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

eventSchema.plugin(unixTimestamp)

eventSchema.index({ buyIn: -1 })
eventSchema.index({ game: -1 })
eventSchema.index({ day: -1 })
eventSchema.index({ city: -1 })

eventSchema.virtual('brackets', {
    ref: 'Bracket',
    foreignField: 'event',
    localField: '_id',
})
eventSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'event',
    localField: '_id',
})

eventSchema.virtual('fullAddress').get(function () {
    return `${this.address}, ${this.city}, ${this.state} ${this.zipCode}`
})

const Event = mongoose.model('Event', eventSchema)
module.exports = Event
