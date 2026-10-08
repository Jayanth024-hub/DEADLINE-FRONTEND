import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  BookOpen, 
  Settings, 
  FileText, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  Download,
  Check,
  X,
  Save,
  UserPlus
} from 'lucide-react';
import { SYSTEM_AUDIT_LOGS, SYSTEM_DEPARTMENTS } from '../data/mockData';

export default function AdminView({ 
  deadlines, 
  opportunities, 
  user 
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('users'); // 'users' | 'depts' | 'audit' | 'settings'
  const [userList, setUserList] = useState([
    { id: 'u1', name: 'Sai Jayanth', email: 'saijayanth@univ.edu', role: 'STUDENT', dept: 'CSE', status: 'ACTIVE' },
    { id: 'u2', name: 'Dr. R. Sharma', email: 'faculty@deadlineiq.com', role: 'FACULTY', dept: 'CSE', status: 'ACTIVE' },
    { id: 'u3', name: 'Prof. K. Venkatesh', email: 'coordinator@deadlineiq.com', role: 'COORDINATOR', dept: 'Career Cell', status: 'ACTIVE' },
    { id: 'u4', name: 'Dr. S. Nair', email: 'admin@deadlineiq.com', role: 'ADMINISTRATOR', dept: 'Academic Affairs', status: 'ACTIVE' },
    { id: 'u5', name: 'Ananya Sen', email: 'ananya@univ.edu', role: 'STUDENT', dept: 'IT', status: 'ACTIVE' },
    { id: 'u6', name: 'Dr. Priya Mohan', email: 'pmohan@deadlineiq.com', role: 'FACULTY', dept: 'ECE', status: 'ACTIVE' },
    { id: 'u7', name: 'Dr. A. Menon', email: 'dean@deadlineiq.com', role: 'DEAN', dept: "Dean's Office", status: 'ACTIVE' },
  ]);

  const [departments, setDepartments] = useState(SYSTEM_DEPARTMENTS);
  const [adminNotice, setAdminNotice] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('STUDENT');
  const [newUserDept, setNewUserDept] = useState('CSE');

  // Settings State
  const [urgencyHours, setUrgencyHours] = useState('3');
  const [autoOverdue, setAutoOverdue] = useState(true);
  const [autoDdlMode, setAutoDdlMode] = useState('update');

  const showNotice = (msg) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(''), 3000);
  };

  const handleRoleChange = (userId, newRole) => {
    setUserList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showNotice(`Updated role to ${newRole}`);
  };

  const handleToggleStatus = (userId) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        showNotice(`Account for ${u.name} set to ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const created = {
      id: `u-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      dept: newUserDept,
      status: 'ACTIVE'
    };

    setUserList(prev => [created, ...prev]);
    setNewUserName('');
    setNewUserEmail('');
    setIsAddUserModalOpen(false);
    showNotice(`Provisioned new account for ${created.name} (${created.role})`);
  };

  const handleExportAuditLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(SYSTEM_AUDIT_LOGS, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'system_audit_compliance_report.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('Audit compliance log report exported (JSON).');
  };

  const handleSaveSettings = () => {
    showNotice('Global system parameters & Hibernate DDL settings saved successfully.');
  };

  return (
    <div className="admin-view-container animate-fade-in">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <div className="role-eyebrow">
            <span className="admin-dot"></span>
            Administrator Console • System Governance
          </div>
          <h2>Central System Administration</h2>
          <p className="admin-sub">
            Manage user roles, configure departments &amp; courses, audit compliance logs, and oversee global system settings.
          </p>
        </div>
      </div>

      {adminNotice && (
        <div className="admin-action-notice animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* Admin KPI Overview */}
      <div className="admin-stats-grid">
        <div className="stat-card white-card">
          <div className="stat-header">
            <span className="stat-title">Total Registered Users</span>
            <div className="stat-icon-box stat-blue">
              <Users size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number">{userList.length + 895}+</span>
            <span className="stat-pill pill-neutral">Across 3 Depts</span>
          </div>
          <span className="stat-hint">Students, Faculty &amp; Staff</span>
        </div>

        <div className="stat-card white-card">
          <div className="stat-header">
            <span className="stat-title">Active Deadlines Tracked</span>
            <div className="stat-icon-box stat-green">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number text-success">{deadlines.length}</span>
            <span className="stat-pill pill-success">Spring Boot / MySQL</span>
          </div>
          <span className="stat-hint">Automatic Date Status Logic</span>
        </div>

        <div className="stat-card white-card">
          <div className="stat-header">
            <span className="stat-title">Career Programs</span>
            <div className="stat-icon-box stat-purple">
              <Building2 size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number">{opportunities.length}</span>
            <span className="stat-pill pill-purple">Verified Active</span>
          </div>
          <span className="stat-hint">Internships &amp; Hackathons</span>
        </div>
      </div>

      {/* Admin Subtabs Bar */}
      <div className="admin-tabs-card white-card">
        <div className="admin-tabs-list">
          <button 
            className={`admin-tab-btn ${activeAdminTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('users')}
          >
            <Users size={15} />
            <span>User &amp; Role Management</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeAdminTab === 'depts' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('depts')}
          >
            <Building2 size={15} />
            <span>Departments &amp; Courses</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeAdminTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('audit')}
          >
            <FileText size={15} />
            <span>System Audit Reports</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeAdminTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('settings')}
          >
            <Settings size={15} />
            <span>System Settings</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeAdminTab === 'users' && (
        <div className="admin-tab-panel white-card">
          <div className="panel-header-flex">
            <div>
              <h3>User Directory &amp; Role Assignments</h3>
              <p>Authorize roles: STUDENT, FACULTY, COORDINATOR, DEAN, or ADMINISTRATOR</p>
            </div>
            <button className="btn-primary btn-sm" onClick={() => setIsAddUserModalOpen(true)}>
              <UserPlus size={14} />
              <span>Provision User</span>
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Assigned Role</th>
                  <th>Account Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userList.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className="dept-tag">{u.dept}</span></td>
                    <td>
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`role-select role-select-${u.role.toLowerCase()}`}
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="FACULTY">FACULTY</option>
                        <option value="COORDINATOR">COORDINATOR</option>
                        <option value="DEAN">DEAN</option>
                        <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status-pill ${u.status === 'ACTIVE' ? 'pill-success' : 'pill-danger'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-ghost" 
                        onClick={() => handleToggleStatus(u.id)}
                        title="Toggle active status"
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminTab === 'depts' && (
        <div className="admin-tab-panel white-card">
          <div className="panel-header-flex">
            <div>
              <h3>Academic Departments &amp; Enrolled Courses</h3>
              <p>Institutional structure and curriculum assignment</p>
            </div>
          </div>

          <div className="depts-grid">
            {departments.map(d => (
              <div key={d.id} className="dept-card">
                <div className="dept-card-top">
                  <span className="dept-code-badge">{d.code}</span>
                  <h4>{d.name}</h4>
                </div>
                <div className="dept-metrics-row">
                  <div className="metric-box">
                    <span>Courses</span>
                    <strong>{d.coursesCount}</strong>
                  </div>
                  <div className="metric-box">
                    <span>Enrolled Students</span>
                    <strong>{d.studentCount}</strong>
                  </div>
                  <div className="metric-box">
                    <span>Faculty</span>
                    <strong>{d.facultyCount}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAdminTab === 'audit' && (
        <div className="admin-tab-panel white-card">
          <div className="panel-header-flex">
            <div>
              <h3>System Audit Compliance Logs</h3>
              <p>Real-time security and operations ledger for Spring Boot application events</p>
            </div>
            <button className="btn-secondary btn-sm" onClick={handleExportAuditLogs}>
              <Download size={14} />
              <span>Export Audit Ledger</span>
            </button>
          </div>

          <div className="audit-log-stack">
            {SYSTEM_AUDIT_LOGS.map(log => (
              <div key={log.id} className="audit-row">
                <div className="audit-action-tag">{log.action}</div>
                <div className="audit-details-box">
                  <strong>{log.details}</strong>
                  <small>Initiated by {log.user}</small>
                </div>
                <span className="audit-time">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAdminTab === 'settings' && (
        <div className="admin-tab-panel white-card">
          <div className="panel-header-flex">
            <div>
              <h3>System Settings &amp; Deadlines Configuration</h3>
              <p>Configure automatic Java date/time thresholds and database persistence</p>
            </div>
            <button className="btn-primary btn-sm" onClick={handleSaveSettings}>
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="settings-grid">
            <div className="setting-tile">
              <strong>Due Soon Urgency Window</strong>
              <p>Deadlines due within this threshold automatically advance to DUE_SOON.</p>
              <select 
                value={urgencyHours} 
                onChange={(e) => setUrgencyHours(e.target.value)} 
                className="form-select"
              >
                <option value="2">48 Hours (2 Days)</option>
                <option value="3">72 Hours (3 Days - Default)</option>
                <option value="5">120 Hours (5 Days)</option>
              </select>
            </div>

            <div className="setting-tile">
              <strong>Overdue Cutoff Logic</strong>
              <p>Automatically mark unsubmitted deliverables as OVERDUE at 23:59:59 on the due date.</p>
              <input 
                type="checkbox" 
                checked={autoOverdue} 
                onChange={(e) => setAutoOverdue(e.target.checked)} 
                className="pref-toggle" 
              />
            </div>

            <div className="setting-tile">
              <strong>MySQL Relational Auto-DDL</strong>
              <p>Hibernate spring.jpa.hibernate.ddl-auto mode.</p>
              <select 
                value={autoDdlMode}
                onChange={(e) => setAutoDdlMode(e.target.value)}
                className="form-select"
              >
                <option value="update">update (Safe schema synchronization)</option>
                <option value="validate">validate (Read-only check)</option>
                <option value="none">none (Manual migrations)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Provision User Modal */}
      {isAddUserModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsAddUserModalOpen(false)}>
          <div className="modal-dialog provision-modal white-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>Provision New Institutional Account</h3>
                <p>Register a verified student, faculty member, or staff</p>
              </div>
              <button className="btn-ghost modal-close-btn" onClick={() => setIsAddUserModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Institutional Email Address *</label>
                <input 
                  type="email" 
                  placeholder="e.g. rkumar@univ.edu"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Department</label>
                  <select 
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    className="form-select"
                  >
                    <option value="CSE">Computer Science &amp; Engineering</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics &amp; Communication</option>
                    <option value="Career Cell">Career Development Cell</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Authorized Role</label>
                  <select 
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="form-select"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="FACULTY">FACULTY</option>
                    <option value="COORDINATOR">COORDINATOR</option>
                    <option value="DEAN">DEAN</option>
                    <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-secondary" onClick={() => setIsAddUserModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={16} />
                  <span>Authorize &amp; Provision</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-view-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.75rem 0 3rem 0;
        }

        .admin-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .admin-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
        }

        .admin-header-row h2 {
          font-size: 1.625rem;
          margin-bottom: 0.25rem;
        }

        .admin-sub {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .admin-action-notice {
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
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        /* Tabs Card */
        .admin-tabs-card {
          padding: 0.5rem;
          background: #ffffff;
        }

        .admin-tabs-list {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
        }

        .admin-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          font-size: 0.8125rem;
          font-weight: 600;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .admin-tab-btn:hover {
          color: var(--text-main);
          background: var(--bg-app);
        }

        .admin-tab-btn.active {
          color: var(--primary);
          background: var(--primary-light);
          border-color: var(--primary-border);
          font-weight: 700;
        }

        /* Panels */
        .admin-tab-panel {
          padding: 1.5rem;
          background: #ffffff;
        }

        .panel-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .panel-header-flex h3 {
          font-size: 1.125rem;
          margin-bottom: 0.125rem;
        }

        .panel-header-flex p {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        /* Table */
        .admin-table-wrapper {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
        }

        .admin-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          font-size: 0.6875rem;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--surface-border);
        }

        .admin-table td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid var(--surface-border-subtle);
          vertical-align: middle;
        }

        .dept-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-sm);
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          color: var(--text-secondary);
        }

        .role-select {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: var(--radius-sm);
          border: 1px solid var(--surface-border);
          outline: none;
          cursor: pointer;
        }

        .role-select-student { color: #0284c7; background: #e0f2fe; }
        .role-select-faculty { color: #d97706; background: #fef3c7; }
        .role-select-coordinator { color: #7c3aed; background: #ede9fe; }
        .role-select-administrator { color: #059669; background: #d1fae5; }

        .btn-sm {
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          gap: 0.35rem;
        }

        /* Depts */
        .depts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .dept-card {
          padding: 1.25rem;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
        }

        .dept-card-top {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 1rem;
        }

        .dept-code-badge {
          font-size: 0.6875rem;
          font-weight: 800;
          color: var(--primary);
          background: var(--primary-light);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .dept-card-top h4 {
          font-size: 0.9375rem;
          font-weight: 700;
        }

        .dept-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          text-align: center;
          padding-top: 0.75rem;
          border-top: 1px solid var(--surface-border-subtle);
        }

        .metric-box {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-box span {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .metric-box strong {
          font-size: 0.9375rem;
          color: var(--text-main);
        }

        /* Audit Logs */
        .audit-log-stack {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .audit-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
        }

        .audit-action-tag {
          font-size: 0.6875rem;
          font-weight: 800;
          color: var(--primary);
          background: var(--primary-light);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          min-width: 140px;
          text-align: center;
        }

        .audit-details-box {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .audit-details-box strong {
          font-size: 0.8125rem;
          color: var(--text-main);
        }

        .audit-details-box small {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .audit-time {
          font-size: 0.75rem;
          color: var(--text-subtle);
        }

        /* Settings */
        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .setting-tile {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding: 1rem;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
        }

        .setting-tile strong {
          font-size: 0.875rem;
        }

        .setting-tile p {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Provision Modal */
        .provision-modal {
          max-width: 540px;
          width: 95%;
          padding: 1.5rem;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .modal-actions-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--surface-border);
        }

        @media (max-width: 900px) {
          .admin-stats-grid, .depts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
