import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  GraduationCap,
  Briefcase,
  BookOpen,
  Shield,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { ACADEMIC_SEMESTERS, DEMO_USERS } from '../data/mockData';
import { loginWithBackend, registerWithBackend } from '../data/authApi';

export default function AuthGate({ 
  onLoginSuccess, 
  initialMode = 'login', 
  redirectPath = null, 
  onNavigateHome = null 
}) {
  const [activeTab, setActiveTab] = useState(initialMode || 'login');

  useEffect(() => {
    if (initialMode) {
      setActiveTab(initialMode);
    }
  }, [initialMode]);

  // Registration Form State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    password: '',
    confirmPassword: '',
    // Student
    rollNumber: '',
    department: 'Computer Science & Engineering',
    semester: ACADEMIC_SEMESTERS[5],
    section: 'CSE 3-1 Section A',
    cgpa: '8.94',
    // Faculty
    facultyId: '',
    facultyDesignation: 'Associate Professor',
    facultyCourses: 'CS301 - Operating Systems, CS302 - OS Lab',
    // Coordinator
    coordinatorId: '',
    coordinatorCell: 'Career Development Center (CDC)',
    deanId: '',
    deanDivision: 'Office of the Dean',
    // Administrator
    adminId: '',
    adminDivision: 'Office of Academic Affairs',
    agreeTerms: true
  });

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!regData.email.trim() || !regData.email.includes('@')) {
      setErrorMessage('Please enter a valid institutional email address.');
      return;
    }
    if (regData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (regData.password !== regData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (regData.role === 'STUDENT' && !regData.rollNumber.trim()) {
      setErrorMessage('Please enter your Student Roll Number / ID.');
      return;
    }
    if (regData.role === 'FACULTY' && !regData.facultyId.trim()) {
      setErrorMessage('Please enter your Faculty ID.');
      return;
    }
    if (regData.role === 'COORDINATOR' && !regData.coordinatorId.trim()) {
      setErrorMessage('Please enter your Coordinator ID.');
      return;
    }
    if (regData.role === 'DEAN' && !regData.deanId.trim()) {
      setErrorMessage('Please enter your Dean ID.');
      return;
    }
    if (regData.role === 'ADMINISTRATOR' && !regData.adminId.trim()) {
      setErrorMessage('Please enter your Administrator ID.');
      return;
    }

    const newUser = {
      name: regData.name.trim(),
      email: regData.email.toLowerCase().trim(),
      password: regData.password,
      role: regData.role,
      department: regData.role === 'STUDENT' ? regData.department : 
                 (regData.role === 'FACULTY' ? regData.department : 
                 (regData.role === 'COORDINATOR' ? regData.coordinatorCell :
                 (regData.role === 'DEAN' ? regData.deanDivision : regData.adminDivision))),
      section: regData.role === 'STUDENT' ? regData.section : undefined,
      rollNumber: regData.role === 'STUDENT' ? regData.rollNumber.trim() : undefined,
      semester: regData.role === 'STUDENT' ? regData.semester : undefined,
      cgpa: regData.role === 'STUDENT' ? (regData.cgpa || '8.90') : undefined,
      facultyId: regData.role === 'FACULTY' ? regData.facultyId.trim() : undefined,
      courses: regData.role === 'FACULTY' ? [regData.facultyCourses] : undefined,
      coordinatorId: regData.role === 'COORDINATOR' ? regData.coordinatorId.trim() : undefined,
      deanId: regData.role === 'DEAN' ? regData.deanId.trim() : undefined,
      adminId: regData.role === 'ADMINISTRATOR' ? regData.adminId.trim() : undefined
    };

    setIsSubmitting(true);
    try {
      await registerWithBackend(newUser);
      setSuccessMessage(`Account registered for ${newUser.name}! Please sign in below.`);
      setLoginData({
        email: newUser.email,
        password: '',
        rememberMe: true
      });
      setActiveTab('login');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const emailTrimmed = loginData.email.toLowerCase().trim();
    if (!emailTrimmed) {
      setErrorMessage('Please enter your institutional email.');
      return;
    }
    if (!loginData.password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const authenticatedUser = await loginWithBackend(emailTrimmed, loginData.password);
      onLoginSuccess(authenticatedUser, redirectPath);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    const demoUser = DEMO_USERS[demoRole] || DEMO_USERS.STUDENT;
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const authenticatedUser = await loginWithBackend(demoUser.email, demoUser.password);
      onLoginSuccess(authenticatedUser, redirectPath);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      setIsForgotModalOpen(false);
      setForgotSubmitted(false);
      setForgotEmail('');
      setSuccessMessage('Password recovery link sent to your institutional email.');
    }, 1800);
  };

  return (
    <div className="auth-clean-page animate-fade-in">
      <div className="auth-clean-card white-card">
        {/* Top Link */}
        {onNavigateHome && (
          <div className="auth-top-nav">
            <button 
              type="button"
              onClick={onNavigateHome} 
              className="back-home-btn"
            >
              <span>← Back to DeadlineIQ Home</span>
            </button>
          </div>
        )}

        {/* Brand & Heading */}
        <div className="auth-header-clean">
          <div className="brand-logo-clean" onClick={onNavigateHome} style={{ cursor: onNavigateHome ? 'pointer' : 'default' }}>
            deadline<span className="brand-accent">IQ</span>
          </div>
          <h2>{activeTab === 'login' ? 'Sign in to your account' : 'Create institutional account'}</h2>
          <p className="auth-sub-clean">
            {activeTab === 'login' 
              ? 'Enter your institutional email or use instant demo access below.' 
              : 'Join as a student, faculty member, placement coordinator, or admin.'}
          </p>
        </div>

        {/* Redirect Notice */}
        {redirectPath && (
          <div className="redirect-notice-pill">
            <Lock size={13} />
            <span>Please sign in to access <strong>{redirectPath}</strong></span>
          </div>
        )}

        {/* Single, Clean, Elegant Tab Switcher (No Stuffed Micro-Buttons!) */}
        <div className="modern-auth-tabs">
          <button 
            type="button" 
            className={`tab-btn-clean ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`tab-btn-clean ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            Register
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="clean-alert alert-error">
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="clean-alert alert-success">
            <CheckCircle2 size={15} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* =========================================================
            TAB 1: SIGN IN FORM
            ========================================================= */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="clean-form">
            <div className="form-field-group">
              <label className="field-lbl">Institutional Email</label>
              <div className="input-wrap">
                <Mail size={15} className="input-icon" />
                <input 
                  type="email" 
                  required 
                  placeholder="e.g. saijayanth@univ.edu"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="input-box"
                />
              </div>
            </div>

            <div className="form-field-group">
              <div className="lbl-row-split">
                <label className="field-lbl">Password</label>
                <button 
                  type="button" 
                  className="forgot-link"
                  onClick={() => setIsForgotModalOpen(true)}
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-wrap">
                <Lock size={15} className="input-icon" />
                <input 
                  type={showLoginPassword ? "text" : "password"}
                  required 
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="input-box"
                />
                <button 
                  type="button" 
                  className="eye-toggle-btn" 
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  tabIndex={-1}
                >
                  {showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary clean-submit-btn" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight size={15} />
            </button>

            {/* Instant Demo Personas (1-Click Access) */}
            <div className="demo-divider-clean">
              <span>Or explore instantly as a demo persona:</span>
            </div>

            <div className="demo-chips-row">
              <button 
                type="button" 
                onClick={() => handleDemoLogin('STUDENT')} 
                className="demo-chip-btn student"
                disabled={isSubmitting}
                title="Sign in as Sai Jayanth (Semester 6 CSE Student)"
              >
                <GraduationCap size={13} />
                <span>Student</span>
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('FACULTY')} 
                className="demo-chip-btn faculty"
                disabled={isSubmitting}
                title="Sign in as Dr. R. Sharma (Associate Professor)"
              >
                <BookOpen size={13} />
                <span>Faculty</span>
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('COORDINATOR')} 
                className="demo-chip-btn coord"
                disabled={isSubmitting}
                title="Sign in as Prof. S. Verma (Placement Coordinator)"
              >
                <Briefcase size={13} />
                <span>Placement</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('DEAN')}
                className="demo-chip-btn dean"
                disabled={isSubmitting}
                title="Sign in as Dr. A. Menon (Academic Dean)"
              >
                <GraduationCap size={13} />
                <span>Dean</span>
              </button>
              <button 
                type="button" 
                onClick={() => handleDemoLogin('ADMINISTRATOR')} 
                className="demo-chip-btn admin"
                disabled={isSubmitting}
                title="Sign in as Dr. A. Menon (Academic Dean / Admin)"
              >
                <ShieldCheck size={13} />
                <span>Admin</span>
              </button>
            </div>

            <div className="form-toggle-footer">
              <span>New to DeadlineIQ?</span>
              <button 
                type="button" 
                className="switch-link-text"
                onClick={() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
              >
                Create your account here →
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            TAB 2: REGISTRATION FORM
            ========================================================= */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="clean-form">
            {/* Clean Dropdown for Role (NO stuffed micro-buttons!) */}
            <div className="form-field-group">
              <label className="field-lbl">Institutional Role *</label>
              <select 
                value={regData.role}
                onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                className="select-box-clean"
              >
                <option value="STUDENT">🎓 Student (Assignments, Deadlines &amp; Placements)</option>
                <option value="FACULTY">📚 Faculty (Course Management &amp; Lab Briefs)</option>
                <option value="COORDINATOR">💼 Placement Coordinator (CDC Drives &amp; Candidates)</option>
                <option value="DEAN">🎓 Dean (Institutional Academic Oversight)</option>
                <option value="ADMINISTRATOR">🛡️ Administrator (Academic Governance)</option>
              </select>
            </div>

            <div className="form-row-2col">
              <div className="form-field-group">
                <label className="field-lbl">Full Name *</label>
                <div className="input-wrap">
                  <User size={15} className="input-icon" />
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Sai Jayanth"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    className="input-box"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-lbl">Institutional Email *</label>
                <div className="input-wrap">
                  <Mail size={15} className="input-icon" />
                  <input 
                    type="email" 
                    required 
                    placeholder="e.g. name@univ.edu"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="input-box"
                  />
                </div>
              </div>
            </div>

            {/* Role-Specific Fields (Rendered cleanly without heavy blue boxes) */}
            {regData.role === 'STUDENT' && (
              <div className="role-sub-card">
                <span className="sub-card-lbl">Student Academic Profile</span>
                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label className="field-lbl">Roll Number / Student ID *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. 22BCE1042"
                      value={regData.rollNumber}
                      onChange={(e) => setRegData({ ...regData, rollNumber: e.target.value })}
                      className="input-box"
                    />
                  </div>
                  <div className="form-field-group">
                    <label className="field-lbl">Current Term</label>
                    <select 
                      value={regData.semester} 
                      onChange={(e) => setRegData({ ...regData, semester: e.target.value })}
                      className="select-box-clean"
                    >
                      {ACADEMIC_SEMESTERS.map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {regData.role === 'FACULTY' && (
              <div className="role-sub-card">
                <span className="sub-card-lbl">Faculty Profile</span>
                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label className="field-lbl">Faculty ID Number *</label>
                    <input 
                      type="text" 
                      required
                      autoComplete="off"
                      placeholder="Enter your institutional faculty ID"
                      value={regData.facultyId}
                      onChange={(e) => setRegData({ ...regData, facultyId: e.target.value })}
                      className="input-box"
                    />
                  </div>
                  <div className="form-field-group">
                    <label className="field-lbl">Designation</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Associate Professor"
                      value={regData.facultyDesignation}
                      onChange={(e) => setRegData({ ...regData, facultyDesignation: e.target.value })}
                      className="input-box"
                    />
                  </div>
                </div>
              </div>
            )}

            {regData.role === 'COORDINATOR' && (
              <div className="role-sub-card">
                <span className="sub-card-lbl">Placement Coordinator Profile</span>
                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label className="field-lbl">Coordinator ID *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. CDC-COORD-101"
                      value={regData.coordinatorId}
                      onChange={(e) => setRegData({ ...regData, coordinatorId: e.target.value })}
                      className="input-box"
                    />
                  </div>
                  <div className="form-field-group">
                    <label className="field-lbl">Placement Cell</label>
                    <input 
                      type="text" 
                      value={regData.coordinatorCell}
                      onChange={(e) => setRegData({ ...regData, coordinatorCell: e.target.value })}
                      className="input-box"
                    />
                  </div>
                </div>
              </div>
            )}

            {regData.role === 'DEAN' && (
              <div className="role-sub-card">
                <span className="sub-card-lbl">Dean's Office Profile</span>
                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label className="field-lbl">Dean ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DEAN-ACADEMIC-01"
                      value={regData.deanId}
                      onChange={(e) => setRegData({ ...regData, deanId: e.target.value })}
                      className="input-box"
                    />
                  </div>
                  <div className="form-field-group">
                    <label className="field-lbl">Office</label>
                    <input
                      type="text"
                      value={regData.deanDivision}
                      onChange={(e) => setRegData({ ...regData, deanDivision: e.target.value })}
                      className="input-box"
                    />
                  </div>
                </div>
              </div>
            )}

            {regData.role === 'ADMINISTRATOR' && (
              <div className="role-sub-card">
                <span className="sub-card-lbl">Administrator Clearance</span>
                <div className="form-row-2col">
                  <div className="form-field-group">
                    <label className="field-lbl">Admin ID *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. ADM-TIER1-01"
                      value={regData.adminId}
                      onChange={(e) => setRegData({ ...regData, adminId: e.target.value })}
                      className="input-box"
                    />
                  </div>
                  <div className="form-field-group">
                    <label className="field-lbl">Division</label>
                    <input 
                      type="text" 
                      value={regData.adminDivision}
                      onChange={(e) => setRegData({ ...regData, adminDivision: e.target.value })}
                      className="input-box"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Passwords */}
            <div className="form-row-2col">
              <div className="form-field-group">
                <label className="field-lbl">Password *</label>
                <div className="input-wrap">
                  <Lock size={15} className="input-icon" />
                  <input 
                    type={showRegPassword ? "text" : "password"}
                    required 
                    placeholder="Min 6 chars"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="input-box"
                  />
                  <button 
                    type="button" 
                    className="eye-toggle-btn" 
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    tabIndex={-1}
                  >
                    {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-lbl">Confirm Password *</label>
                <div className="input-wrap">
                  <Lock size={15} className="input-icon" />
                  <input 
                    type={showRegPassword ? "text" : "password"}
                    required 
                    placeholder="Repeat password"
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    className="input-box"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary clean-submit-btn" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Creating account...' : 'Complete Registration'}</span>
              <ArrowRight size={15} />
            </button>

            <div className="form-toggle-footer">
              <span>Already registered?</span>
              <button 
                type="button" 
                className="switch-link-text"
                onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
              >
                Sign In directly →
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsForgotModalOpen(false)}>
          <div className="modal-dialog forgot-dialog white-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <Lock size={18} />
                </div>
                <div>
                  <h3>Reset Your Password</h3>
                  <p>Enter your institutional email to receive recovery instructions</p>
                </div>
              </div>
              <button className="btn-ghost modal-close-btn" onClick={() => setIsForgotModalOpen(false)}>
                <X size={15} />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="forgot-success-box">
                <CheckCircle2 size={32} className="text-green" />
                <h4>Verification Email Sent</h4>
                <p>We've sent a password reset link to <strong>{forgotEmail}</strong>.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="clean-form">
                <div className="form-field-group">
                  <label className="field-lbl">Institutional Email</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="e.g. name@univ.edu"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="input-box"
                  />
                </div>
                <div className="modal-footer" style={{ marginTop: '1rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsForgotModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <Send size={14} />
                    <span>Send Reset Link</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modern, Clean, Spacious Component CSS */}
      <style>{`
        .auth-clean-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1rem;
          background: #f8fafc;
        }

        .auth-clean-card {
          width: 100%;
          max-width: 520px;
          padding: 2.25rem 2.5rem;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 16px 36px -5px rgba(15, 23, 42, 0.08);
          box-sizing: border-box;
        }

        .auth-top-nav {
          margin-bottom: 1.25rem;
        }

        .back-home-btn {
          background: none;
          border: none;
          font-size: 0.8125rem;
          color: #64748b;
          cursor: pointer;
          padding: 0;
          font-weight: 500;
          transition: color 0.15s;
        }

        .back-home-btn:hover {
          color: #2563eb;
        }

        .auth-header-clean {
          margin-bottom: 1.5rem;
        }

        .brand-logo-clean {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-bottom: 0.5rem;
        }

        .brand-accent {
          color: #2563eb;
        }

        .auth-header-clean h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.25rem 0;
        }

        .auth-sub-clean {
          font-size: 0.84rem;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .redirect-notice-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.85rem;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          font-size: 0.8125rem;
          color: #1e40af;
          margin-bottom: 1.25rem;
        }

        /* Modern, Clean Tabs (NO STUFFED BUTTONS!) */
        .modern-auth-tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 1.5rem;
          gap: 1.5rem;
        }

        .tab-btn-clean {
          background: none;
          border: none;
          padding: 0.5rem 0.25rem 0.75rem 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          position: relative;
          transition: color 0.15s;
        }

        .tab-btn-clean:hover {
          color: #0f172a;
        }

        .tab-btn-clean.active {
          color: #2563eb;
        }

        .tab-btn-clean.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #2563eb;
          border-radius: 2px;
        }

        /* Form */
        .clean-form {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .field-lbl {
          font-size: 0.78rem;
          font-weight: 600;
          color: #334155;
        }

        .lbl-row-split {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-link {
          background: none;
          border: none;
          color: #2563eb;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.75rem;
          color: #94a3b8;
          pointer-events: none;
        }

        .input-box {
          width: 100%;
          padding: 0.55rem 0.75rem 0.55rem 2.2rem;
          font-size: 0.875rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #ffffff;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }

        .input-box:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .select-box-clean {
          width: 100%;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #ffffff;
          color: #0f172a;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }

        .select-box-clean:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .eye-toggle-btn {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
        }

        .eye-toggle-btn:hover {
          color: #334155;
        }

        .form-row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        .role-sub-card {
          padding: 0.85rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .sub-card-lbl {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          display: block;
          margin-bottom: 0.65rem;
        }

        .clean-submit-btn {
          width: 100%;
          justify-content: center;
          padding: 0.65rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 8px;
          margin-top: 0.25rem;
        }

        /* Demo Divider & Chips */
        .demo-divider-clean {
          text-align: center;
          position: relative;
          margin: 0.75rem 0 0.5rem 0;
        }

        .demo-divider-clean span {
          font-size: 0.72rem;
          font-weight: 600;
          color: #64748b;
        }

        .demo-chips-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .demo-chip-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          padding: 0.45rem 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s;
        }

        .demo-chip-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .demo-chip-btn.student:hover { border-color: #3b82f6; color: #1d4ed8; }
        .demo-chip-btn.faculty:hover { border-color: #8b5cf6; color: #6d28d9; }
        .demo-chip-btn.coord:hover { border-color: #10b981; color: #047857; }
        .demo-chip-btn.admin:hover { border-color: #f59e0b; color: #b45309; }

        .form-toggle-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          color: #64748b;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid #f1f5f9;
        }

        .switch-link-text {
          background: none;
          border: none;
          color: #2563eb;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          font-size: 0.8125rem;
        }

        .switch-link-text:hover {
          text-decoration: underline;
        }

        .clean-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          font-size: 0.8125rem;
          line-height: 1.4;
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

        /* Modal Dialog */
        .forgot-dialog {
          width: 100%;
          max-width: 440px;
          padding: 1.75rem;
          border-radius: 12px;
        }

        .forgot-success-box {
          text-align: center;
          padding: 1.5rem 0;
        }

        .forgot-success-box h4 {
          margin: 0.75rem 0 0.35rem 0;
          font-size: 1.125rem;
        }

        .forgot-success-box p {
          font-size: 0.8125rem;
          color: #64748b;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
