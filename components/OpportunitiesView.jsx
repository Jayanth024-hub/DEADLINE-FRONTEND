import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  ExternalLink, 
  MapPin, 
  DollarSign, 
  Award, 
  Clock, 
  Bookmark, 
  CheckCircle2, 
  Sparkles,
  Filter,
  Check,
  X,
  Send,
  FileText,
  UserCheck
} from 'lucide-react';

export default function OpportunitiesView({ 
  opportunities, 
  onUpdateOpportunityStatus 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Application Modal state
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [applyStep, setApplyStep] = useState('form'); // 'form' | 'success'
  const [portfolioLink, setPortfolioLink] = useState('https://github.com/saijayanth');
  const [sopNote, setSopNote] = useState('');

  const types = ['All', 'Internship', 'Hackathon', 'Placement'];
  const statuses = ['All', 'Saved', 'Applied', 'Interviewing'];

  const filtered = opportunities.filter(opp => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'All' || opp.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || opp.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenApplyModal = (opp) => {
    setSelectedOpp(opp);
    setApplyStep('form');
    setSopNote('');
  };

  const handleConfirmApplication = (e) => {
    e.preventDefault();
    if (!selectedOpp) return;

    onUpdateOpportunityStatus(selectedOpp.id, 'Applied');
    setApplyStep('success');
  };

  return (
    <div className="opportunities-container animate-fade-in">
      {/* Top Header */}
      <div className="page-header-row">
        <div>
          <h2>Career Opportunities &amp; Programs</h2>
          <p className="page-header-sub">
            Handpicked engineering internships, campus placements, global hackathons, and research grants.
          </p>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="control-filter-bar white-card">
        {/* Search */}
        <div className="search-box-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search company, skills, or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <span className="filter-label">Program:</span>
          <div className="chip-list">
            {types.map(t => (
              <button 
                key={t}
                className={`filter-chip ${selectedType === t ? 'active' : ''}`}
                onClick={() => setSelectedType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <div className="chip-list">
            {statuses.map(s => (
              <button 
                key={s}
                className={`filter-chip ${selectedStatus === s ? 'active' : ''}`}
                onClick={() => setSelectedStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="opportunities-grid">
        {filtered.map(opp => {
          const isSaved = opp.status === 'Saved';
          const isApplied = opp.status === 'Applied';
          const isInterviewing = opp.status === 'Interviewing';

          return (
            <div key={opp.id} className="opp-card white-card">
              {/* Header */}
              <div className="opp-card-header">
                <div className="opp-company-brand">
                  <div className="company-logo-avatar">
                    {opp.company.charAt(0)}
                  </div>
                  <div>
                    <h4 className="opp-company-title">{opp.company}</h4>
                    <span className="opp-badge-type">{opp.type}</span>
                  </div>
                </div>

                {/* Pipeline Status Select */}
                <select 
                  className={`status-select select-${(opp.status || 'open').toLowerCase()}`}
                  value={opp.status || 'Open'}
                  onChange={(e) => onUpdateOpportunityStatus(opp.id, e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="Saved">Saved</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                </select>
              </div>

              {/* Title & Description */}
              <h3 className="opp-job-title">{opp.title}</h3>
              <p className="opp-job-desc">{opp.description}</p>

              {/* Key Details Rows */}
              <div className="opp-meta-list">
                <div className="opp-meta-row">
                  <Award size={14} className="meta-icon text-primary" />
                  <strong>{opp.stipend}</strong>
                </div>
                <div className="opp-meta-row">
                  <MapPin size={14} className="meta-icon" />
                  <span>{opp.location}</span>
                </div>
                <div className="opp-meta-row">
                  <Clock size={14} className="meta-icon text-danger" />
                  <span>Deadline: <strong>{new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong></span>
                </div>
              </div>

              {/* Eligibility */}
              <div className="eligibility-box">
                <span className="eligibility-label">Eligibility:</span>
                <span className="eligibility-text">{opp.eligibility}</span>
              </div>

              {/* Tags */}
              <div className="opp-tags-cluster">
                {opp.tags.map(t => (
                  <span key={t} className="opp-pill-tag">#{t}</span>
                ))}
              </div>

              {/* Footer Buttons */}
              <div className="opp-card-footer">
                <button 
                  className={`btn-secondary bookmark-toggle-btn ${isSaved ? 'is-active' : ''}`}
                  onClick={() => onUpdateOpportunityStatus(opp.id, isSaved ? 'Open' : 'Saved')}
                  title={isSaved ? "Remove bookmark" : "Save opportunity"}
                >
                  <Bookmark size={14} className={isSaved ? 'fill-primary' : ''} />
                  <span>{isSaved ? 'Bookmarked' : 'Save'}</span>
                </button>

                <button 
                  type="button"
                  className="btn-primary apply-now-btn"
                  onClick={() => handleOpenApplyModal(opp)}
                >
                  <span>{isApplied ? 'Application Sent' : (isInterviewing ? 'Interviewing' : 'Apply Now')}</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application / Details Modal */}
      {selectedOpp && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setSelectedOpp(null)}>
          <div className="modal-dialog opp-modal-dialog white-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="company-logo-avatar avatar-modal">
                  {selectedOpp.company.charAt(0)}
                </div>
                <div>
                  <h3>{selectedOpp.title}</h3>
                  <p>{selectedOpp.company} • {selectedOpp.type} • {selectedOpp.location}</p>
                </div>
              </div>
              <button className="btn-ghost modal-close-btn" onClick={() => setSelectedOpp(null)}>
                <X size={15} />
              </button>
            </div>

            {applyStep === 'success' ? (
              <div className="apply-success-box">
                <CheckCircle2 size={36} className="text-green" />
                <h4>Application Successfully Recorded!</h4>
                <p>
                  Your profile, institutional CGPA, and resume have been recorded as <strong>Applied</strong> for <strong>{selectedOpp.title}</strong> at <strong>{selectedOpp.company}</strong>.
                </p>
                <div className="success-modal-actions">
                  <a 
                    href={selectedOpp.applyUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-secondary"
                  >
                    <span>Open Company Portal</span>
                    <ExternalLink size={13} />
                  </a>
                  <button className="btn-primary" onClick={() => setSelectedOpp(null)}>
                    Done &amp; Return to List
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmApplication} className="apply-form">
                <div className="opp-summary-card">
                  <div className="summary-row">
                    <span><strong>Compensation / Stipend:</strong> {selectedOpp.stipend}</span>
                    <span><strong>Application Deadline:</strong> {new Date(selectedOpp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="summary-row">
                    <span><strong>Eligibility:</strong> {selectedOpp.eligibility}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-field-label">GitHub / Portfolio / LinkedIn URL</label>
                  <input 
                    type="url" 
                    required 
                    placeholder="https://github.com/username"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-field-label">Statement of Interest / Notes for T&amp;P Coordinator</label>
                  <textarea 
                    rows={3} 
                    placeholder="Briefly state your relevant tech stack, coursework, or project achievements..."
                    value={sopNote}
                    onChange={(e) => setSopNote(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setSelectedOpp(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <Send size={14} />
                    <span>Confirm &amp; Record Application</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .opportunities-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.5rem 0 3rem 0;
        }

        .page-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .page-header-sub {
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .control-filter-bar {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 0.875rem 1.25rem;
          flex-wrap: wrap;
        }

        .search-box-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 240px;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 0.45rem 0.75rem 0.45rem 2.2rem;
          font-size: 0.8125rem;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          background: #ffffff;
          outline: none;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .chip-list {
          display: flex;
          gap: 0.35rem;
        }

        .filter-chip {
          padding: 0.3rem 0.65rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          border: 1px solid var(--surface-border);
          background: #ffffff;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-chip.active {
          background: #0284c7;
          color: #ffffff;
          border-color: #0284c7;
        }

        .opportunities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.25rem;
        }

        .opp-card {
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
          background: #ffffff;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-lg);
          transition: all 0.18s ease;
        }

        .opp-card:hover {
          border-color: #93c5fd;
          box-shadow: var(--shadow-md);
        }

        .opp-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .opp-company-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .company-logo-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
          color: #ffffff;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-modal {
          width: 40px;
          height: 40px;
          font-size: 1.15rem;
        }

        .opp-company-title {
          font-size: 0.875rem;
          font-weight: 750;
          color: var(--text-main);
          line-height: 1.2;
        }

        .opp-badge-type {
          font-size: 0.65rem;
          font-weight: 600;
          color: #5b21b6;
          background: #f5f3ff;
          padding: 0.05rem 0.4rem;
          border-radius: var(--radius-full);
          display: inline-block;
        }

        .status-select {
          padding: 0.25rem 0.5rem;
          font-size: 0.72rem;
          font-weight: 700;
          border-radius: var(--radius-full);
          border: 1px solid var(--surface-border);
          outline: none;
          cursor: pointer;
        }

        .select-open { background: #f8fafc; color: #475569; }
        .select-saved { background: #eff6ff; color: #0284c7; border-color: #bfdbfe; }
        .select-applied { background: #dcfce7; color: #15803d; border-color: #bbf7d0; }
        .select-interviewing { background: #fef3c7; color: #b45309; border-color: #fde68a; }

        .opp-job-title {
          font-size: 0.9375rem;
          font-weight: 700;
          margin-bottom: 0.35rem;
          line-height: 1.3;
        }

        .opp-job-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin-bottom: 0.75rem;
        }

        .opp-meta-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-bottom: 0.75rem;
          padding: 0.65rem;
          background: var(--bg-sky-light);
          border-radius: var(--radius-md);
        }

        .opp-meta-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .meta-icon {
          color: var(--text-muted);
        }

        .eligibility-box {
          font-size: 0.72rem;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }

        .eligibility-label {
          font-weight: 700;
          color: var(--text-main);
          margin-right: 0.3rem;
        }

        .eligibility-text {
          color: var(--text-secondary);
        }

        .opp-tags-cluster {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-bottom: 1rem;
        }

        .opp-pill-tag {
          font-size: 0.65rem;
          color: var(--text-muted);
          background: #ffffff;
          border: 1px solid var(--surface-border);
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-sm);
        }

        .opp-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.65rem;
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid var(--surface-border);
        }

        .bookmark-toggle-btn {
          padding: 0.4rem 0.75rem;
          font-size: 0.75rem;
        }

        .fill-primary {
          fill: #0284c7;
          color: #0284c7;
        }

        .apply-now-btn {
          flex: 1;
          padding: 0.45rem 0.85rem;
          font-size: 0.78rem;
        }

        /* Modal */
        .opp-modal-dialog {
          max-width: 520px;
        }

        .opp-summary-card {
          background: var(--bg-sky-light);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.75rem;
          margin-bottom: 0.875rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .apply-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .form-field-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .form-input {
          padding: 0.5rem 0.65rem;
          font-size: 0.8125rem;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          outline: none;
        }

        .form-input:focus {
          border-color: #0284c7;
        }

        .apply-success-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
          padding: 1.5rem 0.5rem;
        }

        .apply-success-box h4 {
          font-size: 1rem;
        }

        .apply-success-box p {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.45;
          max-width: 400px;
        }

        .success-modal-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        @media (max-width: 640px) {
          .opportunities-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
