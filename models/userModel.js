const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    photo: {
        type: String,
        default: '',
    },
    passwordConfirm: {
        type: String,
        required: true,
        select: false,
    },
    passwordChangedAt: {
        type: Number,
        default: '',
    },
    role: {
        type: String,
        required: true,
        enum: ['free-user', 'subscribed-user', 'admin-user'],
        default: 'free-user',
    },
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined

    next()
})

userSchema.methods.correctPassword = function (passedInPassword, storedPassword) {
    return bcrypt.compare(passedInPassword, storedPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        return JWTTimestamp < this.passwordChangedAt
    }

    return false
}

const User = mongoose.model('User', userSchema)

module.exports = User
