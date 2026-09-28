import { Check, CheckCheck } from 'lucide-react';

function formatTime(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
}

export default function MessageBubble({ message, isMine }) {
  return (
    <div className={`message-row ${isMine ? 'mine' : ''}`}>
      {!isMine && <div className="mini-avatar">{message.username.slice(0, 1).toUpperCase()}</div>}
      <div className="message-content">
        {!isMine && <span className="sender-name">{message.username}</span>}
        <div className="bubble">
          <p>{message.text}</p>
          <span className="message-meta">
            {formatTime(message.createdAt)}
            {isMine && (message.status === 'read' ? <CheckCheck size={14} className="read" /> : <Check size={14} />)}
          </span>
        </div>
      </div>
    </div>
  );
}
