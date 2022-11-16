const mongoose = require('mongoose')
const Media = require('../models/mediaModel')
const catchAsync = require('../utils/catchAsync')
const { cloudinary } = require('../utils/cloudinary')
const AppError = require('../utils/appError')

const toId = mongoose.Types.ObjectId

exports.uploadMedia = catchAsync(async (req, res, next) => {
    const { data, fileName } = req.body

    const response = await cloudinary.uploader.upload(data, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        public_id: fileName,
        transformation: [{ background: '#292c31', width: 675, height: 1000, crop: 'pad' }],
    })

    if (response.secure_url === '') {
        return next(new AppError('There was an error uploading your image', 400))
    }

    const userMedia = await Media.create({
        user: toId(req.user._id),
        secureUrl: response.secure_url,
        publicId: response.public_id,
        folder: response.folder,
    })

    res.status(200).json({ status: 'success', data: userMedia })
})

exports.getUserMedia = catchAsync(async (req, res, next) => {
    console.log(req.user._id)
    const media = await Media.find({}).sort({ createdAt: -1 })
    console.log(media)

    res.status(200).json({ status: 'success', results: media.length, data: media })
})

exports.deleteMedia = catchAsync(async (req, res, next) => {
    const publicId = req.params.id

    const media = await Media.findOneAndDelete({
        user: toId(req.user._id),
        publicId: `rackemm_images/${publicId}`,
    })

    if (!media) {
        return next(new AppError('Something went wrong'))
    }

    await cloudinary.uploader.destroy(`rackemm_images/${publicId}`)

    res.status(200).json({ status: 'success', data: media })
})
