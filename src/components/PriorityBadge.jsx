import React from 'react';

export default function PriorityBadge({ priority = 'MEDIUM' }) {
  const p = (priority || 'MEDIUM').toUpperCase();

  const config = {
    URGENT: { label: 'Urgent', className: 'urgent', dot: '🔴' },
    HIGH: { label: 'High', className: 'high', dot: '🟠' },
    MEDIUM: { label: 'Medium', className: 'medium', dot: '🟡' },
    LOW: { label: 'Low', className: 'low', dot: '🔵' }
  };

  const current = config[p] || config.MEDIUM;

  return (
    <span className={`priority-badge ${current.className}`}>
      <span>{current.dot}</span>
      <span>{current.label}</span>
    </span>
  );
}
