const mongoose = require('mongoose')
const Review = require('../models/reviewModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const toId = mongoose.Types.ObjectId

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {}
    if (req.params.eventId) filter = { event: req.params.eventId }

    const reviews = await Review.find(filter)

    if (!reviews) {
        return next(new AppError('Could not get reviews', 400))
    }

    res.status(200).json({ status: 'success', results: reviews.length, data: reviews })
})

exports.createReview = catchAsync(async (req, res, next) => {
    if (!req.body.event) req.body.event = req.params.eventId
    if (!req.body.user) req.body.user = toId(req.user.id)

    const review = await Review.create({ user: toId(req.body._id), ...req.body })

    if (!review) {
        return next(new AppError('Could not save review', 400))
    }

    res.status(200).json({ status: 'success', data: review })
})

exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id })

    if (!review) {
        return next(new AppError('No event found with that ID', 404))
    }

    res.status(200).json({ status: 'success', data: review })
})

exports.updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        {
            ...req.body,
        },
        {
            new: true,
        },
    )

    if (!review) {
        return next(new AppError('No review found with that ID', 404))
    }

    res.status(200).json({ status: 'successful', data: review })
})
