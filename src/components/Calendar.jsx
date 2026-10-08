import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import PriorityBadge from './PriorityBadge';

export default function Calendar({ deadlines = [], onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date('2026-10-01T00:00:00'));
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  // Adjust Monday as start of week (0 for Mon, 6 for Sun)
  const startingDay = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const days = [];
  // Prev month padding
  for (let i = startingDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false, dateStr: null });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({ day: i, isCurrentMonth: true, dateStr: formatted });
  }
  // Next month padding to fill grid
  const remaining = 35 - days.length > 0 ? 35 - days.length : (42 - days.length);
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, isCurrentMonth: false, dateStr: null });
  }

  // Group deadlines by day string (YYYY-MM-DD)
  const deadlinesByDate = {};
  deadlines.forEach(dl => {
    if (dl.dueDate) {
      const dStr = dl.dueDate.split('T')[0];
      if (!deadlinesByDate[dStr]) deadlinesByDate[dStr] = [];
      deadlinesByDate[dStr].push(dl);
    }
  });

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const handleDayClick = (cell) => {
    if (!cell.isCurrentMonth) return;
    setSelectedDate(cell.dateStr);
    if (onSelectDate) onSelectDate(cell.dateStr);
  };

  const selectedDeadlines = selectedDate ? (deadlinesByDate[selectedDate] || []) : [];

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={20} style={{ color: 'var(--primary-blue)' }} />
          <h3 className="calendar-month-title">
            {monthNames[month]} {year}
          </h3>
        </div>
        <div className="calendar-nav-buttons">
          <button className="saas-btn saas-btn-secondary saas-btn-sm" onClick={prevMonth}>
            <ChevronLeft size={16} />
          </button>
          <button 
            className="saas-btn saas-btn-secondary saas-btn-sm" 
            onClick={() => setCurrentDate(new Date('2026-10-01'))}
          >
            Today
          </button>
          <button className="saas-btn saas-btn-secondary saas-btn-sm" onClick={nextMonth}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(dayName => (
          <div key={dayName} className="calendar-day-header">{dayName}</div>
        ))}

        {days.map((cell, idx) => {
          const dayDeadlines = cell.dateStr ? (deadlinesByDate[cell.dateStr] || []) : [];
          const isToday = cell.dateStr === '2026-10-01'; // Simulated today
          const isSelected = cell.dateStr === selectedDate;

          return (
            <div
              key={idx}
              className={`calendar-day-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDayClick(cell)}
            >
              <span className="day-number">{cell.day}</span>
              
              {dayDeadlines.length > 0 && (
                <div className="calendar-deadline-dots">
                  {dayDeadlines.slice(0, 3).map((dl, dIdx) => (
                    <div 
                      key={dIdx} 
                      className={`deadline-dot ${dl.priority?.toLowerCase() || 'medium'}`} 
                      title={`${dl.title} (${dl.priority})`}
                    />
                  ))}
                  {dayDeadlines.length > 3 && (
                    <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)' }}>
                      +{dayDeadlines.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
            Deadlines on {selectedDate} ({selectedDeadlines.length})
          </div>
          {selectedDeadlines.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No deadlines due on this day.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedDeadlines.map(dl => (
                <div 
                  key={dl.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'white',
                    borderRadius: '6px',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{dl.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dl.course} • {dl.category}</div>
                  </div>
                  <PriorityBadge priority={dl.priority} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
