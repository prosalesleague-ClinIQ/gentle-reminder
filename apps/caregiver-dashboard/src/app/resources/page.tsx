export default function ResourcesPage() {
  const quickReferenceGuides = [
    {
      title: 'Sundowning Management',
      description:
        'Strategies for managing late-afternoon confusion and agitation. Includes lighting, routine, and communication tips.',
      category: 'Clinical',
      categoryColor: '#C0392B',
      categoryBg: '#FDECEC',
    },
    {
      title: 'Communication Techniques',
      description:
        'How to communicate effectively with patients experiencing cognitive decline. Validation therapy principles.',
      category: 'Communication',
      categoryColor: '#1A7BC4',
      categoryBg: '#EBF5FB',
    },
    {
      title: 'Fall Prevention',
      description:
        'Environmental modifications and monitoring strategies to reduce fall risk in dementia patients.',
      category: 'Safety',
      categoryColor: '#B58200',
      categoryBg: '#FEF7E0',
    },
  ];

  const trainingVideos = [
    {
      title: 'Understanding Dementia Stages',
      description: 'Overview of mild, moderate, and severe dementia progression',
      duration: '12 min',
    },
    {
      title: 'Gentle Feeding Techniques',
      description: 'Safe approaches to mealtime for patients with swallowing difficulties',
      duration: '8 min',
    },
    {
      title: 'De-escalation Strategies',
      description: 'Techniques for calming agitated patients without medication',
      duration: '15 min',
    },
  ];

  const clinicalProtocols = [
    {
      title: 'Cognitive Assessment Protocol',
      description: 'Step-by-step guide for conducting cognitive assessments using the platform',
    },
    {
      title: 'Medication Administration',
      description: 'Safe medication handling and documentation procedures',
    },
    {
      title: 'Emergency Response',
      description: 'Protocol for medical emergencies, falls, and wandering incidents',
    },
  ];

  const externalResources = [
    { name: "Alzheimer's Association", url: 'https://www.alz.org', description: 'Research, support, and education for Alzheimer\'s and dementia care' },
    { name: 'National Institute on Aging', url: 'https://www.nia.nih.gov', description: 'Federal research and information on aging and dementia' },
    { name: 'Dementia UK', url: 'https://www.dementiauk.org', description: 'Specialist dementia support and Admiral Nurse services' },
  ];

  const cardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  };

  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    color: '#1F2937',
    margin: '0 0 16px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 32,
  };

  const viewButtonStyle: React.CSSProperties = {
    padding: '8px 18px',
    background: '#1A7BC4',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
    marginTop: 'auto',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: 0 }}>
          Resource Library
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280', margin: '6px 0 0' }}>
          Evidence-based resources for dementia care
        </p>
      </div>

      {/* Quick Reference Guides */}
      <h2 style={sectionHeadingStyle}>Quick Reference Guides</h2>
      <div style={gridStyle}>
        {quickReferenceGuides.map((guide) => (
          <div key={guide.title} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: guide.categoryBg,
                  color: guide.categoryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {guide.category}
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1F2937' }}>{guide.title}</div>
            <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
              {guide.description}
            </div>
            <button style={viewButtonStyle}>View</button>
          </div>
        ))}
      </div>

      {/* Training Videos */}
      <h2 style={sectionHeadingStyle}>Training Videos</h2>
      <div style={gridStyle}>
        {trainingVideos.map((video) => (
          <div key={video.title} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: '#F0F9FF',
                  color: '#0369A1',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Video
              </span>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>{video.duration}</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1F2937' }}>{video.title}</div>
            <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
              {video.description}
            </div>
            <button style={viewButtonStyle}>View</button>
          </div>
        ))}
      </div>

      {/* Clinical Protocols */}
      <h2 style={sectionHeadingStyle}>Clinical Protocols</h2>
      <div style={gridStyle}>
        {clinicalProtocols.map((protocol) => (
          <div key={protocol.title} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: '#F3F0FF',
                  color: '#6D28D9',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Protocol
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1F2937' }}>{protocol.title}</div>
            <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
              {protocol.description}
            </div>
            <button style={viewButtonStyle}>View</button>
          </div>
        ))}
      </div>

      {/* External Resources */}
      <h2 style={sectionHeadingStyle}>External Resources</h2>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        {externalResources.map((resource, idx) => (
          <div
            key={resource.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 24px',
              borderBottom:
                idx < externalResources.length - 1 ? '1px solid #F0F0F0' : 'none',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937' }}>{resource.name}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                {resource.description}
              </div>
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '8px 18px',
                background: '#F3F4F6',
                color: '#374151',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              Visit Site
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
