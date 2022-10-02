/* eslint-disable */

require('dotenv').config({ path: './config.env' })
const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')
const express = require('express')
const YearlyEvent = require('../models/yearlyEventModel')
const WeeklyEvent = require('../models/weeklyEventModel')

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const games = ['8-Ball', '9-Ball', '10-Ball']
const hours = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
]
const minutes = ['00', '30']
const statusus = ['active', 'inactive']
const ratingSystems = ['Fargo Rate', 'None']

mongoose.connect(process.env.MONGO_URI)

const seedData = []
for (let i = 0; i < 50; i++) {
    seedData.push(
        new WeeklyEvent({
            type: 'weekly',
            title: faker.lorem.words(2),
            description: faker.lorem.words(3),
            pointOfContact: faker.name.fullName(),
            pointOfContactPhone: faker.phone.number('(###)-###-####'),
            buyIn: faker.random.numeric(2),
            day: daysOfWeek[faker.mersenne.rand(6, 0)],
            game: games[faker.mersenne.rand(2, 0)],
            startTime: `${hours[faker.mersenne.rand(23, 0)]}:${minutes[faker.mersenne.rand(1, 0)]}`,
            venue: faker.lorem.words(2),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.state(),
            zipCode: faker.address.zipCode(),
            ratingSystem: ratingSystems[faker.mersenne.rand(1, 0)],
            status: statusus[faker.mersenne.rand(1, 0)],
            user_id: '632e1c9e52c3cd2267da2607',
        }),
    )
}

function randomDate(start, end, startHour, endHour) {
    const date = new Date(+start + Math.random() * (end - start))
    const hour = (startHour + Math.random() * (endHour - startHour)) | 0
    date.setHours(hour)
    return date
}

function addDays(date, days) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

// for (let i = 0; i < 50; i++) {
//     let dateStart = randomDate(new Date(2022, 10, 1), new Date(), 0, 24)
//     let dateEnd = addDays(dateStart, 1)
//     seedData.push(
//         new YearlyEvent({
//             type: 'yearly',
//             title: faker.lorem.words(2),
//             description: faker.lorem.words(3),
//             pointOfContact: faker.name.fullName(),
//             pointOfContactPhone: faker.phone.number('(###)-###-####'),
//             buyIn: faker.random.numeric(2),
//             startDate: dateStart,
//             endDate: dateEnd,
//             game: games[faker.mersenne.rand(2, 0)],
//             startTime: `${hours[faker.mersenne.rand(23, 0)]}:${minutes[faker.mersenne.rand(1, 0)]}`,
//             venue: faker.lorem.words(2),
//             address: faker.address.streetAddress(),
//             city: faker.address.city(),
//             state: faker.address.state(),
//             zipCode: faker.address.zipCode(),
//             ratingSystem: ratingSystems[faker.mersenne.rand(1, 0)],
//             status: statusus[faker.mersenne.rand(1, 0)],
//             user_id: '632e1c9e52c3cd2267da2607',
//         }),
//     )
// }

let done = 0
console.log('Seeding Data')
try {
    for (let i = 0; i < seedData.length; i++) {
        seedData[i].save((error, result) => {
            done++
            if (done === seedData.length) {
                exit()
            }
        })
    }
} catch (error) {
    console.log('There was an error')
}

function exit() {
    mongoose.disconnect()
}
