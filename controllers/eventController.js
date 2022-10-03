const mongoose = require('mongoose')

const toId = mongoose.Types.ObjectId
const catchAsync = require('../utils/catchAsync')
const Event = require('../models/eventModel')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures')

// public
exports.getEventsPublic = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Event.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
        .filter()

    const events = await features.query

    res.status(200).json({ status: 'success', data: events })
})

exports.getEventPublic = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const event = await Event.findById(id)

    if (!event) {
        return next(new AppError('No event found', 404))
    }

    res.status(200).json({ status: 'success', data: event })
})

// auth
exports.getEvents = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Event.find({ user: toId(req.user._id) }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
        .filter()

    const events = await features.query

    res.status(200).json({ status: 'success', data: events })
})

exports.getEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findOne({ _id: req.params.id, user: req.user._id })

    if (!event) {
        return next(new AppError('No event found with that ID', 404))
    }

    res.status(200).json({ status: 'success', data: event })
})

exports.deleteEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.user._id })

    if (!event) {
        return next(new AppError('No event found with that ID', 404))
    }

    res.status(200).json({ status: 'success', data: event })
})

exports.createEvent = catchAsync(async (req, res, next) => {
    const user = toId(req.user._id)
    const event = await Event.create({ ...req.body, user })

    res.status(200).json({ status: 'success', data: event })
})

exports.updateEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        {
            ...req.body,
        },
        {
            new: true,
        },
    )

    if (!event) {
        return next(new AppError('No event found with that ID', 404))
    }

    res.status(200).json({ status: 'success', data: event })
})

exports.getEventStats = catchAsync(async (req, res, next) => {
    const stats = await Event.aggregate([
        {
            $match: { buyIn: { $gt: 5 } },
        },
        {
            $group: {
                _id: '$type',
                avgBuyIn: { $avg: '$buyIn' },
            },
        },
    ])
    res.status(200).json({ starus: 'success', data: stats })
})
