import React from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  TrendingUp
} from 'lucide-react';

export default function DeanView({ deadlines, opportunities, user }) {
  const completedDeadlines = deadlines.filter(deadline =>
    deadline.completed || deadline.status === 'COMPLETED'
  );
  const overdueDeadlines = deadlines.filter(deadline =>
    !deadline.completed && deadline.status === 'OVERDUE'
  );
  const upcomingDeadlines = deadlines
    .filter(deadline => !deadline.completed && deadline.status !== 'OVERDUE')
    .sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate))
    .slice(0, 5);
  const courseSummaries = Object.values(deadlines.reduce((courses, deadline) => {
    const course = deadline.course || 'Institutional';
    if (!courses[course]) courses[course] = { name: course, total: 0, completed: 0 };
    courses[course].total += 1;
    if (deadline.completed || deadline.status === 'COMPLETED') {
      courses[course].completed += 1;
    }
    return courses;
  }, {}));

  const completionRate = deadlines.length
    ? Math.round((completedDeadlines.length / deadlines.length) * 100)
    : 0;

  const formatDate = (date) => {
    if (!date) return 'No date set';
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
      ? 'No date set'
      : parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="dean-view-container animate-fade-in">
      <style>{`
        .dean-view-container { display: grid; gap: 1.25rem; }
        .dean-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
        .dean-eyebrow { display: flex; align-items: center; gap: .5rem; color: #6d28d9; font-weight: 700; font-size: .78rem; text-transform: uppercase; letter-spacing: .06em; }
        .dean-view-container h2 { margin: .45rem 0; color: #172033; }
        .dean-subtitle { margin: 0; color: #64748b; max-width: 680px; }
        .dean-overview-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
        .dean-panel { background: white; border: 1px solid #e7eaf0; border-radius: 16px; padding: 1.2rem; }
        .dean-metric-label { color: #64748b; font-size: .82rem; font-weight: 600; }
        .dean-metric-value { display: block; margin: .55rem 0 .25rem; color: #172033; font-size: 1.8rem; font-weight: 750; }
        .dean-metric-note { color: #64748b; font-size: .78rem; }
        .dean-content-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(280px, .75fr); gap: 1rem; }
        .dean-panel-heading { display: flex; align-items: center; gap: .55rem; margin: 0 0 .25rem; color: #172033; }
        .dean-panel-intro { margin: 0 0 1rem; color: #64748b; font-size: .85rem; }
        .dean-course-row { padding: .9rem 0; border-top: 1px solid #eef0f4; }
        .dean-course-top { display: flex; justify-content: space-between; gap: 1rem; font-size: .86rem; font-weight: 650; }
        .dean-course-top span:last-child { color: #64748b; white-space: nowrap; }
        .dean-progress-track { height: 7px; margin-top: .6rem; overflow: hidden; border-radius: 99px; background: #eef2f7; }
        .dean-progress-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, #7c3aed, #2563eb); }
        .dean-deadline-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: .8rem 0; border-top: 1px solid #eef0f4; }
        .dean-deadline-title { color: #172033; font-size: .85rem; font-weight: 650; }
        .dean-deadline-meta { margin-top: .2rem; color: #64748b; font-size: .76rem; }
        .dean-deadline-date { color: #475569; font-size: .78rem; white-space: nowrap; }
        .dean-empty { color: #64748b; font-size: .86rem; padding: .7rem 0; }
        .dean-pulse { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; margin-top: 1rem; }
        .dean-pulse-item { display: flex; align-items: center; gap: .65rem; padding: .8rem; border-radius: 12px; background: #f8fafc; color: #475569; font-size: .8rem; }
        .dean-pulse-item strong { display: block; color: #172033; font-size: 1rem; }
        @media (max-width: 900px) { .dean-overview-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .dean-content-grid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .dean-header { display: block; } .dean-overview-grid { gap: .65rem; } .dean-panel { padding: 1rem; } .dean-deadline-row { align-items: flex-start; } .dean-pulse { grid-template-columns: 1fr; } }
      `}</style>

      <header className="dean-header">
        <div>
          <div className="dean-eyebrow"><GraduationCap size={16} /> Dean's Office • {user.department || 'Academic Affairs'}</div>
          <h2>Institutional Academic Overview</h2>
          <p className="dean-subtitle">
            Monitor academic milestones, completion trends, and campus opportunities across the institution.
          </p>
        </div>
      </header>

      <section className="dean-overview-grid" aria-label="Institutional overview metrics">
        <div className="dean-panel">
          <span className="dean-metric-label">Tracked milestones</span>
          <strong className="dean-metric-value">{deadlines.length}</strong>
          <span className="dean-metric-note">Academic deadlines in the system</span>
        </div>
        <div className="dean-panel">
          <span className="dean-metric-label">Completion rate</span>
          <strong className="dean-metric-value">{completionRate}%</strong>
          <span className="dean-metric-note">{completedDeadlines.length} milestones completed</span>
        </div>
        <div className="dean-panel">
          <span className="dean-metric-label">Overdue items</span>
          <strong className="dean-metric-value">{overdueDeadlines.length}</strong>
          <span className="dean-metric-note">Require institutional attention</span>
        </div>
        <div className="dean-panel">
          <span className="dean-metric-label">Active opportunities</span>
          <strong className="dean-metric-value">{opportunities.length}</strong>
          <span className="dean-metric-note">Career programs and events</span>
        </div>
      </section>

      <div className="dean-content-grid">
        <section className="dean-panel">
          <h3 className="dean-panel-heading"><TrendingUp size={17} /> Academic progress by course</h3>
          <p className="dean-panel-intro">Completion is calculated from the tracked deadlines for each course.</p>
          {courseSummaries.length ? courseSummaries.map(course => {
            const rate = Math.round((course.completed / course.total) * 100);
            return (
              <div className="dean-course-row" key={course.name}>
                <div className="dean-course-top">
                  <span>{course.name}</span>
                  <span>{course.completed}/{course.total} complete</span>
                </div>
                <div className="dean-progress-track" aria-label={`${course.name}: ${rate}% complete`}>
                  <div className="dean-progress-fill" style={{ width: `${rate}%` }} />
                </div>
              </div>
            );
          }) : <p className="dean-empty">No academic milestones are currently tracked.</p>}

          <div className="dean-pulse">
            <div className="dean-pulse-item">
              <BookOpen size={18} />
              <span><strong>{courseSummaries.length}</strong> courses represented</span>
            </div>
            <div className="dean-pulse-item">
              <Briefcase size={18} />
              <span><strong>{opportunities.length}</strong> campus opportunities</span>
            </div>
          </div>
        </section>

        <section className="dean-panel">
          <h3 className="dean-panel-heading"><CalendarDays size={17} /> Upcoming milestones</h3>
          <p className="dean-panel-intro">The next open deadlines across the institution.</p>
          {upcomingDeadlines.length ? upcomingDeadlines.map(deadline => (
            <div className="dean-deadline-row" key={deadline.id}>
              <div>
                <div className="dean-deadline-title">{deadline.title}</div>
                <div className="dean-deadline-meta">{deadline.course || 'Institutional deadline'}</div>
              </div>
              <span className="dean-deadline-date">{formatDate(deadline.dueDate)}</span>
            </div>
          )) : <p className="dean-empty">No upcoming deadlines.</p>}
          <div className="dean-pulse">
            <div className="dean-pulse-item">
              <CheckCircle2 size={18} />
              <span><strong>{completedDeadlines.length}</strong> completed</span>
            </div>
            <div className="dean-pulse-item">
              <AlertTriangle size={18} />
              <span><strong>{overdueDeadlines.length}</strong> overdue</span>
            </div>
            <div className="dean-pulse-item">
              <Clock3 size={18} />
              <span><strong>{upcomingDeadlines.length}</strong> next to review</span>
            </div>
            <div className="dean-pulse-item">
              <Award size={18} />
              <span><strong>{completionRate}%</strong> overall completion</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
