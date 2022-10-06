const mongoose = require('mongoose')
const unixTimestamp = require('mongoose-unix-timestamp')
const Event = require('./eventModel')

const reviewSchema = new mongoose.Schema(
    {
        review: String,
        rating: {
            type: Number,
            min: 1,
            max: 5,
            require: [true, 'Please provide a rating 1 - 5'],
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

reviewSchema.plugin(unixTimestamp)

reviewSchema.index({ event: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'fullName photo',
    })
    next()
})

reviewSchema.statics.calcAverageRating = async function (eventId) {
    const stats = await this.aggregate([
        {
            $match: { event: eventId },
        },
        {
            $group: {
                _id: '$event',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ])

    if (stats.length > 0) {
        await Event.findByIdAndUpdate(eventId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating,
        })
    } else {
        await Event.findByIdAndUpdate(eventId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        })
    }
}

reviewSchema.post('save', function () {
    // this points to current review
    this.constructor.calcAverageRating(this.event)
})

// findByIdAndUpdate - only query middleware can access this
// findByIdAndDelete - only query middleware can access this
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne().clone()
})

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRating(this.r.event)
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
