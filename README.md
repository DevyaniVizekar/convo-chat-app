<div align="center">

# 💬 Convo Chat

### A Real-Time Chat Application

A clean and responsive real-time chat application built with React, Node.js, Express, Socket.IO, and SQLite.

<br>

## 🚀 Live Demo

### [🌐 Open Convo Chat](https://convo-chatapp.vercel.app/)

</div>

---

## ✨ About The Project

**Convo Chat** is a real-time web-based chat application designed to provide a simple, responsive, and seamless messaging experience.

Users can join the chat with a username, send messages instantly, view previous messages, and communicate with other connected users in real time using **Socket.IO**.

The application uses **SQLite** for message persistence, allowing chat history to be retrieved after refreshing the page.

---

## 🚀 Features

- 💬 **Real-Time Messaging** — Messages are delivered instantly using Socket.IO.
- 👤 **Username-Based Login** — Users can join the chat using a username.
- 🕒 **Message Timestamps** — Each message displays its timestamp.
- 💾 **Persistent Chat History** — Messages are stored using SQLite.
- 🔄 **Chat History on Refresh** — Previous messages can be retrieved after refreshing.
- 🟢 **Online User Status** — Displays connected users.
- 📱 **Responsive UI** — Works across desktop and mobile screen sizes.
- ⚡ **REST API** — Backend provides APIs for sending and retrieving messages.
- 🔌 **Socket.IO Communication** — Enables real-time client-server communication.
- 🛡️ **Error Handling** — Handles API and connection errors gracefully.
- 🎨 **Clean & Minimal Interface** — Designed with a modern, user-friendly UI.

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ React
- ⚡ Vite
- 🎨 CSS
- 🔌 Socket.IO Client

### Backend

- 🟢 Node.js
- 🚂 Express.js
- 🔌 Socket.IO
- 🗄️ SQLite
- 🌐 REST APIs

### Deployment

- ▲ Vercel

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/DevyaniVizekar/convo-chat-app.git
cd convo-chat-app
```

### 2️⃣ Install Dependencies

Install the root dependencies:

```bash
npm install
```

Then install dependencies for both frontend and backend:

```bash
npm run install:all
```

### 3️⃣ Configure Environment Variables

#### Backend

Create a `.env` file inside the `server` directory:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
DB_PATH=./data/chat.sqlite
```

#### Frontend

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

### 4️⃣ Run the Application

From the project root:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

The backend will run on:

```text
http://localhost:5000
```

---

## 🔑 Key Highlights

- ⚡ Real-time communication without page refresh
- 🔌 WebSocket-based communication using Socket.IO
- 🗄️ SQLite-based message persistence
- 🌐 RESTful backend APIs
- 📱 Responsive and user-friendly interface
- 🧩 Separate frontend and backend architecture
- 🚀 Deployed and accessible online through Vercel

---

## 🌐 Live Application

<div align="center">

### 🚀 Try Convo Chat

[**👉 Open Convo Chat**](https://convo-chatapp.vercel.app/)

</div>

---

<div align="center">

### Built with ❤️ by

# **Devyani Vizekar**

💻 Frontend Developer | React Enthusiast

</div>
