# RACKEMM API

Node/Express REST API for the Rackemm pool tournament database.

**Live API:** https://web-production-897fe.up.railway.app  
**Frontend repo:** [rackemm-ui](https://github.com/cbaston82/rackemm-ui)  
**Live site:** https://rackemm.netlify.app

## Tech Stack

- Node.js, Express
- MongoDB (Mongoose)
- Stripe (subscriptions + webhooks), Cloudinary (media), SendGrid (email)
- JWT authentication, bcrypt, helmet, express-rate-limit

## Prerequisites

- Node 16+
- MongoDB running locally (`mongod`)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) if testing webhooks locally

## Run Locally

```bash
git clone https://github.com/cbaston82/rackemm-api-node
cd rackemm-api-node
npm install
cp config.env.example config.env   # then fill in values
npm run start:dev                   # runs on http://localhost:4000
```

### Seed / delete test data

These scripts connect directly to local MongoDB and only run in `NODE_ENV=development`.

```bash
# Import test data (events, users, filters, reviews, etc.)
node dev-data/data/import-dev-data.js --import

# Wipe all data from the database
node dev-data/data/import-dev-data.js --delete
```

### Stripe webhook (local testing)

```bash
stripe listen --forward-to localhost:4000/api/v1/stripe/webhook
```

## Environment Variables

### Local (`config.env`)

```env
NODE_ENV=development
DOMAIN=http://localhost:3900
PORT=4000

MONGO_URI_LOCAL=mongodb://127.0.0.1:27017/rackemm?directConnection=true

JWT_SECRET=
JWT_SECRET_EXPIRES_IN=3d
JWT_COOKIE_EXPIRES_IN=3

STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_SECRET=

SENDGRID_API_KEY=
SUPPORT_EMAIL=
```

### Production (Railway environment variables)

```env
NODE_ENV=production
DOMAIN=https://rackemm.netlify.app
PORT=4000

# Railway MongoDB — use the internal URL with authSource and directConnection
MONGO_URI=mongodb://mongo:<password>@mongodb.railway.internal:27017/rackemm?authSource=admin&directConnection=true

JWT_SECRET=
JWT_SECRET_EXPIRES_IN=3d
JWT_COOKIE_EXPIRES_IN=3

STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_SECRET=

SENDGRID_API_KEY=
SUPPORT_EMAIL=
```

> **MongoDB note:** Railway's MongoDB internal hostname only works within the same Railway project. The `?authSource=admin&directConnection=true` params are required — without them the connection will fail with an authentication error.

### Required helper file

Create `helpers/stripeHelper.js` (excluded from git):

```js
const stripe = require('stripe')('sk_test_your_key_here')

const createCustomer = (email, fullName) =>
    stripe.customers.create({ email, name: fullName })

module.exports = { createCustomer }
```

## Deploy to Railway

1. Push to GitHub
2. Create a new project in [Railway](https://railway.app) and connect the repo
3. Add a MongoDB service to the same Railway project
4. Set `MONGO_URI` using the internal MongoDB URL (see production env vars above)
5. Add all other production environment variables
6. Railway runs `npm start` automatically
7. Add your Railway public URL to the CORS whitelist in `app.js`

## CORS Whitelist

Allowed origins in production (`app.js`):

- `https://www.rackemm.com`
- `https://rackemm.netlify.app`
- `https://web-production-897fe.up.railway.app`

Add any new frontend domains here before deploying.

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/signup` | Register |
| POST | `/api/v1/auth/login` | Login |
| PATCH | `/api/v1/auth/update-password` | Change password |
| PATCH | `/api/v1/auth/reset-password/:token` | Reset password |
| GET | `/api/v1/events` | List events (public) |
| POST | `/api/v1/events` | Create event (auth + subscription) |
| GET/PATCH/DELETE | `/api/v1/events/:id` | Event detail/edit/delete |
| GET/POST | `/api/v1/filters` | Filters |
| GET/POST | `/api/v1/reviews` | Reviews |
| GET/POST | `/api/v1/media` | Media upload (Cloudinary) |
| POST | `/api/v1/stripe/checkout` | Create Stripe checkout session |
| POST | `/api/v1/stripe/webhook` | Stripe webhook handler |

## License

[MIT](https://choosealicense.com/licenses/mit/)
