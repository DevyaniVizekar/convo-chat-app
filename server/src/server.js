import 'dotenv/config';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createRouter } from './routes.js';
import { registerSocketHandlers } from './socket.js';
import './db.js';

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT || 5000);
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PATCH']
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 10000,
  pingInterval: 25000
});

app.disable('x-powered-by');
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '20kb' }));
app.use('/api', createRouter(io));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error.' });
});

registerSocketHandlers(io);

server.listen(port, () => {
  console.log(`Convo chat API running on port ${port}`);
});

const shutdown = () => {
  io.close();
  server.close(() => process.exit(0));
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
