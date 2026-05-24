# Manufacturing BDA/CRM Portal

Hey! This is a simple, lightweight MERN Stack BDA/CRM application built for a Manufacturing Company. It helps Business Development Associates (BDAs) track leads, manage scheduled follow-ups, and convert won deals into active corporate clients with GST information. It is designed to be very clean, readable, and straightforward to explain in a technical interview!

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Recharts (for analytics), Lucide React (icons), React Router DOM v6, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Morgan, CORS, Dotenv

## Key Features

- **Role-based Authentication**: Admin, Manager, and BDA portals with protected routes.
- **Leads Pipeline**: Grid tables and horizontal Kanban board layouts to track leads by status and priority.
- **Automatic Lead Scoring**: Automatically calculates warmth index (Hot, Warm, Cold) using pre-save Mongoose database hooks.
- **Client Onboarding**: Transition won leads directly into active client profiles, recording GST numbers, cities, and states.
- **Scheduled Follow-ups**: Follow-up scheduler to track calls, emails, and meetings with overdue status alerts.
- **Sales Analytics Reports**: Dynamic analytics charts detailing status distributions and client exports in CSV format.

## Demo Credentials

- **Admin**: `admin@crm.com` / `admin1234`
- **Manager**: `manager@crm.com` / `manager1234`
- **BDA**: `bda@crm.com` / `bda1234`

## Environment Variables (.env)

Set up a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://hardikmathur11:Mongowithhardik@cluster0.0stebd8.mongodb.net/crm-bda
JWT_SECRET=supersecretjwtkeyforauth123
```

For the frontend, set up a `.env` in the `client` directory (Vite reads this):

```env
VITE_API_URL=http://localhost:5000/api
```

## How to Run Locally

### 1. Run the Backend Server
```bash
cd server
npm install
# Seed the database with demo users, leads, and products:
npm run seed
# Start the backend server in development mode:
npm run dev
```

### 2. Run the Frontend Client
```bash
cd client
npm install
# Start the Vite development server:
npm run dev
```
Open `http://localhost:5173` in your browser.
