const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { millisecondsToSeconds } = require('date-fns')

const userSchema = new mongoose.Schema(
    {
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
        photo: String,
        passwordConfirm: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            required: true,
            enum: ['free-user', 'subscribed-user', 'admin-user'],
            default: 'free-user',
        },
        passwordChangedAt: Number,
        passwordResetToken: String,
        passwordResetExpires: Number,
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
    },
    {
        timestamps: true,
    },
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined

    next()
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = millisecondsToSeconds(Math.round(new Date().getTime())) - 1000

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

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
