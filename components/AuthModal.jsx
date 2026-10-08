import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Shield, 
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Hash,
  PhoneCall
} from 'lucide-react';
import { ACADEMIC_SEMESTERS } from '../data/mockData';
import { loginWithBackend, registerWithBackend } from '../data/authApi';

export default function AuthModal({ isOpen, onClose, onLoginUser }) {
  const [authMode, setAuthMode] = useState('login'); // When switching user, login is common, but can register
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Student
    rollNumber: '',
    department: 'Computer Science & Engineering',
    semester: ACADEMIC_SEMESTERS[5],
    section: 'CSE 3-1 Section A',
    // Faculty
    facultyId: '',
    facultyDesignation: 'Associate Professor',
    facultyCourses: 'CS301 - Operating Systems',
    // Coordinator
    coordinatorId: '',
    coordinatorCell: 'Career Development Center (CDC)',
    coordinatorPhone: '+91 98765 43210',
    // Dean
    deanId: '',
    deanDivision: 'Office of the Dean',
    // Admin
    adminId: '',
    adminDivision: 'Office of Academic Affairs',
    adminClearanceCode: 'ACAD-GOV-2026'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const emailTrimmed = formData.email.toLowerCase().trim();
    if (!emailTrimmed) {
      setErrorMessage('Please enter an institutional email.');
      return;
    }

    if (authMode === 'register') {
      if (!formData.name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (formData.password.length < 6) {
        setErrorMessage('Password must be at least 6 characters for safety.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }

      if (selectedRole === 'STUDENT' && !formData.rollNumber.trim()) {
        setErrorMessage('Please enter your student Roll Number.');
        return;
      }
      if (selectedRole === 'FACULTY' && !formData.facultyId.trim()) {
        setErrorMessage('Please enter your Faculty ID.');
        return;
      }
      if (selectedRole === 'COORDINATOR' && !formData.coordinatorId.trim()) {
        setErrorMessage('Please enter your Coordinator ID.');
        return;
      }
      if (selectedRole === 'DEAN' && !formData.deanId.trim()) {
        setErrorMessage('Please enter your Dean ID.');
        return;
      }
      if (selectedRole === 'ADMINISTRATOR' && !formData.adminId.trim()) {
        setErrorMessage('Please enter your Administrator ID.');
        return;
      }

      const newUser = {
        name: formData.name.trim(),
        email: emailTrimmed,
        password: formData.password,
        role: selectedRole,
        department: selectedRole === 'STUDENT' ? formData.department :
                   (selectedRole === 'FACULTY' ? formData.department : 
                   (selectedRole === 'COORDINATOR' ? formData.coordinatorCell :
                   (selectedRole === 'DEAN' ? formData.deanDivision : formData.adminDivision))),
        section: selectedRole === 'STUDENT' ? formData.section : undefined,
        rollNumber: selectedRole === 'STUDENT' ? formData.rollNumber.trim() : undefined,
        semester: selectedRole === 'STUDENT' ? formData.semester : undefined,
        batch: selectedRole === 'STUDENT' ? '2023 - 2027' : undefined,
        cgpa: selectedRole === 'STUDENT' ? '8.90' : undefined,
        facultyId: selectedRole === 'FACULTY' ? formData.facultyId.trim() : undefined,
        facultyDesignation: selectedRole === 'FACULTY' ? formData.facultyDesignation : undefined,
        courses: selectedRole === 'FACULTY' ? [formData.facultyCourses] : undefined,
        coordinatorId: selectedRole === 'COORDINATOR' ? formData.coordinatorId.trim() : undefined,
        deanId: selectedRole === 'DEAN' ? formData.deanId.trim() : undefined,
        adminId: selectedRole === 'ADMINISTRATOR' ? formData.adminId.trim() : undefined,
        avatar: formData.name.trim().substring(0, 2).toUpperCase()
      };

      setIsSubmitting(true);
      try {
        await registerWithBackend(newUser);
        setSuccessMessage(`Account registered for ${newUser.name} (${newUser.role})! Please sign in with your credentials.`);
        setAuthMode('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Login mode
    if (!formData.password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const authenticatedUser = await loginWithBackend(emailTrimmed, formData.password);
      onLoginUser(authenticatedUser);
      onClose();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-dialog white-card auth-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3>Institutional User Portal</h3>
              <p>Sign in with your registered credentials or register a role-based account</p>
            </div>
          </div>
          <button className="btn-ghost modal-close-btn" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="auth-modal-tabs">
          <button 
            type="button"
            className={`auth-mini-tab ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            Sign In With Credentials
          </button>
          <button 
            type="button"
            className={`auth-mini-tab ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => { setAuthMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            Register New Account
          </button>
        </div>

        {/* Feedback messages */}
        {errorMessage && (
          <div className="auth-alert alert-error">
            <AlertCircle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-alert alert-success">
            <CheckCircle2 size={14} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {authMode === 'register' && (
            <>
              <div className="role-selector-row">
                <label>Select Your Institutional Role *</label>
                <div className="role-pills-cluster">
                  {[
                    { id: 'STUDENT', label: 'Student', icon: GraduationCap },
                    { id: 'FACULTY', label: 'Faculty', icon: BookOpen },
                    { id: 'COORDINATOR', label: 'Coordinator', icon: Briefcase },
                    { id: 'DEAN', label: 'Dean', icon: GraduationCap },
                    { id: 'ADMINISTRATOR', label: 'Administrator', icon: Shield }
                  ].map(r => {
                    const Icon = r.icon;
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        className={`role-select-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedRole(r.id)}
                      >
                        <Icon size={12} />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-with-icon">
                  <User size={14} className="field-icon" />
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Sai Jayanth"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Role-Specific fields in modal */}
              <div className="modal-role-box">
                {selectedRole === 'STUDENT' && (
                  <>
                  <div className="form-row-dual">
                    <div className="form-group">
                      <label>Student ID / Roll Number *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter your student ID"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Section</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Section A"
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Current Semester *</label>
                    <select
                      required
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="form-input"
                    >
                      {ACADEMIC_SEMESTERS.map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>
                  </>
                )}

                {selectedRole === 'FACULTY' && (
                  <div className="form-row-dual">
                    <div className="form-group">
                      <label>Faculty ID Number *</label>
                      <input 
                        type="text" 
                        required
                        autoComplete="off"
                        placeholder="Enter your institutional faculty ID"
                        value={formData.facultyId}
                        onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Designation</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Associate Professor"
                        value={formData.facultyDesignation}
                        onChange={(e) => setFormData({ ...formData, facultyDesignation: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'COORDINATOR' && (
                  <div className="form-row-dual">
                    <div className="form-group">
                      <label>Coordinator ID *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. COORD-CDC-01"
                        value={formData.coordinatorId}
                        onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Office Ext</label>
                      <input 
                        type="text" 
                        placeholder="e.g. +91 98765 43210"
                        value={formData.coordinatorPhone}
                        onChange={(e) => setFormData({ ...formData, coordinatorPhone: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'ADMINISTRATOR' && (
                  <div className="form-row-dual">
                    <div className="form-group">
                      <label>Administrator ID *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. ADM-SEC-01"
                        value={formData.adminId}
                        onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Security Clearance Code *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. ACAD-GOV-2026"
                        value={formData.adminClearanceCode}
                        onChange={(e) => setFormData({ ...formData, adminClearanceCode: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}
                {selectedRole === 'DEAN' && (
                  <div className="form-row-dual">
                    <div className="form-group">
                      <label>Dean ID *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DEAN-ACADEMIC-01"
                        value={formData.deanId}
                        onChange={(e) => setFormData({ ...formData, deanId: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Office</label>
                      <input
                        type="text"
                        value={formData.deanDivision}
                        onChange={(e) => setFormData({ ...formData, deanDivision: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="form-group">
            <label>Institutional Email *</label>
            <div className="input-with-icon">
              <Mail size={14} className="field-icon" />
              <input 
                type="email" 
                required 
                placeholder="e.g. user@univ.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password * (min 6 chars)</label>
            <div className="input-with-eye">
              <input 
                type={showPassword ? "text" : "password"}
                required 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
              />
              <button 
                type="button" 
                className="btn-eye" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {authMode === 'register' && (
            <div className="form-group">
              <label>Confirm Password *</label>
              <div className="input-with-eye">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  required 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="form-input"
                />
                <button 
                  type="button" 
                  className="btn-eye" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          <div className="auth-footer-actions">
            <button 
              type="button" 
              className="btn-ghost toggle-auth-mode"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
            >
              {authMode === 'login' ? "Need to register first? Click here" : "Already registered? Sign In"}
            </button>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Please wait...' : (authMode === 'login' ? 'Authenticate & Sign In' : 'Register Account')}</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </form>

        {authMode === 'login' && (
          <div className="modal-notice-card">
            <span>Evaluation Reference: Default demo accounts: <code>saijayanth@univ.edu</code>, <code>faculty@deadlineiq.com</code>, <code>coordinator@deadlineiq.com</code>, <code>admin@deadlineiq.com</code> • Password: <code>password123</code>.</span>
          </div>
        )}
      </div>

      <style>{`
        .auth-modal-dialog {
          max-width: 480px;
          padding: 1.5rem;
        }

        .auth-modal-tabs {
          display: flex;
          background: #f1f5f9;
          padding: 0.2rem;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          gap: 0.25rem;
        }

        .auth-mini-tab {
          flex: 1;
          padding: 0.45rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .auth-mini-tab.active {
          background: #ffffff;
          color: #0c325c;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
        }

        .auth-alert {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          margin-bottom: 0.875rem;
        }

        .alert-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        .alert-success {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .form-group label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 0.45rem 0.65rem 0.45rem 2rem;
          font-size: 0.8125rem;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          outline: none;
          box-sizing: border-box;
        }

        .form-input:focus {
          border-color: #0284c7;
        }

        .input-with-eye {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-eye input {
          width: 100%;
          padding: 0.45rem 2rem 0.45rem 0.65rem;
          font-size: 0.8125rem;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          outline: none;
          box-sizing: border-box;
        }

        .input-with-eye input:focus {
          border-color: #0284c7;
        }

        .btn-eye {
          position: absolute;
          right: 0.6rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .role-selector-row {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .role-selector-row label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .role-pills-cluster {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.3rem;
        }

        .role-select-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          padding: 0.35rem 0.25rem;
          font-size: 0.6875rem;
          font-weight: 700;
          border-radius: var(--radius-md);
          border: 1px solid var(--surface-border);
          background: var(--bg-sky-light);
          color: var(--text-secondary);
          cursor: pointer;
        }

        .role-select-chip.active {
          background: #0284c7;
          color: #ffffff;
          border-color: #0284c7;
        }

        .modal-role-box {
          background: var(--bg-sky-light);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          padding: 0.625rem 0.75rem;
        }

        .modal-role-box .form-input {
          padding-left: 0.65rem;
        }

        .form-row-dual {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .auth-footer-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--surface-border);
          margin-top: 0.25rem;
        }

        .toggle-auth-mode {
          font-size: 0.72rem;
          color: #0284c7;
        }

        .modal-notice-card {
          margin-top: 0.75rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--surface-border);
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .modal-notice-card code {
          background: #e2e8f0;
          padding: 0.05rem 0.3rem;
          border-radius: 3px;
          color: #0f172a;
        }

        @media (max-width: 480px) {
          .role-pills-cluster {
            grid-template-columns: repeat(2, 1fr);
          }
          .form-row-dual {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
