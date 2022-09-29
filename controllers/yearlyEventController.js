const mongoose = require('mongoose')
const YearlyEvent = require('../models/yearlyEventModel')

const toId = mongoose.Types.ObjectId

exports.getAllYearlyEvents = async (req, res) => {
    const events = await YearlyEvent.find({ status: 'active' }).sort({ createdAt: -1 })

    res.status(200).json(events)
}

exports.getSingleYearlyEvent = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' })
    }

    const event = await YearlyEvent.findOne({ _id: id })

    if (!event) {
        return res.status(400).json({ error: 'No such event' })
    }

    res.status(200).json(event)
}

exports.getYearlyEvents = async (req, res) => {
    const user = toId(req.user._id)

    const events = await YearlyEvent.find({ user }).sort({ createdAt: -1 })

    res.status(200).json(events)
}

exports.getYearlyEvent = async (req, res) => {
    const user = toId(req.user._id)
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' })
    }

    const event = await YearlyEvent.findOne({ _id: id, user })

    if (!event) {
        return res.status(400).json({ error: 'No such event' })
    }

    res.status(200).json(event)
}

exports.createYearlyEvent = async (req, res) => {
    try {
        const user = toId(req.user._id)
        const event = await YearlyEvent.create({ ...req.body, user })
        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.deleteYearlyEvent = async (req, res) => {
    const user = toId(req.user._id)
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' })
    }

    const event = await YearlyEvent.findOneAndDelete({ _id: id, user })

    if (!event) {
        return res.status(400).json({ error: 'No such event' })
    }

    res.status(200).json(event)
}

exports.updateYearlyEvent = async (req, res) => {
    const user = toId(req.user._id)
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' })
    }

    const event = await YearlyEvent.findOneAndUpdate(
        { _id: id, user },
        {
            ...req.body,
        },
        {
            new: true,
        },
    )

    if (!event) {
        return res.status(400).json({ error: 'No such event' })
    }

    res.status(200).json(event)
}
