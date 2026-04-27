const fs = require('fs')
const mongoose = require('mongoose')
const Event = require('../../models/eventModel')

const MONGO_URI = process.env.MONGO_URI
const USER_ID = process.env.SEED_USER_ID

if (!MONGO_URI) {
    console.error('Error: MONGO_URI env var is required (your Railway MongoDB connection string)')
    process.exit(1)
}

if (!USER_ID) {
    console.error('Error: SEED_USER_ID env var is required (the MongoDB _id of the user to own these events)')
    process.exit(1)
}

mongoose.connect(MONGO_URI).then(() => {
    console.log(`Connected to MongoDB`)
})

const rawEvents = JSON.parse(fs.readFileSync(`${__dirname}/prod-events.json`, 'utf-8'))
const events = rawEvents.map(e => ({ ...e, user: USER_ID }))

const importData = async () => {
    try {
        await Event.create(events)
        console.log(`${events.length} events imported successfully`)
        process.exit()
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

const deleteData = async () => {
    try {
        await Event.deleteMany()
        console.log('All events deleted')
        process.exit()
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
} else {
    console.log('Usage:')
    console.log('  Import: MONGO_URI="..." SEED_USER_ID="..." node dev-data/data/seed-prod.js --import')
    console.log('  Delete: MONGO_URI="..." SEED_USER_ID="..." node dev-data/data/seed-prod.js --delete')
    process.exit(1)
}
