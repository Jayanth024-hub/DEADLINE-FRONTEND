import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, Plus, BookOpen } from 'lucide-react';
import { deadlineService } from '../services/api';

export default function AddDeadlineModal({ 
  isOpen = true, 
  onClose, 
  onSuccess, 
  initialData = null 
}) {
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

  useEffect(() => {
    if (initialData) {
      const dParts = initialData.dueDate ? initialData.dueDate.split('T') : ['2026-10-12', '23:59'];
      setFormData({
        title: initialData.title || '',
        course: initialData.course || 'CS301 - Operating Systems',
        category: initialData.category || 'Assignment',
        dueDate: dParts[0] || '2026-10-12',
        dueTime: dParts[1]?.substring(0, 5) || '23:59',
        priority: initialData.priority || 'HIGH',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  if (isOpen === false) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    const fullDueDate = `${formData.dueDate}T${formData.dueTime}:00`;
    
    if (initialData?.id) {
      await deadlineService.updateDeadline(initialData.id, {
        title: formData.title.trim(),
        course: formData.course,
        category: formData.category,
        dueDate: fullDueDate,
        priority: formData.priority,
        notes: formData.notes.trim()
      });
    } else {
      await deadlineService.addDeadline({
        title: formData.title.trim(),
        course: formData.course,
        category: formData.category,
        dueDate: fullDueDate,
        priority: formData.priority,
        notes: formData.notes.trim()
      });
    }

    setLoading(false);
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <div className="saas-modal-backdrop" onClick={onClose}>
      <div className="saas-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="saas-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--primary-blue-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={16} />
            </div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              {initialData ? 'Edit Academic Deadline' : 'Create New Deadline'}
            </h3>
          </div>
          <button className="saas-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="saas-modal-body">
            <div className="saas-form-group">
              <label className="saas-label">Deliverable Title *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. DBMS Normalization Project"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="saas-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
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
              <label className="saas-label">Notes & Deliverable Guidelines</label>
              <textarea 
                rows={3}
                placeholder="Include rubric details, submission format, or repository links..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="saas-textarea"
              />
            </div>
          </div>

          <div className="saas-modal-footer">
            <button type="button" className="saas-btn saas-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="saas-btn saas-btn-primary" disabled={loading}>
              {loading ? 'Saving...' : initialData ? 'Update Deadline' : 'Add Deadline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
