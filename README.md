# Manufacturing BDA/CRM Portal

Hey! I built this MERN Stack BDA/CRM portal specifically for manufacturing sales teams. In manufacturing, sales aren't just simple transactional checkouts—they have long cycles, custom negotiations, role-based handoffs, and final invoicing that requires GST details. 

I wanted this application to be clean, responsive, and easy to explain in a tech interview. Everything from authorization levels to the Kanban pipeline is fully functional.

---

## Key Features I Built

*   **Role-Based Access Control**:
    *   **Admin**: Team management (onboarding new BDAs/Managers), setting monthly targets, and full catalog access.
    *   **Manager**: Auditing leads pipeline, monitoring sales progress charts, and managing products catalog.
    *   **BDA**: Personal workspace focused on managing assigned leads, scheduling follow-ups, and converting won deals.
*   **Active Leads Pipeline**:
    *   I built a clean **Kanban Board** and a details list showing lead state progressions.
    *   **Mongoose Hook Lead Scoring**: Automatically calculates warmth index (`Hot`, `Warm`, `Cold`) using database pre-save triggers depending on status and value priority.
*   **Client Transition Onboarding**:
    *   A single button transitions a won lead into an active Client profile, requesting mandatory business details like GST number, city, and state.
*   **Follow-up Scheduler**:
    *   Keeps track of upcoming and overdue calls, emails, site visits, or WhatsApp follow-ups.
*   **Interactive Sales Charts**:
    *   Includes visual reporting for lead statistics, status spreads, and a quick CSV client download exporter.

---

## The Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Recharts, Lucide React, React Hot Toast
*   **Backend**: Node.js, Express.js, MongoDB (Mongoose)
*   **Security/Auth**: JSON Web Tokens (JWT) & bcryptjs (password hashing)
*   **Logger/HTTP**: Morgan, CORS, Dotenv

---

## Running It Locally

Here is how you can set it up on your own machine.

### 1. Set Up Environment Files
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=supersecretjwtkeyforauth1234
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install & Start Backend
Open a terminal in the root directory:
```bash
cd server
npm install

# Seed the database with the mock test users and sample leads:
npm run seed

# Run the dev server:
npm run dev
```

### 3. Install & Start Frontend
Open a new terminal in the root directory:
```bash
cd client
npm install

# Run the Vite dev server:
npm run dev
```
Now open `http://localhost:5173` to view the landing page!

---

## Demo Access Credentials
You can log in as any of these pre-seeded roles to test:

*   **Admin Access**:
    *   *Email*: `admin@crm.com`
    *   *Password*: `admin1234`
*   **Manager Access**:
    *   *Email*: `manager@crm.com`
    *   *Password*: `manager1234`
*   **BDA Access**:
    *   *Email*: `bda@crm.com`
    *   *Password*: `bda1234`

---

## Production Configurations

*   **Backend (Render)**: Set up with `render.yaml` infrastructure-as-code to deploy directly from sub-directory `server/`.
*   **Frontend (Vercel)**: Configured with `vercel.json` rewrite routing rules to ensure SPA routes reload correctly without throwing 404 errors.
