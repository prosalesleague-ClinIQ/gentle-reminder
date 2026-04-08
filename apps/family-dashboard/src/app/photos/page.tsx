'use client';

import { useState } from 'react';
import { photos, voiceRecordings } from '../../data/mock';

const categories = ['All', 'Family', 'Events', 'Places'] as const;

export default function PhotosPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = activeCategory === 'All' ? photos : photos.filter((p) => p.category === activeCategory);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: 0 }}>Photos & Memories</h1>
          <p style={{ fontSize: 16, color: '#6B7280', marginTop: 4 }}>
            Share photos and voice messages with Margaret
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            style={{
              padding: '10px 20px',
              background: '#7C3AED',
              color: '#FFF',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Upload Photo
          </button>
          <button
            style={{
              padding: '10px 20px',
              background: '#FFF',
              color: '#7C3AED',
              border: '2px solid #7C3AED',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add Memory
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: 'none',
              background: activeCategory === cat ? '#7C3AED' : '#F3F4F6',
              color: activeCategory === cat ? '#FFF' : '#6B7280',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
        {filtered.map((photo) => (
          <div
            key={photo.id}
            style={{
              background: '#FFF',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            {/* Placeholder image */}
            <div
              style={{
                height: 180,
                background: 'linear-gradient(135deg, #E9D5FF 0%, #C4B5FD 50%, #A78BFA 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                color: '#7C3AED',
              }}
            >
              {photo.category === 'Family' ? '\u263A' : photo.category === 'Events' ? '\u2605' : '\u2302'}
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
                {photo.caption}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9CA3AF' }}>
                <span>{photo.uploadedBy}</span>
                <span>{new Date(photo.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 8,
                  padding: '2px 10px',
                  borderRadius: 10,
                  background: '#F3E8FF',
                  color: '#7C3AED',
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {photo.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Voice Recordings */}
      <div style={{ background: '#FFF', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 20px 0' }}>
          Voice Recordings
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {voiceRecordings.map((rec) => (
            <div
              key={rec.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                borderRadius: 8,
                background: '#FAF5FF',
                border: '1px solid #E9D5FF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                    fontSize: 18,
                    cursor: 'pointer',
                  }}
                >
                  {'\u25B6'}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{rec.title}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                    {rec.recordedBy} - {new Date(rec.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{rec.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
