import PatientCard from '../../components/PatientCard';
import { patients } from '../../data/mock';

export default function PatientsPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: 0 }}>Patients</h1>
        <p style={{ fontSize: 15, color: '#6B7280', margin: '6px 0 0' }}>
          Manage and monitor your patients&apos; cognitive health.
        </p>
      </div>

      {/* Summary bar */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          marginBottom: 24,
          padding: '14px 20px',
          background: '#FFFFFF',
          borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          fontSize: 13,
          color: '#6B7280',
        }}
      >
        <span>
          <strong style={{ color: '#1F2937' }}>4</strong> patients shown
        </span>
        <span style={{ color: '#E0E0E0' }}>|</span>
        <span>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#3D8158', marginRight: 6 }} />
          2 Mild
        </span>
        <span>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#E5A300', marginRight: 6 }} />
          1 Moderate
        </span>
        <span>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#C0392B', marginRight: 6 }} />
          1 Severe
        </span>
      </div>

      {/* Patient grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}
