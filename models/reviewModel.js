const mongoose = require('mongoose')

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
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

reviewSchema.pre(/^find/, function () {
    this.populate({
        path: 'user',
        select: 'fullName photo',
    })
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
