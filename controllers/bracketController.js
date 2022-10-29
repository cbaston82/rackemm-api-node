const mongoose = require('mongoose')
const Bracket = require('../models/bracketModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const toId = mongoose.Types.ObjectId

exports.createBracket = catchAsync(async (req, res, next) => {
    if (!req.body.event) req.body.event = req.params.eventId
    if (!req.body.user) req.body.user = toId(req.user.id)

    const bracket = await Bracket.create({ user: toId(req.body._id), ...req.body })

    if (!bracket) {
        return next(new AppError('Could not save bracket', 400))
    }

    res.status(200).json({ status: 'success', data: bracket })
})

exports.getAllBrackets = catchAsync(async (req, res, next) => {
    let filter = {}
    if (req.params.eventId) filter = { event: req.params.eventId }

    const brackets = await Bracket.find(filter)

    if (!brackets) {
        return next(new AppError('Could not get reviews', 400))
    }

    res.status(200).json({ status: 'success', results: brackets.length, data: brackets })
})

exports.updateBracket = catchAsync(async (req, res, next) => {
    const bracket = await Bracket.findOneAndUpdate(
        { user: toId(req.user._id), _id: req.params.id },
        { ...req.body },
        {
            new: true,
        },
    )

    if (!bracket) {
        return next(new AppError('Could not update bracket', 400))
    }

    res.status(200).json({ status: 'success', data: bracket })
})

exports.getBracket = catchAsync(async (req, res, next) => {
    const bracket = await Bracket.findOne({ id: req.params.id, user: toId(req.user._id) })

    if (!bracket) {
        return next(new AppError('Could not get bracket', 400))
    }

    res.status(200).json({ status: 'success', data: bracket })
})

exports.deleteBracket = catchAsync(async (req, res, next) => {
    const bracket = await Bracket.findOneAndDelete({ _id: req.params.id, user: toId(req.user._id) })

    if (!bracket) {
        return next(new AppError('Could not delete bracket', 400))
    }

    res.status(200).json({ status: 'success', data: bracket })
})
