import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = 'No records found', 
  description = 'There are currently no items matching your criteria.',
  actionText,
  onAction 
}) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon">
        <Icon size={24} />
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <button className="saas-btn saas-btn-primary saas-btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}
