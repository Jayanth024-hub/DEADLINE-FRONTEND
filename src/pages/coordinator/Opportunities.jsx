import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import OpportunityCard from '../../components/OpportunityCard';
import Modal from '../../components/Modal';
import { opportunityService } from '../../services/api';
import { Plus, Check, Briefcase } from 'lucide-react';

export default function CoordinatorOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'INTERNSHIP',
    location: 'Bangalore, India',
    stipend: '₹1,00,000 / month',
    deadline: '2026-10-25',
    eligibility: 'CGPA >= 7.5, B.Tech CSE / IT',
    tags: 'Software, Algorithms, Java',
    description: ''
  });

  const loadData = async () => {
    const list = await opportunityService.getOpportunities();
    setOpportunities(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;

    await opportunityService.addOpportunity({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      deadline: `${formData.deadline}T23:59:00`
    });

    setShowAddModal(false);
    loadData();
  };

  const filtered = opportunities.filter(o =>
    !searchQuery ||
    o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Manage Placement Drives & Events"
        subtitle="Publish campus recruitment listings and hackathon participation alerts."
      >
        <button 
          className="saas-btn saas-btn-primary" 
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={15} /> Post New Opportunity
        </button>
      </PageHeader>

      <div style={{ marginBottom: '22px' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by company or drive title..."
        />
      </div>

      <div className="opportunity-card-grid">
        {filtered.map(opp => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            onRegister={() => {}}
            isRegistered={false}
          />
        ))}
      </div>

      {showAddModal && (
        <Modal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)}
          title="Post Campus Placement / Internship Drive"
          maxWidth={600}
        >
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="saas-form-group">
                <label className="saas-label">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="saas-input"
                />
              </div>

              <div className="saas-form-group">
                <label className="saas-label">Opportunity Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="saas-select"
                >
                  <option value="INTERNSHIP">Internship</option>
                  <option value="PLACEMENT">Full-Time Placement</option>
                  <option value="HACKATHON">Hackathon</option>
                  <option value="WORKSHOP">Workshop</option>
                </select>
              </div>
            </div>

            <div className="saas-form-group">
              <label className="saas-label">Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cloud Support & Solutions Intern 2027"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="saas-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="saas-form-group">
                <label className="saas-label">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="saas-input"
                />
              </div>

              <div className="saas-form-group">
                <label className="saas-label">Stipend / CTC</label>
                <input
                  type="text"
                  value={formData.stipend}
                  onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                  className="saas-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="saas-form-group">
                <label className="saas-label">Application Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="saas-input"
                />
              </div>

              <div className="saas-form-group">
                <label className="saas-label">Eligibility Criteria</label>
                <input
                  type="text"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="saas-input"
                />
              </div>
            </div>

            <div className="saas-form-group">
              <label className="saas-label">Required Skills / Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="saas-input"
                placeholder="AWS, Python, System Design"
              />
            </div>

            <div className="saas-form-group">
              <label className="saas-label">Job Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="saas-textarea"
                placeholder="Provide drive guidelines, interview rounds breakdown..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button 
                type="button" 
                className="saas-btn saas-btn-secondary" 
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="saas-btn saas-btn-primary">
                <Check size={14} /> Publish Drive
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
