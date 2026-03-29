# PrimeTrade Backend Developer Intern Assignment

This repository contains the completed assignment for the PrimeTrade Backend Developer Intern position.

## Project Architecture
The project is built as a Monorepo containing a full-stack web application with the following stack:

### Backend (`/backend`)
- **Framework:** Node.js + Express.js
- **Database:** SQLite (Used for zero-configuration, seamless reviewer experience)
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JWT & bcryptjs
- **API Documentation:** Swagger UI
- **Language:** TypeScript

### Frontend (`/frontend`)
- **Framework:** React + Vite
- **Routing:** React Router v6
- **Styling:** TailwindCSS
- **HTTP Client:** Axios
- **Language:** TypeScript

---

## Features
- **User Authentication:** Secure Registration & Login with Password Hashing.
- **JWT Authorization:** Secured API routes requiring valid bearer tokens.
- **Role-Based Access Control:** Users have `USER` or `ADMIN` roles. Admin users can view all tasks system-wide.
- **CRUD Entities (Tasks):** Create, Read, Update, Delete tasks with statuses (PENDING, IN_PROGRESS, COMPLETED).
- **API Validation:** Payload validation with Zod ensuring bad data never hits the DB.
- **Interactive UI:** A fully responsive React Dashboard to interact with the API endpoints seamlessly.
- **Swagger Documentation:** Auto-generated interactive API docs.

---

## How to Run the Project (Locally)

### Prerequisites
- Node.js (v18+)

### 1. Start the Backend
```bash
cd backend
npm install
npx prisma db push  # Generates the SQLite database automatically
npm run dev
```
> The backend server will start at **http://localhost:5000**
> View the API Documentation at **http://localhost:5000/api-docs**

### 2. Start the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> The React app will start at **http://localhost:5173** (or similar port assigned by Vite).

---

## Default Roles & Testing
To test Role-Based access control (Admin capabilities):
1. Register a new user via the interface. By default, it registers as `USER`.
2. To test `ADMIN` features (viewing all tasks from all users), you can modify the database manually, OR for API testing, you can hit the POST `/api/v1/auth/register` endpoint with Postman and attach `"role": "ADMIN"` in the JSON payload.
"# Primetrade" 
