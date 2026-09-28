# Convo Real-Time Chat

A clean, fast, responsive real-time chat application built for the Convo Software Developer assignment.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Real-time:** Socket.IO (mandatory requirement)
- **Database:** SQLite via `better-sqlite3`
- **Styling:** Plain CSS, pastel UI, no heavy UI framework

## Implemented requirements

- Username-based dummy login
- Clean responsive chat interface
- Send messages
- REST API for sending messages
- REST API for fetching chat history
- Instant Socket.IO message delivery without refresh
- Broadcast to connected users in real time
- Graceful connect/disconnect handling
- Typing indicator
- Online/offline user status
- Delivered/read status for messages
- Message timestamps
- Persistent message storage in SQLite
- History remains after refresh/restart
- API and Socket.IO error handling
- Meaningful frontend/backend folder structure
- Fast Vite production build

## Project structure

```text
Convo-realtime-chat/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MessageComposer.jsx
│   │   │   └── UserSidebar.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── db.js
│   │   ├── server.js
│   │   ├── routes.js
│   │   └── socket.js
│   ├── data/              # SQLite database is created automatically
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## Requirements

- Node.js **20+** recommended
- npm **10+**

No MongoDB account is required because this implementation uses a local SQLite database.

## 1. Install

Open a terminal in the project root:

```bash
npm install
npm run install:all
```

If you prefer separate commands:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

## 2. Environment variables

### Backend

Copy:

```text
server/.env.example -> server/.env
```

Default values:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
DB_PATH=./data/chat.sqlite
```

### Frontend

Copy:

```text
client/.env.example -> client/.env
```

Default value:

```env
VITE_API_URL=http://localhost:5000
```

## 3. Run locally

### Easiest: run both frontend and backend

From the root:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

### Run separately

Terminal 1:

```bash
npm run dev --prefix server
```

Terminal 2:

```bash
npm run dev --prefix client
```

## 4. Test real-time chat

1. Open `http://localhost:5173` in two browser tabs.
2. Enter a different username in each tab.
3. Send a message from either tab.
4. The other tab receives it immediately through **Socket.IO**, without refresh.
5. Start typing in one tab to see the typing indicator in the other.
6. Refresh a tab: previous messages are loaded from SQLite through the history API.

## REST API

### Health check

```http
GET /api/health
```

### Fetch chat history

```http
GET /api/messages?limit=100
```

### Send a message

```http
POST /api/messages
Content-Type: application/json

{
  "username": "Devyani",
  "text": "Hello!"
}
```

### Mark a message as delivered/read

```http
PATCH /api/messages/:id/status
Content-Type: application/json

{
  "status": "read"
}
```

## Socket.IO events

### Client -> server

- `user:join`
- `message:send`
- `typing:start`
- `typing:stop`
- `message:read`

### Server -> client

- `user:joined`
- `user:left`
- `presence:update`
- `typing:update`
- `message:new`
- `message:status`
- `server:error`

## Error handling

The backend validates usernames and message content, returns structured API errors, catches database failures, and handles Socket.IO errors. The frontend shows a lightweight error banner and reconnect state instead of crashing the page.
