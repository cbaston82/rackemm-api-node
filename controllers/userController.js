const mongoose = require('mongoose')
const User = require('../models/userModel')

const toId = mongoose.Types.ObjectId

exports.getUsers = async (req, res) => {
    res.status(200).json('all users')
}

exports.deleteUser = async (req, res) => {
    res.status(200).json('delete user')
}

exports.createUser = async (req, res) => {
    res.status(200).json('create user')
}

exports.updateUser = async (req, res) => {
    res.status(200).json('update user')
}

exports.getUser = async (req, res) => {
    res.status(200).json('get user')
}

exports.updateMe = async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return res.status(400).json({ error: 'Cannot update password here.' })
    }

    try {
        const user = await User.findByIdAndUpdate(
            toId(req.user._id),
            {
                email: req.user.email,
                fullName: req.user.fullName,
            },
            {
                new: true,
            },
        )

        if (!user) {
            return res.status(400).json({ error: 'User information not found' })
        }

        return res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: 'Could not update information.' })
    }
}

exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(toId(req.user.id), { active: false })

        res.status(204).json({ error: 'Account was deleted' })
    } catch (error) {
        res.status(400).json({ error: 'Problems deleting account' })
    }
}
