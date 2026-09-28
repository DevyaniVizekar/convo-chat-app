const users = new Map();

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('user:join', (payload = {}) => {
      const username = sanitizeUsername(payload.username);
      if (!username) {
        socket.emit('server:error', { message: 'A valid username is required.' });
        return;
      }

      socket.data.username = username;
      users.set(socket.id, username);
      socket.join('global-chat');

      io.emit('presence:update', {
        username,
        online: true,
        onlineCount: users.size
      });

      socket.emit('user:joined', { username, onlineCount: users.size });
    });

    socket.on('typing:start', () => {
      if (!socket.data.username) return;
      socket.to('global-chat').emit('typing:update', {
        username: socket.data.username,
        typing: true
      });
    });

    socket.on('typing:stop', () => {
      if (!socket.data.username) return;
      socket.to('global-chat').emit('typing:update', {
        username: socket.data.username,
        typing: false
      });
    });

    socket.on('message:read', (payload = {}) => {
      if (!Number.isInteger(Number(payload.id))) return;
      io.to('global-chat').emit('message:status', {
        id: Number(payload.id),
        status: 'read'
      });
    });

    socket.on('disconnect', () => {
      const username = users.get(socket.id);
      users.delete(socket.id);
      if (username) {
        io.emit('presence:update', {
          username,
          online: false,
          onlineCount: users.size
        });
      }
    });
  });
}

export function getOnlineUsers() {
  return [...new Set(users.values())];
}

function sanitizeUsername(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 32);
}
