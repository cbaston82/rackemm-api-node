const mongoose = require('mongoose')
const WeeklyEvent = require('../models/weeklyEventModel')

const toId = mongoose.Types.ObjectId

// get all weekly events public
exports.getAllWeeklyEvents = async (req, res) => {
    const events = await WeeklyEvent.find().sort({ createdAt: -1 })

    res.status(200).json(events)
}

// get a single event public
exports.getSingleWeeklyEvent = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' })
    }

    const event = await WeeklyEvent.findOne({ _id: id })

    if (!event) {
        return res.status(400).json({ error: 'No such event' })
    }

    res.status(200).json(event)
}

// get all events
exports.getWeeklyEvents = async (req, res) => {
    const user = toId(req.user._id)
    const events = await WeeklyEvent.find({ user }).sort({ createdAt: -1 })

    res.status(200).json(events)
}

// get a single event
exports.getWeeklyEvent = async (req, res) => {
    try {
        const user = req.user._id
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such event' })
        }

        const event = await WeeklyEvent.findOne({ _id: id, user })

        if (!event) {
            return res.status(400).json({ error: 'No such event' })
        }

        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// create an event
exports.createWeeklyEvent = async (req, res) => {
    try {
        const user = toId(req.user._id)
        const event = await WeeklyEvent.create({ ...req.body, user })

        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete a event
exports.deleteWeeklyEvent = async (req, res) => {
    const user = req.user._id
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' })
    }

    const event = await WeeklyEvent.findOneAndDelete({ _id: id, user })

    if (!event) {
        return res.status(400).json({ error: 'No such event' })
    }

    res.status(200).json(event)
}

// update a event
exports.updateWeeklyEvent = async (req, res) => {
    const user = req.user._id
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' })
    }

    const event = await WeeklyEvent.findOneAndUpdate(
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
