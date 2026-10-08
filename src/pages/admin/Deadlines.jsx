import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import DeadlineTable from '../../components/DeadlineTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { deadlineService } from '../../services/api';
import { ShieldCheck, Layers, AlertTriangle } from 'lucide-react';

export default function AdminDeadlines() {
  const [deadlines, setDeadlines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadData = async () => {
    const list = await deadlineService.getDeadlines();
    setDeadlines(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deadlineService.deleteDeadline(deleteConfirmId);
      setDeleteConfirmId(null);
      loadData();
    }
  };

  const handleToggle = async (id) => {
    await deadlineService.toggleComplete(id);
    loadData();
  };

  const filtered = deadlines.filter(d => {
    const matchesSearch = !searchQuery ||
      d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.course?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Institutional Deadline Governance"
        subtitle="Cross-department monitoring of student submission compliance and assessment frequency."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '14px', marginBottom: '20px' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search all institutional deadlines..."
        />

        <select 
          className="saas-select" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="DUE_SOON">Due Soon</option>
          <option value="DUE_TODAY">Due Today</option>
          <option value="OVERDUE">Overdue</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <DeadlineTable
        deadlines={filtered}
        onToggleComplete={handleToggle}
        onDelete={(id) => setDeleteConfirmId(id)}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Admin Deadline Revocation"
        message="Are you sure you want to administratively delete this deadline from the institution-wide directory?"
        confirmText="Revoke"
        isDanger={true}
      />
    </div>
  );
}
