'use client';

import { useState } from 'react';

type NoteType = 'Observation' | 'Clinical' | 'Behavioral' | 'Family Communication';

interface PatientNote {
  id: string;
  patient: string;
  type: NoteType;
  content: string;
  author: string;
  timestamp: string;
}

const PATIENTS = ['Margaret', 'Harold', 'Dorothy', 'Frank'];

const NOTE_TYPES: NoteType[] = ['Observation', 'Clinical', 'Behavioral', 'Family Communication'];

const TYPE_COLORS: Record<NoteType, { bg: string; text: string }> = {
  Observation: { bg: '#E3F2FD', text: '#1565C0' },
  Clinical: { bg: '#FFF3E0', text: '#E65100' },
  Behavioral: { bg: '#F3E5F5', text: '#7B1FA2' },
  'Family Communication': { bg: '#E8F5E9', text: '#2E7D32' },
};

const DEMO_NOTES: PatientNote[] = [
  {
    id: '1',
    patient: 'Margaret',
    type: 'Observation',
    content: "Seemed more oriented after morning session. Recognized Lisa's photo immediately.",
    author: 'Sarah Mitchell',
    timestamp: 'Mar 31, 10:30 AM',
  },
  {
    id: '2',
    patient: 'Harold',
    type: 'Clinical',
    content: 'Refused Memantine again. Will discuss alternatives with Dr. Chen.',
    author: 'Sarah Mitchell',
    timestamp: 'Mar 31, 8:15 AM',
  },
  {
    id: '3',
    patient: 'Margaret',
    type: 'Behavioral',
    content: 'Mild agitation during evening transition. Calmed with music therapy.',
    author: 'Sarah Mitchell',
    timestamp: 'Mar 30, 7:00 PM',
  },
  {
    id: '4',
    patient: 'Dorothy',
    type: 'Observation',
    content: 'Personal best cognitive score (88%). Very engaged during session.',
    author: 'Sarah Mitchell',
    timestamp: 'Mar 30, 2:00 PM',
  },
  {
    id: '5',
    patient: 'Frank',
    type: 'Clinical',
    content: 'Increased fall risk noted. Adjusted walker height.',
    author: 'Sarah Mitchell',
    timestamp: 'Mar 30, 11:00 AM',
  },
  {
    id: '6',
    patient: 'Margaret',
    type: 'Family Communication',
    content: 'Lisa called to check in. Shared weekly report.',
    author: 'Sarah Mitchell',
    timestamp: 'Mar 29, 3:00 PM',
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<PatientNote[]>(DEMO_NOTES);
  const [selectedPatient, setSelectedPatient] = useState<string>('all');
  const [newNoteType, setNewNoteType] = useState<NoteType>('Observation');
  const [newNotePatient, setNewNotePatient] = useState<string>('Margaret');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredNotes =
    selectedPatient === 'all' ? notes : notes.filter((n) => n.patient === selectedPatient);

  const handleSaveNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: PatientNote = {
      id: Date.now().toString(),
      patient: newNotePatient,
      type: newNoteType,
      content: newNoteContent.trim(),
      author: 'Sarah Mitchell',
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setShowForm(false);
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 960 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 28,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F2B3F', margin: 0 }}>
            Patient Notes
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>
            Clinical notes and documentation
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: '#1A7BC4',
            color: '#FFF',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel' : '+ New Note'}
        </button>
      </div>

      {/* Patient Filter */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginRight: 12 }}>
          Filter by Patient:
        </label>
        <select
          value={selectedPatient}
          onChange={(e: any) => setSelectedPatient(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #CBD5E1',
            fontSize: 14,
            color: '#0F2B3F',
            background: '#FFF',
          }}
        >
          <option value="all">All Patients</option>
          {PATIENTS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* New Note Form */}
      {showForm && (
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: 24,
            marginBottom: 28,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F2B3F', margin: '0 0 16px' }}>
            New Note
          </h3>

          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#475569',
                  marginBottom: 6,
                }}
              >
                Patient
              </label>
              <select
                value={newNotePatient}
                onChange={(e: any) => setNewNotePatient(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  fontSize: 14,
                  color: '#0F2B3F',
                  background: '#FFF',
                }}
              >
                {PATIENTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#475569',
                  marginBottom: 6,
                }}
              >
                Note Type
              </label>
              <select
                value={newNoteType}
                onChange={(e: any) => setNewNoteType(e.target.value as NoteType)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  fontSize: 14,
                  color: '#0F2B3F',
                  background: '#FFF',
                }}
              >
                {NOTE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#475569',
                marginBottom: 6,
              }}
            >
              Content
            </label>
            <textarea
              value={newNoteContent}
              onChange={(e: any) => setNewNoteContent(e.target.value)}
              placeholder="Enter note content..."
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid #CBD5E1',
                fontSize: 14,
                color: '#0F2B3F',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            onClick={handleSaveNote}
            disabled={!newNoteContent.trim()}
            style={{
              background: newNoteContent.trim() ? '#1A7BC4' : '#94A3B8',
              color: '#FFF',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: newNoteContent.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Save Note
          </button>
        </div>
      )}

      {/* Notes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredNotes.map((note) => {
          const typeColor = TYPE_COLORS[note.type];
          return (
            <div
              key={note.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                padding: '18px 20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#0F2B3F',
                  }}
                >
                  {note.patient}
                </span>
                <span
                  style={{
                    background: typeColor.bg,
                    color: typeColor.text,
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 12,
                  }}
                >
                  {note.type}
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#334155', margin: '0 0 10px', lineHeight: 1.5 }}>
                {note.content}
              </p>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>
                {note.author} &middot; {note.timestamp}
              </div>
            </div>
          );
        })}

        {filteredNotes.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: '#94A3B8',
              fontSize: 14,
            }}
          >
            No notes found for this patient.
          </div>
        )}
      </div>
    </div>
  );
}
