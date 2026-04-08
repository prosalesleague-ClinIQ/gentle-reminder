'use client';

import { useState } from 'react';
import { threads, messages, type Thread, type Message } from '../../data/mock';

const roleColors: Record<string, string> = {
  caregiver: '#10B981',
  clinician: '#3B82F6',
  family: '#7C3AED',
  system: '#6B7280',
};

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState<Thread>(threads[0]);
  const [composeText, setComposeText] = useState('');

  const threadMessages = messages.filter((m) => m.threadId === selectedThread.id);

  const handleSend = () => {
    if (composeText.trim()) {
      // In production, this would call the API
      alert(`Message sent: ${composeText}`);
      setComposeText('');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: '0 0 24px 0' }}>
        Messages
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, height: 'calc(100vh - 160px)' }}>

        {/* Thread List */}
        <div style={{ background: '#FFF', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'auto' }}>
          <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: 0 }}>Conversations</h2>
          </div>
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #F3F4F6',
                cursor: 'pointer',
                background: selectedThread.id === thread.id ? '#FAF5FF' : 'transparent',
                borderLeft: selectedThread.id === thread.id ? '3px solid #7C3AED' : '3px solid transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{thread.title}</span>
                {thread.unreadCount > 0 && (
                  <span
                    style={{
                      background: '#7C3AED',
                      color: '#FFF',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 10,
                    }}
                  >
                    {thread.unreadCount}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 4px 0', lineHeight: 1.4 }}>
                {thread.lastMessage.length > 60 ? thread.lastMessage.slice(0, 60) + '...' : thread.lastMessage}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: roleColors[thread.type] || '#6B7280',
                    textTransform: 'capitalize',
                  }}
                >
                  {thread.type}
                </span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                  {formatTimestamp(thread.lastMessageTime)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Detail */}
        <div
          style={{
            background: '#FFF',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Thread Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: 0 }}>{selectedThread.title}</h2>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: '4px 0 0 0' }}>
              {selectedThread.participants.join(', ')}
            </p>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {threadMessages.map((msg) => {
              const isOwn = msg.senderRole === 'family';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isOwn ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    alignSelf: isOwn ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: roleColors[msg.senderRole] }}>
                      {msg.sender}
                    </span>
                    {msg.type !== 'text' && (
                      <span
                        style={{
                          fontSize: 11,
                          background: '#F3F4F6',
                          padding: '2px 6px',
                          borderRadius: 4,
                          color: '#6B7280',
                        }}
                      >
                        {msg.type === 'photo' ? 'Photo' : 'Session Summary'}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      background: isOwn ? '#7C3AED' : '#F3F4F6',
                      color: isOwn ? '#FFF' : '#374151',
                      padding: '12px 16px',
                      borderRadius: 12,
                      borderTopLeftRadius: isOwn ? 12 : 4,
                      borderTopRightRadius: isOwn ? 4 : 12,
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.content}
                  </div>
                  <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Compose */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <textarea
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  resize: 'none',
                  minHeight: 44,
                  outline: 'none',
                }}
                rows={2}
              />
              <button
                onClick={handleSend}
                style={{
                  padding: '12px 24px',
                  background: '#7C3AED',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  alignSelf: 'flex-end',
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
