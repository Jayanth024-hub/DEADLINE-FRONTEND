import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  trendUp = true,
  color = 'primary'
}) {
  const colorMap = {
    primary: { bg: '#e0f2fe', color: '#0284c7' },
    success: { bg: '#ecfdf5', color: '#10b981' },
    warning: { bg: '#fffbeb', color: '#f59e0b' },
    danger: { bg: '#fef2f2', color: '#ef4444' },
    purple: { bg: '#f5f3ff', color: '#8b5cf6' }
  };

  const style = colorMap[color] || colorMap.primary;

  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className="stat-card-icon-box" style={{ background: style.bg, color: style.color }}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      {(description || trend) && (
        <div className="stat-card-desc">
          {trend && (
            <span className={trendUp ? 'stat-trend-up' : 'stat-trend-down'}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
          <span>{description}</span>
        </div>
      )}
    </div>
  );
}
