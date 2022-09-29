require('dotenv').config({ path: './config.env' })

const mongoose = require('mongoose')
const app = require('./app')

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connect to Mongo Database')
    })
    .catch((error) => {
        console.log(error)
    })

app.listen(process.env.PORT || 4000, () => {
    // eslint-disable-next-line no-console
    console.log(`connected to db and listening on port ${process.env.PORT}`)
})
