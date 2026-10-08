import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-app)' }}>
        <LoadingSpinner text="Verifying authentication session..." size={36} />
      </div>
    );
  }

  // 1. Mandatory login check
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Role-based restrictions check
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || '').toUpperCase();
    const isAllowed = allowedRoles.some(r => {
      const targetRole = r.toUpperCase();
      if (targetRole === userRole) return true;
      if ((targetRole === 'ADMIN' || targetRole === 'ADMINISTRATOR') && (userRole === 'ADMIN' || userRole === 'ADMINISTRATOR')) {
        return true;
      }
      return false;
    });

    if (!isAllowed) {
      // Reject and redirect to user's authorized role dashboard
      let redirectTarget = '/student/dashboard';
      if (userRole === 'FACULTY') redirectTarget = '/faculty/dashboard';
      else if (userRole === 'COORDINATOR') redirectTarget = '/coordinator/dashboard';
      else if (userRole === 'ADMIN' || userRole === 'ADMINISTRATOR') redirectTarget = '/admin/dashboard';

      return <Navigate to={redirectTarget} replace />;
    }
  }

  return children;
}
