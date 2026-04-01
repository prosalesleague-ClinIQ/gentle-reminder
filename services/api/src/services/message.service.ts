import { AppError } from '../middleware/errorHandler.js';

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Thread {
  id: string;
  participants: { id: string; name: string; role: string; avatar: string }[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// In-memory demo data
const threads: Thread[] = [
  {
    id: 'thread-1',
    participants: [
      { id: 'user-1', name: 'Sarah Mitchell', role: 'Lead Caregiver', avatar: 'SM' },
      { id: 'user-2', name: 'Lisa Thompson', role: 'Family Member', avatar: 'LT' },
    ],
    lastMessage: 'Dad seemed much more engaged today during the photo activity.',
    lastMessageTime: '2026-04-01T09:15:00Z',
    unreadCount: 2,
  },
  {
    id: 'thread-2',
    participants: [
      { id: 'user-1', name: 'Sarah Mitchell', role: 'Lead Caregiver', avatar: 'SM' },
      { id: 'user-3', name: 'Dr. Chen', role: 'Neurologist', avatar: 'DC' },
    ],
    lastMessage: 'The cognitive assessment results look promising. Let\'s discuss at the next review.',
    lastMessageTime: '2026-03-31T16:42:00Z',
    unreadCount: 1,
  },
  {
    id: 'thread-3',
    participants: [
      { id: 'user-1', name: 'Sarah Mitchell', role: 'Lead Caregiver', avatar: 'SM' },
      { id: 'user-4', name: 'James Thompson', role: 'Family Member', avatar: 'JT' },
    ],
    lastMessage: 'Thanks for the update on his medication schedule.',
    lastMessageTime: '2026-03-31T11:20:00Z',
    unreadCount: 0,
  },
  {
    id: 'thread-4',
    participants: [
      { id: 'user-1', name: 'Sarah Mitchell', role: 'Lead Caregiver', avatar: 'SM' },
      { id: 'user-5', name: 'Emily Rivera', role: 'Occupational Therapist', avatar: 'ER' },
    ],
    lastMessage: 'I\'ve updated the exercise plan for this week. Please review.',
    lastMessageTime: '2026-03-30T14:05:00Z',
    unreadCount: 0,
  },
];

const messages: Message[] = [
  // Thread 1 - Lisa Thompson
  {
    id: 'msg-1', threadId: 'thread-1', senderId: 'user-2', senderName: 'Lisa Thompson',
    senderRole: 'Family Member', content: 'Hi Sarah, how is Dad doing today?',
    timestamp: '2026-04-01T08:30:00Z', read: true,
  },
  {
    id: 'msg-2', threadId: 'thread-1', senderId: 'user-1', senderName: 'Sarah Mitchell',
    senderRole: 'Lead Caregiver', content: 'Good morning Lisa! He had a great breakfast and was in good spirits. We did the morning orientation and he remembered the day of the week.',
    timestamp: '2026-04-01T08:45:00Z', read: true,
  },
  {
    id: 'msg-3', threadId: 'thread-1', senderId: 'user-2', senderName: 'Lisa Thompson',
    senderRole: 'Family Member', content: 'That\'s wonderful to hear! Did he enjoy looking at the family photos?',
    timestamp: '2026-04-01T09:00:00Z', read: false,
  },
  {
    id: 'msg-4', threadId: 'thread-1', senderId: 'user-2', senderName: 'Lisa Thompson',
    senderRole: 'Family Member', content: 'Dad seemed much more engaged today during the photo activity.',
    timestamp: '2026-04-01T09:15:00Z', read: false,
  },
  // Thread 2 - Dr. Chen
  {
    id: 'msg-5', threadId: 'thread-2', senderId: 'user-1', senderName: 'Sarah Mitchell',
    senderRole: 'Lead Caregiver', content: 'Dr. Chen, I wanted to share the latest cognitive test results from this week.',
    timestamp: '2026-03-31T15:30:00Z', read: true,
  },
  {
    id: 'msg-6', threadId: 'thread-2', senderId: 'user-3', senderName: 'Dr. Chen',
    senderRole: 'Neurologist', content: 'The cognitive assessment results look promising. Let\'s discuss at the next review.',
    timestamp: '2026-03-31T16:42:00Z', read: false,
  },
  // Thread 3 - James Thompson
  {
    id: 'msg-7', threadId: 'thread-3', senderId: 'user-1', senderName: 'Sarah Mitchell',
    senderRole: 'Lead Caregiver', content: 'James, I\'ve updated your father\'s medication schedule. Morning dose moved to 8:30 AM per Dr. Chen\'s recommendation.',
    timestamp: '2026-03-31T10:50:00Z', read: true,
  },
  {
    id: 'msg-8', threadId: 'thread-3', senderId: 'user-4', senderName: 'James Thompson',
    senderRole: 'Family Member', content: 'Thanks for the update on his medication schedule.',
    timestamp: '2026-03-31T11:20:00Z', read: true,
  },
  // Thread 4 - Emily Rivera
  {
    id: 'msg-9', threadId: 'thread-4', senderId: 'user-5', senderName: 'Emily Rivera',
    senderRole: 'Occupational Therapist', content: 'I\'ve updated the exercise plan for this week. Please review.',
    timestamp: '2026-03-30T14:05:00Z', read: true,
  },
];

let messageIdCounter = 10;

export async function getConversations(userId: string) {
  return threads.map((thread) => {
    const otherParticipant = thread.participants.find((p) => p.id !== 'user-1') || thread.participants[0];
    return {
      ...thread,
      contactName: otherParticipant.name,
      contactRole: otherParticipant.role,
      contactAvatar: otherParticipant.avatar,
    };
  });
}

export async function getThreadMessages(threadId: string) {
  const thread = threads.find((t) => t.id === threadId);
  if (!thread) throw AppError.notFound('Thread not found');

  const threadMessages = messages.filter((m) => m.threadId === threadId);
  return { thread, messages: threadMessages };
}

export async function sendMessage(data: {
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
}) {
  const thread = threads.find((t) => t.id === data.threadId);
  if (!thread) throw AppError.notFound('Thread not found');

  const newMessage: Message = {
    id: `msg-${++messageIdCounter}`,
    threadId: data.threadId,
    senderId: data.senderId,
    senderName: data.senderName,
    senderRole: data.senderRole,
    content: data.content,
    timestamp: new Date().toISOString(),
    read: false,
  };

  messages.push(newMessage);
  thread.lastMessage = data.content;
  thread.lastMessageTime = newMessage.timestamp;

  return newMessage;
}
