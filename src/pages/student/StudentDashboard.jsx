import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deadlineService, opportunityService } from '../../services/api';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import DeadlineCard from '../../components/DeadlineCard';
import Calendar from '../../components/Calendar';
import OpportunityCard from '../../components/OpportunityCard';
import AIChatBox from '../../components/AIChatBox';
import Modal from '../../components/Modal';
import AddDeadlineModal from '../../components/AddDeadlineModal';
import { 
  CheckSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Briefcase, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deadlines, setDeadlines] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const dList = await deadlineService.getDeadlines();
    const oList = await opportunityService.getOpportunities();
    setDeadlines(dList);
    setOpportunities(oList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleComplete = async (id) => {
    await deadlineService.toggleComplete(id);
    loadData();
  };

  const handleRegisterOpportunity = async (oppId) => {
    await opportunityService.registerStudent(oppId, user?.name || 'Student');
    loadData();
  };

  // Metrics
  const totalCount = deadlines.length;
  const urgentCount = deadlines.filter(d => !d.completed && (d.priority === 'URGENT' || d.status === 'DUE_TODAY')).length;
  const completedCount = deadlines.filter(d => d.completed).length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const activeOpportunities = opportunities.length;

  const upcomingDeadlines = deadlines.filter(d => !d.completed).slice(0, 3);
  const topOpportunities = opportunities.slice(0, 2);

  return (
    <div>
      <PageHeader
        title={`Good day, ${user?.name?.split(' ')[0] || 'Student'} 👋`}
        subtitle="Here is your academic overview and upcoming milestones for today."
      >
        <button 
          className="saas-btn saas-btn-primary" 
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={15} /> Add Deadline
        </button>
      </PageHeader>

      {/* Reusable Stat Cards Grid */}
      <div className="stat-card-grid">
        <StatCard
          title="Total Deadlines"
          value={totalCount}
          icon={CheckSquare}
          description="Active tracking across courses"
          color="primary"
        />
        <StatCard
          title="Urgent Deliverables"
          value={urgentCount}
          icon={AlertTriangle}
          description="Due in next 24-48 hours"
          color="danger"
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={CheckCircle2}
          description={`${completedCount} of ${totalCount} completed`}
          trend="+5% this week"
          trendUp={true}
          color="success"
        />
        <StatCard
          title="Career Drives"
          value={activeOpportunities}
          icon={Briefcase}
          description="Eligible placements & internships"
          color="purple"
        />
      </div>

      {/* Main 2-column Desktop Layout */}
      <div className="dashboard-main-grid">
        {/* Left Column: Upcoming Deadlines & Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Upcoming Deadlines
              </h2>
              <button 
                className="saas-btn saas-btn-secondary saas-btn-sm"
                onClick={() => navigate('/student/deadlines')}
              >
                View All ({deadlines.length}) <ArrowRight size={13} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {upcomingDeadlines.length === 0 ? (
                <div style={{ padding: '24px', background: 'white', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  All caught up! No urgent deadlines pending.
                </div>
              ) : (
                upcomingDeadlines.map(dl => (
                  <DeadlineCard
                    key={dl.id}
                    deadline={dl}
                    onToggleComplete={handleToggleComplete}
                  />
                ))
              )}
            </div>
          </div>

          {/* Monthly Desktop Calendar */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Academic Calendar
              </h2>
            </div>
            <Calendar deadlines={deadlines} />
          </div>
        </div>

        {/* Right Column: AI Quick Access & Opportunities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Embedded AI Assistant */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <AIChatBox compact={true} />
          </div>

          {/* Top Opportunities */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Recommended Opportunities
              </h2>
              <button 
                className="saas-btn saas-btn-secondary saas-btn-sm"
                onClick={() => navigate('/student/opportunities')}
              >
                Explore <ArrowRight size={13} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {topOpportunities.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onRegister={handleRegisterOpportunity}
                  isRegistered={opp.registeredStudents?.includes(user?.name || 'Student')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddDeadlineModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
