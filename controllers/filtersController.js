const mongoose = require('mongoose')
const Filter = require('../models/filterModel')

const toId = mongoose.Types.ObjectId

exports.createFilter = async (req, res) => {
    try {
        const user = toId(req.user._id)
        const filter = await Filter.create({
            ...req.body,
            user,
        })
        res.status(200).json(filter)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.getAllFilters = async (req, res) => {
    try {
        const user = toId(req.user._id)
        const filters = await Filter.find({ user })
        res.status(200).json(filters)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.getAFilter = async (req, res) => {
    const user = toId(req.user._id)
    const { id } = req.params

    try {
        const filter = await Filter.findOne({ id: id, user })
        res.status(200).json(filter)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.deleteAFilter = async (req, res) => {
    const user = toId(req.user._id)
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such filer' })
    }

    try {
        const filter = await Filter.findOneAndDelete({ _id: id, user })
        res.status(200).json(filter)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
