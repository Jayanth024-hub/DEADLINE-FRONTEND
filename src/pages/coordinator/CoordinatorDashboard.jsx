import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import OpportunityCard from '../../components/OpportunityCard';
import { opportunityService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Users, Calendar, Award, Plus, ArrowRight } from 'lucide-react';

export default function CoordinatorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    async function loadData() {
      const list = await opportunityService.getOpportunities();
      setOpportunities(list);
    }
    loadData();
  }, []);

  const totalDrives = opportunities.length;
  const totalRegistrations = opportunities.reduce((acc, o) => acc + (o.registeredCount || 0), 0);
  const activeEvents = opportunities.filter(o => o.type === 'HACKATHON' || o.type === 'WORKSHOP').length;

  return (
    <div>
      <PageHeader
        title={`Placement & Career Cell: ${user?.name || 'Prof. K. Venkatesh'}`}
        subtitle="Coordinate campus recruitments, corporate drives, and technical hackathons."
      >
        <button 
          className="saas-btn saas-btn-primary" 
          onClick={() => navigate('/coordinator/opportunities')}
        >
          <Plus size={15} /> Add New Drive
        </button>
      </PageHeader>

      <div className="stat-card-grid">
        <StatCard
          title="Active Drives"
          value={totalDrives}
          icon={Briefcase}
          description="Live company listings"
          color="primary"
        />
        <StatCard
          title="Total Registrations"
          value={totalRegistrations}
          icon={Users}
          description="Verified candidate applications"
          trend="+18 today"
          trendUp={true}
          color="success"
        />
        <StatCard
          title="Events & Hackathons"
          value={activeEvents}
          icon={Calendar}
          description="Competitions & workshops"
          color="purple"
        />
        <StatCard
          title="Partner Recruiters"
          value="45+"
          icon={Award}
          description="Google, Microsoft, GS, etc."
          color="warning"
        />
      </div>

      <div style={{ marginTop: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
            Active Recruitment Drives
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="saas-btn saas-btn-secondary saas-btn-sm" 
              onClick={() => navigate('/coordinator/registrations')}
            >
              <Users size={13} /> View Applicant Rosters
            </button>
            <button 
              className="saas-btn saas-btn-secondary saas-btn-sm" 
              onClick={() => navigate('/coordinator/opportunities')}
            >
              Manage Drives <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <div className="opportunity-card-grid">
          {opportunities.slice(0, 3).map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onRegister={() => navigate('/coordinator/registrations')}
              isRegistered={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
