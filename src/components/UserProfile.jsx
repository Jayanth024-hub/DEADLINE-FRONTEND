import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Sparkles, ChevronDown, ShieldCheck, Mail, Building } from 'lucide-react';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button 
        className="saas-btn saas-btn-primary saas-btn-sm" 
        onClick={() => navigate('/login')}
      >
        Sign In
      </button>
    );
  }

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (user.role === 'FACULTY') return '/faculty';
    if (user.role === 'COORDINATOR') return '/coordinator';
    if (user.role === 'ADMINISTRATOR' || user.role === 'ADMIN') return '/admin';
    return '/student';
  };

  return (
    <div className="user-profile-menu-wrap" ref={menuRef} style={{ position: 'relative' }}>
      <button className="user-profile-trigger" onClick={() => setIsOpen(!isOpen)}>
        <div className="user-avatar-circle">
          {user.avatar || user.name?.substring(0, 2).toUpperCase() || 'U'}
        </div>
        <div style={{ textAlign: 'left' }}>
          <div className="user-meta-name">{user.name}</div>
          <div className="user-meta-role">{user.role}</div>
        </div>
        <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
      </button>

      {isOpen && (
        <div className="user-dropdown-card" style={{ width: '260px' }}>
          <div className="dropdown-role-section" style={{ paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--emerald-green)', marginBottom: '6px' }}>
              <ShieldCheck size={14} />
              <span>AUTHENTICATED SESSION</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Mail size={12} /> {user.email}
            </div>
            {user.department && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <Building size={11} /> {user.department}
              </div>
            )}
            <div style={{ marginTop: '8px' }}>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '12px', 
                background: '#e0f2fe', 
                color: '#0284c7' 
              }}>
                Role: {user.role}
              </span>
            </div>
          </div>

          <button 
            className="dropdown-action-item" 
            onClick={() => {
              setIsOpen(false);
              navigate(getDashboardPath());
            }}
          >
            <User size={15} /> Dashboard & Overview
          </button>

          {user.role === 'STUDENT' && (
            <button 
              className="dropdown-action-item" 
              onClick={() => {
                setIsOpen(false);
                navigate('/student/profile');
              }}
            >
              <User size={15} /> Academic Profile
            </button>
          )}

          <button 
            className="dropdown-action-item" 
            onClick={() => {
              setIsOpen(false);
              navigate('/ai');
            }}
          >
            <Sparkles size={15} /> My AI Assistant
          </button>

          <div style={{ height: '1px', background: 'var(--border-light)', margin: '6px 0' }} />

          <button 
            className="dropdown-action-item logout" 
            onClick={handleLogout}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
