import React from 'react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import { Users, Calendar, CheckSquare, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

export default function AssignmentCard({ 
  assignment, 
  onEdit, 
  onDelete, 
  onViewSubmissions 
}) {
  const {
    id,
    title,
    course,
    category = 'ASSIGNMENT',
    targetClass = 'CSE 3-1',
    targetSection = 'Section A',
    dueDate,
    priority = 'MEDIUM',
    status = 'UPCOMING',
    totalSubmissions = 0,
    totalEnrolled = 60,
    notes
  } = assignment;

  const submissionPercentage = totalEnrolled > 0 
    ? Math.round((totalSubmissions / totalEnrolled) * 100) 
    : 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="deadline-card">
      <div className="deadline-card-top">
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-blue)', background: 'var(--primary-blue-light)', padding: '2px 8px', borderRadius: '4px' }}>
          {targetClass} • {targetSection}
        </span>
        <PriorityBadge priority={priority} />
      </div>

      <h3 className="deadline-card-title">{title}</h3>
      <div className="deadline-card-course">{course}</div>
      {notes && <p className="deadline-card-desc">{notes}</p>}

      <div style={{ marginTop: '10px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <span>Submissions</span>
          <span>{totalSubmissions} / {totalEnrolled} ({submissionPercentage}%)</span>
        </div>
        <ProgressBar progress={submissionPercentage} height={7} variant={submissionPercentage >= 80 ? 'success' : 'primary'} />
      </div>

      <div className="deadline-card-meta">
        <div className="deadline-date-info">
          <Calendar size={14} />
          <span>Due: {formatDate(dueDate)}</span>
        </div>

        <div className="deadline-card-actions">
          {onViewSubmissions && (
            <button 
              className="saas-btn saas-btn-secondary saas-btn-sm" 
              onClick={() => onViewSubmissions(assignment)}
            >
              <Users size={12} /> Submissions
            </button>
          )}

          {onEdit && (
            <button 
              className="saas-btn saas-btn-secondary saas-btn-sm" 
              onClick={() => onEdit(assignment)}
              title="Edit Assignment"
            >
              <Edit size={13} />
            </button>
          )}

          {onDelete && (
            <button 
              className="saas-btn saas-btn-danger saas-btn-sm" 
              onClick={() => onDelete(id)}
              title="Delete Assignment"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
