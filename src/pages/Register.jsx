import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Building, ArrowRight, AlertCircle, BookOpen } from 'lucide-react';

const DEPARTMENTS = [
  'CSE',
  'ECE',
  'EEE',
  'AIML',
  'Cyber Security'
];

const FACULTY_SUBJECTS = [
  'Mathematics',
  'Chemistry',
  'Physics',
  'Data Structures',
  'Java',
  'C Language',
  'Python',
  'Operating Systems',
  'DBMS',
  'Computer Networks',
  'Computer Organization',
  'Software Engineering',
  'Web Development',
  'Artificial Intelligence',
  'Machine Learning',
  'Cyber Security',
  'Cloud Computing',
  'Computer Architecture',
  'Design & Analysis of Algorithms',
  'Engineering Graphics',
  'English'
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    department: 'CSE',
    subject: 'Operating Systems',
    year: '',
    section: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isStudent = formData.role === 'STUDENT';
  const isFaculty = formData.role === 'FACULTY';
  const isCoordinator = formData.role === 'COORDINATOR';
  const isAdmin = formData.role === 'ADMIN' || formData.role === 'ADMINISTRATOR';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (e) => {
    const nextRole = e.target.value;
    setFormData(prev => ({
      ...prev,
      role: nextRole,
      department: DEPARTMENTS.includes(prev.department) ? prev.department : DEPARTMENTS[0],
      subject: FACULTY_SUBJECTS.includes(prev.subject) ? prev.subject : FACULTY_SUBJECTS[0]
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const section = formData.section.trim().replace(/^section\s+/i, '');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!formData.password) {
      setError('Please enter a password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!formData.department || !DEPARTMENTS.includes(formData.department)) {
      setError('Please select a valid engineering department.');
      return;
    }

    if (isFaculty) {
      if (!formData.subject || !FACULTY_SUBJECTS.includes(formData.subject)) {
        setError('Please select a valid teaching subject.');
        return;
      }
    }

    if (isStudent) {
      if (!formData.year.trim()) {
        setError('Please enter your academic year (e.g. 3rd Year).');
        return;
      }
      if (!section) {
        setError('Please enter your section (e.g. M).');
        return;
      }
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        department: formData.department,
        subject: isFaculty ? formData.subject : null,
        year: isStudent ? formData.year.trim() : null,
        section: isStudent ? section : null
      };

      const res = await register(payload);

      // No automatic login. Redirect to /login with success message.
      navigate('/login', {
        state: {
          registered: true,
          message: res.message || 'Registration successful! Please sign in with your email and password.'
        }
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div className="brand-icon-sq" style={{ margin: '0 auto 12px' }}>
            IQ
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join DeadlineIQ Academic & Career Portal</p>
        </div>

        {error && (
          <div style={{ 
            background: '#fee2e2', 
            border: '1px solid #fca5a5', 
            borderRadius: '8px', 
            padding: '10px 14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#991b1b', 
            fontSize: '13px', 
            marginBottom: '18px' 
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="saas-form-group">
            <label className="saas-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="saas-input"
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="saas-form-group">
            <label className="saas-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="saas-input"
              placeholder="user@deadlineiq.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="saas-form-group">
              <label className="saas-label">Password *</label>
              <input
                type="password"
                name="password"
                className="saas-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="saas-form-group">
              <label className="saas-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="saas-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Role and Department Selection (Shown for ALL roles) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="saas-form-group">
              <label className="saas-label">Role *</label>
              <select 
                name="role" 
                className="saas-select" 
                value={formData.role} 
                onChange={handleRoleChange}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="COORDINATOR">Coordinator</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="saas-form-group">
              <label className="saas-label">Department *</label>
              <select
                name="department"
                className="saas-select"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Faculty Teaching Subject (Shown only when Role = FACULTY) */}
          {isFaculty && (
            <div className="saas-form-group">
              <label className="saas-label">Teaching Subject *</label>
              <select
                name="subject"
                className="saas-select"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                {FACULTY_SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Student Academic Year and Section (Shown only when Role = STUDENT) */}
          {isStudent && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="saas-form-group">
                <label className="saas-label">Academic Year *</label>
                <input
                  type="text"
                  name="year"
                  className="saas-input"
                  placeholder="e.g. 3rd Year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="saas-form-group">
                <label className="saas-label">Section *</label>
                <input
                  type="text"
                  name="section"
                  className="saas-input"
                  placeholder="e.g. M"
                  value={formData.section}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="saas-btn saas-btn-primary" 
            style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register Account'} <ArrowRight size={15} />
          </button>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Already have an account?
          </p>
          <Link 
            to="/login" 
            className="saas-btn saas-btn-secondary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '100%', 
              padding: '10px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              boxSizing: 'border-box'
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
