const mongoose = require('mongoose')
const WeeklyResult = require('../models/WeeklyResultModel')

const toId = mongoose.Types.ObjectId

exports.getWeeklyResults = async (req, res) => {
    console.log(req.user._id)
    try {
        console.log(req.user._id)
        const user = toId(req.user._id)
        const events = await WeeklyResult.find({ user }).sort({ createdAt: -1 })

        res.status(200).json(events)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.createWeeklyResults = async (req, res) => {
    console.log(req.user._id)
    try {
        const user = toId(req.user._id)
        const weeklyEvent = toId(req.body.event_id)
        const weeklyResults = await WeeklyResult.create({ ...req.body, weeklyEvent, user })
        res.status(200).json(weeklyResults)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.deleteWeeklyResults = async (req, res) => {
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

exports.updateWeeklyResults = async (req, res) => {
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
        {
            new: true,
        },
    )
    if (!weeklyResults) {
        return res.status(400).json({ error: 'No such results' })
    }

    res.status(200).json(weeklyResults)
}
