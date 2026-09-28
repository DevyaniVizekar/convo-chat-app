import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { ArrowRight, Sparkles } from 'lucide-react';
import ChatHeader from './components/ChatHeader.jsx';
import UserSidebar from './components/UserSidebar.jsx';
import MessageBubble from './components/MessageBubble.jsx';
import MessageComposer from './components/MessageComposer.jsx';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const clean = username.trim().replace(/\s+/g, ' ').slice(0, 32);
    if (clean) onLogin(clean);
  };
  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-icon"><Sparkles size={24} /></div>
        <span className="eyebrow">Convo · REAL-TIME CHAT</span>
        <h1>Say hello, instantly.</h1>
        <p>Enter a username to join the shared chat room. No password required.</p>
        <form onSubmit={submit} className="login-form">
          <label htmlFor="username">Your username</label>
          <input id="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} maxLength={32} placeholder="e.g. Devyani" />
          <button type="submit" disabled={!username.trim()}>Join chat <ArrowRight size={18} /></button>
        </form>
      </section>
    </main>
  );
}

export default function App() {
  const [username, setUsername] = useState(() => sessionStorage.getItem('Convo_username') || '');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  const typingTimer = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = useCallback(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), []);

  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/messages?limit=100`);
      if (!response.ok) throw new Error('Could not load chat history.');
      const data = await response.json();
      setMessages(data.messages || []);
      requestAnimationFrame(scrollToBottom);
    } catch {
      setError('Could not load chat history. Check that the backend is running.');
    }
  }, [scrollToBottom]);

  useEffect(() => {
    if (!username) return;
    loadHistory();
    const socket = io(API_URL, { transports: ['websocket', 'polling'], reconnection: true, reconnectionAttempts: 8 });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setError('');
      socket.emit('user:join', { username });
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setError('Unable to connect to the chat server. Retrying…'));
    socket.on('server:error', ({ message }) => setError(message));
    socket.on('user:joined', ({ onlineCount: count }) => setOnlineCount(count));
    socket.on('presence:update', ({ username: changedUser, online, onlineCount: count }) => {
      setOnlineCount(count);
      setOnlineUsers((current) => online
        ? [...new Set([...current, changedUser])]
        : current.filter((name) => name !== changedUser));
    });
    socket.on('message:new', (message) => {
      setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
      requestAnimationFrame(scrollToBottom);
      if (message.username !== username) socket.emit('message:read', { id: message.id });
    });
    socket.on('message:status', ({ id, status }) => {
      setMessages((current) => current.map((message) => message.id === id ? { ...message, status } : message));
    });
    socket.on('typing:update', ({ username: typingName, typing }) => setTypingUser(typing ? typingName : ''));

    return () => {
      clearTimeout(typingTimer.current);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [username, loadHistory, scrollToBottom]);

  useEffect(() => {
    if (messages.length) requestAnimationFrame(scrollToBottom);
  }, [messages.length, scrollToBottom]);

  const handleLogin = (name) => {
    sessionStorage.setItem('Convo_username', name);
    setUsername(name);
  };

  const sendMessage = async () => {
    const clean = text.trim();
    if (!clean || !username) return;
    setText('');
    socketRef.current?.emit('typing:stop');
    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, text: clean })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Unable to send message.');
      }
      setError('');
    } catch (err) {
      setText(clean);
      setError(err.message || 'Unable to send message.');
    }
  };

  const handleTyping = (value) => {
    const socket = socketRef.current;
    if (!socket?.connected) return;
    if (value.trim()) socket.emit('typing:start');
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socket.emit('typing:stop'), 900);
  };

  const logout = () => {
    sessionStorage.removeItem('Convo_username');
    setUsername('');
  };

  const users = useMemo(() => onlineUsers.length ? onlineUsers : [username], [onlineUsers, username]);

  if (!username) return <Login onLogin={handleLogin} />;

  return (
    <main className="app-shell">
      <section className="chat-card">
        <UserSidebar username={username} onlineUsers={users} />
        <div className="chat-main">
          <ChatHeader onlineCount={onlineCount || users.length} connected={connected} />
          <div className="chat-body">
            {error && <div className="error-banner" role="alert">{error}</div>}
            <div className="conversation">
              <div className="room-intro">
                <div className="intro-avatar"><Sparkles size={19} /></div>
                <div><strong>Welcome to Convo Chat</strong><span>Messages are saved automatically.</span></div>
              </div>
              {messages.length === 0 && <div className="empty-state"><span>💬</span><strong>No messages yet</strong><p>Be the first to say hello.</p></div>}
              {messages.map((message) => <MessageBubble key={message.id} message={message} isMine={message.username === username} />)}
              {typingUser && <div className="typing"><span /><span /><span /> {typingUser} is typing…</div>}
              <div ref={bottomRef} />
            </div>
          </div>
          <MessageComposer value={text} setValue={setText} onSend={sendMessage} disabled={!connected} onTyping={handleTyping} />
          <div className="chat-footer"><span>Signed in as <strong>{username}</strong></span><button onClick={logout}>Switch user</button></div>
        </div>
      </section>
    </main>
  );
}
