# 🏆 Leaderboard Task - TripleW Solutions

## 🔗 Live Links

- 🌐 **Frontend (Live UI):** [https://threew.lancway.com](https://threew.lancway.com)  
- ⚙️ **Backend API:** [https://threew-1xhn.onrender.com/api/users](https://threew-1xhn.onrender.com/api/users)

---

## 📌 Project Overview
This project implements a **Leaderboard System** where users can:
- Select from a list of users (initial 10 seeded users, with option to add more).
- Claim **random points (1–10)** for the selected user.
- View a **dynamic leaderboard** that updates in real-time.
- Maintain a **claim history collection** that logs every claim with user, points, and timestamp.

The backend is built with **Node.js + Express + MongoDB**, and the frontend is built with **React + Vite**.

---

## 🚀 Features
- **User Management**: Start with 10 users in the database, but users can also be added via the frontend.
- **Random Points Claim**: Claiming generates a random number between 1 and 10 and updates the user's total points.
- **Leaderboard**: Ranks users dynamically in descending order of points.
- **Claim History**: Every claim is stored in a separate collection with timestamp.
- **Real-Time Updates**: Socket.io integration for live leaderboard and claim history updates.
- **Responsive UI**: Mobile-friendly interface with table & card layouts.
- **Pagination**: Efficient claim history pagination with “Load More”.

---

## 🛠️ Tech Stack
### Frontend:
- React (Vite)
- TailwindCSS
- Socket.io-client
- Axios

### Backend:
- Node.js
- Express.js
- MongoDB (Atlas)
- Socket.io

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/RitikRK96/threew.git
cd leaderboard-task
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@threew.26mo6gh.mongodb.net/Threew
PORT=5000
```

Run backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=https://threew-1xhn.onrender.com/api/users
VITE_SOCKET_URL=https://threew-1xhn.onrender.com
```

Run frontend:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Deploy built files from `frontend/dist/` to your hosting provider (e.g., Hostinger, Netlify, Vercel).

---

## 🌍 Deployment
- **Backend** (Node.js + MongoDB) deployed on: [Render](https://threew-1xhn.onrender.com)
- **Frontend** deployed on: [Lancway Hosting](https://threew.lancway.com)

---

## 📊 API Endpoints
### Users
- `POST /api/users/add` → Add new user
- `GET /api/users/leaderboard` → Get leaderboard

### Claims
- `POST /api/users/claim/:userId` → Claim random points
- `GET /api/users/history` → Get claim history (with pagination)

---

## 🎨 UI Preview
- **User Selector**: Choose a user to claim points.
- **Claim Button**: Generates random points and updates DB.
- **Leaderboard**: Displays user ranking by points.
- **Claim History**: Shows claim log with pagination.

---

## ⏱️ Task Constraints
- **Time Limit**: 2 Days
- **Submission**: Fill out the Round 1 Task Submission Form.

---

## 🏆 Bonus Points
- ✅ Clean and modern UI
- ✅ Responsive design (Mobile + Desktop)
- ✅ Efficient pagination logic
- ✅ Reusable components & clean code
- ✅ Code comments & best practices

---

## 📷 Demo
- 🔗 **Live Frontend**: [https://threew.lancway.com](https://threew.lancway.com)
- 🔗 **Backend API**: [https://threew-1xhn.onrender.com/api/users](https://threew-1xhn.onrender.com/api/users)
```
