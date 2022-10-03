const mongoose = require('mongoose')
const Filter = require('../models/filterModel')
const catchAsync = require('../utils/catchAsync')

const toId = mongoose.Types.ObjectId

exports.createFilter = catchAsync(async (req, res) => {
    const filter = await Filter.create({
        ...req.body,
        user: toId(req.user._id),
    })

    res.status(200).json({ status: 'success', data: filter })
})

exports.getAllFilters = catchAsync(async (req, res) => {
    const filters = await Filter.find({ user: toId(req.user._id) })

    res.status(200).json({ status: 'success', data: filters })
})

exports.getAFilter = catchAsync(async (req, res) => {
    const filter = await Filter.findOne({ id: req.params.id, user: toId(req.user._id) })

    res.status(200).json({ status: 'success', data: filter })
})

exports.deleteAFilter = catchAsync(async (req, res) => {
    const filter = await Filter.findOneAndDelete({ _id: req.params.id, user: toId(req.user._id) })

    res.status(200).json({ status: 'success', data: filter })
})
