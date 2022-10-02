const mongoose = require('mongoose')
const Media = require('../models/media')
const { cloudinary } = require('../utils/cloudinary')

const toId = mongoose.Types.ObjectId

exports.uploadMedia = async (req, res) => {
    try {
        const { data, fileName } = req.body
        const response = await cloudinary.uploader.upload(data, {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            public_id: fileName,
            transformation: [{ background: '#292c31', width: 675, height: 1000, crop: 'pad' }],
        })

        if (response.secure_url === '') {
            return res.status(400).json({ error: 'There was an error uploading your image' })
        }

        const user = toId(req.user._id)
        const userMedia = await Media.create({
            user,
            secureUrl: response.secure_url,
            publicId: response.public_id,
            folder: response.folder,
        })

        res.status(200).json(userMedia)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.getUserMedia = async (req, res) => {
    try {
        const user = req.user._id
        const media = await Media.find({ user }).sort({ createdAt: -1 })

        res.status(200).json(media)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.deleteMedia = async (req, res) => {
    try {
        const user = req.user._id
        const publicId = req.params.id

        await Media.findOneAndDelete({ user, publicId: `rackemm_images/${publicId}` })

        const response = await cloudinary.uploader.destroy(`rackemm_images/${publicId}`)

        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
