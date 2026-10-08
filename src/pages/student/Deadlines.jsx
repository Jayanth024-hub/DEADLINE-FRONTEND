import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import DeadlineCard from '../../components/DeadlineCard';
import DeadlineTable from '../../components/DeadlineTable';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import AddDeadlineModal from '../../components/AddDeadlineModal';
import { deadlineService } from '../../services/api';
import { Plus, LayoutGrid, List, Filter } from 'lucide-react';

export default function Deadlines() {
  const [deadlines, setDeadlines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadDeadlines = async () => {
    const list = await deadlineService.getDeadlines();
    setDeadlines(list);
  };

  useEffect(() => {
    loadDeadlines();
  }, []);

  const handleToggleComplete = async (id) => {
    await deadlineService.toggleComplete(id);
    loadDeadlines();
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deadlineService.deleteDeadline(deleteConfirmId);
      setDeleteConfirmId(null);
      loadDeadlines();
    }
  };

  // Filtering
  const filteredDeadlines = deadlines.filter((dl) => {
    // Search filter
    const matchesSearch = !searchQuery || 
      dl.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dl.course?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dl.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    let matchesStatus = true;
    if (activeFilter === 'UPCOMING') matchesStatus = dl.status === 'UPCOMING' && !dl.completed;
    else if (activeFilter === 'DUE_TODAY') matchesStatus = dl.status === 'DUE_TODAY' && !dl.completed;
    else if (activeFilter === 'DUE_SOON') matchesStatus = dl.status === 'DUE_SOON' && !dl.completed;
    else if (activeFilter === 'OVERDUE') matchesStatus = dl.status === 'OVERDUE' && !dl.completed;
    else if (activeFilter === 'COMPLETED') matchesStatus = dl.completed;

    // Category filter
    let matchesCategory = true;
    if (activeCategory !== 'ALL') {
      matchesCategory = dl.category?.toUpperCase() === activeCategory;
    }

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = ['ALL', 'ASSIGNMENT', 'PROJECT', 'EXAM', 'LAB'];

  return (
    <div>
      <PageHeader 
        title="My Deadlines" 
        subtitle="Track, filter, and complete assignments, exams, and project milestones."
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ display: 'flex', background: 'white', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
            <button
              className={`saas-btn saas-btn-sm ${viewMode === 'table' ? 'saas-btn-primary' : 'saas-btn-secondary'}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={14} />
            </button>
            <button
              className={`saas-btn saas-btn-sm ${viewMode === 'grid' ? 'saas-btn-primary' : 'saas-btn-secondary'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          <button 
            className="saas-btn saas-btn-primary" 
            onClick={() => {
              setEditingDeadline(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={15} /> Add Deadline
          </button>
        </div>
      </PageHeader>

      {/* Search & Category Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', marginBottom: '18px' }}>
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Search by title, subject, or keywords..." 
        />

        <div style={{ display: 'flex', gap: '6px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'ALL' ? 'All Types' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="filter-tabs-row">
        {[
          { key: 'ALL', label: 'All Deadlines' },
          { key: 'UPCOMING', label: 'Upcoming' },
          { key: 'DUE_TODAY', label: 'Due Today' },
          { key: 'DUE_SOON', label: 'Due Soon' },
          { key: 'OVERDUE', label: 'Overdue' },
          { key: 'COMPLETED', label: 'Completed' }
        ].map(tab => (
          <button
            key={tab.key}
            className={`filter-tab ${activeFilter === tab.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Rendering */}
      {filteredDeadlines.length === 0 ? (
        <EmptyState 
          title="No deadlines found"
          description="Try adjusting your search query or status filter to see deadlines."
          actionText="Create New Deadline"
          onAction={() => setShowAddModal(true)}
        />
      ) : viewMode === 'table' ? (
        <DeadlineTable
          deadlines={filteredDeadlines}
          onToggleComplete={handleToggleComplete}
          onEdit={(dl) => {
            setEditingDeadline(dl);
            setShowAddModal(true);
          }}
          onDelete={(id) => setDeleteConfirmId(id)}
        />
      ) : (
        <div className="deadline-card-grid">
          {filteredDeadlines.map(dl => (
            <DeadlineCard
              key={dl.id}
              deadline={dl}
              onToggleComplete={handleToggleComplete}
              onEdit={(dl) => {
                setEditingDeadline(dl);
                setShowAddModal(true);
              }}
              onDelete={(id) => setDeleteConfirmId(id)}
            />
          ))}
        </div>
      )}

      {/* Modals & Dialogs */}
      {showAddModal && (
        <AddDeadlineModal
          initialData={editingDeadline}
          onClose={() => {
            setShowAddModal(false);
            setEditingDeadline(null);
          }}
          onSuccess={loadDeadlines}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Deadline"
        message="Are you sure you want to delete this deadline? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}
