import { Router } from 'express';
import { createMessage, getMessages, setMessageStatus } from './db.js';

export function createRouter(io) {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'Convo-chat-api', timestamp: new Date().toISOString() });
  });

  router.get('/messages', (req, res) => {
    try {
      res.json({ messages: getMessages(req.query.limit) });
    } catch {
      res.status(500).json({ message: 'Unable to fetch chat history.' });
    }
  });

  router.post('/messages', (req, res) => {
    try {
      const username = String(req.body?.username || '').trim().replace(/\s+/g, ' ').slice(0, 32);
      const text = String(req.body?.text || '').trim();

      if (!username) return res.status(400).json({ message: 'Username is required.' });
      if (username.length > 32) return res.status(400).json({ message: 'Username must be 32 characters or fewer.' });
      if (!text) return res.status(400).json({ message: 'Message cannot be empty.' });
      if (text.length > 1000) return res.status(400).json({ message: 'Message must be 1000 characters or fewer.' });

      const message = createMessage(username, text);
      io.to('global-chat').emit('message:new', message);
      res.status(201).json({ message });
    } catch {
      res.status(500).json({ message: 'Unable to send message.' });
    }
  });

  router.patch('/messages/:id/status', (req, res) => {
    try {
      const id = Number(req.params.id);
      const status = req.body?.status;
      if (!Number.isInteger(id) || !['delivered', 'read'].includes(status)) {
        return res.status(400).json({ message: 'Invalid message id or status.' });
      }
      const message = setMessageStatus(id, status);
      if (!message) return res.status(404).json({ message: 'Message not found.' });
      io.to('global-chat').emit('message:status', { id, status });
      res.json({ message });
    } catch {
      res.status(500).json({ message: 'Unable to update message status.' });
    }
  });

  return router;
}
