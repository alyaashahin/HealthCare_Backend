# HealthCare Backend

Backend for a simple HealthCare Management System built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Features

- JWT Authentication
- Role Based Authorization
  - Patient
  - Doctor
  - Finance
  - Admin
- Doctor Profile Management
- Doctor Schedule Management
- Public Doctor APIs
- Booking Management
- Visit Management
- Treatment Management
- Finance Visit Search
- Global Error Handling

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt

---

## Project Structure

```
src
├── application
├── domain
├── infrastructure
├── presentation
└── shared
```

The project follows a Clean Architecture approach by separating business logic, infrastructure, and presentation layers.

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Configure environment

Create a `.env` file.

Example:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=3000
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run migrations

```bash
npx prisma migrate dev
```

### Start the server

```bash
npm run dev
```

---

## Main Modules

- Authentication
- Doctor Profiles
- Doctor Schedules
- Public Doctors
- Bookings
- Visits
- Treatments
- Finance

---

## API

RESTful APIs are organized by feature.

Example:

```
POST   /auth/login
POST   /auth/register

GET    /doctors
GET    /doctors/:doctorId
GET    /doctors/:doctorId/available-slots

POST   /bookings

POST   /visits/start
POST   /visits/:visitId/complete
```

---

## Notes

- Patients can create bookings.
- Doctors manage visits and treatments.
- Visit total amount is calculated automatically.
- Booking status is updated automatically during the visit lifecycle.
- Finance users can search visits using multiple filters.

---

## Author

Alyaa Shahin
