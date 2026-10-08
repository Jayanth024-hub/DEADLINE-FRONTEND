import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import AssignmentCard from '../../components/AssignmentCard';
import { deadlineService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, CheckCircle2, Clock, Plus, ArrowRight } from 'lucide-react';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    async function loadData() {
      const list = await deadlineService.getDeadlines();
      setAssignments(list);
    }
    loadData();
  }, []);

  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter(a => !a.completed).length;
  const totalSubmissions = assignments.reduce((acc, a) => acc + (a.totalSubmissions || 45), 0);
  const totalEnrolled = assignments.reduce((acc, a) => acc + (a.totalEnrolled || 60), 0);
  const avgSubmissionPct = totalEnrolled > 0 ? Math.round((totalSubmissions / totalEnrolled) * 100) : 74;

  return (
    <div>
      <PageHeader
        title={`Faculty Console: ${user?.name || 'Dr. R. Sharma'}`}
        subtitle="Manage department coursework, monitor class submissions, and verify lab deliverables."
      >
        <button 
          className="saas-btn saas-btn-primary" 
          onClick={() => navigate('/faculty/add-assignment')}
        >
          <Plus size={15} /> Create Assignment
        </button>
      </PageHeader>

      <div className="stat-card-grid">
        <StatCard
          title="Total Assignments"
          value={totalAssignments}
          icon={BookOpen}
          description="Curriculum tasks assigned"
          color="primary"
        />
        <StatCard
          title="Active Deadlines"
          value={activeAssignments}
          icon={Clock}
          description="Pending student submissions"
          color="warning"
        />
        <StatCard
          title="Avg Submission Rate"
          value={`${avgSubmissionPct}%`}
          icon={CheckCircle2}
          description="Across enrolled classes"
          trend="+8% this term"
          trendUp={true}
          color="success"
        />
        <StatCard
          title="Enrolled Students"
          value="180"
          icon={Users}
          description="CSE 3-1 (Sec A, B, C)"
          color="purple"
        />
      </div>

      <div style={{ marginTop: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
            Recent Course Assignments
          </h2>
          <button 
            className="saas-btn saas-btn-secondary saas-btn-sm" 
            onClick={() => navigate('/faculty/assignments')}
          >
            Manage All <ArrowRight size={13} />
          </button>
        </div>

        <div className="deadline-card-grid">
          {assignments.slice(0, 3).map(asg => (
            <AssignmentCard
              key={asg.id}
              assignment={asg}
              onEdit={() => navigate('/faculty/assignments')}
              onViewSubmissions={() => navigate('/faculty/assignments')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
