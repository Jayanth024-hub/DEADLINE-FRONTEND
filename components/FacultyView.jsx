import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BarChart3, 
  GraduationCap, 
  ChevronRight,
  Send,
  FileText,
  X,
  Download,
  Check,
  ExternalLink
} from 'lucide-react';

export default function FacultyView({ 
  deadlines, 
  user, 
  onOpenAddModal 
}) {
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [activeReviewDeadline, setActiveReviewDeadline] = useState(null);
  const [submissionsData, setSubmissionsData] = useState({
    'Sai Jayanth': { roll: '22BCE1042', status: 'Submitted', date: 'Oct 01, 11:20 AM', grade: '95', feedback: 'Clean scheduling logic and Gantt implementation.', file: 'cpu_scheduler_impl.zip' },
    'Aarav Patel': { roll: '22BCE1043', status: 'Submitted', date: 'Oct 01, 09:45 AM', grade: '88', feedback: 'Good test cases, missing edge case for priority inversion.', file: 'lab_report_aarav.pdf' },
    'Riya Sharma': { roll: '22BCE1044', status: 'Submitted', date: 'Sep 30, 06:15 PM', grade: '92', feedback: 'Well structured and clear analysis.', file: 'os_simulation_riya.pdf' },
    'Rohan Gupta': { roll: '22BCE1045', status: 'Pending', date: '-', grade: '', feedback: '', file: null },
    'Priya Nair': { roll: '22BCE1046', status: 'Submitted', date: 'Oct 01, 01:10 PM', grade: '90', feedback: 'Great code comments and execution accuracy.', file: 'priya_os_final.c' }
  });
  const [facultyToast, setFacultyToast] = useState('');

  const showToast = (msg) => {
    setFacultyToast(msg);
    setTimeout(() => setFacultyToast(''), 3000);
  };

  const facultyDeadlines = deadlines.filter(d => 
    selectedCourse === 'All' || d.course.toLowerCase().includes(selectedCourse.toLowerCase())
  );

  const totalAssignments = facultyDeadlines.length;
  const totalSubmissionsReceived = facultyDeadlines.reduce((acc, d) => acc + (d.totalSubmissions || 45), 0);
  const totalStudentsExpected = facultyDeadlines.reduce((acc, d) => acc + (d.totalEnrolled || 60), 0);
  const avgSubmissionRate = totalStudentsExpected > 0 ? Math.round((totalSubmissionsReceived / totalStudentsExpected) * 100) : 0;

  const handleUpdateGrade = (studentName, newGrade) => {
    setSubmissionsData(prev => ({
      ...prev,
      [studentName]: { ...prev[studentName], grade: newGrade }
    }));
  };

  const handleUpdateFeedback = (studentName, newFeedback) => {
    setSubmissionsData(prev => ({
      ...prev,
      [studentName]: { ...prev[studentName], feedback: newFeedback }
    }));
  };

  const handleSaveEvaluation = (studentName) => {
    showToast(`Saved evaluation for ${studentName}: Grade ${submissionsData[studentName].grade}/100`);
  };

  const handleSendReminder = (studentName) => {
    showToast(`Submission reminder dispatched to ${studentName} (${submissionsData[studentName].roll})`);
  };

  const handleExportGradesCSV = () => {
    if (!activeReviewDeadline) return;
    const headers = ['Student Name', 'Roll Number', 'Assignment', 'Submission Status', 'Grade (100)', 'Faculty Feedback'];
    const rows = Object.entries(submissionsData).map(([name, data]) => [
      `"${name}"`,
      `"${data.roll}"`,
      `"${activeReviewDeadline.title}"`,
      `"${data.status}"`,
      `"${data.grade || 'N/A'}"`,
      `"${data.feedback || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeReviewDeadline.title.replace(/\s+/g, '_')}_grades.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Grades exported successfully as CSV.');
  };

  return (
    <div className="faculty-view-container animate-fade-in">
      {/* Header */}
      <div className="faculty-header-row">
        <div>
          <div className="role-eyebrow">
            <span className="faculty-dot"></span>
            Faculty Portal • {user.department || 'Department of Computer Science'}
          </div>
          <h2>Academic Management Console</h2>
          <p className="faculty-sub">
            Create academic deliverables, assign coursework to sections, and monitor real-time class submission progress.
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Publish Assignment</span>
        </button>
      </div>

      {facultyToast && (
        <div className="faculty-action-toast animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{facultyToast}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="faculty-stats-grid">
        <div className="stat-card white-card">
          <div className="stat-header">
            <span className="stat-title">Active Assignments</span>
            <div className="stat-icon-box stat-blue">
              <BookOpen size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number">{totalAssignments}</span>
            <span className="stat-pill pill-neutral">Across 2 Sections</span>
          </div>
          <span className="stat-hint">Operating Systems &amp; Lab Coursework</span>
        </div>

        <div className="stat-card white-card">
          <div className="stat-header">
            <span className="stat-title">Submissions Received</span>
            <div className="stat-icon-box stat-green">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number text-success">{totalSubmissionsReceived}</span>
            <span className="stat-pill pill-success">of {totalStudentsExpected} expected</span>
          </div>
          <span className="stat-hint">Active class enrollment</span>
        </div>

        <div className="stat-card white-card">
          <div className="stat-header">
            <span className="stat-title">Avg Submission Rate</span>
            <div className="stat-icon-box stat-purple">
              <BarChart3 size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number">{avgSubmissionRate}%</span>
            <span className="stat-pill pill-purple">On-time track</span>
          </div>
          <div className="mini-progress-bar">
            <div className="mini-progress-fill" style={{ width: `${avgSubmissionRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Course Selector Filter */}
      <div className="course-filter-card white-card">
        <span className="filter-title">Filter by Enrolled Course:</span>
        <div className="course-chips">
          {['All', 'Operating Systems', 'Database Systems', 'Networks', 'Machine Learning'].map(c => (
            <button 
              key={c}
              className={`course-chip ${selectedCourse === c ? 'active' : ''}`}
              onClick={() => setSelectedCourse(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Class Submission Monitor Table */}
      <div className="faculty-table-card white-card">
        <div className="table-header-box">
          <div>
            <h3>Course Deliverables &amp; Student Submissions</h3>
            <p>Live progress tracking for {user.section || 'All Sections'}</p>
          </div>
        </div>

        <div className="submissions-table-wrapper">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Deliverable Title</th>
                <th>Course</th>
                <th>Target Section</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Student Submissions</th>
                <th>Completion Rate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {facultyDeadlines.map(dl => {
                const submitted = dl.totalSubmissions || 48;
                const total = dl.totalEnrolled || 60;
                const pct = Math.round((submitted / total) * 100);

                return (
                  <tr key={dl.id}>
                    <td>
                      <div className="dl-title-box">
                        <strong>{dl.title}</strong>
                        <small>{dl.category}</small>
                      </div>
                    </td>
                    <td><span className="course-pill">{dl.course.split('-')[0]}</span></td>
                    <td><span className="section-pill">{dl.targetSection || 'Section A'}</span></td>
                    <td>
                      <div className="date-cell">
                        <Clock size={12} />
                        <span>{new Date(dl.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-tag tag-${dl.status.toLowerCase().replace('_', '-')}`}>
                        {dl.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="submission-count-box">
                        <strong>{submitted}</strong> / {total} students
                      </div>
                    </td>
                    <td>
                      <div className="table-progress-cell">
                        <span>{pct}%</span>
                        <div className="table-progress-bar">
                          <div className="table-progress-fill" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn-secondary btn-sm" 
                        onClick={() => setActiveReviewDeadline(dl)}
                        title="Review and grade student submissions"
                      >
                        <span>Review</span>
                        <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Grading Modal */}
      {activeReviewDeadline && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveReviewDeadline(null)}>
          <div className="modal-dialog review-modal white-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="review-modal-title">
                <div className="review-icon-badge">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3>{activeReviewDeadline.title}</h3>
                  <p>{activeReviewDeadline.course} • Due {new Date(activeReviewDeadline.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <button className="btn-ghost modal-close-btn" onClick={() => setActiveReviewDeadline(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="review-modal-actions-bar">
              <span className="review-summary-pill">
                <strong>{Object.values(submissionsData).filter(s => s.status === 'Submitted').length}</strong> of {Object.keys(submissionsData).length} Submitted
              </span>
              <button className="btn-secondary btn-sm" onClick={handleExportGradesCSV}>
                <Download size={13} />
                <span>Export Grades CSV</span>
              </button>
            </div>

            <div className="submissions-grading-list">
              {Object.entries(submissionsData).map(([name, data]) => {
                const isSubmitted = data.status === 'Submitted';

                return (
                  <div key={name} className="grading-student-card">
                    <div className="student-info-col">
                      <div className="student-avatar-badge">{name.charAt(0)}</div>
                      <div>
                        <strong>{name}</strong>
                        <small>Roll: {data.roll} • {data.date !== '-' ? `Turned in ${data.date}` : 'Not submitted yet'}</small>
                      </div>
                      <span className={`status-pill ${isSubmitted ? 'pill-success' : 'pill-danger'}`}>
                        {data.status}
                      </span>
                    </div>

                    {isSubmitted ? (
                      <div className="grading-controls-row">
                        <div className="grade-input-box">
                          <label>Score (100):</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            value={data.grade} 
                            onChange={(e) => handleUpdateGrade(name, e.target.value)}
                            className="grade-num-input"
                          />
                        </div>

                        <div className="feedback-input-box">
                          <label>Feedback:</label>
                          <input 
                            type="text" 
                            placeholder="Add evaluation comments..."
                            value={data.feedback} 
                            onChange={(e) => handleUpdateFeedback(name, e.target.value)}
                            className="feedback-text-input"
                          />
                        </div>

                        <button 
                          className="btn-primary btn-sm save-grade-btn"
                          onClick={() => handleSaveEvaluation(name)}
                          title="Save grade and feedback"
                        >
                          <Check size={13} />
                          <span>Save</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pending-student-actions">
                        <span className="pending-msg">Student has not turned in the work.</span>
                        <button 
                          className="btn-secondary btn-sm"
                          onClick={() => handleSendReminder(name)}
                        >
                          <Send size={12} />
                          <span>Send Reminder</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="modal-footer-row">
              <button className="btn-secondary" onClick={() => setActiveReviewDeadline(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .faculty-view-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.75rem 0 3rem 0;
        }

        .faculty-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .role-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #d97706;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .faculty-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f59e0b;
        }

        .faculty-header-row h2 {
          font-size: 1.625rem;
          margin-bottom: 0.25rem;
        }

        .faculty-sub {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .faculty-action-toast {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          font-weight: 600;
        }

        /* Stats */
        .faculty-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .course-filter-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.25rem;
          flex-wrap: wrap;
        }

        .filter-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .course-chips {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .course-chip {
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
        }

        .course-chip:hover {
          border-color: #cbd5e1;
          color: var(--text-main);
        }

        .course-chip.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
        }

        /* Submissions Table */
        .faculty-table-card {
          padding: 1.5rem;
          background: #ffffff;
        }

        .table-header-box {
          margin-bottom: 1.25rem;
        }

        .table-header-box h3 {
          font-size: 1.125rem;
          margin-bottom: 0.125rem;
        }

        .table-header-box p {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .submissions-table-wrapper {
          overflow-x: auto;
        }

        .submissions-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
        }

        .submissions-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          font-size: 0.6875rem;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--surface-border);
        }

        .submissions-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--surface-border-subtle);
          vertical-align: middle;
        }

        .dl-title-box {
          display: flex;
          flex-direction: column;
        }

        .dl-title-box strong {
          color: var(--text-main);
          font-size: 0.875rem;
        }

        .dl-title-box small {
          color: var(--text-muted);
        }

        .course-pill {
          font-weight: 700;
          color: var(--primary);
          background: var(--primary-light);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
        }

        .section-pill {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-muted);
        }

        .status-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          display: inline-block;
        }

        .tag-upcoming { background: #f1f5f9; color: #475569; }
        .tag-due-soon { background: #fef3c7; color: #b45309; }
        .tag-due-today { background: #fee2e2; color: #b91c1c; }
        .tag-overdue { background: #ffe4e6; color: #be123c; }
        .tag-completed { background: #dcfce7; color: #15803d; }

        .submission-count-box strong {
          color: var(--text-main);
        }

        .table-progress-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .table-progress-cell span {
          min-width: 32px;
          font-weight: 700;
          color: var(--text-main);
        }

        .table-progress-bar {
          width: 70px;
          height: 6px;
          background: var(--bg-subtle);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .table-progress-fill {
          height: 100%;
          background: var(--primary);
          border-radius: var(--radius-full);
        }

        .btn-sm {
          padding: 0.35rem 0.625rem;
          font-size: 0.75rem;
          gap: 0.35rem;
        }

        /* Review Modal */
        .review-modal {
          max-width: 760px;
          width: 95%;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
        }

        .review-modal-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .review-icon-badge {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: #fef3c7;
          color: #d97706;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .review-modal-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid var(--surface-border);
        }

        .review-summary-pill {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .submissions-grading-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          overflow-y: auto;
          max-height: 480px;
          padding-right: 0.25rem;
        }

        .grading-student-card {
          padding: 0.875rem 1rem;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .student-info-col {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .student-avatar-badge {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #4338ca;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .student-info-col div {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .student-info-col strong {
          font-size: 0.8125rem;
          color: var(--text-main);
        }

        .student-info-col small {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .grading-controls-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .grade-input-box {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .grade-num-input {
          width: 60px;
          padding: 0.3rem 0.5rem;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-sm);
          font-size: 0.8125rem;
          font-weight: 700;
          text-align: center;
        }

        .feedback-input-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 220px;
        }

        .feedback-text-input {
          flex: 1;
          padding: 0.35rem 0.625rem;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
        }

        .pending-student-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .modal-footer-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--surface-border);
        }

        @media (max-width: 900px) {
          .faculty-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
