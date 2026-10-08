import React from 'react';
import { Clock, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';

export default function StatusBadge({ status = 'UPCOMING' }) {
  const s = (status || 'UPCOMING').toUpperCase().replace(/\s+/g, '_');

  const configs = {
    DUE_TODAY: { label: 'Due Today', className: 'due_today', icon: AlertCircle },
    DUE_SOON: { label: 'Due Soon', className: 'due_soon', icon: Clock },
    UPCOMING: { label: 'Upcoming', className: 'upcoming', icon: Calendar },
    OVERDUE: { label: 'Overdue', className: 'overdue', icon: AlertCircle },
    COMPLETED: { label: 'Completed', className: 'completed', icon: CheckCircle2 }
  };

  const current = configs[s] || configs.UPCOMING;
  const Icon = current.icon;

  return (
    <span className={`status-badge ${current.className}`}>
      <Icon size={12} />
      <span>{current.label}</span>
    </span>
  );
}
