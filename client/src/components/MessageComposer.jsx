import { Paperclip, Send } from 'lucide-react';

export default function MessageComposer({ value, setValue, onSend, disabled, onTyping }) {
  const submit = (event) => {
    event.preventDefault();
    onSend();
  };

  return (
    <form className="composer" onSubmit={submit}>
      <button type="button" className="attach-button" aria-label="Attachment (demo)" title="Attachments are not required for this assignment" disabled>
        <Paperclip size={20} />
      </button>
      <input
        value={value}
        onChange={(e) => { setValue(e.target.value); onTyping(e.target.value); }}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) submit(e); }}
        placeholder="Type a message…"
        maxLength={1000}
        disabled={disabled}
        aria-label="Message"
      />
      <button className="send-button" type="submit" disabled={disabled || !value.trim()} aria-label="Send message">
        <Send size={19} />
      </button>
    </form>
  );
}
