# NPRP Farmer Connect System 

A full-stack MERN application built to connect farmers with agricultural experts. Farmers can register, post their queries, and attach images (via Cloudinary), while experts can log in, browse the questions, and provide answers. 

## 🛠️ Tech Stack

**Frontend:**
* React (Vite)
* Redux Toolkit (State Management)
* React Router DOM (v6)
* React Bootstrap & React Icons
* Axios

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* JWT (JSON Web Tokens) for authentication
* Bcrypt.js (Password hashing)
* Multer & Cloudinary (for image uploads)

## 📁 Project Structure

The repository is divided into two main folders:
```text
NPRP-Farmer-Connect-System/
├── backend/
│   ├── config/          # DB connection & Cloudinary setup
│   ├── controllers/     # Route logic (auth, queries, etc.)
│   ├── middleware/      # Auth protect, error handlers, upload logic
│   ├── models/          # Mongoose schemas (User, Query)
│   ├── routes/          # Express API routes
│   ├── uploads/         # Temp storage for uploads
│   ├── utils/           # Helper functions (token generation)
│   ├── app.js           # Express app setup
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance
    │   ├── components/  # Reusable UI (Header, Protected Routes, etc.)
    │   ├── pages/       # Page views (Dashboards, Login, etc.)
    │   ├── slices/      # Redux Toolkit state slices
    │   ├── App.jsx      # Main router setup
    │   └── store.js     # Redux store configuration
    └── vite.config.js
