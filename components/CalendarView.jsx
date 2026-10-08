import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Plus, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function CalendarView({ 
  deadlines, 
  onToggleComplete, 
  onOpenAddModal 
}) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [selectedDay, setSelectedDay] = useState(4); // Default select day 4
  const [showInspector, setShowInspector] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const currentMonthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Calculate start day of week (Sun=0, Mon=1, etc.) and total days
  const startDayOffset = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthStr = String(month + 1).padStart(2, '0');

  // Days array with padding for previous month
  const calendarCells = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarCells.push({ dayNumber: null, isCurrentMonth: false });
  }
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const datePrefix = `${year}-${monthStr}-${dayStr}`;
    const dayDeadlines = deadlines.filter(d => d.dueDate && d.dueDate.startsWith(datePrefix));

    calendarCells.push({
      dayNumber: day,
      isCurrentMonth: true,
      deadlines: dayDeadlines,
      isToday: day === 1 && month === 9 && year === 2026
    });
  }

  const selectedDatePrefix = `${year}-${monthStr}-${String(selectedDay).padStart(2, '0')}`;
  const selectedDeadlines = deadlines.filter(d => d.dueDate && d.dueDate.startsWith(selectedDatePrefix));

  // Determine category-specific soft badge class
  const getEventBadgeClass = (category, priority, isCompleted) => {
    if (isCompleted) return 'event-completed';
    const cat = (category || '').toUpperCase();
    if (cat === 'ASSIGNMENT') return 'event-assignment';
    if (cat === 'EXAM') return 'event-exam';
    if (cat === 'PROJECT') return 'event-project';
    if (cat === 'LAB') return 'event-lab';
    if (cat === 'CAREER') return 'event-career';
    
    // Priority fallbacks
    const prio = (priority || '').toUpperCase();
    if (prio === 'URGENT') return 'event-urgent';
    if (prio === 'HIGH') return 'event-high';
    return 'event-assignment';
  };

  return (
    <div className="calendar-page-container animate-fade-in">
      {/* Calendar Header Bar */}
      <div className="calendar-header-row">
        <div className="header-title-block">
          <h2>Academic Calendar</h2>
          <p className="calendar-subtitle">Monthly timeline of assignments, tests, project milestones, and career deadlines.</p>
        </div>

        <div className="calendar-controls-group">
          {/* Month Navigator */}
          <div className="month-selector white-card">
            <button 
              className="btn-ghost nav-arrow-btn" 
              title="Previous Month" 
              aria-label="Previous Month"
              onClick={handlePrevMonth}
            >
              <ChevronLeft size={15} />
            </button>
            <span className="current-month-label">{currentMonthName}</span>
            <button 
              className="btn-ghost nav-arrow-btn" 
              title="Next Month" 
              aria-label="Next Month"
              onClick={handleNextMonth}
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Toggle Inspector Button */}
          <button 
            className="btn-secondary toggle-inspector-btn"
            onClick={() => setShowInspector(!showInspector)}
            title={showInspector ? "Hide day details panel" : "Show day details panel"}
          >
            {showInspector ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="btn-text">{showInspector ? 'Hide Details' : 'Show Details'}</span>
          </button>

          {/* Add Event */}
          <button className="btn-primary add-event-btn" onClick={onOpenAddModal}>
            <Plus size={15} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Layout: Grid on Left, Selected Day Inspector on Right */}
      <div className={`calendar-layout-grid ${!showInspector ? 'full-width-mode' : ''}`}>
        {/* Left Side: Calendar Board */}
        <div className="calendar-board white-card">
          {/* 7-Day Weekday Headers */}
          <div className="weekdays-grid">
            <div className="weekday-header-cell">Sun</div>
            <div className="weekday-header-cell">Mon</div>
            <div className="weekday-header-cell">Tue</div>
            <div className="weekday-header-cell">Wed</div>
            <div className="weekday-header-cell">Thu</div>
            <div className="weekday-header-cell">Fri</div>
            <div className="weekday-header-cell">Sat</div>
          </div>

          {/* 7-Day Month Grid */}
          <div className="days-matrix-grid">
            {calendarCells.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return <div key={`empty-${idx}`} className="calendar-day-cell empty-cell"></div>;
              }

              const hasDeadlines = cell.deadlines.length > 0;
              const isSelected = selectedDay === cell.dayNumber;

              return (
                <div 
                  key={`day-${cell.dayNumber}`}
                  className={`calendar-day-cell ${cell.isToday ? 'cell-today' : ''} ${isSelected ? 'cell-selected' : ''}`}
                  onClick={() => setSelectedDay(cell.dayNumber)}
                  role="button"
                  tabIndex={0}
                  title={`October ${cell.dayNumber}: ${cell.deadlines.length} deliverable(s)`}
                >
                  <div className="day-cell-top">
                    <span className={`day-number ${cell.isToday ? 'today-pill' : ''}`}>
                      {cell.dayNumber}
                    </span>
                    {hasDeadlines && (
                      <span className="day-count-indicator">
                        {cell.deadlines.length}
                      </span>
                    )}
                  </div>

                  <div className="day-events-stack">
                    {cell.deadlines.slice(0, 2).map(dl => {
                      const isDone = dl.completed || dl.status === 'COMPLETED';
                      const badgeClass = getEventBadgeClass(dl.category, dl.priority, isDone);

                      return (
                        <div 
                          key={dl.id} 
                          className={`day-event-badge ${badgeClass}`}
                          title={`${dl.title} • ${dl.course}`}
                        >
                          <span className="event-title-trunc">{dl.title}</span>
                        </div>
                      );
                    })}
                    {cell.deadlines.length > 2 && (
                      <span className="more-events-label">+{cell.deadlines.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clean Legend Bar */}
          <div className="calendar-legend-bar">
            <span className="legend-label">Categories:</span>
            <div className="legend-items">
              <span className="legend-chip"><span className="legend-dot dot-assignment"></span> Assignment</span>
              <span className="legend-chip"><span className="legend-dot dot-exam"></span> Exam</span>
              <span className="legend-chip"><span className="legend-dot dot-project"></span> Project</span>
              <span className="legend-chip"><span className="legend-dot dot-lab"></span> Lab</span>
              <span className="legend-chip"><span className="legend-dot dot-completed"></span> Completed</span>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Day Deliverables Inspector */}
        {showInspector && (
          <div className="day-inspector-panel white-card">
            <div className="inspector-header">
              <div className="inspector-date-box">
                <span className="inspector-day-name">{currentDate.toLocaleDateString('en-US', { month: 'long' })} {selectedDay}, {year}</span>
                <span className="inspector-sub">
                  {selectedDeadlines.length} {selectedDeadlines.length === 1 ? 'deliverable' : 'deliverables'} scheduled
                </span>
              </div>
            </div>

            <div className="inspector-body">
              {selectedDeadlines.length === 0 ? (
                <div className="inspector-empty">
                  <CalendarIcon size={32} className="empty-cal-icon" />
                  <h4>No deliverables scheduled</h4>
                  <p>{currentDate.toLocaleDateString('en-US', { month: 'long' })} {selectedDay} is clear. A great time for focused study, revision, or project work.</p>
                  <button 
                    className="btn-secondary add-day-btn" 
                    onClick={() => onOpenAddModal && onOpenAddModal({ dueDate: `${year}-${monthStr}-${String(selectedDay).padStart(2, '0')}T23:59:00` })}
                  >
                    <Plus size={14} />
                    <span>Add deadline for this date</span>
                  </button>
                </div>
              ) : (
                <div className="inspector-tasks-list">
                  {selectedDeadlines.map(dl => {
                    const isDone = dl.completed || dl.status === 'COMPLETED';

                    return (
                      <div key={dl.id} className="inspector-task-card">
                        <div className="inspector-task-top">
                          <span className="inspector-course">{dl.course}</span>
                          <span className={`badge badge-${(dl.priority || 'medium').toLowerCase()}`}>
                            {dl.priority}
                          </span>
                        </div>
                        <h4 className={`inspector-title ${isDone ? 'line-through' : ''}`}>
                          {dl.title}
                        </h4>
                        <p className="inspector-notes">{dl.notes}</p>
                        
                        <div className="inspector-task-footer">
                          <div className="inspector-time">
                            <Clock size={12} />
                            <span>{new Date(dl.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <button 
                            className={`btn-ghost complete-toggle ${isDone ? 'text-success' : ''}`}
                            onClick={() => onToggleComplete(dl.id)}
                            title={isDone ? "Mark as pending" : "Mark as completed"}
                          >
                            <CheckCircle2 size={15} />
                            <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* ==========================================================================
           DeadlineIQ - Calendar Page (SaaS Responsive Grid Layout)
           ========================================================================== */

        .calendar-page-container {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.25rem 0 2.5rem 0;
          box-sizing: border-box;
        }

        /* Top Header */
        .calendar-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.875rem;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .header-title-block {
          min-width: 0;
        }

        .header-title-block h2 {
          font-size: 1.5rem; /* 24px */
          font-weight: 600;
          color: var(--text-main);
          letter-spacing: -0.015em;
          margin-bottom: 0.15rem;
        }

        .calendar-subtitle {
          font-size: 0.875rem; /* 14px */
          font-weight: 400;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .calendar-controls-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .month-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.5rem;
          background: #ffffff;
        }

        .current-month-label {
          font-weight: 600;
          font-size: 0.8125rem;
          color: var(--text-main);
          min-width: 100px;
          text-align: center;
          user-select: none;
        }

        .nav-arrow-btn {
          padding: 0.25rem;
          color: var(--text-secondary);
        }

        .toggle-inspector-btn {
          font-size: 0.75rem;
          padding: 0.4rem 0.65rem;
        }

        .add-event-btn {
          font-size: 0.75rem;
          padding: 0.4rem 0.8rem;
        }

        /* ==========================================================================
           2-Column Grid Layout (Calendar Board + Day Inspector)
           ========================================================================== */

        .calendar-layout-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 310px;
          gap: 1.25rem;
          align-items: start;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .calendar-layout-grid.full-width-mode {
          grid-template-columns: minmax(0, 1fr);
        }

        /* ==========================================================================
           Calendar Board & 7-Day Responsive CSS Grid
           ========================================================================== */

        .calendar-board {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          padding: 1.125rem;
          background: #ffffff;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-lg);
          box-sizing: border-box;
          overflow: hidden;
        }

        /* Weekday Headers: STRICTLY 7 EQUAL COLUMNS */
        .weekdays-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          width: 100%;
          max-width: 100%;
          min-width: 0;
          gap: 0.35rem;
          box-sizing: border-box;
          text-align: center;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--surface-border);
          margin-bottom: 0.35rem;
        }

        .weekday-header-cell {
          font-size: 0.75rem; /* 12px */
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0.25rem 0;
        }

        /* Month Days: STRICTLY 7 EQUAL COLUMNS */
        .days-matrix-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0.35rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .calendar-day-cell {
          min-height: 102px;
          max-height: 118px;
          min-width: 0;
          width: 100%;
          overflow: hidden;
          padding: 0.35rem 0.45rem;
          background: #ffffff;
          border: 1px solid var(--surface-border-subtle);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .calendar-day-cell:hover {
          background: #fbfcfe;
          border-color: #cbd5e1;
        }

        .calendar-day-cell.cell-selected {
          border-color: var(--primary);
          background: #f0f9ff;
          box-shadow: 0 0 0 1.5px rgba(2, 132, 199, 0.25);
        }

        .calendar-day-cell.cell-today {
          border-color: #c7d2fe;
          background: #fbfbfe;
        }

        .empty-cell {
          background: transparent;
          border-color: transparent;
          cursor: default;
          pointer-events: none;
        }

        /* Day Cell Header */
        .day-cell-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 0;
          margin-bottom: 0.2rem;
        }

        .day-number {
          font-size: 0.8125rem; /* 13px */
          font-weight: 500;
          color: var(--text-secondary);
          line-height: 1;
        }

        .today-pill {
          background: var(--primary);
          color: #ffffff;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 0.6875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .day-count-indicator {
          font-size: 0.625rem;
          font-weight: 600;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.05rem 0.3rem;
          border-radius: var(--radius-full);
          line-height: 1;
        }

        /* Event Badges Stack inside Day Cell */
        .day-events-stack {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
          width: 100%;
          overflow: hidden;
          margin-top: 0.15rem;
        }

        .day-event-badge {
          font-size: 0.6875rem; /* 11px */
          font-weight: 500;
          line-height: 1.35;
          padding: 0.18rem 0.38rem;
          border-radius: 4px;
          min-width: 0;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          box-sizing: border-box;
          border: 1px solid transparent;
          cursor: pointer;
          transition: transform 0.1s ease;
        }

        .day-event-badge:hover {
          transform: translateY(-1px);
        }

        .event-title-trunc {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }

        /* Sophisticated Soft Event Colors */
        .event-assignment, .event-urgent {
          background: #fffbeb;
          border-color: #fef3c7;
          color: #92400e;
        }

        .event-exam, .event-high {
          background: #fef2f2;
          border-color: #fee2e2;
          color: #991b1b;
        }

        .event-project {
          background: #f5f3ff;
          border-color: #ede9fe;
          color: #6b21a8;
        }

        .event-lab {
          background: #f0f9ff;
          border-color: #e0f2fe;
          color: #0369a1;
        }

        .event-career {
          background: #ecfdf5;
          border-color: #d1fae5;
          color: #065f46;
        }

        .event-completed {
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #64748b;
          text-decoration: line-through;
          opacity: 0.75;
        }

        .more-events-label {
          font-size: 0.5625rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 1px;
        }

        /* Legend */
        .calendar-legend-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--surface-border);
          font-size: 0.75rem;
          flex-wrap: wrap;
        }

        .legend-label {
          font-weight: 600;
          color: var(--text-muted);
          font-size: 0.6875rem;
          text-transform: uppercase;
        }

        .legend-items {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .legend-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.6875rem;
          color: var(--text-secondary);
        }

        .legend-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .dot-assignment { background: #f59e0b; }
        .dot-exam { background: #ef4444; }
        .dot-project { background: #8b5cf6; }
        .dot-lab { background: #0284c7; }
        .dot-completed { background: #10b981; }

        /* ==========================================================================
           Selected Day Deliverables Inspector Panel
           ========================================================================== */

        .day-inspector-panel {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          padding: 1.25rem;
          background: #ffffff;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-lg);
          box-sizing: border-box;
        }

        .inspector-header {
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--surface-border);
          margin-bottom: 0.875rem;
        }

        .inspector-day-name {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
          display: block;
        }

        .inspector-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .inspector-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 0.5rem;
          gap: 0.35rem;
        }

        .empty-cal-icon {
          color: var(--text-subtle);
          margin-bottom: 0.25rem;
        }

        .inspector-empty h4 {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .inspector-empty p {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }

        .add-day-btn {
          font-size: 0.75rem;
          padding: 0.35rem 0.75rem;
        }

        .inspector-tasks-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .inspector-task-card {
          padding: 0.75rem;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
        }

        .inspector-task-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.2rem;
        }

        .inspector-course {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--primary);
        }

        .inspector-title {
          font-size: 0.8125rem;
          font-weight: 600;
          margin-bottom: 0.2rem;
          line-height: 1.3;
        }

        .inspector-title.line-through {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .inspector-notes {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.35;
          margin-bottom: 0.5rem;
        }

        .inspector-task-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.4rem;
          border-top: 1px solid var(--surface-border-subtle);
        }

        .inspector-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .complete-toggle {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.2rem 0.35rem;
        }

        /* ==========================================================================
           Responsive Layout Rules
           ========================================================================== */

        @media (max-width: 1180px) {
          .calendar-layout-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .day-inspector-panel {
            margin-top: 0.5rem;
          }
        }

        @media (max-width: 768px) {
          .calendar-day-cell {
            min-height: 85px;
            padding: 0.25rem;
          }
          .day-event-badge {
            font-size: 0.625rem;
            padding: 0.12rem 0.25rem;
          }
          .toggle-inspector-btn .btn-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
