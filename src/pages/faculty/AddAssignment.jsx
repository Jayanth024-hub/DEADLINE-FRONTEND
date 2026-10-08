import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { deadlineService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Check, Plus } from 'lucide-react';

export default function AddAssignment() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    course: 'CS301 - Operating Systems',
    targetClass: 'CSE 3-1',
    targetSection: 'Section A',
    dueDate: '2026-10-14',
    dueTime: '23:59',
    priority: 'HIGH',
    notes: '',
    totalEnrolled: 60
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    const fullDueDate = `${formData.dueDate}T${formData.dueTime}:00`;
    await deadlineService.addDeadline({
      title: formData.title.trim(),
      course: formData.course,
      category: 'ASSIGNMENT',
      targetClass: formData.targetClass,
      targetSection: formData.targetSection,
      dueDate: fullDueDate,
      priority: formData.priority,
      notes: formData.notes.trim(),
      totalEnrolled: Number(formData.totalEnrolled) || 60,
      totalSubmissions: 0,
      createdBy: user?.email || 'faculty@deadlineiq.com'
    });
    setLoading(false);
    navigate('/faculty/assignments');
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <PageHeader
        title="Publish Course Assignment"
        subtitle="Distribute coursework and deadlines directly to enrolled students."
      >
        <button 
          className="saas-btn saas-btn-secondary" 
          onClick={() => navigate('/faculty/assignments')}
        >
          <ArrowLeft size={14} /> Back to Assignments
        </button>
      </PageHeader>

      <div style={{ background: 'white', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <form onSubmit={handleSubmit}>
          <div className="saas-form-group">
            <label className="saas-label">Assignment Title *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Distributed Database Replication & Sharding Lab"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="saas-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="saas-form-group">
              <label className="saas-label">Course</label>
              <select 
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="saas-select"
              >
                <option value="CS301 - Operating Systems">CS301 - Operating Systems</option>
                <option value="CS304 - Database Systems">CS304 - Database Systems</option>
                <option value="CS306 - Computer Networks">CS306 - Computer Networks</option>
                <option value="CS310 - Machine Learning">CS310 - Machine Learning</option>
              </select>
            </div>

            <div className="saas-form-group">
              <label className="saas-label">Target Class & Section</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={formData.targetClass} 
                  onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                  className="saas-input"
                  placeholder="CSE 3-1"
                />
                <input 
                  type="text" 
                  value={formData.targetSection} 
                  onChange={(e) => setFormData({ ...formData, targetSection: e.target.value })}
                  className="saas-input"
                  placeholder="Section A"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
            <div className="saas-form-group">
              <label className="saas-label">Due Date</label>
              <input 
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="saas-input"
              />
            </div>

            <div className="saas-form-group">
              <label className="saas-label">Due Time</label>
              <input 
                type="time"
                value={formData.dueTime}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                className="saas-input"
              />
            </div>

            <div className="saas-form-group">
              <label className="saas-label">Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="saas-select"
              >
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div className="saas-form-group">
            <label className="saas-label">Deliverable Guidelines & Notes</label>
            <textarea 
              rows={4}
              placeholder="Specify submission format (e.g. PDF report + GitHub repository URL)..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="saas-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button 
              type="button" 
              className="saas-btn saas-btn-secondary" 
              onClick={() => navigate('/faculty/assignments')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="saas-btn saas-btn-primary" 
              disabled={loading}
            >
              {loading ? 'Publishing...' : <><Check size={15} /> Publish to Class</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
