const Filter = require('../models/filterModel')
const mongoose = require('mongoose')

const createFilter = async (req, res) => {
    try {
        const user_id = req.user._id
        const filter = await Filter.create({
            ...req.body,
            user_id,
        })
        res.status(200).json(filter)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getAllFilters = async (req, res) => {
    try {
        const user_id = req.user._id
        const filters = await Filter.find({ user_id })
        res.status(200).json(filters)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getAFilter = async (req, res) => {
    const user_id = req.user._id
    const { id } = req.params

    try {
        const filter = await Filter.findOne({ id: id, user_id })
        res.status(200).json(filter)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteAFilter = async (req, res) => {
    const user_id = req.user._id
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such filer' })
    }

    try {
        const filter = await Filter.findOneAndDelete({ _id: id, user_id })
        res.status(200).json(filter)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { createFilter, getAllFilters, getAFilter, deleteAFilter }
