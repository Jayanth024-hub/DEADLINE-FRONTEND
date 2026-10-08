import React from 'react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import { CheckCircle2, Edit2, Trash2 } from 'lucide-react';

export default function DeadlineTable({ 
  deadlines = [], 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (deadlines.length === 0) {
    return null;
  }

  return (
    <div className="deadline-table-container">
      <table className="saas-table">
        <thead>
          <tr>
            <th>Deadline Title</th>
            <th>Category & Course</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th style={{ width: '140px' }}>Progress</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deadlines.map((dl) => (
            <tr key={dl.id} style={{ opacity: dl.completed ? 0.75 : 1 }}>
              <td>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{dl.title}</div>
                {dl.notes && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dl.notes}
                  </div>
                )}
              </td>
              <td>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{dl.category || 'General'}</span>
                {dl.course && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dl.course}</div>}
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>{formatDate(dl.dueDate)}</td>
              <td>
                <PriorityBadge priority={dl.priority} />
              </td>
              <td>
                <StatusBadge status={dl.status} />
              </td>
              <td>
                <ProgressBar progress={dl.completed ? 100 : dl.progress || 0} showLabel={false} height={5} />
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '2px' }}>
                  {dl.completed ? 100 : dl.progress || 0}%
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                  <button
                    className={`saas-btn saas-btn-sm ${dl.completed ? 'saas-btn-secondary' : 'saas-btn-success'}`}
                    onClick={() => onToggleComplete && onToggleComplete(dl.id)}
                    title={dl.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    <CheckCircle2 size={13} />
                  </button>
                  {onEdit && (
                    <button
                      className="saas-btn saas-btn-secondary saas-btn-sm"
                      onClick={() => onEdit(dl)}
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="saas-btn saas-btn-danger saas-btn-sm"
                      onClick={() => onDelete(dl.id)}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
