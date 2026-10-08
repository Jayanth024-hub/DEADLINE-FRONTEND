import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  Calendar as CalendarIcon, 
  AlertCircle,
  Tag,
  Kanban,
  List as ListIcon,
  ChevronDown,
  X,
  Check,
  RotateCcw
} from 'lucide-react';

export default function DeadlinesView({ 
  deadlines, 
  onToggleComplete, 
  onDeleteDeadline, 
  onUpdateProgress,
  onOpenAddModal,
  onEditDeadline
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [editingDeadline, setEditingDeadline] = useState(null);

  const categories = ['All', 'Assignment', 'Project', 'Exam', 'Lab Submission'];
  const priorities = ['All', 'Urgent', 'High', 'Medium', 'Low'];
  const statuses = ['All', 'Pending', 'In Progress', 'Completed'];

  // Filtering Logic
  const filteredDeadlines = deadlines.filter(d => {
    const matchesSearch = 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || d.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || d.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const getDueTimeText = (dateString, status) => {
    if (status === 'Completed') return 'Completed';
    const dueDate = new Date(dateString);
    const now = new Date('2026-10-01T13:30:00'); // current simulated time
    const diffHours = Math.round((dueDate - now) / (1000 * 60 * 60));
    
    if (diffHours < 0) return 'Overdue';
    if (diffHours < 24) return `Due in ${diffHours} hours`;
    const diffDays = Math.ceil(diffHours / 24);
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingDeadline || !onEditDeadline) return;
    onEditDeadline(editingDeadline);
    setEditingDeadline(null);
  };

  return (
    <div className="deadlines-container animate-fade-in">
      {/* Top Header */}
      <div className="page-header-row">
        <div>
          <h2>Academic Deadlines</h2>
          <p className="page-header-sub">
            Track, prioritize, and manage all your assignments, projects, exams, and labs in one clean interface.
          </p>
        </div>
        <div className="header-actions-group">
          <div className="view-mode-toggle">
            <button 
              className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <ListIcon size={16} />
              <span>List</span>
            </button>
            <button 
              className={`view-mode-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View"
            >
              <Kanban size={16} />
              <span>Kanban</span>
            </button>
          </div>
          <button className="btn-primary" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Add Deadline</span>
          </button>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="control-filter-bar white-card">
        {/* Search */}
        <div className="search-box-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by title, subject, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Status Filters */}
        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <div className="chip-list">
            {statuses.map(s => (
              <button 
                key={s} 
                className={`filter-chip ${selectedStatus === s ? 'active' : ''}`}
                onClick={() => setSelectedStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-group">
          <span className="filter-label">Category:</span>
          <div className="chip-list">
            {categories.map(c => (
              <button 
                key={c} 
                className={`filter-chip ${selectedCategory === c ? 'active' : ''}`}
                onClick={() => setSelectedCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <span className="filter-label">Priority:</span>
          <select 
            value={selectedPriority} 
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="priority-select"
          >
            {priorities.map(p => (
              <option key={p} value={p}>{p === 'All' ? 'All Priorities' : `${p} Priority`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Rendering: List View or Kanban View */}
      {viewMode === 'list' ? (
        <div className="deadlines-list-wrapper">
          {filteredDeadlines.length === 0 ? (
            <div className="empty-state-box white-card">
              <AlertCircle size={36} className="empty-icon" />
              <h4>No deadlines match your filter</h4>
              <p>Try resetting the search terms or change your priority/status filters.</p>
              <button 
                className="btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedPriority('All');
                  setSelectedStatus('All');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredDeadlines.map(deadline => {
              const isDone = deadline.status === 'Completed';
              const dueText = getDueTimeText(deadline.dueDate, deadline.status);
              const isUrgent = dueText.includes('hours') || dueText.includes('tomorrow') || dueText === 'Overdue';

              return (
                <div key={deadline.id} className={`deadline-row-card white-card ${isDone ? 'is-completed' : ''}`}>
                  {/* Left Checkbox */}
                  <button 
                    className="row-check-btn" 
                    onClick={() => onToggleComplete(deadline.id)}
                    title={isDone ? "Mark as pending" : "Mark as completed"}
                  >
                    {isDone ? (
                      <CheckCircle2 size={22} className="check-done-icon" />
                    ) : (
                      <Circle size={22} className="check-empty-icon" />
                    )}
                  </button>

                  {/* Main Details */}
                  <div className="row-main-details">
                    <div className="row-meta-badges">
                      <span className="course-badge">{deadline.course}</span>
                      <span className={`badge badge-${deadline.priority.toLowerCase()}`}>
                        {deadline.priority} Priority
                      </span>
                      <span className="category-tag">{deadline.category}</span>
                    </div>

                    <h3 className={`row-title ${isDone ? 'line-through' : ''}`}>
                      {deadline.title}
                    </h3>
                    <p className="row-notes">{deadline.notes}</p>

                    <div className="row-bottom-bar">
                      <div className={`countdown-chip ${isUrgent && !isDone ? 'countdown-urgent' : ''}`}>
                        <Clock size={13} />
                        <span>{dueText} • {new Date(deadline.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className="tags-cluster">
                        {deadline.tags.map(t => (
                          <span key={t} className="mini-tag">#{t}</span>
                        ))}
                      </div>

                      <span className="instructor-label">Faculty: {deadline.instructor}</span>
                    </div>
                  </div>

                  {/* Progress & Actions */}
                  <div className="row-right-actions">
                    <div className="progress-interactive-box">
                      <div className="progress-label-row">
                        <span>Progress</span>
                        <strong>{deadline.progress}%</strong>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        value={deadline.progress}
                        onChange={(e) => onUpdateProgress(deadline.id, parseInt(e.target.value))}
                        className="progress-slider"
                      />
                    </div>

                    <div className="row-buttons-group">
                      <button 
                        className="btn-ghost edit-btn" 
                        onClick={() => setEditingDeadline(deadline)}
                        title="Edit Deliverable"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button 
                        className="btn-ghost delete-btn" 
                        onClick={() => onDeleteDeadline(deadline.id)}
                        title="Delete Deadline"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Kanban Board View */
        <div className="kanban-board-grid">
          {['Pending', 'In Progress', 'Completed'].map(colStatus => {
            const colDeadlines = filteredDeadlines.filter(d => d.status === colStatus);

            return (
              <div key={colStatus} className="kanban-column white-card">
                <div className="kanban-column-header">
                  <div className="kanban-col-title-group">
                    <span className={`kanban-indicator-dot dot-${colStatus.toLowerCase().replace(' ', '-')}`}></span>
                    <h4>{colStatus}</h4>
                  </div>
                  <div className="kanban-header-right">
                    <span className="kanban-count-badge">{colDeadlines.length}</span>
                    <button 
                      className="btn-ghost btn-mini" 
                      onClick={onOpenAddModal}
                      title={`Add deadline`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="kanban-cards-stack">
                  {colDeadlines.length === 0 ? (
                    <div className="kanban-empty-slot">No deliverables in {colStatus}</div>
                  ) : (
                    colDeadlines.map(d => (
                      <div key={d.id} className="kanban-card">
                        <div className="kanban-card-top">
                          <span className="course-code-mini">{d.course.split('-')[0]}</span>
                          <span className={`badge badge-${d.priority.toLowerCase()}`}>{d.priority}</span>
                        </div>
                        <h5 className="kanban-card-title">{d.title}</h5>
                        <p className="kanban-card-notes">{d.notes}</p>
                        
                        <div className="kanban-card-progress-bar">
                          <div className="kanban-progress-fill" style={{ width: `${d.progress}%` }}></div>
                        </div>

                        <div className="kanban-card-footer">
                          <div className="kanban-due-tag">
                            <Clock size={12} />
                            <span>{new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>

                          <div className="kanban-actions-cluster">
                            {colStatus === 'Pending' && (
                              <button 
                                className="kanban-stage-btn btn-stage-start"
                                onClick={() => onUpdateProgress(d.id, 30)}
                                title="Move to In Progress (30%)"
                              >
                                Start
                              </button>
                            )}
                            {colStatus === 'In Progress' && (
                              <button 
                                className="kanban-stage-btn btn-stage-done"
                                onClick={() => onToggleComplete(d.id)}
                                title="Mark Completed (100%)"
                              >
                                Done
                              </button>
                            )}
                            {colStatus === 'Completed' && (
                              <button 
                                className="kanban-stage-btn btn-stage-reopen"
                                onClick={() => onUpdateProgress(d.id, 50)}
                                title="Reopen as In Progress (50%)"
                              >
                                Reopen
                              </button>
                            )}

                            <button 
                              className="btn-ghost btn-mini"
                              onClick={() => setEditingDeadline(d)}
                              title="Edit Deliverable"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button 
                              className="btn-ghost btn-mini delete-btn"
                              onClick={() => onDeleteDeadline(d.id)}
                              title="Delete Deliverable"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Deadline Modal */}
      {editingDeadline && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setEditingDeadline(null)}>
          <div className="modal-dialog edit-dl-modal white-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>Edit Academic Deliverable</h3>
                <p>Modify task details, priority, and progress</p>
              </div>
              <button className="btn-ghost modal-close-btn" onClick={() => setEditingDeadline(null)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="modal-form">
              <div className="form-group">
                <label>Deliverable Title *</label>
                <input 
                  type="text" 
                  value={editingDeadline.title} 
                  onChange={(e) => setEditingDeadline({ ...editingDeadline, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Course / Subject</label>
                  <input 
                    type="text" 
                    value={editingDeadline.course} 
                    onChange={(e) => setEditingDeadline({ ...editingDeadline, course: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={editingDeadline.category}
                    onChange={(e) => setEditingDeadline({ ...editingDeadline, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project Milestone</option>
                    <option value="Exam">Exam / Midterm</option>
                    <option value="Lab Submission">Lab Submission</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Priority</label>
                  <select 
                    value={editingDeadline.priority}
                    onChange={(e) => setEditingDeadline({ ...editingDeadline, priority: e.target.value })}
                    className="form-select"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date &amp; Time</label>
                  <input 
                    type="datetime-local" 
                    value={editingDeadline.dueDate ? editingDeadline.dueDate.substring(0, 16) : ''}
                    onChange={(e) => setEditingDeadline({ ...editingDeadline, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Progress ({editingDeadline.progress}%)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={editingDeadline.progress}
                  onChange={(e) => {
                    const p = parseInt(e.target.value);
                    setEditingDeadline({ 
                      ...editingDeadline, 
                      progress: p,
                      completed: p === 100,
                      status: p === 100 ? 'Completed' : (p > 0 ? 'In Progress' : 'Pending')
                    });
                  }}
                  className="progress-slider"
                />
              </div>

              <div className="form-group">
                <label>Notes &amp; Instructions</label>
                <textarea 
                  rows="3"
                  value={editingDeadline.notes}
                  onChange={(e) => setEditingDeadline({ ...editingDeadline, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-secondary" onClick={() => setEditingDeadline(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .deadlines-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.75rem 0 3rem 0;
        }

        .page-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-header-row h2 {
          font-size: 1.625rem;
          margin-bottom: 0.25rem;
        }

        .page-header-sub {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .header-actions-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .view-mode-toggle {
          display: flex;
          background: var(--bg-subtle);
          padding: 0.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--surface-border);
        }

        .view-mode-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.625rem;
          font-size: 0.75rem;
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .view-mode-btn.active {
          background: #ffffff;
          color: var(--text-main);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        /* Control Filter Bar */
        .control-filter-bar {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1rem 1.25rem;
          flex-wrap: wrap;
          background: #ffffff;
        }

        .search-box-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.75rem;
          flex: 1;
          min-width: 240px;
        }

        .search-icon {
          color: var(--text-subtle);
        }

        .search-input {
          border: none;
          background: transparent;
          width: 100%;
          outline: none;
          font-size: 0.8125rem;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .chip-list {
          display: flex;
          gap: 0.375rem;
          flex-wrap: wrap;
        }

        .filter-chip {
          padding: 0.3rem 0.625rem;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-full);
          background: var(--bg-app);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
        }

        .filter-chip:hover {
          border-color: #cbd5e1;
          color: var(--text-main);
        }

        .filter-chip.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
        }

        .priority-select {
          padding: 0.35rem 0.625rem;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          background: #ffffff;
          color: var(--text-main);
          outline: none;
          cursor: pointer;
        }

        /* Deadlines List View */
        .deadlines-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .deadline-row-card {
          display: flex;
          align-items: center;
          padding: 1.125rem 1.25rem;
          gap: 1.25rem;
          transition: all 0.15s;
        }

        .deadline-row-card:hover {
          border-color: #cbd5e1;
          box-shadow: var(--shadow-sm);
        }

        .deadline-row-card.is-completed {
          opacity: 0.75;
          background: #fafaf9;
        }

        .row-check-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .check-empty-icon {
          color: var(--text-subtle);
          transition: color 0.15s;
        }

        .check-empty-icon:hover {
          color: var(--primary);
        }

        .check-done-icon {
          color: #10b981;
        }

        .row-main-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .row-meta-badges {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .course-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--primary);
          background: var(--primary-light);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .category-tag {
          font-size: 0.6875rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .row-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .row-title.line-through {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .row-notes {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .row-bottom-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 0.25rem;
        }

        .countdown-chip {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .countdown-urgent {
          color: #be123c;
          font-weight: 700;
        }

        .tags-cluster {
          display: flex;
          gap: 0.375rem;
        }

        .mini-tag {
          font-size: 0.6875rem;
          color: var(--text-muted);
          background: var(--bg-app);
          padding: 0.1rem 0.4rem;
          border-radius: var(--radius-sm);
        }

        .instructor-label {
          font-size: 0.6875rem;
          color: var(--text-subtle);
        }

        .row-right-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        .progress-interactive-box {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          width: 110px;
        }

        .progress-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .progress-label-row strong {
          color: var(--text-main);
        }

        .progress-slider {
          width: 100%;
          accent-color: var(--primary);
          height: 4px;
          cursor: pointer;
        }

        .row-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .edit-btn:hover {
          color: var(--primary);
        }

        .delete-btn:hover {
          color: #be123c;
        }

        /* Empty State */
        .empty-state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          text-align: center;
          gap: 0.75rem;
        }

        .empty-icon {
          color: var(--text-subtle);
        }

        /* Kanban View */
        .kanban-board-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          align-items: start;
        }

        .kanban-column {
          padding: 1.25rem;
          background: #ffffff;
        }

        .kanban-column-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .kanban-col-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .kanban-col-title-group h4 {
          font-size: 0.875rem;
          font-weight: 700;
        }

        .kanban-header-right {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .kanban-indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-pending { background: #f59e0b; }
        .dot-in-progress { background: #3b82f6; }
        .dot-completed { background: #10b981; }

        .kanban-count-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--text-muted);
          background: var(--bg-app);
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-full);
        }

        .kanban-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .kanban-card {
          padding: 0.875rem;
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          transition: all 0.15s;
        }

        .kanban-card:hover {
          background: #ffffff;
          box-shadow: var(--shadow-sm);
        }

        .kanban-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.375rem;
        }

        .course-code-mini {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .kanban-card-title {
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .kanban-card-notes {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.3;
          margin-bottom: 0.5rem;
        }

        .kanban-card-progress-bar {
          width: 100%;
          height: 4px;
          background: var(--surface-border);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .kanban-progress-fill {
          height: 100%;
          background: var(--primary);
        }

        .kanban-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid var(--surface-border-subtle);
        }

        .kanban-due-tag {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .kanban-actions-cluster {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .kanban-stage-btn {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-stage-start {
          background: #eff6ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
        }

        .btn-stage-start:hover {
          background: #dbeafe;
        }

        .btn-stage-done {
          background: #ecfdf5;
          color: #065f46;
          border-color: #a7f3d0;
        }

        .btn-stage-done:hover {
          background: #d1fae5;
        }

        .btn-stage-reopen {
          background: #fef3c7;
          color: #92400e;
          border-color: #fde68a;
        }

        .btn-stage-reopen:hover {
          background: #fde68a;
        }

        .btn-mini {
          padding: 0.25rem;
        }

        .kanban-empty-slot {
          padding: 2rem 1rem;
          text-align: center;
          font-size: 0.8125rem;
          color: var(--text-subtle);
          border: 1px dashed var(--surface-border);
          border-radius: var(--radius-md);
        }

        /* Edit Modal */
        .edit-dl-modal {
          max-width: 580px;
          width: 95%;
          padding: 1.5rem;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .modal-actions-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--surface-border);
        }

        @media (max-width: 900px) {
          .deadline-row-card {
            flex-direction: column;
          }
          .row-right-actions {
            width: 100%;
            justify-content: space-between;
            margin-top: 0.5rem;
          }
          .kanban-board-grid {
            grid-template-columns: 1fr;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
