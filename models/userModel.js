const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.statics.signup = async function (user) {
    //validation
    const { email } = user
    if (!user.email || !user.password || !user.fullName) {
        throw Error('All fields must be field')
    }

    if (!validator.isEmail(user.email)) {
        throw Error('Email is not valid')
    }

    // if (!validator.isStrongPassword(user.password)) {
    //     throw Error('Password not strong enough')
    // }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    return await this.create({
        email,
        fullName: user.fullName,
        password: hash,
    })
}

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be field')
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error('Invalid login credentials')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Invalid login credentials')
    }

    return user
}

module.exports = mongoose.model('User', userSchema)
