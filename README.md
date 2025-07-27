# 💬 Chatrix Chat App

**Chatrix** is a full-stack **1-to-1 real-time chat application** that combines modern UI design, secure user authentication, image uploading, and online presence tracking. Built using **React**, **Node.js**, **MongoDB**, and **Socket.IO**, it offers a smooth and dynamic chatting experience — now live on **Render**.

🌐 **Live Demo**: [https://chatrix-chat-app-vr89.onrender.com](https://chatrix-chat-app-vr89.onrender.com)

---

## 🚀 Features

- 🔐 JWT-based **User Authentication**
- 💬 **1-to-1 Real-time Messaging** using **Socket.IO**
- 🖼️ **Profile photo** and **chat image uploads** via **Cloudinary**
- 🟢 **User Online/Offline Status** tracking
- 🎨 **32 Prebuilt Themes** via **Daisy UI**
- ⚛️ Global State Management using **Zustand**
- 🍪 Secure **cookie-based** token storage
- 🧑‍💻 Fully **responsive UI** using **Tailwind CSS**
- 🌩️ **Deployed on Render**

---

## 🧰 Tech Stack

| Layer      | Tech Stack                                       |
|------------|--------------------------------------------------|
| Frontend   | React, Zustand, Tailwind CSS, Daisy UI, Vite     |
| Backend    | Node.js, Express, Socket.IO, Cloudinary          |
| Database   | MongoDB with Mongoose                            |
| Auth       | JWT, cookie-parser                               |

---

## 📁 Project Structure

```bash
/
├── frontend/   # React + Zustand + Tailwind client
└── backend/    # Express + MongoDB + Socket.IO + Cloudinary
````

---

## ⚙️ Getting Started (Local Development)

### 🔄 Prerequisites

* Node.js (v16+)
* MongoDB (local or Atlas)
* Cloudinary account

---

### 📦 Installation

1. **Clone the repo**

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

## 👤 Profile Features

* Upload and update **profile photo**
* Profile image stored securely on **Cloudinary**
* Real-time avatar updates in chats

---

## 🎨 Themes

Chatrix includes **32 Daisy UI themes**
Easily toggle themes in-app for a personalized experience.

---
## 👨‍💻 Author

**Pratyush Tripathi**
GitHub: [@PratyushTripathi01](https://github.com/PratyushTripathi01)

---

## 🤝 Contributions

Contributions are welcome!
Feel free to fork, open issues, or submit pull requests 🚀

---

> ⭐ Don’t forget to star the repo if you found it helpful!
