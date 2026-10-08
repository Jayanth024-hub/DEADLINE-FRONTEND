import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  Building2, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Award, 
  ExternalLink,
  Tag,
  CheckCircle2
} from 'lucide-react';

export default function AddOpportunityModal({ 
  isOpen, 
  onClose, 
  onAddOpportunity 
}) {
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Internship');
  const [stipend, setStipend] = useState('');
  const [location, setLocation] = useState('Bengaluru / Hybrid');
  const [deadline, setDeadline] = useState('2026-10-25');
  const [eligibility, setEligibility] = useState('B.Tech CSE/IT, CGPA >= 7.5, No active backlogs');
  const [applyUrl, setApplyUrl] = useState('https://careers.univ.edu');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Software, Fullstack, Cloud');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !title.trim() || !deadline) {
      setFormError('Please fill in the Company, Role Title, and Application Deadline.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newOpp = {
      id: `opp-${Date.now()}`,
      company: company.trim(),
      title: title.trim(),
      type,
      stipend: stipend.trim() || (type === 'Internship' ? '₹85,000 / month' : '18.5 LPA CTC'),
      location: location.trim() || 'Hybrid',
      deadline: `${deadline}T23:59:59`,
      eligibility: eligibility.trim(),
      applyUrl: applyUrl.trim() || 'https://careers.univ.edu',
      description: description.trim() || `Exciting opportunity at ${company} for eligible students. Work on production architecture and solve challenging problems.`,
      tags: tags.length > 0 ? tags : ['Engineering', 'CampusDrive'],
      status: 'Open',
      registeredCount: 1,
      registeredStudents: ['Sai Jayanth']
    };

    onAddOpportunity(newOpp);
    // Reset form
    setCompany('');
    setTitle('');
    setType('Internship');
    setStipend('');
    setDescription('');
    setFormError('');
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-dialog add-opp-modal white-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <div className="opp-icon-badge">
              <Briefcase size={20} />
            </div>
            <div>
              <h3>Publish Campus Opportunity</h3>
              <p>Post internships, campus recruitment drives, or hackathons to the student portal</p>
            </div>
          </div>
          <button className="btn-ghost modal-close-btn" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>

        {formError && (
          <div className="modal-error-banner">
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Company / Organization Name *</label>
              <div className="input-with-icon">
                <Building2 size={15} />
                <input 
                  type="text" 
                  placeholder="e.g. Google, Microsoft, Qualcomm"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Program Type *</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="form-select"
              >
                <option value="Internship">Summer Internship</option>
                <option value="Placement">Campus Placement (Full-time)</option>
                <option value="Hackathon">Engineering Hackathon</option>
                <option value="Fellowship">Research Fellowship / Grant</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Role / Drive Title *</label>
            <input 
              type="text" 
              placeholder="e.g. Software Development Engineer Intern (2027 Batch)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Compensation / Stipend / Prize</label>
              <div className="input-with-icon">
                <DollarSign size={15} />
                <input 
                  type="text" 
                  placeholder="e.g. ₹1,10,000 / month or 22 LPA CTC"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location / Work Mode</label>
              <div className="input-with-icon">
                <MapPin size={15} />
                <input 
                  type="text" 
                  placeholder="e.g. Bengaluru / Hyderabad (Hybrid)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Registration Deadline *</label>
              <div className="input-with-icon">
                <Calendar size={15} />
                <input 
                  type="date" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Application Portal / Registration Link</label>
              <div className="input-with-icon">
                <ExternalLink size={15} />
                <input 
                  type="url" 
                  placeholder="https://careers.company.com/apply"
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Eligibility Criteria</label>
            <input 
              type="text" 
              placeholder="e.g. B.Tech CSE/IT, CGPA >= 8.0, 2027 batch graduating"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role Description &amp; Requirements</label>
            <textarea 
              rows="3"
              placeholder="Outline role responsibilities, interview rounds, and requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Relevant Skills &amp; Domain Tags (comma separated)</label>
            <div className="input-with-icon">
              <Tag size={15} />
              <input 
                type="text" 
                placeholder="e.g. Java, Python, React, Cloud, DSA"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions-bar">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <CheckCircle2 size={16} />
              <span>Publish Opportunity</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .add-opp-modal {
          max-width: 620px;
          width: 95%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 1.75rem;
        }

        .modal-header-icon-title {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .opp-icon-badge {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--purple-light);
          color: var(--purple-text);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.125rem;
          margin-top: 1.25rem;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .modal-error-banner {
          margin-top: 1rem;
          padding: 0.625rem 0.875rem;
          background: #fee2e2;
          color: #991b1b;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .modal-actions-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--surface-border);
        }

        @media (max-width: 600px) {
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
