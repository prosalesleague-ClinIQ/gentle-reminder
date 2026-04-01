'use client';

import { useState } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
}

interface Thread {
  id: string;
  contactName: string;
  contactRole: string;
  contactAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const demoThreads: Thread[] = [
  {
    id: 'thread-1',
    contactName: 'Lisa Thompson',
    contactRole: 'Family Member',
    contactAvatar: 'LT',
    lastMessage: 'Dad seemed much more engaged today during the photo activity.',
    lastMessageTime: '9:15 AM',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'user-2', senderName: 'Lisa Thompson', senderRole: 'Family Member', content: 'Hi Sarah, how is Dad doing today?', timestamp: '8:30 AM' },
      { id: 'm2', senderId: 'user-1', senderName: 'Sarah Mitchell', senderRole: 'Lead Caregiver', content: 'Good morning Lisa! He had a great breakfast and was in good spirits. We did the morning orientation and he remembered the day of the week.', timestamp: '8:45 AM' },
      { id: 'm3', senderId: 'user-2', senderName: 'Lisa Thompson', senderRole: 'Family Member', content: "That's wonderful to hear! Did he enjoy looking at the family photos?", timestamp: '9:00 AM' },
      { id: 'm4', senderId: 'user-2', senderName: 'Lisa Thompson', senderRole: 'Family Member', content: 'Dad seemed much more engaged today during the photo activity.', timestamp: '9:15 AM' },
    ],
  },
  {
    id: 'thread-2',
    contactName: 'Dr. Chen',
    contactRole: 'Neurologist',
    contactAvatar: 'DC',
    lastMessage: "The cognitive assessment results look promising. Let's discuss at the next review.",
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    messages: [
      { id: 'm5', senderId: 'user-1', senderName: 'Sarah Mitchell', senderRole: 'Lead Caregiver', content: "Dr. Chen, I wanted to share the latest cognitive test results from this week.", timestamp: '3:30 PM' },
      { id: 'm6', senderId: 'user-3', senderName: 'Dr. Chen', senderRole: 'Neurologist', content: "The cognitive assessment results look promising. Let's discuss at the next review.", timestamp: '4:42 PM' },
    ],
  },
  {
    id: 'thread-3',
    contactName: 'James Thompson',
    contactRole: 'Family Member',
    contactAvatar: 'JT',
    lastMessage: 'Thanks for the update on his medication schedule.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm7', senderId: 'user-1', senderName: 'Sarah Mitchell', senderRole: 'Lead Caregiver', content: "James, I've updated your father's medication schedule. Morning dose moved to 8:30 AM per Dr. Chen's recommendation.", timestamp: '10:50 AM' },
      { id: 'm8', senderId: 'user-4', senderName: 'James Thompson', senderRole: 'Family Member', content: 'Thanks for the update on his medication schedule.', timestamp: '11:20 AM' },
    ],
  },
  {
    id: 'thread-4',
    contactName: 'Emily Rivera',
    contactRole: 'Occupational Therapist',
    contactAvatar: 'ER',
    lastMessage: "I've updated the exercise plan for this week. Please review.",
    lastMessageTime: 'Mar 30',
    unreadCount: 0,
    messages: [
      { id: 'm9', senderId: 'user-5', senderName: 'Emily Rivera', senderRole: 'Occupational Therapist', content: "I've updated the exercise plan for this week. Please review.", timestamp: '2:05 PM' },
    ],
  },
];

export default function MessagesPage() {
  const [activeThread, setActiveThread] = useState<Thread>(demoThreads[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      senderId: 'user-1',
      senderName: 'Sarah Mitchell',
      senderRole: 'Lead Caregiver',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
    setActiveThread((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
    setNewMessage('');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: 0 }}>Messages</h1>
        <p style={{ fontSize: 15, color: '#6B7280', margin: '6px 0 0' }}>
          Communicate with family members, doctors, and care team.
        </p>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 200px)', minHeight: 500 }}>
        {/* Thread list */}
        <div
          style={{
            width: 340,
            flexShrink: 0,
            background: '#FFFFFF',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', fontWeight: 600, fontSize: 14, color: '#374151' }}>
            Conversations
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {demoThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #F9FAFB',
                  cursor: 'pointer',
                  background: activeThread.id === thread.id ? '#EFF6FF' : 'transparent',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  transition: 'background 0.15s',
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: activeThread.id === thread.id ? '#1A7BC4' : '#E5E7EB',
                    color: activeThread.id === thread.id ? '#FFF' : '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {thread.contactAvatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#1F2937' }}>{thread.contactName}</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{thread.lastMessageTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: 13,
                        color: '#6B7280',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1,
                        marginRight: 8,
                      }}
                    >
                      {thread.lastMessage}
                    </span>
                    {thread.unreadCount > 0 && (
                      <span
                        style={{
                          background: '#1A7BC4',
                          color: '#FFF',
                          borderRadius: 10,
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '2px 8px',
                          flexShrink: 0,
                        }}
                      >
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active conversation */}
        <div
          style={{
            flex: 1,
            background: '#FFFFFF',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Conversation header */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #F3F4F6',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#1A7BC4',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {activeThread.contactAvatar}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#1F2937' }}>{activeThread.contactName}</div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>{activeThread.contactRole}</div>
            </div>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activeThread.messages.map((msg) => {
              const isMe = msg.senderId === 'user-1';
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>
                    {msg.senderName} - {msg.timestamp}
                  </div>
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '10px 16px',
                      borderRadius: 12,
                      background: isMe ? '#1A7BC4' : '#F3F4F6',
                      color: isMe ? '#FFF' : '#1F2937',
                      fontSize: 14,
                      lineHeight: '1.5',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input area */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: '10px 24px',
                borderRadius: 8,
                border: 'none',
                background: '#1A7BC4',
                color: '#FFF',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
