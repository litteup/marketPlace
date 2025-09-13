  # Distress Marketplace Backend (NestJS + Prisma + PostgreSQL)

The backend service for the Distress Deals Marketplace — a platform where sellers can list urgent sales (distress deals) and buyers can safely discover, negotiate, and purchase them.

## 📖 Project Overview

The Distress Marketplace enables users to quickly connect in urgent buying/selling scenarios while ensuring trust and safety. It provides:

- **Sellers**: Ability to create time-sensitive listings with urgency countdowns.

- **Buyers**: Search, filter, and make offers on available distress deals.
- **Buyers/Sellers**: Secure checkout flow (mock escrow), messaging, and transaction reviews.
- **Admins**: Tools for moderation, dispute resolution, and user management.

## 🚀 Core Features

- Authentication & Profiles
  - Secure session-based login for buyers, sellers, and admins.
- Listings
  - Sellers create/manage distress sales with urgency countdown.
  - Search and filter by category, price, urgency, or location.
- Offers & Bidding
  - Buyers make offers or place bids on listings.
- Transactions
  - Mock escrow-style checkout flow for safer payments.
- Messaging
  - Direct chat between buyers and sellers.
- Ratings & Reviews
  - Post-transaction feedback system.
- Admin Console
  - Moderation tools, dispute handling, and reporting.

## ✅ Requirements

- Node.js (v22+)
- npm (comes with Node.js)
- PostgreSQL (v14+ recommended)

## 🛠️ Tech Stack

- **Framework**: NestJS

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript
- **Testing**: Jest (unit + e2e)
- **Deployment**: Docker + CI/CD (planned)

## 📦 Setup Instructions

### 1. Clone the repository

```sh
git clone https://github.com/kodecampteam/distress-marketplace-be.git

cd distress-marketplace-be
```

### 2. Install dependencies

```sh
npm ci
```

### 3. Configure environment variables

```sh
cp .env.example .env # Copy .env.example to .env and update values
```

Example configuration:

```sh
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/distress_marketplace"
PORT=3000
NODE_ENV="node_environment"
SESSION_SECRET="session_secret"
SESSION_MAX_AE="session_max_age"
BCRYPT_SALT_ROUNDS=bcrypt_salt_rounds
```

### 4. Database & Prisma setup

#### Generate Prisma client:

```sh
npx prisma generate
```

#### Run migrations:

```sh
npx prisma migrate dev --name init
```

#### (Optional) seed the database:

```sh
npm run db:seed
```

### 5. Start the server

```sh
npm run start:dev
```

> API available at: `http://localhost:3000/api`

## 📖 Example API Endpoints

#### Auth

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| POST   | `/auth/signup` | Register a new account |
| POST   | `/auth/login`  | Authenticate & get JWT |

#### Listings

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| GET    | `/listings`     | Fetch all active listings   |
| POST   | `/listings`     | Create a new listing        |
| GET    | `/listings/:id` | Fetch single listing detail |
| PATCH  | `/listings/:id` | Update listing (seller)     |
| DELETE | `/listings/:id` | Delete listing (seller)     |

#### Offers & Orders

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| POST   | `/offers`          | Make an offer on a listing |
| POST   | `/orders/checkout` | Start mock escrow checkout |

## 🗄️ Database Workflow

1. Update schema in `prisma/schema.prisma`.

2. Run migrations:

   ```sh
   npx prisma migrate dev --name <migration-name>
   ```

3. Push changes to DB:

   ```sh
   npx prisma db push
   ```

4. Explore with Prisma Studio:

   ```sh
   npx prisma studio
   ```

## 🤝 Contributing

Contributions are welcome! 🎉
Please check [CONTRIBUTION.md](CONTRIBUTING.md) for branch naming rules, commit conventions, and PR workflow.

## 📜 License

This project is licensed under the [Apache License](LICENSE).
