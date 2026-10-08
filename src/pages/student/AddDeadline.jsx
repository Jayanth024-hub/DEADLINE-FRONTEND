import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { deadlineService } from '../../services/api';
import { ArrowLeft, Plus, Check } from 'lucide-react';

export default function AddDeadline() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    course: 'CS301 - Operating Systems',
    category: 'Assignment',
    dueDate: '2026-10-12',
    dueTime: '23:59',
    priority: 'HIGH',
    notes: '',
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
      category: formData.category,
      dueDate: fullDueDate,
      priority: formData.priority,
      notes: formData.notes.trim()
    });
    setLoading(false);
    navigate('/student/deadlines');
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <PageHeader
        title="Add Academic Deadline"
        subtitle="Create a new task, assignment milestone, or quiz countdown."
      >
        <button 
          className="saas-btn saas-btn-secondary" 
          onClick={() => navigate('/student/deadlines')}
        >
          <ArrowLeft size={14} /> Back to Deadlines
        </button>
      </PageHeader>

      <div style={{ background: 'white', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <form onSubmit={handleSubmit}>
          <div className="saas-form-group">
            <label className="saas-label">Deliverable Title *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Distributed Systems Final Report"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="saas-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="saas-form-group">
              <label className="saas-label">Course / Subject</label>
              <select 
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="saas-select"
              >
                <option value="CS301 - Operating Systems">CS301 - Operating Systems</option>
                <option value="CS304 - Database Systems">CS304 - Database Systems</option>
                <option value="CS306 - Computer Networks">CS306 - Computer Networks</option>
                <option value="CS310 - Machine Learning">CS310 - Machine Learning</option>
                <option value="MA201 - Discrete Math">MA201 - Discrete Math</option>
                <option value="PH101 - Physics I">PH101 - Physics I</option>
                <option value="EN101 - English Composition">EN101 - English Composition</option>
                <option value="TT101 - Technical Training I">TT101 - Technical Training I</option>
              </select>
            </div>

            <div className="saas-form-group">
              <label className="saas-label">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="saas-select"
              >
                <option value="Assignment">Assignment</option>
                <option value="Project">Project Milestone</option>
                <option value="Exam">Exam / Quiz</option>
                <option value="Lab">Lab Deliverable</option>
                <option value="Personal">Personal Goal</option>
              </select>
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
                <option value="URGENT">Urgent (Red)</option>
                <option value="HIGH">High (Orange)</option>
                <option value="MEDIUM">Medium (Yellow)</option>
                <option value="LOW">Low (Blue)</option>
              </select>
            </div>
          </div>

          <div className="saas-form-group">
            <label className="saas-label">Deliverable Guidelines & Notes</label>
            <textarea 
              rows={4}
              placeholder="Outline project rubrics, test instructions, or external links..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="saas-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button 
              type="button" 
              className="saas-btn saas-btn-secondary" 
              onClick={() => navigate('/student/deadlines')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="saas-btn saas-btn-primary" 
              disabled={loading}
            >
              {loading ? 'Creating...' : <><Check size={15} /> Save Deadline</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
