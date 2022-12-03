const mongoose = require('mongoose')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const AppError = require('../utils/appError')

const toId = mongoose.Types.ObjectId

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}

    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })

    return newObj
}

exports.getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()

    if (!users) {
        return next(new AppError('Could not get users', 400))
    }

    res.status(200).json({ status: 'success', data: users })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(toId(req.params.id), { active: false })

    if (!user) {
        return next(new AppError('Could not delete account', 400))
    }

    res.status(200).json({ status: 'success', message: 'Dashboard was deleted' })
})

exports.createUser = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body)

    if (!user) {
        return next(new AppError('Could not create user.', 400))
    }

    res.status(200).json({ status: 'success', data: user })
})

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        { _id: req.params.id },
        {
            ...req.body,
        },
        { new: true },
    )

    if (!user) {
        return next(new AppError('Could not update user', 400))
    }

    res.status(200).json({ status: 'success', data: user })
})

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new AppError('Could not get user', 400))
    }

    res.status(200).json({ status: 'success', data: user })
})

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Cannot update password here', 404))
    }

    const filteredBody = filterObj(req.body, 'fullName', 'email')

    const user = await User.findByIdAndUpdate(toId(req.user._id), filteredBody, {
        new: true,
        runValidators: true,
    })

    if (!user) {
        return next(new AppError('User not found', 404))
    }

    return res.status(200).json({ status: 'success', data: user })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(toId(req.user.id), { active: false })

    if (!user) {
        next(new AppError('Could not delete account', 400))
    }

    res.status(200).json({ status: 'success', message: 'Dashboard was deleted' })
})

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(toId(req.user._id))

    if (!user) {
        return next(new AppError({ status: 'Error', data: 'Could not get user information' }, 400))
    }

    res.status(200).json({ status: 'successful', data: user })
})
