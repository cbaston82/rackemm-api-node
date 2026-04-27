# RACKEMM API

Node/Express REST API for the Rackemm pool tournament database.

**Frontend repo:** [rackemm-ui](https://github.com/cbaston82/rackemm-ui)

## Tech Stack

- Node.js, Express
- MongoDB (Mongoose)
- Stripe (subscriptions + webhooks), Cloudinary (media), SendGrid (email)
- JWT authentication, bcrypt, helmet, express-rate-limit

## Prerequisites

- Node 16+
- MongoDB running locally (`mongod`) — or swap to Atlas URI in `config.env`
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

These scripts connect directly to MongoDB and only run in `NODE_ENV=development`.

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

Create a `config.env` file in the project root:

```env
NODE_ENV=development
DOMAIN=http://localhost:3900
PORT=4000

# Use MONGO_URI_LOCAL for development, MONGO_URI (Atlas) for production
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/rackemm
MONGO_URI_LOCAL=mongodb://127.0.0.1:27017/rackemm?directConnection=true

# JWT
JWT_SECRET=
JWT_SECRET_EXPIRES_IN=3d
JWT_COOKIE_EXPIRES_IN=3

# Stripe — get these from your Stripe dashboard
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudinary — get these from your Cloudinary dashboard
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_SECRET=

# SendGrid — needed for password reset emails
SENDGRID_API_KEY=
SUPPORT_EMAIL=support@yourdomain.com
```

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
3. Add environment variables in the Railway dashboard (same as `config.env` above, with `NODE_ENV=production` and your Atlas `MONGO_URI`)
4. Railway auto-detects Node and runs `npm start`
5. Add the Railway public URL to the CORS whitelist in `app.js` if using a custom domain

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
