import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { User, Award, Mail, BookOpen, Check, Bell, Save } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'user@deadlineiq.com',
    rollNumber: user?.rollNumber || '22BCE1042',
    department: user?.department || 'Computer Science & Engineering',
    batch: user?.batch || '2023 - 2027',
    semester: user?.semester || '6th Semester',
    section: user?.section || 'CSE 3-1 Section A',
    cgpa: user?.cgpa || '8.94',
  });
  const [savedMessage, setSavedMessage] = useState(false);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = { ...user, ...profile };
    setUser(updated);
    authService.setCurrentUser(updated);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <PageHeader
        title="Student Academic Profile"
        subtitle="Manage your university credentials, department section, and recruitment eligibility."
      />

      {savedMessage && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#065f46',
          marginBottom: '20px',
          fontSize: '13px'
        }}>
          <Check size={16} />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <div className="profile-layout-grid">
        {/* Left card: Avatar & summary */}
        <div style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #0284c7, #8b5cf6)', 
            color: 'white', 
            fontSize: '28px', 
            fontWeight: 800, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            {profile.name?.substring(0, 2).toUpperCase() || 'SJ'}
          </div>

          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 800 }}>{profile.name}</h3>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--text-muted)' }}>{profile.rollNumber}</p>

          <div style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--primary-blue-light)', color: 'var(--primary-blue)', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, marginBottom: '20px' }}>
            CGPA: {profile.cgpa} / 10.0
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <div style={{ marginBottom: '6px' }}><strong>Batch:</strong> {profile.batch}</div>
            <div style={{ marginBottom: '6px' }}><strong>Section:</strong> {profile.section}</div>
            <div><strong>Status:</strong> Eligible for Tier-1 Drives</div>
          </div>
        </div>

        {/* Right card: Form */}
        <div style={{ background: 'white', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="saas-form-group">
                <label className="saas-label">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="saas-input" 
                  value={profile.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="saas-form-group">
                <label className="saas-label">Academic Email</label>
                <input 
                  type="email" 
                  name="email" 
                  className="saas-input" 
                  value={profile.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="saas-form-group">
                <label className="saas-label">Roll Number</label>
                <input 
                  type="text" 
                  name="rollNumber" 
                  className="saas-input" 
                  value={profile.rollNumber} 
                  onChange={handleChange} 
                />
              </div>

              <div className="saas-form-group">
                <label className="saas-label">Current CGPA</label>
                <input 
                  type="text" 
                  name="cgpa" 
                  className="saas-input" 
                  value={profile.cgpa} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="saas-form-group">
              <label className="saas-label">Department / Branch</label>
              <input 
                type="text" 
                name="department" 
                className="saas-input" 
                value={profile.department} 
                onChange={handleChange} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="saas-form-group">
                <label className="saas-label">Semester</label>
                <input 
                  type="text" 
                  name="semester" 
                  className="saas-input" 
                  value={profile.semester} 
                  onChange={handleChange} 
                />
              </div>

              <div className="saas-form-group">
                <label className="saas-label">Class Section</label>
                <input 
                  type="text" 
                  name="section" 
                  className="saas-input" 
                  value={profile.section} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" className="saas-btn saas-btn-primary">
                <Save size={15} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
