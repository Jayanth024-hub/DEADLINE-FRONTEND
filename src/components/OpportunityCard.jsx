import React from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, Users, ExternalLink, CheckCircle } from 'lucide-react';

export default function OpportunityCard({ 
  opportunity, 
  onRegister, 
  isRegistered = false 
}) {
  const {
    id,
    title,
    company,
    type,
    location,
    stipend,
    deadline,
    eligibility,
    tags = [],
    registeredCount = 0,
    applyUrl,
    description
  } = opportunity;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Rolling';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="opportunity-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span className="opp-company-badge">{company}</span>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: 700, 
          padding: '2px 8px', 
          borderRadius: '9999px',
          background: type === 'INTERNSHIP' ? '#e0f2fe' : type === 'HACKATHON' ? '#f5f3ff' : '#fef3c7',
          color: type === 'INTERNSHIP' ? '#0369a1' : type === 'HACKATHON' ? '#6d28d9' : '#b45309'
        }}>
          {type}
        </span>
      </div>

      <h3 className="opp-card-title">{title}</h3>

      {stipend && (
        <div className="opp-stipend-box">
          <DollarSign size={15} />
          <span>{stipend}</span>
        </div>
      )}

      {description && (
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
          {description}
        </p>
      )}

      <div className="opp-meta-list">
        {location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
            <span>{location}</span>
          </div>
        )}
        {eligibility && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 600 }}>Eligibility:</span>
            <span>{eligibility}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          <span>Deadline: {formatDate(deadline)}</span>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="opp-tags-row">
          {tags.map((t, idx) => (
            <span key={idx} className="opp-tag">{t}</span>
          ))}
        </div>
      )}

      <div className="opp-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <Users size={13} />
          <span>{registeredCount} applied</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {applyUrl && (
            <a 
              href={applyUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="saas-btn saas-btn-secondary saas-btn-sm"
              title="Official Link"
            >
              <ExternalLink size={13} /> Details
            </a>
          )}
          
          <button 
            className={`saas-btn saas-btn-sm ${isRegistered ? 'saas-btn-secondary' : 'saas-btn-primary'}`}
            onClick={() => onRegister && onRegister(id)}
            disabled={isRegistered}
          >
            {isRegistered ? (
              <>
                <CheckCircle size={13} style={{ color: 'var(--emerald-green)' }} /> Registered
              </>
            ) : (
              'Register Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
