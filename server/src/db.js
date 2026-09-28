import 'dotenv/config';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultDbPath = path.resolve(__dirname, '../data/chat.sqlite');
const configuredPath = process.env.DB_PATH || defaultDbPath;
const dbPath = path.isAbsolute(configuredPath) ? configuredPath : path.resolve(process.cwd(), configuredPath);

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL CHECK(length(username) BETWEEN 1 AND 32),
    text TEXT NOT NULL CHECK(length(text) BETWEEN 1 AND 1000),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'delivered' CHECK(status IN ('delivered', 'read'))
  );

  CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
`);

const insertMessage = db.prepare(`
  INSERT INTO messages (username, text, created_at, status)
  VALUES (?, ?, ?, 'delivered')
`);

const getMessage = db.prepare(`
  SELECT id, username, text, created_at AS createdAt, status
  FROM messages
  WHERE id = ?
`);

const listMessages = db.prepare(`
  SELECT id, username, text, created_at AS createdAt, status
  FROM messages
  ORDER BY id DESC
  LIMIT ?
`);

const updateStatus = db.prepare(`
  UPDATE messages SET status = ? WHERE id = ?
`);

export function createMessage(username, text) {
  const now = new Date().toISOString();
  const result = insertMessage.run(username, text, now);
  return getMessage.get(result.lastInsertRowid);
}

export function getMessages(limit = 100) {
  return listMessages.all(Math.min(Math.max(Number(limit) || 100, 1), 200)).reverse();
}

export function setMessageStatus(id, status) {
  if (!['delivered', 'read'].includes(status)) return null;
  updateStatus.run(id, status);
  return getMessage.get(id) || null;
}
