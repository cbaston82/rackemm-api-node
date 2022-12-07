const mongoose = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const Bracket = require('../models/bracketModel')
const Event = require('../models/eventModel')
const Filter = require('../models/filterModel')
const Review = require('../models/reviewModel')
const Media = require('../models/mediaModel')
const StripeAccount = require('../models/stripeAccountModel')
const AppError = require('../utils/appError')

const { cloudinary } = require('../utils/cloudinary')

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
    const deleteUser = await StripeAccount.find({ user: toId(req.user.id) })

    if (await stripe.customers.del(deleteUser[0].customerId)) {
        StripeAccount.findOneAndDelete({ user: toId(req.user.id) }, (err) => {
            if (err) {
                next(new AppError('could not delete stripe account', 400))
            } else {
                console.log('stripe account deleted.')
            }
        })

        User.findOneAndDelete({ _id: toId(req.user.id) }, (err) => {
            if (err) {
                next(new AppError('could not delete account', 400))
            } else {
                console.log('account deleted.')
            }
        })

        const userBrackets = await Bracket.deleteMany({ user: toId(req.user.id) })
        const userEvents = await Event.deleteMany({ user: toId(req.user.id) })
        const userFilters = await Filter.deleteMany({ user: toId(req.user.id) })

        const userReviews = await Review.find({ user: toId(req.user.id) })

        if (userReviews) {
            userReviews.forEach((review) => {
                Review.findOneAndDelete({ _id: toId(review._id) }, (err) => {
                    if (err) {
                        next(new AppError('could not delete review', 400))
                    } else {
                        console.log('media deleted.')
                    }
                })
            })
        }

        const userMedia = await Media.find({ user: toId(req.user.id) })
        const deleteUserMedia = await Media.deleteMany({ user: toId(req.user.id) })

        if (userMedia) {
            userMedia.forEach((media) => {
                cloudinary.uploader.destroy(media.publicId)
            })
        }

        if (!userBrackets) {
            next(new AppError('could not delete brackets', 400))
        }

        if (!userEvents) {
            next(new AppError('could not delete events', 400))
        }

        if (!userFilters) {
            next(new AppError('could not delete filters', 400))
        }

        if (!userReviews) {
            next(new AppError('could not delete reviews', 400))
        }

        if (!deleteUserMedia) {
            next(new AppError('could not delete media', 400))
        }
    } else {
        res.status(new AppError('Could not delete account.', 500))
    }

    res.status(200).json({ status: 'success', message: 'Account was deleted' })
})

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(toId(req.user._id))

    if (!user) {
        return next(new AppError({ status: 'Error', data: 'Could not get user information' }, 400))
    }

    res.status(200).json({ status: 'successful', data: user })
})
