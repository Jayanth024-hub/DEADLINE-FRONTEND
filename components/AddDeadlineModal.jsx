import React, { useState } from 'react';
import { X, Calendar, Clock, AlertCircle, Plus, BookOpen } from 'lucide-react';

export default function AddDeadlineModal({ isOpen, onClose, onAddDeadline }) {
  const [formData, setFormData] = useState({
    title: '',
    course: 'CS301 - Operating Systems',
    category: 'Assignment',
    dueDate: '2026-10-07',
    dueTime: '23:59',
    priority: 'High',
    instructor: 'Dr. R. Sharma',
    tags: 'Algorithms, Submission',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const fullDueDate = `${formData.dueDate}T${formData.dueTime}:00`;
    const newDeadline = {
      id: `dl-${Date.now()}`,
      title: formData.title.trim(),
      course: formData.course,
      category: formData.category,
      dueDate: fullDueDate,
      priority: formData.priority,
      status: 'Pending',
      progress: 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      instructor: formData.instructor,
      notes: formData.notes.trim() || 'No additional notes provided.',
    };

    onAddDeadline(newDeadline);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-dialog white-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Plus size={18} />
            </div>
            <div>
              <h3>New Academic Deadline</h3>
              <p>Add an assignment, test, or milestone to your tracking dashboard</p>
            </div>
          </div>
          <button className="btn-ghost modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label>Deliverable Title *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Distributed Systems Lab 3 - Raft Consensus"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>

          {/* Course & Category Grid */}
          <div className="form-row-2">
            <div className="form-group">
              <label>Course / Subject</label>
              <select 
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="form-select"
              >
                <option value="CS301 - Operating Systems">CS301 - Operating Systems</option>
                <option value="CS304 - Database Systems">CS304 - Database Systems</option>
                <option value="CS306 - Computer Networks">CS306 - Computer Networks</option>
                <option value="CS310 - Machine Learning">CS310 - Machine Learning</option>
                <option value="CS312 - Cloud Architecture">CS312 - Cloud Architecture</option>
                <option value="MA201 - Discrete Math">MA201 - Discrete Math</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                <option value="Assignment">Assignment</option>
                <option value="Project">Project Milestone</option>
                <option value="Exam">Exam / Quiz</option>
                <option value="Lab Submission">Lab Submission</option>
                <option value="Career">Career Deadline</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="form-row-2">
            <div className="form-group">
              <label>Due Date</label>
              <input 
                type="date" 
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Due Time</label>
              <input 
                type="time" 
                required
                value={formData.dueTime}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* Priority & Instructor */}
          <div className="form-row-2">
            <div className="form-group">
              <label>Urgency / Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="form-select"
              >
                <option value="Urgent">🔥 Urgent Priority</option>
                <option value="High">⚠️ High Priority</option>
                <option value="Medium">⚡ Medium Priority</option>
                <option value="Low">☕ Low Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label>Instructor / Faculty</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. R. Sharma"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. C++, Networking, Wireshark"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="form-input"
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Notes &amp; Instructions</label>
            <textarea 
              rows="3"
              placeholder="Add key rubric requirements, submission link, or notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="form-textarea"
            />
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>Create Deadline</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-dialog {
          width: 100%;
          max-width: 580px;
          background: #ffffff;
          padding: 1.75rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--surface-border);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--surface-border);
          margin-bottom: 1.25rem;
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .modal-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-title-group h3 {
          font-size: 1.125rem;
          margin-bottom: 0.125rem;
        }

        .modal-title-group p {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .form-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .form-input, .form-select, .form-textarea {
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          background: var(--bg-app);
          color: var(--text-main);
          outline: none;
          transition: border-color 0.15s;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--primary);
          background: #ffffff;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--surface-border);
          margin-top: 0.5rem;
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
