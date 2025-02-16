
# RACKEMM SERVER

A POOL TOURNAMENTS DATABASE. Find a tournament anywhere anytime. any place.





## Authors

- [@cbaston82](https://github.com/cbaston82)


## Run Locally


Clone the project

```bash
  git clone https://github.com/cbaston82/rackemm-api-node
```

Go to the project directory

```bash
  cd radkemm-api-node
```

Install dependencies

```bash
  npm install
```

Seed fake data

```bash
    node dev-data/data/import-dev-data.js --import
```

Optionally you can delete fake data

```bash
    node dev-data/data/import-dev-data.js --delete
```

Update .env file see environmenbt variables below

```bash
  vim config.env
```

Add helpers/stripeHelper.js file 

```js
const stripe = require('stripe')(
    'sk_test_your_own_here',
)

const createCustomer = (email, fullName) =>
    stripe.customers.create({
        email: email,
        name: fullName,
    })

module.exports = {
    createCustomer,
}
```

Start the server

```bash
  npm run start:dev
```

Listen for stripe webhooks
```bash
    stripe listen --forward-to localhost:4000/api/v1/stripe/webhook
```
## Environment Variables


To run this project, you will need to add the following environment variables to your config.env file

`NODE_ENV`=development
`DOMAIN`=http://localhost:3900
`PORT`=4000


`MONGO_URI_LOCAL`=mongodb://127.0.0.1:27017/rackemm?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0

<!-- These are needed if you want to test the subscriptions -->
`STRIPE_PUBLISHABLE_KEY`=
`STRIPE_SECRET_KEY`=
`STRIPE_WEBHOOK_SECRET`=

<!-- These are needed if you want to test uploading images -->
`CLOUDINARY_NAME`
`CLOUDINARY_API_KEY`=
`CLOUDINARY_UPLOAD_PRESET`=
`CLOUDINARY_API_SECRET`=

JWT_SECRET=rackthemballsgoodsoicanbreakandrunout
JWT_SECRET_EXPIRES_IN=3d
JWT_COOKIE_EXPIRES_IN=3

<!-- This is needed if you want to send emails. Needed for password reset etc. -->
`SENDGRID_API_KEY`=

`SUPPORT_EMAIL`=

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Tech Stack

**Client:** React, Redux, TailwindCSS
[rackemm-ui](https://github.com/cbaston82/rackemm-ui)

**Server:** Mongo, Node, Express, Mongo
[rackemm-api-node](https://github.com/cbaston82/rackemm-api-node)


## Features

- Stripe Checkout with multiple subscriptions
- Create weekely and special events
- Save custom filters and make them shareable 
- Save events to your calendar
- Allow logged in users to leave reviews on events


## Screenshots

![App Screenshot](https://res.cloudinary.com/hoo/image/upload/v1739676096/rackemm_images/Screenshot_2025-02-15_at_7.21.21_PM.png)


![Logo](https://res.cloudinary.com/hoo/image/upload/v1663402485/rackemm_images/app_images/logo.png)

![Logo](https://res.cloudinary.com/hoo/image/upload/v1663402485/rackemm_images/app_images/logo-white.png)


![Logo](https://res.cloudinary.com/hoo/image/upload/v1695232082/rackemm_images/app_images/rackemm-logo-transparent.png)
