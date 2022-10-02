const mongoose = require('mongoose')

const toId = mongoose.Types.ObjectId
const Event = require('../models/eventModel')
const APIFeatures = require('../utils/apiFeatures')

// public
exports.getEventsPublic = async (req, res) => {
    try {
        const features = new APIFeatures(Event.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .filter()

        const events = await features.query

        res.status(200).json(events)
    } catch (error) {
        res.status(400).json({ error: 'Bad request' })
    }
}

exports.getEventPublic = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' })
    }

    const event = await Event.findById(id)

    if (!event) {
        return res.status(400).json({ error: 'No such event' })
    }

    res.status(200).json(event)
}

// auth
exports.getEvents = async (req, res) => {
    try {
        const features = new APIFeatures(Event.find({ user: toId(req.user._id) }), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .filter()

        const events = await features.query

        res.status(200).json(events)
    } catch (error) {
        res.status(400).json({ error: error })
    }
}

exports.getEvent = async (req, res) => {
    try {
        const user = req.user._id
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such event' })
        }

        const event = await Event.findOne({ _id: id, user })

        if (!event) {
            return res.status(400).json({ error: 'No such event' })
        }

        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.deleteEvent = async (req, res) => {
    const user = req.user._id
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' })
    }

    const event = await Event.findOneAndDelete({ _id: id, user })

    if (!event) {
        return res.status(400).json({ error: 'No such event' })
    }

    res.status(200).json(event)
}

exports.createEvent = async (req, res) => {
    try {
        const user = toId(req.user._id)
        const event = await Event.create({ ...req.body, user })

        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const user = req.user._id
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such event' })
        }

        const event = await Event.findOneAndUpdate(
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
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.getEventStats = async (req, res) => {
    try {
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
        res.status(200).json(stats)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
