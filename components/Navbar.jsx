import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Plus, 
  Bell, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Briefcase, 
  LayoutDashboard, 
  CheckSquare, 
  Search, 
  GraduationCap, 
  ChevronDown, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  UserCheck, 
  BookOpen, 
  Users,
  LogOut,
  User as UserIcon,
  Menu
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAddModal, 
  notifications = [], 
  onMarkNotificationRead, 
  user, 
  onOpenProfile, 
  onOpenWorkflowModal, 
  onOpenAuthModal,
  onLogout,
  onNavigate
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <header className="fastweb-navbar-wrapper public">
        <div className="container nav-inner">
          <div 
            className="brand-group" 
            onClick={() => onNavigate ? onNavigate('/') : null} 
            role="button" 
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <span className="brand-logo-text">
              deadline<span className="brand-iq-accent">IQ</span>
            </span>
          </div>

          <nav className="nav-links-row" aria-label="Public Navigation">
            <button 
              onClick={() => {
                if (onNavigate) onNavigate('/#features');
                const el = document.getElementById('features');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="nav-link-btn"
            >
              <span>FEATURES</span>
            </button>
            <button 
              onClick={() => {
                if (onNavigate) onNavigate('/#how-it-works');
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="nav-link-btn"
            >
              <span>HOW IT WORKS</span>
            </button>
            <button 
              onClick={() => {
                if (onNavigate) onNavigate('/#opportunities');
                const el = document.getElementById('opportunities');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="nav-link-btn"
            >
              <span>OPPORTUNITIES</span>
            </button>
            <button 
              onClick={() => {
                if (onNavigate) onNavigate('/#roles');
                const el = document.getElementById('roles');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="nav-link-btn"
            >
              <span>ROLES</span>
            </button>
          </nav>

          <div className="nav-actions-group">
            <button 
              className="fastweb-login-link" 
              onClick={() => onNavigate ? onNavigate('/login') : null}
            >
              SIGN IN
            </button>
            <button 
              onClick={() => onNavigate ? onNavigate('/register') : null} 
              className="fastweb-signup-btn"
              style={{ background: '#2563eb' }}
            >
              <span>GET STARTED</span>
            </button>
          </div>

          <button
            className="mobile-nav-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav id="mobile-navigation" className="mobile-nav-panel" aria-label="Public Navigation">
            {[
              ['Features', '/#features'],
              ['How it works', '/#how-it-works'],
              ['Opportunities', '/#opportunities'],
              ['Roles', '/#roles']
            ].map(([label, path]) => (
              <button
                key={path}
                className="mobile-nav-link"
                onClick={() => {
                  onNavigate?.(path);
                  setMobileMenuOpen(false);
                }}
              >
                {label}
              </button>
            ))}
            <div className="mobile-nav-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  onNavigate?.('/login');
                  setMobileMenuOpen(false);
                }}
              >
                Sign in
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  onNavigate?.('/register');
                  setMobileMenuOpen(false);
                }}
              >
                Get started
              </button>
            </div>
          </nav>
        )}
      </header>
    );
  }

  const getNavItemsForRole = () => {
    switch (user.role) {
      case 'FACULTY':
        return [
          { id: 'faculty-console', label: 'ACADEMIC CONSOLE', icon: BookOpen },
          { id: 'deadlines', label: 'DELIVERABLES', icon: CheckSquare },
          { id: 'ai-studio', label: 'AI COPILOT', icon: Sparkles, highlight: true },
          { id: 'calendar', label: 'CALENDAR', icon: CalendarIcon },
        ];
      case 'COORDINATOR':
        return [
          { id: 'coord-console', label: 'DRIVES & EVENTS', icon: Briefcase },
          { id: 'opportunities', label: 'APPLICATIONS', icon: Users },
          { id: 'ai-studio', label: 'AI COPILOT', icon: Sparkles, highlight: true },
          { id: 'calendar', label: 'CALENDAR', icon: CalendarIcon },
        ];
      case 'DEAN':
        return [
          { id: 'dean-console', label: 'INSTITUTION OVERVIEW', icon: GraduationCap },
          { id: 'deadlines', label: 'DEADLINES', icon: CheckSquare },
          { id: 'opportunities', label: 'OPPORTUNITIES', icon: Briefcase },
          { id: 'ai-studio', label: 'AI COPILOT', icon: Sparkles, highlight: true },
          { id: 'calendar', label: 'CALENDAR', icon: CalendarIcon },
        ];
      case 'ADMINISTRATOR':
        return [
          { id: 'admin-console', label: 'GOVERNANCE', icon: ShieldCheck },
          { id: 'deadlines', label: 'DEADLINES', icon: CheckSquare },
          { id: 'opportunities', label: 'OPPORTUNITIES', icon: Briefcase },
          { id: 'ai-studio', label: 'AI COPILOT', icon: Sparkles, highlight: true },
        ];
      case 'STUDENT':
      default:
        return [
          { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
          { id: 'deadlines', label: 'DEADLINES', icon: CheckSquare },
          { id: 'opportunities', label: 'OPPORTUNITIES', icon: Briefcase },
          { id: 'ai-studio', label: 'AI COPILOT', icon: Sparkles, highlight: true },
          { id: 'calendar', label: 'CALENDAR', icon: CalendarIcon },
        ];
    }
  };

  const navItems = getNavItemsForRole();

  return (
    <header className="fastweb-navbar-wrapper authenticated">
      <div className="container nav-inner">
        {/* Fastweb-style Brand Logo */}
        <div 
          className="brand-group" 
          onClick={() => setActiveTab(user.role === 'STUDENT' ? 'overview' : (user.role === 'FACULTY' ? 'faculty-console' : (user.role === 'COORDINATOR' ? 'coord-console' : (user.role === 'DEAN' ? 'dean-console' : 'admin-console'))))} 
          role="button" 
          tabIndex={0}
        >
          <span className="brand-logo-text">
            deadline<span className="brand-iq-accent">IQ</span>
          </span>
        </div>

        {/* Center Fastweb-Style Uppercase Navigation */}
        <nav className="nav-links-row" aria-label="Main Navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-link-btn ${isActive ? 'active' : ''} ${item.highlight ? 'highlight-link' : ''}`}
              >
                <span>{item.label}</span>
                {item.highlight && <span className="ai-dot-ping"></span>}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Primary CTA, Notifications, and Polished Profile Dropdown */}
        <div className="nav-actions-group">
          {/* Fastweb Signature Rounded Green CTA Button */}
          <button 
            onClick={onOpenAddModal} 
            className="fastweb-signup-btn"
            title="Create a new academic deadline"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>{user.role === 'FACULTY' ? 'NEW ASSIGNMENT' : (user.role === 'COORDINATOR' ? 'NEW DRIVE' : 'NEW DEADLINE')}</span>
          </button>

          {/* Notifications */}
          <div className="notification-wrapper" ref={notifRef}>
            <button 
              className={`icon-circle-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              aria-label="View notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown white-card animate-fade-in">
                <div className="dropdown-header">
                  <div>
                    <h4>Notifications</h4>
                    <p>{unreadCount} unread alerts</p>
                  </div>
                  <button 
                    className="btn-ghost close-btn" 
                    onClick={() => setShowNotifications(false)}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="empty-notif">No new alerts</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`notif-item ${n.unread ? 'unread' : ''}`}
                        onClick={() => onMarkNotificationRead(n.id)}
                      >
                        <div className={`notif-indicator notif-${n.type}`}></div>
                        <div className="notif-content">
                          <span className="notif-title">{n.title}</span>
                          <p className="notif-desc">{n.message}</p>
                          <span className="notif-time">{n.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Trigger & Dropdown Menu */}
          <div className="profile-menu-wrapper" ref={profileRef}>
            <button 
              className={`user-profile-trigger ${showProfileMenu ? 'active' : ''}`}
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              aria-label="Account and Settings Menu"
              aria-expanded={showProfileMenu}
            >
              <div className="user-profile-circle">
                {user.avatar || (user.name ? user.name.substring(0, 2).toUpperCase() : 'U')}
              </div>
              <span className="user-profile-name">{user.name ? user.name.split(' ')[0] : 'User'}</span>
              <ChevronDown size={13} className={`profile-chevron ${showProfileMenu ? 'rotated' : ''}`} />
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown-card white-card animate-fade-in">
                <div className="profile-dropdown-header">
                  <div className="profile-dropdown-avatar">
                    {user.avatar || (user.name ? user.name.substring(0, 2).toUpperCase() : 'U')}
                  </div>
                  <div className="profile-dropdown-meta">
                    <span className="profile-dropdown-name">{user.name}</span>
                    <span className="profile-dropdown-email">{user.email}</span>
                    <span className="profile-role-badge">{user.role}</span>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <div className="profile-dropdown-menu">
                  <button 
                    className="dropdown-item-btn"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                  >
                    <GraduationCap size={15} className="menu-item-icon" />
                    <span>My Profile &amp; Academics</span>
                  </button>

                  <button 
                    className="dropdown-item-btn"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenWorkflowModal) onOpenWorkflowModal();
                    }}
                  >
                    <ShieldCheck size={15} className="menu-item-icon text-blue" />
                    <span>System Workflow Guide</span>
                  </button>

                  <button 
                    className="dropdown-item-btn"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenAuthModal) onOpenAuthModal();
                    }}
                  >
                    <UserCheck size={15} className="menu-item-icon" />
                    <span>Switch Role / Persona</span>
                  </button>

                  <div className="dropdown-divider" />

                  {onLogout && (
                    <button 
                      className="dropdown-item-btn danger-item"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                    >
                      <LogOut size={15} className="menu-item-icon" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="mobile-nav-toggle"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-navigation" className="mobile-nav-panel" aria-label="Main Navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`mobile-nav-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      <style>{`
        .fastweb-navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #ffffff;
          border-bottom: 1px solid #d4e7f5;
          box-shadow: 0 2px 4px rgba(12, 46, 89, 0.04);
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          gap: 1rem;
          min-width: 0;
        }

        .mobile-nav-toggle,
        .mobile-nav-panel {
          display: none;
        }

        /* Fastweb Logo Style */
        .brand-group {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
          flex-shrink: 0;
        }

        .brand-logo-text {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 750;
          color: #0c325c;
          letter-spacing: -0.035em;
          line-height: 1;
        }

        .brand-iq-accent {
          color: #0284c7;
        }

        /* Navigation Links */
        .nav-links-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-shrink: 0;
        }

        .nav-link-btn {
          background: transparent;
          border: none;
          color: #0c325c;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          padding: 0.4rem 0.2rem;
          position: relative;
          transition: color 0.15s ease;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          white-space: nowrap;
        }

        .nav-link-btn:hover {
          color: #0284c7;
        }

        .nav-link-btn.active {
          color: #0284c7;
        }

        .nav-link-btn.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 2.5px;
          background: #0284c7;
          border-radius: var(--radius-full);
        }

        .ai-dot-ping {
          width: 5px;
          height: 5px;
          background: #0284c7;
          border-radius: 50%;
          display: inline-block;
          animation: pulseGlow 1.8s infinite;
        }

        /* Right Actions */
        .nav-actions-group {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          flex-shrink: 0;
        }

        .workflow-link-btn {
          font-size: 0.78rem;
          font-weight: 700;
          color: #0c325c;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.35rem 0.6rem;
        }

        .workflow-link-btn:hover {
          color: #0284c7;
          background: #edf7fd;
        }

        /* Fastweb Log In Text Button */
        .fastweb-login-link {
          background: transparent;
          border: none;
          color: #0284c7;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          padding: 0.4rem 0.5rem;
          transition: color 0.15s;
          white-space: nowrap;
        }

        .fastweb-login-link:hover {
          color: #0369a1;
          text-decoration: underline;
        }

        /* Fastweb Signature Rounded Green Sign-up Button */
        .fastweb-signup-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #2a7e65;
          color: #ffffff;
          padding: 0.48rem 1.15rem;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          border-radius: var(--radius-full);
          border: none;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(42, 126, 101, 0.25);
          transition: all 0.18s ease;
        }

        .fastweb-signup-btn:hover {
          background: #226753;
          box-shadow: 0 4px 10px rgba(42, 126, 101, 0.35);
          transform: translateY(-1px);
        }

        /* Icon Circle */
        .icon-circle-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #d4e7f5;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0c325c;
          cursor: pointer;
          position: relative;
          transition: all 0.15s ease;
        }

        .icon-circle-btn:hover {
          background: #edf7fd;
          border-color: #93c5fd;
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          font-size: 0.5625rem;
          font-weight: 700;
          min-width: 15px;
          height: 15px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #ffffff;
        }

        /* User Profile Trigger & Dropdown */
        .profile-menu-wrapper {
          position: relative;
        }

        .user-profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          border: 1px solid #d4e7f5;
          padding: 0.2rem 0.65rem 0.2rem 0.2rem;
          border-radius: var(--radius-full, 9999px);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .user-profile-trigger:hover, .user-profile-trigger.active {
          background: #edf7fd;
          border-color: #93c5fd;
        }

        .user-profile-name {
          font-size: 0.78rem;
          font-weight: 700;
          color: #0c325c;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-chevron {
          color: #64748b;
          transition: transform 0.2s ease;
        }

        .profile-chevron.rotated {
          transform: rotate(180deg);
        }

        .user-profile-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
          color: #ffffff;
          font-size: 0.6875rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 3px rgba(2, 132, 199, 0.25);
          flex-shrink: 0;
        }

        /* Profile Dropdown Card */
        .profile-dropdown-card {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 250px;
          background: #ffffff;
          border: 1px solid #d4e7f5;
          border-radius: var(--radius-lg, 12px);
          box-shadow: 0 10px 25px -5px rgba(12, 46, 89, 0.12), 0 8px 10px -6px rgba(12, 46, 89, 0.08);
          padding: 0.75rem;
          z-index: 210;
        }

        .profile-dropdown-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.35rem 0.25rem 0.6rem;
        }

        .profile-dropdown-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
          color: #ffffff;
          font-size: 0.8125rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .profile-dropdown-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .profile-dropdown-name {
          font-size: 0.84rem;
          font-weight: 750;
          color: #0c325c;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-dropdown-email {
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 1px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-role-badge {
          display: inline-block;
          margin-top: 0.3rem;
          font-size: 0.625rem;
          font-weight: 700;
          color: #0284c7;
          background: #e0f2fe;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
          letter-spacing: 0.04em;
          width: fit-content;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 0.4rem 0;
        }

        .profile-dropdown-menu {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .dropdown-item-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 0.5rem 0.6rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: #334155;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .dropdown-item-btn:hover {
          background: #f1f5f9;
          color: #0c325c;
        }

        .dropdown-item-btn .menu-item-icon {
          color: #64748b;
          flex-shrink: 0;
        }

        .dropdown-item-btn:hover .menu-item-icon {
          color: #0284c7;
        }

        .dropdown-item-btn.danger-item {
          color: #dc2626;
        }

        .dropdown-item-btn.danger-item .menu-item-icon {
          color: #dc2626;
        }

        .dropdown-item-btn.danger-item:hover {
          background: #fef2f2;
          color: #b91c1c;
        }

        /* Notifications Dropdown */
        .notification-wrapper {
          position: relative;
        }

        .notifications-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 300px;
          background: #ffffff;
          border: 1px solid #d4e7f5;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 0.875rem;
          z-index: 200;
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #d4e7f5;
        }

        .dropdown-header h4 {
          font-size: 0.875rem;
          margin-bottom: 0.1rem;
        }

        .dropdown-header p {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          max-height: 240px;
          overflow-y: auto;
          margin-top: 0.5rem;
        }

        .notif-item {
          display: flex;
          gap: 0.5rem;
          padding: 0.4rem 0.5rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .notif-item:hover {
          background: #edf7fd;
        }

        .notif-item.unread {
          background: #e0f2fe;
        }

        .notif-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .notif-warning { background: #f59e0b; }
        .notif-info { background: #0284c7; }
        .notif-success { background: #10b981; }

        .notif-content {
          display: flex;
          flex-direction: column;
        }

        .notif-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .notif-desc {
          font-size: 0.6875rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        .notif-time {
          font-size: 0.625rem;
          color: var(--text-subtle);
        }

        @media (max-width: 1080px) {
          .nav-links-row {
            gap: 0.875rem;
          }
          .nav-link-btn {
            font-size: 0.72rem;
          }
        }

        @media (max-width: 880px) {
          .nav-links-row {
            display: none;
          }

          .mobile-nav-toggle {
            width: 40px;
            height: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            border: 1px solid #dbe5f0;
            border-radius: 12px;
            background: #ffffff;
            color: #0c325c;
            cursor: pointer;
          }

          .mobile-nav-toggle:hover {
            background: #f1f7fc;
            border-color: #bfd9ec;
          }

          .mobile-nav-panel {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            width: min(100% - 2rem, 1360px);
            margin: 0 auto;
            padding: 0.75rem 0 1rem;
            border-top: 1px solid #e8eef5;
          }

          .mobile-nav-link {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            width: 100%;
            padding: 0.8rem 0.75rem;
            border: 0;
            border-radius: 10px;
            background: transparent;
            color: #233b56;
            font: inherit;
            font-size: 0.9rem;
            font-weight: 650;
            text-align: left;
            cursor: pointer;
          }

          .mobile-nav-link:hover,
          .mobile-nav-link.active {
            background: #eff7fc;
            color: #0369a1;
          }

          .mobile-nav-actions {
            display: flex;
            gap: 0.75rem;
            padding: 0.75rem 0.5rem 0;
          }

          .mobile-nav-actions > button {
            flex: 1;
          }
        }

        @media (max-width: 600px) {
          .nav-inner {
            height: 60px;
            gap: 0.5rem;
          }

          .brand-logo-text {
            font-size: 1.2rem;
          }

          .nav-actions-group {
            gap: 0.375rem;
          }

          .fastweb-login-link {
            display: none;
          }

          .authenticated .nav-actions-group > .fastweb-signup-btn {
            width: 40px;
            height: 40px;
            padding: 0;
          }

          .authenticated .nav-actions-group > .fastweb-signup-btn span {
            display: none;
          }

          .user-profile-name,
          .profile-chevron {
            display: none;
          }

          .mobile-nav-panel {
            width: calc(100% - 2rem);
          }
        }
      `}</style>
    </header>
  );
}
