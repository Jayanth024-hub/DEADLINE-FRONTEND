import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Briefcase, 
  User, 
  Sparkles, 
  LogOut, 
  FileText, 
  PlusCircle, 
  Users, 
  ShieldCheck, 
  Activity,
  Layers
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || 'STUDENT';

  const isItemActive = (to) => {
    if (to === '/student') return location.pathname === '/student' || location.pathname === '/student/dashboard';
    if (to === '/faculty') return location.pathname === '/faculty' || location.pathname === '/faculty/dashboard';
    if (to === '/coordinator') return location.pathname === '/coordinator' || location.pathname === '/coordinator/dashboard';
    if (to === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    return location.pathname === to;
  };

  const getNavLinks = () => {
    switch (role) {
      case 'FACULTY':
        return [
          { label: 'Faculty Dashboard', to: '/faculty', icon: LayoutDashboard },
          { label: 'Class Assignments', to: '/faculty/assignments', icon: FileText },
          { label: 'Create Assignment', to: '/faculty/add-assignment', icon: PlusCircle },
          { label: 'AI Academic Copilot', to: '/ai', icon: Sparkles }
        ];
      case 'COORDINATOR':
        return [
          { label: 'Coordinator Console', to: '/coordinator', icon: LayoutDashboard },
          { label: 'Manage Drives & Events', to: '/coordinator/opportunities', icon: Briefcase },
          { label: 'Student Registrations', to: '/coordinator/registrations', icon: Users },
          { label: 'AI Placement Copilot', to: '/ai', icon: Sparkles }
        ];
      case 'ADMINISTRATOR':
      case 'ADMIN':
        return [
          { label: 'Admin Command', to: '/admin', icon: LayoutDashboard },
          { label: 'Manage Users', to: '/admin/users', icon: Users },
          { label: 'Deadline Governance', to: '/admin/deadlines', icon: Layers },
          { label: 'AI System Assistant', to: '/ai', icon: Sparkles }
        ];
      case 'STUDENT':
      default:
        return [
          { label: 'Student Dashboard', to: '/student', icon: LayoutDashboard },
          { label: 'My Deadlines', to: '/student/deadlines', icon: CheckSquare },
          { label: 'Career Opportunities', to: '/student/opportunities', icon: Briefcase },
          { label: 'Academic Profile', to: '/student/profile', icon: User },
          { label: 'AI Copilot Studio', to: '/ai', icon: Sparkles }
        ];
    }
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="saas-sidebar">
      <div className="sidebar-brand-box">
        <NavLink to="/" className="sidebar-brand">
          <div className="brand-icon-sq">IQ</div>
          <div className="brand-text-logo">
            Deadline<span>IQ</span>
          </div>
        </NavLink>
        <span className="sidebar-role-tag">{role}</span>
      </div>

      <nav className="sidebar-nav-container">
        <div className="sidebar-nav-label">Navigation</div>
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={() => `sidebar-link ${isItemActive(item.to) ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="sidebar-nav-label" style={{ marginTop: '16px' }}>Quick Portals</div>
        <NavLink to="/" className="sidebar-link">
          <Activity size={18} />
          <span>Public Landing</span>
        </NavLink>
      </nav>

      {user && (
        <div className="sidebar-footer-box">
          <div className="sidebar-user-tile">
            <div className="sidebar-avatar">
              {user.avatar || user.name?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-dept">{user.department || role}</div>
            </div>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
