import { MessageCircle, MoreHorizontal } from 'lucide-react';

export default function ChatHeader({ onlineCount, connected }) {
  return (
    <header className="chat-header">
      <div className="brand-mark" aria-hidden="true"><MessageCircle size={22} /></div>
      <div className="header-copy">
        <h1>Convo Chat</h1>
        <p><span className={`status-dot ${connected ? 'online' : 'offline'}`} /> {connected ? `${onlineCount} online` : 'Reconnecting…'}</p>
      </div>
      <button className="icon-button" aria-label="More options" title="More options"><MoreHorizontal size={22} /></button>
    </header>
  );
}
