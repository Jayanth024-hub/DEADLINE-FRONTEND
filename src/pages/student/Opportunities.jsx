import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import OpportunityCard from '../../components/OpportunityCard';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { opportunityService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, CheckCircle2, Award, Zap } from 'lucide-react';

export default function Opportunities() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('ALL');
  const [registeredSuccess, setRegisteredSuccess] = useState('');

  const loadData = async () => {
    const list = await opportunityService.getOpportunities();
    setOpportunities(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegister = async (oppId) => {
    const opp = opportunities.find(o => String(o.id) === String(oppId));
    await opportunityService.registerStudent(oppId, user?.name || 'Student');
    setRegisteredSuccess(opp?.title || 'Opportunity');
    loadData();
  };

  const filtered = opportunities.filter((opp) => {
    const matchesSearch = !searchQuery ||
      opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = activeType === 'ALL' || opp.type === activeType;

    return matchesSearch && matchesType;
  });

  const types = [
    { key: 'ALL', label: 'All Opportunities' },
    { key: 'INTERNSHIP', label: 'Internships' },
    { key: 'PLACEMENT', label: 'Full-Time Placements' },
    { key: 'HACKATHON', label: 'Hackathons' },
    { key: 'WORKSHOP', label: 'Workshops' }
  ];

  return (
    <div>
      <PageHeader
        title="Career & Placement Drives"
        subtitle="Verified campus recruitments, summer internships, and high-impact hackathons."
      />

      {registeredSuccess && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#065f46',
          marginBottom: '20px',
          fontSize: '13px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            <span>Successfully registered for <strong>{registeredSuccess}</strong>! Your resume and profile have been submitted.</span>
          </div>
          <button 
            style={{ background: 'none', border: 'none', color: '#065f46', cursor: 'pointer', fontWeight: 700 }}
            onClick={() => setRegisteredSuccess('')}
          >
            ✕
          </button>
        </div>
      )}

      {/* Search & Filter Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '14px' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by company name (Google, Microsoft), skills (AI, Cloud), or role..."
          />
        </div>

        <div className="filter-tabs-row">
          {types.map(t => (
            <button
              key={t.key}
              className={`filter-tab ${activeType === t.key ? 'active' : ''}`}
              onClick={() => setActiveType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of opportunities */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No drives match your filters"
          description="Try clearing your search query or selecting 'All Opportunities'."
        />
      ) : (
        <div className="opportunity-card-grid">
          {filtered.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onRegister={handleRegister}
              isRegistered={opp.registeredStudents?.includes(user?.name || 'Student')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
