import React from 'react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import { Calendar, CheckCircle2, MoreVertical, Edit2, Trash2, Clock } from 'lucide-react';

export default function DeadlineCard({ 
  deadline, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) {
  const {
    id,
    title,
    course,
    category,
    dueDate,
    priority,
    status,
    progress = 0,
    completed = false,
    notes
  } = deadline;

  // Format date display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`deadline-card ${completed ? 'completed-card' : ''}`}>
      <div className="deadline-card-top">
        <PriorityBadge priority={priority} />
        <StatusBadge status={status} />
      </div>

      <h3 className="deadline-card-title">{title}</h3>
      {course && <div className="deadline-card-course">{course} • {category}</div>}
      {notes && <p className="deadline-card-desc">{notes}</p>}

      <div style={{ marginBottom: '14px' }}>
        <ProgressBar progress={completed ? 100 : progress} showLabel={true} />
      </div>

      <div className="deadline-card-meta">
        <div className="deadline-date-info">
          <Clock size={14} />
          <span>{formatDate(dueDate)}</span>
        </div>

        <div className="deadline-card-actions">
          {onToggleComplete && (
            <button 
              className={`saas-btn saas-btn-sm ${completed ? 'saas-btn-secondary' : 'saas-btn-success'}`}
              onClick={() => onToggleComplete(id)}
              title={completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            >
              <CheckCircle2 size={13} /> {completed ? 'Completed' : 'Complete'}
            </button>
          )}

          {onEdit && (
            <button 
              className="saas-btn saas-btn-secondary saas-btn-sm" 
              onClick={() => onEdit(deadline)}
              title="Edit deadline"
            >
              <Edit2 size={13} />
            </button>
          )}

          {onDelete && (
            <button 
              className="saas-btn saas-btn-danger saas-btn-sm" 
              onClick={() => onDelete(id)}
              title="Delete deadline"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
