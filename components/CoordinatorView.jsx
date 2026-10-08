import React, { useState } from 'react';
import { 
  Plus, 
  Briefcase, 
  Users, 
  Award, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  FileCheck,
  Building2,
  Calendar,
  Download,
  Send,
  UserCheck,
  Check
} from 'lucide-react';

export default function CoordinatorView({ 
  opportunities, 
  user,
  onOpenCreateOppModal 
}) {
  const [selectedOppId, setSelectedOppId] = useState(opportunities[0]?.id || 'opp-1');
  const [verifiedMap, setVerifiedMap] = useState({
    'Sai Jayanth': true,
    'Aarav Patel': true,
    'Riya Sharma': true,
    'Rohan Gupta': false
  });
  const [bannerNotice, setBannerNotice] = useState('');

  const totalPrograms = opportunities.length;
  const totalRegistrations = opportunities.reduce((acc, o) => acc + (o.registeredCount || 80), 0);
  const activeOpportunity = opportunities.find(o => o.id === selectedOppId) || opportunities[0];

  const studentList = activeOpportunity.registeredStudents || ['Sai Jayanth', 'Aarav Patel', 'Riya Sharma', 'Rohan Gupta'];

  const showNotice = (msg) => {
    setBannerNotice(msg);
    setTimeout(() => setBannerNotice(''), 3500);
  };

  const handleToggleVerify = (studentName) => {
    setVerifiedMap(prev => {
      const nextState = !prev[studentName];
      showNotice(`${studentName} marked as ${nextState ? 'VERIFIED' : 'PENDING VERIFICATION'}`);
      return { ...prev, [studentName]: nextState };
    });
  };

  const handleExportCSV = () => {
    const headers = ['Student Name', 'Roll Number', 'Department', 'Company', 'Drive Title', 'Verification Status'];
    const rows = studentList.map((stu, i) => [
      `"${stu}"`,
      `"22BCE10${40 + i}"`,
      `"Computer Science & Engineering"`,
      `"${activeOpportunity.company}"`,
      `"${activeOpportunity.title}"`,
      `"${verifiedMap[stu] !== false ? 'Verified' : 'Pending'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeOpportunity.company}_applicants_shortlist.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice(`Exported shortlist CSV for ${activeOpportunity.company} (${studentList.length} candidates)`);
  };

  const handleSendReminderBroadcast = () => {
    showNotice(`Broadcast alert sent to all ${studentList.length} applicants of ${activeOpportunity.company}!`);
  };

  return (
    <div className="coordinator-view-container animate-fade-in">
      {/* Header */}
      <div className="coord-header-row">
        <div>
          <div className="role-eyebrow">
            <span className="coord-dot"></span>
            Coordinator Portal • {user.department || 'Career Development Cell'}
          </div>
          <h2>Placement, Internship &amp; Event Operations</h2>
          <p className="coord-sub">
            Publish career openings, launch hackathons &amp; workshops, and monitor college-wide student applicant registrations.
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenCreateOppModal}>
          <Plus size={16} />
          <span>Publish New Opportunity</span>
        </button>
      </div>

      {bannerNotice && (
        <div className="coord-action-banner animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="coord-stats-grid">
        <div className="stat-card white-card">
          <div className="stat-header">
            <span className="stat-title">Active Drives &amp; Events</span>
            <div className="stat-icon-box stat-purple">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number">{totalPrograms}</span>
            <span className="stat-pill pill-purple">Open for applications</span>
          </div>
          <span className="stat-hint">Campus Placements, Internships &amp; Hackathons</span>
        </div>

        <div className="stat-card white-card">
          <div className="stat-header">
            <span className="stat-title">Student Registrations</span>
            <div className="stat-icon-box stat-blue">
              <Users size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number text-primary">{totalRegistrations}</span>
            <span className="stat-pill pill-neutral">Across all batches</span>
          </div>
          <span className="stat-hint">Total applicants verified</span>
        </div>

        <div className="stat-card white-card">
          <div className="stat-header">
            <span className="stat-title">Participation Rate</span>
            <div className="stat-icon-box stat-green">
              <Award size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number text-success">84.2%</span>
            <span className="stat-pill pill-success">Eligible students active</span>
          </div>
          <span className="stat-hint">High engagement across technical drives</span>
        </div>
      </div>

      {/* Dual Layout: Left Program Directory, Right Selected Registrations List */}
      <div className="coord-content-layout">
        {/* Left: Published Programs Table */}
        <div className="coord-left-col white-card">
          <div className="panel-title-box">
            <h3>Published Opportunities ({opportunities.length})</h3>
            <p>Select any drive to inspect and verify registered candidate rosters</p>
          </div>

          <div className="opps-directory-stack">
            {opportunities.map(opp => {
              const isSelected = opp.id === selectedOppId;

              return (
                <div 
                  key={opp.id} 
                  className={`coord-opp-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedOppId(opp.id)}
                >
                  <div className="coord-opp-top">
                    <span className="coord-company">{opp.company}</span>
                    <span className="coord-type-tag">{opp.type}</span>
                  </div>
                  <h4 className="coord-title">{opp.title}</h4>
                  
                  <div className="coord-opp-meta">
                    <span className="coord-deadline">
                      <Clock size={12} />
                      Due {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="coord-registered-pill">
                      <Users size={12} />
                      {opp.registeredCount || 95} Registered
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Registered Applicants Inspector */}
        <div className="coord-right-col white-card">
          <div className="panel-title-box">
            <div className="active-drive-title">
              <span className="active-badge">Active Roster</span>
              <h3>{activeOpportunity.company} - {activeOpportunity.title}</h3>
            </div>
            <p>Registration Deadline: {new Date(activeOpportunity.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="drive-info-chips">
            <div className="drive-chip">
              <Award size={14} className="text-primary" />
              <strong>{activeOpportunity.stipend}</strong>
            </div>
            <div className="drive-chip">
              <span>Eligibility: {activeOpportunity.eligibility}</span>
            </div>
          </div>

          {/* Roster Header with Working Export and Broadcast Buttons */}
          <div className="roster-header-actions-row">
            <h4>Registered Applicants ({studentList.length})</h4>
            <div className="roster-action-buttons">
              <button 
                type="button"
                className="btn-secondary btn-sm"
                onClick={handleExportCSV}
                title="Export list of applicants to CSV spreadsheet"
              >
                <Download size={13} />
                <span>Export Shortlist</span>
              </button>
              <button 
                type="button"
                className="btn-ghost btn-sm"
                onClick={handleSendReminderBroadcast}
                title="Send notification to registered students"
              >
                <Send size={13} />
                <span>Notify All</span>
              </button>
            </div>
          </div>

          <div className="registered-roster-section">
            <div className="roster-list">
              {studentList.map((stu, i) => {
                const isVerified = verifiedMap[stu] !== false;

                return (
                  <div key={stu} className="roster-item">
                    <div className="roster-avatar">{stu.charAt(0)}</div>
                    <div className="roster-details">
                      <strong>{stu}</strong>
                      <small>Roll: 22BCE10{40 + i} • CSE Section A • CGPA: 8.8</small>
                    </div>

                    <button 
                      type="button"
                      className={`roster-status-badge-btn ${isVerified ? 'is-verified' : 'is-pending'}`}
                      onClick={() => handleToggleVerify(stu)}
                      title={`Click to ${isVerified ? 'unverify' : 'verify'} eligibility`}
                    >
                      {isVerified ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          <span>Verify</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .coordinator-view-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.75rem 0 3rem 0;
        }

        .coord-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .role-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #7c3aed;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .coord-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8b5cf6;
        }

        .coord-header-row h2 {
          font-size: 1.625rem;
          margin-bottom: 0.25rem;
        }

        .coord-sub {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .coord-action-banner {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          font-weight: 600;
        }

        /* Stats */
        .coord-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        /* Content Layout */
        .coord-content-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .coord-left-col, .coord-right-col {
          padding: 1.5rem;
          background: #ffffff;
        }

        .panel-title-box {
          margin-bottom: 1.25rem;
        }

        .panel-title-box h3 {
          font-size: 1.125rem;
          margin-bottom: 0.125rem;
        }

        .panel-title-box p {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .opps-directory-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 520px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .coord-opp-item {
          padding: 1rem;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s;
        }

        .coord-opp-item:hover {
          background: #ffffff;
          border-color: #cbd5e1;
        }

        .coord-opp-item.is-selected {
          border-color: var(--primary);
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
        }

        .coord-opp-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .coord-company {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .coord-type-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--purple-text);
          background: var(--purple-light);
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-full);
        }

        .coord-title {
          font-size: 0.9375rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .coord-opp-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .coord-deadline {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .coord-registered-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 700;
          color: var(--primary);
        }

        /* Right Inspector */
        .active-drive-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .active-badge {
          font-size: 0.625rem;
          font-weight: 800;
          color: #065f46;
          background: #d1fae5;
          padding: 0.1rem 0.4rem;
          border-radius: var(--radius-full);
        }

        .drive-info-chips {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--bg-app);
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          font-size: 0.8125rem;
        }

        .drive-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .roster-header-actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .roster-header-actions-row h4 {
          font-size: 0.9375rem;
        }

        .roster-action-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-sm {
          padding: 0.35rem 0.625rem;
          font-size: 0.75rem;
          gap: 0.375rem;
        }

        .roster-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .roster-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.875rem;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
        }

        .roster-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5 0%, #0284c7 100%);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .roster-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .roster-details strong {
          font-size: 0.8125rem;
          color: var(--text-main);
        }

        .roster-details small {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .roster-status-badge-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.25rem 0.625rem;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.15s;
          border: 1px solid transparent;
        }

        .roster-status-badge-btn.is-verified {
          color: #065f46;
          background: #d1fae5;
          border-color: #a7f3d0;
        }

        .roster-status-badge-btn.is-verified:hover {
          background: #fee2e2;
          color: #991b1b;
          border-color: #fca5a5;
        }

        .roster-status-badge-btn.is-pending {
          color: #b45309;
          background: #fef3c7;
          border-color: #fde68a;
        }

        .roster-status-badge-btn.is-pending:hover {
          background: #d1fae5;
          color: #065f46;
          border-color: #a7f3d0;
        }

        @media (max-width: 900px) {
          .coord-stats-grid {
            grid-template-columns: 1fr;
          }
          .coord-content-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
