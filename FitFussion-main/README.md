# **FitFusion** 🏋️‍♂️  
A modern, dynamic, and socially interactive **full-stack fitness tracking web application** designed to help users **set goals, track activities, and stay motivated** with friends.  
FitFusion brings **dark/light mode**, **fluid micro-interactions**, and a **beautiful, highly secure responsive UI** to your fitness journey.

**Live Demo:** [https://fit-fussion-gamma.vercel.app](https://fit-fussion-gamma.vercel.app/)

---

## **📖 Table of Contents**
1. [Overview](#-overview)  
2. [Core Features](#-core-features)  
3. [Tech Stack](#-tech-stack)  
4. [Project Structure](#-project-structure)  
5. [Installation & Setup](#-installation--setup)  
6. [Environment Variables](#-environment-variables)  
7. [Running the Application](#-running-the-application)  
8. [API Endpoints](#-api-endpoints)  
9. [Database Paradigm](#-database-paradigm)  
10. [Screenshots](#-screenshots)  

---

## **📌 Overview**
FitFusion is more than a fitness tracker — it’s an interactive fitness companion. By combining transactional physical daily logs with a collaborative accountability framework, it guides users from initial setup through to achieving long-term milestones.

It allows users to:
- Log workouts and activities seamlessly 📋
- Establish measurable personal goals 🎯
- Track progress and review history via a personalized dashboard 📊
- Explore global community challenges featuring a premium payment simulation 🌟
- Access a secure, self-hosted communication channel 🌗

---

## **🚀 Core Features**

### **1. Secure Authentication & Session Management**
- **JWT Engine:** Utilizes JSON Web Tokens (JWT) safely cached on login/registration.
- **Axios Interceptor Matrix:** Outgoing requests automatically inject a secure `Bearer <token>` header to handle private resource validation seamlessly.
- **Security Middleware:** Hardened on the backend with `helmet` CSP headers, cross-origin isolation (`cors`), and an automated `express-rate-limit` capped at 200 requests per 15 minutes to counter brute-force API hammering.

### **2. Personalized Dashboard Overview**
- Dynamic greeting states customized to the user's real-time hour loop.
- Micro-interactions built with `framer-motion` to display step progress, active workouts, and friend notification feeds.
- Light/Dark mode transitions optimized for performance.

### **3. Premium Challenge Pools with Payment Simulation**
- Custom relational bridge data models linking user accounts to collective competitive events.
- An interactive credit card gateway overlay complete with processing authentication wheels, authorization delays, and validation constraints.

### **4. Dedicated Communication Core**
- Houses a custom, direct contact form pipeline routing query feedback strings straight into a private backend database table, eliminating dependencies on third-party mail managers.

---

## **🛠 Tech Stack**

### **Frontend**
- **React.js (Vite)** – Component-based application framework.
- **Tailwind CSS** – Utility-first structural layout styling.
- **Framer Motion** – Fluid UI animation transitions.
- **React-Toastify** – Non-blocking visual system alerts.

### **Backend**
- **Node.js & Express.js** – Scalable REST API architecture.
- **MongoDB & Mongoose ODM** – NoSQL document database schema validation models.
- **Helmet, CORS, Express-Rate-Limit** – Web server defense shields.

---

## **📂 Project Structure**

```plaintext
FitFusion/
├── client/                     # Frontend Workspace (Vite + React)
│   ├── public/                 # Static asset delivery 
│   ├── src/                    # Source architecture
│   │   ├── assets/             # Media and static graphics
│   │   ├── components/         # Reusable UI components (Form blocks, Modals)
│   │   ├── pages/              # Master view controllers (Home, Dashboard)
│   │   └── services/           # Interceptor configuration and API wrappers (api.js)
│   └── .env                    # Frontend environment paths
└── server/                     # Backend Workspace (Express Engine)
    ├── config/                 # Database pipeline connection initializers
    ├── controllers/            # Operational route interaction logic
    ├── models/                 # Mongoose data layout templates
    ├── routes/                 # Express nested path matrices
    ├── middleware/             # Auth guards and error catchments
    └── .env                    # Backend private instance properties


***********Installation & Setup*************

1. Clone the repository
Bash
git clone [https://github.com/your-username/FitFusion.git](https://github.com/your-username/FitFusion.git)
cd FitFusion

2. Install dependencies
Frontend

cd client
npm install

Backend

Bash
cd ../server
npm install

3.Environment Variables
Frontend (client/.env)
VITE_API_BASE_URL=http://localhost:5000/api

Backend (server/.env)
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_custom_cryptographic_secret_signature

4.Running the Application
Frontend compilation deployment:

cd client
npm run dev
Backend service bootup:

cd server
npm start

5.Database Paradigm
The architecture maps relational document structures via references (ObjectId) across independent tables:

Users: Protects login credentials with encrypted password strings.

Activities: Holds timestamped user exercise logs bound by user IDs.

UserChallenges: Tracks multi-user bridge enrollment links alongside premium staked entry asset values.

Messages: Stash target records tracking name, email, and description strings for customer outreach.