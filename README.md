# NPRP Farmer Connect System 🌱

A full-stack web application designed to improve communication between farmers and agricultural experts at the National Potato Research Program (NPRP), Khumaltar, Nepal.

Farmers often struggle to get reliable, location-relevant agricultural advice directly from research institutions. This project aims to make that communication easier by providing a platform where farmers can submit questions, share images of agricultural problems, and receive responses from experts.

The project is being developed as part of a BSc CSIT 6th-semester E-Governance project.

## About the Project

The idea for this project came from a field visit to NPRP, where we learned about the challenges involved in reaching farmers and sharing agricultural information.

Although information can be published through websites and social media, farmers still need a convenient way to ask specific questions and receive guidance. NPRP Farmer Connect focuses on making that interaction more direct and organized.

Rather than being just another notice board, the goal is to build a platform that supports two-way communication between farmers and agricultural experts.

## Features

### Farmer
- Register and log in to an account.
- Submit agricultural questions and describe problems.
- Attach images to help explain crop diseases or other farming issues.
- View submitted queries and their responses.
- Follow up on agricultural questions through the platform.

### Agricultural Expert
- Log in using an authorized account.
- View submitted farmer queries.
- Review descriptions and attached images.
- Respond to farmers' questions.
- Help farmers access relevant agricultural guidance.

### System
- JWT-based authentication.
- Password hashing for account security.
- Role-based access for farmers and experts.
- Image uploads using Cloudinary.
- REST API built with Express.js.
- MongoDB for storing application data.

*The project is still under development, so feature availability may change as development continues.*

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite |
| UI | React Bootstrap, Bootstrap, React Icons |
| Routing | React Router DOM |
| State management | Redux Toolkit |
| HTTP requests | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| File uploads | Multer, Cloudinary |
| Security | Helmet, express-rate-limit, express-validator |
| Development tools | Git, GitHub, Postman |

## Project Structure

```text
NPRP-farmer-connect-project/
├── backend/
│   ├── config/          # Database and Cloudinary configuration
│   ├── controllers/     # Request handling and application logic
│   ├── middleware/      # Authentication and request middleware
│   ├── models/          # MongoDB/Mongoose models
│   ├── routes/          # API routes
│   ├── uploads/         # Temporary upload storage
│   ├── utils/           # Shared helper functions
│   ├── app.js           # Express application configuration
│   └── server.js        # Backend entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/         # API configuration
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── slices/      # Redux slices
│   │   ├── App.jsx      # Application routing
│   │   └── store.js     # Redux store
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) and npm
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally, or a MongoDB Atlas connection
- A [Cloudinary](https://cloudinary.com/) account for image uploads
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/prashanna-png/NPRP-farmer-connect-project.git
cd NPRP-farmer-connect-project
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

Add the following configuration:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/nprp_farmer_connect

JWT_SECRET=replace_with_a_strong_random_secret
JWT_EXPIRE=7d

JWT_REFRESH_SECRET=replace_with_another_strong_random_secret
JWT_REFRESH_EXPIRE=30d

MAX_FILE_UPLOAD=5

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace the placeholder values with your own credentials. Do not commit the `.env` file to GitHub.

**Start the backend:**

```bash
npm run dev
```

The backend uses port `5000` by default. Make sure MongoDB is running and the environment variables are configured correctly.

If your installed dependencies or scripts differ, check `backend/package.json`.

### 3. Set Up the Frontend

Open another terminal from the project root.

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL in your terminal. With the default configuration, the frontend is available at:

http://localhost:5173

### 4. Verify the Setup

1. Confirm that MongoDB is running.
2. Start the backend and check for database connection errors.
3. Start the frontend.
4. Open the frontend URL in your browser.
5. Test account registration, login, query submission, image uploads, and expert responses as the corresponding features become available.

## Environment Variables

| Variable | Purpose |
|---|---|
| `NODE_ENV` | Application environment |
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Access-token signing secret |
| `JWT_EXPIRE` | Access-token expiration |
| `JWT_REFRESH_SECRET` | Refresh-token signing secret |
| `JWT_REFRESH_EXPIRE` | Refresh-token expiration |
| `MAX_FILE_UPLOAD` | Configured upload-size limit; confirm the unit and enforcement in the backend |
| `CLIENT_URL` | Frontend origin used by the backend |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Keep credentials private and use strong, separate secrets outside local development. Never expose server-side secrets in frontend environment variables or source code.

## How It Works

The application follows a client-server architecture.

1. A farmer registers or logs in.
2. The farmer submits an agricultural question, optionally attaching an image.
3. The backend validates the request and stores the relevant information in MongoDB.
4. An authorized expert reviews the submitted question and provides a response.
5. The farmer can view the response and continue the conversation where follow-up functionality is available.

React handles the user interface, Express provides the REST API, MongoDB stores application records, and Cloudinary handles hosted image storage.

## Project Goals

- Improve direct communication between farmers and agricultural experts.
- Make agricultural guidance easier to access.
- Reduce reliance on scattered communication channels for individual questions.
- Support image-based descriptions of farming problems.
- Explore how digital government services can improve communication between research institutions and the people they serve.

## Current Status

**Status: Under development**

The project is being built incrementally, with authentication, role-based access, farmer queries, and the expert response workflow forming the core of the application.

Additional improvements and testing will continue as development progresses. The repository should be treated as an academic project rather than a production-ready government service.

## Future Improvements

- Notifications when an expert responds to a query.
- Query status tracking and improved follow-up conversations.
- Search and filtering by topic, crop, or location.
- Agricultural notices, training information, and research updates.
- Better support for farmers with limited digital literacy.
- Improved mobile responsiveness and accessibility.
- More comprehensive testing and deployment configuration.

## Academic Context

This project is part of a BSc CSIT 6th-semester E-Governance project inspired by a field visit to the National Potato Research Program (NPRP), Khumaltar, Lalitpur, Nepal, under the Nepal Agricultural Research Council (NARC).

It explores the use of web technology to address practical communication challenges in agricultural research and public service delivery.

## Author

**Prashanna**

GitHub: [@prashanna-png](https://github.com/prashanna-png)

## License

No license has been specified yet. Unless a license is added to the repository, reuse and redistribution are subject to the applicable copyright rules.
