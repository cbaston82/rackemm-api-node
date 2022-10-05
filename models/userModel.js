const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const { millisecondsToSeconds } = require('date-fns')

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'That is not a valid email'],
        },
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
        },
        photo: {
            type: String,
            default: '',
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: 6,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            select: false,
            validate: {
                validator: function (el) {
                    return el === this.password
                },
                message: 'Passwords must match',
            },
        },
        role: {
            type: String,
            required: [true, 'User role is required'],
            enum: ['user', 'subscriber', 'administrator'],
            default: 'user',
        },
        passwordChangedAt: Number,
        passwordResetToken: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: String,
            select: false,
        },
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
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
