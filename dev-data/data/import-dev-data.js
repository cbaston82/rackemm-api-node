const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Event = require('../../models/eventModel')
const Filter = require('../../models/filterModel')
const Review = require('../../models/reviewModel')
const StripeAccount = require('../../models/stripeAccountModel')
const User = require('../../models/userModel')
const Bracket = require('../../models/bracketModel')

dotenv.config({ path: './config.env' })

mongoose.connect(process.env.MONGO_URI_LOCAL).then(() => {
    console.log('connect to Mongo Database')
})

// READ JSON FILE
const events = JSON.parse(fs.readFileSync(`${__dirname}/events.json`, 'utf-8'))
const filters = JSON.parse(fs.readFileSync(`${__dirname}/filters.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))
const stripeAccounts = JSON.parse(fs.readFileSync(`${__dirname}/stripe-accounts.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
const brackets = JSON.parse(fs.readFileSync(`${__dirname}/brackets.json`, 'utf-8'))

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Event.create(events)
        await Filter.create(filters)
        await Review.create(reviews)
        await StripeAccount.create(stripeAccounts)
        await User.create(users)
        await Bracket.create(brackets)

        console.log('Data imported')
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

// DELETE DATA FROM DB
const deleteData = async () => {
    try {
        await Event.deleteMany()
        await Filter.deleteMany()
        await Review.deleteMany()
        await StripeAccount.deleteMany()
        await User.deleteMany()
        await Bracket.deleteMany()

        console.log('Data Deleted!')

        process.exit()
    } catch (err) {
        console.log(err)
    }
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}
