# 💬 Chatrix Chat App

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Express](https://img.shields.io/badge/Server-Express-black?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.IO-lightgrey?logo=socket.io)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38bdf8?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/State-Zustand-orange)
![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-blue?logo=cloudinary)
![Arcjet](https://img.shields.io/badge/Security-Arcjet-purple)
![Groq](https://img.shields.io/badge/AI-Groq-yellow)

---

**Chatrix** is a full-stack **1-to-1 real-time chat application** with **AI-powered chat**, **rate-limiting**, and **notification sounds**.  
Built using **React**, **Node.js**, **MongoDB**, and **Socket.IO**, it offers a smooth, secure, and dynamic chatting experience — now enhanced with **Groq AI** and **Arcjet**.

🌐 **Live Demo**: [https://chatrix-chat-app-vr89.onrender.com](https://chatrix-chat-app-vr89.onrender.com)

---

## 🚀 Features

- 💬 **1-to-1 Real-time Messaging** using **Socket.IO**
- 🔐 **JWT-based Authentication**
- 🧠 **AI Chat Feature** powered by **Groq API**
- 🔔 **Notification Sounds** for messages and AI replies
- ⚡ **API Rate-Limiting** with **Arcjet**
- 🖼️ **Profile & Chat Image Uploads** via **Cloudinary**
- 🟢 **User Online/Offline Status** tracking
- 🎨 **32 Prebuilt Themes** via **Daisy UI**
- ⚛️ Global State Management using **Zustand**
- 🧰 **REST API** with **Node.js & Express**
- 🧱 **MongoDB** for Data Persistence
- 🍪 Secure **cookie-based** token storage
- 💻 Fully **responsive UI** with **Tailwind CSS**
- 🌩️ **Deployed on Render**

---

## 🧰 Tech Stack

| Layer      | Tech Stack                                       |
|------------|--------------------------------------------------|
| Frontend   | React, Zustand, Tailwind CSS, Daisy UI, Vite     |
| Backend    | Node.js, Express, Socket.IO, Cloudinary, Arcjet, Groq API |
| Database   | MongoDB with Mongoose                            |
| Auth       | JWT, cookie-parser                               |

---

## 📁 Project Structure

```bash
/
├── frontend/   # React + Zustand + Tailwind client
└── backend/    # Express + MongoDB + Socket.IO + Cloudinary + Groq + Arcjet
````

---

## ⚙️ Getting Started (Local Development)

### 🔄 Prerequisites

* Node.js (v16+)
* MongoDB (local or Atlas)
* Cloudinary account
* Groq API key
* Arcjet account (for rate limiting)

---

### 📦 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/PratyushTripathi01/chatrix-chat-app.git
cd chatrix-chat-app
```

2. **Environment Setup**

Create a `.env` file inside the `backend/` folder:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GROQ_API_KEY=your_groq_api_key

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

NODE_ENV=development
```

3. **Install Dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### ▶️ Run the App Locally

```bash
# Start backend
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5001`

---

## 🔔 Notification & AI Chat

* Plays a **notification sound** when someone or AI replies
* AI chat integrated with **Groq API** for intelligent responses

---

## ⚙️ Rate Limiting (Arcjet)

* Integrated **Arcjet Free Tier** for smart rate-limiting
* Protects API routes from abuse or spam
* Helps maintain performance and security in production

---

## 👤 Profile Features

* Upload and update **profile photos**
* Images stored securely on **Cloudinary**
* Real-time avatar updates across chats

---

## 🎨 Themes

Chatrix includes **32 Daisy UI themes** 🌈
Easily toggle themes for a personalized chatting experience.

---

## 👨‍💻 Author

**Pratyush Tripathi**
GitHub: [@PratyushTripathi01](https://github.com/PratyushTripathi01)

---

## 🤝 Contributions

Contributions are welcome!
Feel free to **fork**, **open issues**, or **submit pull requests** 🚀

---

⭐ **Don’t forget to star the repo if you found it helpful!**
