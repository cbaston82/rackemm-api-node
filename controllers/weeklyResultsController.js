const WeeklyResult = require('../models/WeeklyResultModel')
const mongoose = require('mongoose')
const toId = mongoose.Types.ObjectId

const getWeeklyResults = async (req, res) => {
    const user = req.user._id
    const events = await WeeklyResult.find({ user }).sort({ createdAt: -1 })

    res.status(200).json(events)
}

const createWeeklyResults = async (req, res) => {
    try {
        const user = toId(req.user._id)
        const weeklyEvent = toId(req.body.event_id)
        const weeklyResults = await WeeklyResult.create({ ...req.body, weeklyEvent, user })
        res.status(200).json(weeklyResults)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteWeeklyResults = async (req, res) => {
    const user = req.user._id
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such results' })
    }

    const weeklyResults = await WeeklyResult.findOneAndDelete({ _id: id, user })

    if (!weeklyResults) {
        return res.status(400).json({ error: 'No such results' })
    }

    res.status(200).json(weeklyResults)
}

const updateWeeklyResults = async (req, res) => {
    const user = req.user._id
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such results' })
    }

    const weeklyResults = await WeeklyResult.findOneAndUpdate(
        { _id: id, user },
        {
            ...req.body,
        },
    )
    if (!weeklyResults) {
        return res.status(400).json({ error: 'No such results' })
    }

    res.status(200).json(weeklyResults)
}

module.exports = {
    createWeeklyResults,
    getWeeklyResults,
    deleteWeeklyResults,
    updateWeeklyResults,
}
