import React from 'react';
import { X, User, GraduationCap, Award, BookOpen, CheckCircle, Mail, Bell } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, user, onLogout }) {
  if (!isOpen) return null;

  const isStudent = user.role === 'STUDENT';
  const profileStats = isStudent
    ? [
        { label: 'Current Semester', value: user.semester || 'Not provided' },
        { label: 'Graduation Batch', value: user.batch || 'Not provided' },
        { label: 'Student ID / Roll Number', value: user.rollNumber || 'Not provided' },
        { label: 'Cumulative GPA', value: user.cgpa || 'Not provided' }
      ]
    : user.role === 'FACULTY'
      ? [
          { label: 'Faculty ID Number', value: user.facultyId || 'Not provided' },
          { label: 'Designation', value: user.facultyDesignation || 'Not provided' },
          { label: 'Department', value: user.department || 'Not provided' },
          { label: 'Courses', value: user.courses?.join(', ') || 'Not provided' }
        ]
      : [
          { label: 'Institutional ID', value: user.coordinatorId || user.adminId || 'Not provided' },
          { label: 'Department', value: user.department || 'Not provided' }
        ];

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-dialog white-card profile-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <User size={18} />
            </div>
            <div>
              <h3>{isStudent ? 'Student Profile & Academics' : `${user.role.charAt(0)}${user.role.slice(1).toLowerCase()} Profile`}</h3>
              <p>{isStudent ? 'Academic credentials, performance metrics, and preferences' : 'Institutional details and account information'}</p>
            </div>
          </div>
          <button className="btn-ghost modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="profile-body">
          {/* Avatar & Summary */}
          <div className="profile-identity-card">
            <div className="large-avatar-box">
              {user.avatar}
            </div>
            <div className="identity-details">
              <h4>{user.name}</h4>
              <p className="identity-role">{user.department} • {user.role}</p>
              <span className="identity-email">{user.email}</span>
            </div>
            {isStudent && (
              <div className="cgpa-highlight-badge">
                <span className="cgpa-num">{user.cgpa || '—'}</span>
                <span className="cgpa-sub">Cumulative GPA</span>
              </div>
            )}
          </div>

          <div className="academic-info-grid">
            {profileStats.map(({ label, value }) => (
              <div className="info-stat-tile" key={label}>
                <span className="tile-label">{label}</span>
                <strong className="tile-value">{value}</strong>
              </div>
            ))}
          </div>

          {/* Notification Preferences */}
          <div className="settings-block">
            <h5>Notification Preferences</h5>
            <div className="pref-item">
              <div>
                <span className="pref-title">Deadline Approaching Alerts</span>
                <p className="pref-desc">Receive notifications 24 hours and 2 hours before submission closes</p>
              </div>
              <input type="checkbox" defaultChecked className="pref-toggle" />
            </div>
            <div className="pref-item">
              <div>
                <span className="pref-title">Career Opportunity Matches</span>
                <p className="pref-desc">Notify when internships matching your tech stack are posted</p>
              </div>
              <input type="checkbox" defaultChecked className="pref-toggle" />
            </div>
          </div>
        </div>

        <div className="modal-footer profile-footer-split">
          {onLogout && (
            <button 
              type="button" 
              className="btn-secondary logout-btn-danger" 
              onClick={() => { onClose(); onLogout(); }}
            >
              Sign Out Safely
            </button>
          )}
          <button className="btn-primary" onClick={onClose}>
            Close Profile
          </button>
        </div>
      </div>

      <style>{`
        .profile-modal-card {
          max-width: 520px;
        }

        .profile-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .profile-identity-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-lg);
        }

        .large-avatar-box {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5 0%, #0284c7 100%);
          color: #ffffff;
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        .identity-details {
          flex: 1;
        }

        .identity-details h4 {
          font-size: 1.125rem;
          margin-bottom: 0.125rem;
        }

        .identity-role {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .identity-email {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .cgpa-highlight-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: #ffffff;
          border: 2px solid var(--primary);
          border-radius: var(--radius-md);
        }

        .cgpa-num {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }

        .cgpa-sub {
          font-size: 0.5625rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 2px;
        }

        .academic-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .info-stat-tile {
          padding: 0.875rem;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .tile-label {
          font-size: 0.6875rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .tile-value {
          font-size: 0.9375rem;
          color: var(--text-main);
        }

        .settings-block {
          padding-top: 0.5rem;
        }

        .settings-block h5 {
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
        }

        .pref-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 0;
          border-bottom: 1px solid var(--surface-border);
        }

        .pref-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .pref-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .pref-toggle {
          accent-color: var(--primary);
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
