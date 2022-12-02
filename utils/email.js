// const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async (options) => {
    const msg = {
        to: options.email,
        from: options.supportEmail,
        subject: options.subject,
        text: options.message,
        html: `<p>${options.message}</p>`,
    }
    await sgMail
        .send(msg)
        .then((results) => {
            console.log('results', results)
        })
        .catch((error) => {
            console.error(error.response.body)
        })
}

// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD,
//         },
//     })
//
//     const mailOptions = {
//         from: 'Carlos Baston',
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//     }
//
//     try {
//         await transporter.sendMail(mailOptions)
//     } catch (error) {
//         throw new Error('Could not send email')
//     }
// }

module.exports = sendEmail
