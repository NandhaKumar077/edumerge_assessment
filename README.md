# EduMerge Admission Management System (BRS - Minimal)

A premium Admission Management & CRM system built with the **MERN Stack** (MongoDB, Express, React, Node.js). 

## 🚀 Overview
This system enables colleges to manage the entire admission lifecycle—from master setup and applicant registration to seat allocation with quota validation and final confirmation.

## 🔑 Demo Credentials
The platform implements a multi-tier hierarchy. You can use the following pre-seeded credentials to explore the system from different role perspectives:

| Role | Email | Password | What is this & Why use it? |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gec.edu` | `admin123` | **Highest Level.** Used to configure the core foundation of the app (Master Setups like creating Campuses, Departments, Programs) and has unrestricted access to all dashboard analytics and applicant management features. |
| **Officer** | `officer@gec.edu` | `officer123` | **Operational Level.** Used by the admission staff. They cannot create or delete structural setups (like Programs/Campuses), but they *can* manage applicants, verify documents, collect fees, and officially confirm seat allocations. |
| **Management** | `mgmt@gec.edu` | `mgmt123` | **Executive Level.** Used by stakeholders who need to oversee the performance of the institution. They have selective view-access to the Dashboard (to see admission performance charts) and the raw Admission lists, without the ability to modify, allocate, or alter the system logic. |

## 🛠️ Tech Stack
- **Frontend**: React v19+ (Vite, TypeScript, React Router, Axios, Framer Motion, D3.js, Lucide-React)
- **Backend**: Node.js, Express.js (Microservice-style)
- **Database**: MongoDB (Mongoose)
- **Styling**: Vanilla CSS (Glassmorphism, Modern UI/UX)

## 📁 Project Structure
The project is strictly separated into a powerful backend API and a modern frontend SPA.

### Node API Structure (`/api`)
Built using an MVC (Model-View-Controller) architecture for maintainability.
- **`/config`**: Database connection files (`db.js`) and environment configs.
- **`/controllers`**: Core business logic. Handles incoming requests, queries the database, formats the data, and returns the JSON response (e.g., `admissionController.js`, `authController.js`).
- **`/models`**: Mongoose schemas defining our MongoDB collections (e.g., `User.js`, `Applicant.js`, `Program.js`).
- **`/routes`**: Defines the API endpoints (`/api/auth`, `/api/master`, etc.) and delegates the requests to specific controllers.
- **`/middleware`**: Security functions that intercept requests to verify JWT tokens and ensure Role-Based Access Control (`auth.js`).

### React UI Structure (`/web`)
Built using Vite and TypeScript, featuring a component-based design.
- **`/src/components`**: Reusable modular UI components (e.g., `Sidebar.tsx`, `CustomSelect.tsx`).
- **`/src/pages`**: Main page views coordinating layouts and data logic for specific routes (e.g., `Dashboard.tsx`, `ApplicantForm.tsx`, `AdmissionList.tsx`).
- **`/src/services`**: API layer handling all HTTP interactions with the Node API (e.g., `api.ts`, `authService.ts`). Simplifies data fetching across the app.
- **`/src/context`**: Global state management. Contains `AuthContext.tsx` which manages the logged-in user, roles, and global logout mechanisms.
- **`/src/assets`**: Static files and resources like images or external stylesheets.

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running on `localhost:27017` or update your `.env`)

### 2. Backend Setup (API)
The Node.js backend handles all data and authentication.
```bash
cd api
npm install
node seed.js   # ⬅️ Run this once to populate the Demo Accounts and empty structure!
npm start
```
*Port: 5000*

### 3. Frontend Setup (React Web)
The modern React application serves as the user interface.
```bash
cd web
npm install
npm run dev
```
*Port: 5173 (Default Vite)*

## 🌟 Key Features
- **Master Setup**: Configure Institution, Campus, Department, and Program.
- **Seat Matrix**: Real-time counters for KCET, COMEDK, Management, and Supernumerary quotas.
- **Admission Number**: Generated automatically on confirmation (Immutable).
- **Dashboard**: High-level stats on intake, filled seats, and pending tasks using interactive D3 charts.
- **Modern React Flow**: Built with Hooks, Context API, and strictly typed TypeScript models.

## 🔐 Authentication & Session Management

### Role-Based Access Control (RBAC)
The application implements strict Role-Based Access Control (RBAC) using user roles such as `Admin`.
- **Frontend Guarding**: React routes are protected using a `PrivateRoute` wrapper. Application views, navigation items, and dashboards dynamically adapt based on the specific privileges granted to the user's role.
- **Backend Authorization**: The Express API endpoints are guarded by custom middleware that inspects the role encoded within the token, preventing unauthorized clients from altering the institution setup or accessing sensitive admission controls.

### JSON Web Tokens (JWT)
The entire system operates on stateless, secure authentication using JSON Web Tokens (JWT).
- On login, the Node.js API verifies credentials and generates a signed JWT containing the user's `userId`, `role`, and `name`.
- The React frontend intercepts this response and securely stores the token in `localStorage` to establish the active session.
- All subsequent frontend API requests automatically use an Axios interceptor to embed this token into the `Authorization: Bearer <token>` HTTP header, proving the user's identity to the backend.

### Secure Sessions & Token Expiration
- **Automatic Expiration**: JWTs are strictly configured with a time-to-live (e.g., `1h` or `1d`). Once this window passes, the cryptographic signature is rejected by the server.
- **Seamless Session Handling**: If the token expires while the user is active, the backend immediately responds with a `401 Unauthorized` error. The frontend's global interceptors catch this error, purge the invalid token from storage, wipe the `AuthContext` state, and gracefully redirect the user back to the `/login` screen to re-authenticate.

---
**Developed by Nandhakumar M** (Assignment for Junior Software Developer)
