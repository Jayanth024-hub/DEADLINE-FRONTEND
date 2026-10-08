import React from 'react';

export default function LoadingSpinner({ text = 'Loading...', size = 32 }) {
  return (
    <div className="loading-spinner-wrap">
      <div 
        className="spinner-circle" 
        style={{ width: `${size}px`, height: `${size}px` }} 
      />
      {text && <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{text}</span>}
    </div>
  );
}
