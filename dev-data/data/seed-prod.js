const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })

const Event = require('../../models/eventModel')
const User = require('../../models/userModel')
const StripeAccount = require('../../models/stripeAccountModel')
const Media = require('../../models/mediaModel')
const Review = require('../../models/reviewModel')

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
    console.error('MONGO_URI not found in config.env')
    process.exit(1)
}

const TEST_EMAIL = 'testuser@rackemm.com'
const TEST_PASSWORD = 'testpass123'

const POSTER_URL =
    'https://res.cloudinary.com/hoo/image/upload/v1663793568/rackemm_images/app_images/img.png'
const POSTER_PUBLIC_ID = 'rackemm_images/app_images/img'

const rawEvents = JSON.parse(fs.readFileSync(`${__dirname}/prod-events.json`, 'utf-8'))

const importData = async () => {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB Atlas')

    const existing = await User.findOne({ email: TEST_EMAIL })
    if (existing) {
        console.log(`Test user already exists (${TEST_EMAIL}). Run --delete first to reseed.`)
        process.exit(0)
    }

    const user = await User.create({
        email: TEST_EMAIL,
        fullName: 'Test User',
        password: TEST_PASSWORD,
        passwordConfirm: TEST_PASSWORD,
        role: 'subscriber',
    })
    console.log(`User created: ${user.email} (${user._id})`)

    await StripeAccount.create({
        subscriptionId: 'sub_test_rackemm',
        subscriptionPlanId: 'price_1M2eWKKr4ipGkAARrPIUdL82',
        subscriptionStatus: 'active',
        subscriptionFrequency: 'month',
        subscriptionStart: 1668111906,
        subscriptionEnd: 1893456000,
        userFreeTrial: 'no',
        customerId: 'cus_test_rackemm',
        customerEmail: TEST_EMAIL,
        customerName: 'Test User',
        user: user._id,
        user_email: TEST_EMAIL,
    })
    console.log('Stripe account created')

    await Media.create([
        {
            secureUrl: POSTER_URL,
            publicId: POSTER_PUBLIC_ID,
            folder: 'rackemm_images',
            user: user._id,
        },
        {
            secureUrl: POSTER_URL,
            publicId: `${POSTER_PUBLIC_ID}_2`,
            folder: 'rackemm_images',
            user: user._id,
        },
        {
            secureUrl: POSTER_URL,
            publicId: `${POSTER_PUBLIC_ID}_3`,
            folder: 'rackemm_images',
            user: user._id,
        },
    ])
    console.log('Media created (3 posters)')

    const events = rawEvents.map((e) => ({ ...e, user: user._id }))
    const created = await Event.create(events)
    console.log(`${created.length} events created`)

    const firstThree = created.slice(0, 3)
    await Review.create([
        {
            review: 'Great tournament, well run and lots of action. Will be back next time!',
            rating: 5,
            event: firstThree[0]._id,
            user: user._id,
        },
        {
            review: 'Solid event. Tables were in good shape and payouts were fast.',
            rating: 4,
            event: firstThree[1]._id,
            user: user._id,
        },
        {
            review: 'Good turnout and competitive field. Started a little late but overall great experience.',
            rating: 4,
            event: firstThree[2]._id,
            user: user._id,
        },
    ])
    console.log('Reviews created (3)')

    console.log('\nDone. Login credentials:')
    console.log(`  Email:    ${TEST_EMAIL}`)
    console.log(`  Password: ${TEST_PASSWORD}`)
    process.exit(0)
}

const deleteData = async () => {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB Atlas')

    const user = await User.findOne({ email: TEST_EMAIL })
    if (!user) {
        console.log('Test user not found — nothing to delete.')
        process.exit(0)
    }

    const userId = user._id
    const [events] = await Promise.all([Event.find({ user: userId })])
    const eventIds = events.map((e) => e._id)

    await Review.deleteMany({ event: { $in: eventIds } })
    await Event.deleteMany({ user: userId })
    await Media.deleteMany({ user: userId })
    await StripeAccount.deleteMany({ user: userId })
    await User.findByIdAndDelete(userId)

    console.log(`Test user and all associated data deleted.`)
    process.exit(0)
}

if (process.argv[2] === '--import') {
    importData().catch((err) => {
        console.error(err)
        process.exit(1)
    })
} else if (process.argv[2] === '--delete') {
    deleteData().catch((err) => {
        console.error(err)
        process.exit(1)
    })
} else {
    console.log('Usage:')
    console.log('  node dev-data/data/seed-prod.js --import')
    console.log('  node dev-data/data/seed-prod.js --delete')
    process.exit(1)
}
