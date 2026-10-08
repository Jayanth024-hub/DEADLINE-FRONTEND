import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Layout & Security
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PageTitleManager from './components/PageTitleManager';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// AI Assistant Page
import AIPage from './pages/AI';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentDeadlines from './pages/student/Deadlines';
import StudentAddDeadline from './pages/student/AddDeadline';
import StudentOpportunities from './pages/student/Opportunities';
import StudentProfile from './pages/student/Profile';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyAssignments from './pages/faculty/Assignments';
import FacultyAddAssignment from './pages/faculty/AddAssignment';

// Coordinator Pages
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import CoordinatorOpportunities from './pages/coordinator/Opportunities';
import CoordinatorRegistrations from './pages/coordinator/Registrations';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminDeadlines from './pages/admin/Deadlines';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PageTitleManager />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            {/* AI Assistant (Requires Login - User Isolated) */}
            <Route 
              path="/ai" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN']}>
                  <AIPage />
                </ProtectedRoute>
              } 
            />

            {/* Student Routes */}
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/deadlines" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                  <StudentDeadlines />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/add-deadline" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                  <StudentAddDeadline />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/opportunities" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                  <StudentOpportunities />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/profile" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />

            {/* Faculty Routes */}
            <Route 
              path="/faculty" 
              element={
                <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/faculty/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/faculty/assignments" 
              element={
                <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                  <FacultyAssignments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/faculty/add-assignment" 
              element={
                <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                  <FacultyAddAssignment />
                </ProtectedRoute>
              } 
            />

            {/* Coordinator Routes */}
            <Route 
              path="/coordinator" 
              element={
                <ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN']}>
                  <CoordinatorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/coordinator/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN']}>
                  <CoordinatorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/coordinator/opportunities" 
              element={
                <ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN']}>
                  <CoordinatorOpportunities />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/coordinator/registrations" 
              element={
                <ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN']}>
                  <CoordinatorRegistrations />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ADMINISTRATOR']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ADMINISTRATOR']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ADMINISTRATOR']}>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/deadlines" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ADMINISTRATOR']}>
                  <AdminDeadlines />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
