import { Users } from 'lucide-react';

export default function UserSidebar({ username, onlineUsers }) {
  const others = onlineUsers.filter((name) => name !== username);
  return (
    <aside className="sidebar">
      <div className="sidebar-title"><Users size={17} /> Online now</div>
      <div className="user-list">
        <div className="user-row me">
          <div className="avatar">{username.slice(0, 1).toUpperCase()}</div>
          <div><strong>{username}</strong><span>You · online</span></div>
          <i className="presence online" />
        </div>
        {others.map((name) => (
          <div className="user-row" key={name}>
            <div className="avatar alt">{name.slice(0, 1).toUpperCase()}</div>
            <div><strong>{name}</strong><span>Online</span></div>
            <i className="presence online" />
          </div>
        ))}
        {!others.length && <p className="empty-users">Share the chat link with someone to start a conversation.</p>}
      </div>
    </aside>
  );
}
