# 🌍 TrailMuse — Your Personal AI Travel Planner

Welcome to **TrailMuse**, a modern, full-stack travel planning application designed and developed by **Money Goyal**. 

TrailMuse helps you organize, track, and manage every aspect of your travel adventures with the power of Artificial Intelligence.

![TrailMuse Dashboard](https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000)

## 🚀 Live Demo

- **Frontend (Live Website):** [https://wandovia-rosy.vercel.app](https://wandovia-rosy.vercel.app)
- **Backend API (Render):** [https://wandovia.onrender.com](https://wandovia.onrender.com)

---

## ✨ Features

### 🤖 AI-Powered Trip Generator
- Powered by **Groq AI**.
- Describe your dream destination, budget, pace, and interests, and TrailMuse generates a complete, day-by-day itinerary instantly.
- Save generated itineraries directly into your database with a single click.

### 📅 Smart Trip Management
- Create, edit, and delete upcoming trips.
- Set travel dates, calculate trip durations automatically, and organize your daily plans.

### 💰 Budget & Expense Tracker
- Assign a budget to your trips.
- Visual progress bars help you see exactly how much of your budget you have left to spend.

### 🧳 Intelligent Packing Lists
- Create detailed packing lists categorized by clothing, electronics, documents, etc.
- Interactive checkboxes let you mark items as packed, saving your progress in real-time.

### ⛅ Live Weather Integration
- Check the real-time weather of any destination using the **Open-Meteo API**.
- Get accurate temperature, humidity, wind speed, and visibility metrics to plan your days better.

### 💱 Currency Converter
- Real-time currency conversion for managing expenses abroad.

---

## 🛠️ Technology Stack

**Frontend:**
- React 18 + Vite
- Context API for state management
- CSS3 (Custom styling with a sleek, modern 'Outfit' font aesthetic)
- Axios for API communication

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Cloud Database)
- Groq API (for AI Itinerary generation)
- JWT Authentication

---

## 💻 Local Setup & Installation

If you want to run TrailMuse on your own machine:

### 1. Clone the Repository
```bash
git clone https://github.com/money-goyal16/wandovia.git
cd wandovia
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
GROQ_API_KEY=your_groq_api_key
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```
Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and go to the root folder:
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 👨‍💻 Developed By

**Money Goyal**  
Feel free to check out the repository, submit issues, or fork it to add your own features!
