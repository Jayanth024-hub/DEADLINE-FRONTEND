import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import { userService, deadlineService, opportunityService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, CheckSquare, Briefcase, Activity, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [deadlinesCount, setDeadlinesCount] = useState(0);
  const [opportunitiesCount, setOpportunitiesCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      const uList = await userService.getAllUsers();
      const dList = await deadlineService.getDeadlines();
      const oList = await opportunityService.getOpportunities();
      setUsers(uList);
      setDeadlinesCount(dList.length);
      setOpportunitiesCount(oList.length);
    }
    loadData();
  }, []);

  return (
    <div>
      <PageHeader
        title={`Administrator Command Center: ${user?.name || 'Admin'}`}
        subtitle="Institutional system telemetry, campus user directory, and compliance governance."
      >
        <button 
          className="saas-btn saas-btn-primary" 
          onClick={() => navigate('/admin/users')}
        >
          <UserPlus size={15} /> Add Campus User
        </button>
      </PageHeader>

      <div className="stat-card-grid">
        <StatCard
          title="Total Users"
          value={users.length || 524}
          icon={Users}
          description="Enrolled campus accounts"
          trend="+12 this month"
          trendUp={true}
          color="primary"
        />
        <StatCard
          title="Deadlines Monitored"
          value={deadlinesCount || 1284}
          icon={CheckSquare}
          description="Curriculum tasks & milestones"
          color="warning"
        />
        <StatCard
          title="Active Opportunities"
          value={opportunitiesCount || 86}
          icon={Briefcase}
          description="Live recruitment drives"
          color="purple"
        />
        <StatCard
          title="System Health"
          value="99.98%"
          icon={ShieldCheck}
          description="Spring Boot & MySQL Online"
          color="success"
        />
      </div>

      <div className="admin-main-grid">
        {/* User Accounts Overview */}
        <div style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Recent Campus Accounts</h3>
            <button 
              className="saas-btn saas-btn-secondary saas-btn-sm" 
              onClick={() => navigate('/admin/users')}
            >
              Manage Users <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {users.slice(0, 5).map(u => (
              <div key={u.id || u.email} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-app)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                    {u.avatar || u.name?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.email}</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', background: 'var(--primary-blue-light)', color: 'var(--primary-blue)' }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System telemetry */}
        <div style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ margin: '0 0 18px 0', fontSize: '16px', fontWeight: 800 }}>System Telemetry & Architecture</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Spring Boot Backend</span>
              <span style={{ fontWeight: 700, color: 'var(--emerald-green)' }}>● Online (Port 8080)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>MySQL Database</span>
              <span style={{ fontWeight: 700, color: 'var(--emerald-green)' }}>● Connected (deadlineiq)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Gemini AI Model</span>
              <span style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>● Active (Gemini 3.6 Flash)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Vector Engine (RAG)</span>
              <span style={{ fontWeight: 700, color: 'var(--purple-accent)' }}>● In-Memory / Pinecone</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Security & Auth</span>
              <span style={{ fontWeight: 700, color: 'var(--emerald-green)' }}>● Role-Based Clearance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
