import React from 'react';

export default function ProgressBar({ progress = 0, variant = 'primary', height = 6, showLabel = false }) {
  const bounded = Math.min(100, Math.max(0, Number(progress) || 0));

  let variantClass = 'primary';
  if (variant === 'success' || bounded >= 100) variantClass = 'success';
  else if (variant === 'danger' || bounded < 25) variantClass = 'danger';
  else if (variant === 'warning' || bounded < 50) variantClass = 'warning';

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
          <span>Progress</span>
          <span>{bounded}%</span>
        </div>
      )}
      <div className="progress-track" style={{ height: `${height}px` }}>
        <div 
          className={`progress-fill ${variantClass}`} 
          style={{ width: `${bounded}%` }}
        />
      </div>
    </div>
  );
}
