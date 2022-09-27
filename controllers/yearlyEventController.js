const YearlyEvent = require('../models/yearlyEventModel')
const mongoose = require('mongoose')
const toId = mongoose.Types.ObjectId

// get all events public
const getAllYearlyEvents = async (req, res) => {
    const events = await YearlyEvent.find({ status: 'active' }).sort({ createdAt: -1 })

    res.status(200).json(events)
}

// get a single event public
const getSingleYearlyEvent = async (req, res) => {
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

// get all events
const getYearlyEvents = async (req, res) => {
    const user = toId(req.user._id)

    const events = await YearlyEvent.find({ user }).sort({ createdAt: -1 })

    res.status(200).json(events)
}

// get a single event
const getYearlyEvent = async (req, res) => {
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

// create an event
const createYearlyEvent = async (req, res) => {
    try {
        const user = toId(req.user._id)
        const event = await YearlyEvent.create({ ...req.body, user })
        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete a event
const deleteYearlyEvent = async (req, res) => {
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

// update a event
const updateYearlyEvent = async (req, res) => {
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
    )

    if (!event) {
        return res.status(400).json({ error: 'No such event' })
    }

    res.status(200).json(event)
}

module.exports = {
    createYearlyEvent,
    getYearlyEvents,
    getYearlyEvent,
    deleteYearlyEvent,
    updateYearlyEvent,
    getAllYearlyEvents,
    getSingleYearlyEvent,
}
