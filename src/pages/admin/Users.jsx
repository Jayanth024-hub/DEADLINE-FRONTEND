import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { userService } from '../../services/api';
import { UserPlus, Trash2, Edit, Check, Shield } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    section: 'Section A'
  });

  const loadData = async () => {
    const list = await userService.getAllUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    await userService.addUser(formData);
    setShowAddModal(false);
    loadData();
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await userService.deleteUser(deleteConfirmId);
      setDeleteConfirmId(null);
      loadData();
    }
  };

  const filtered = users.filter(u => {
    const matchesSearch = !searchQuery ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <PageHeader
        title="Campus User Directory"
        subtitle="Manage accounts, departments, and clearance roles across university branches."
      >
        <button 
          className="saas-btn saas-btn-primary" 
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus size={15} /> Add Campus User
        </button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '14px', marginBottom: '20px' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, or department..."
        />

        <select 
          className="saas-select" 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="FACULTY">Faculty</option>
          <option value="COORDINATOR">Coordinators</option>
          <option value="ADMINISTRATOR">Administrators</option>
        </select>
      </div>

      <div className="deadline-table-container">
        <table className="saas-table">
          <thead>
            <tr>
              <th>User Name & Email</th>
              <th>System Role</th>
              <th>Department / Unit</th>
              <th>Class / Section</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id || u.email}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                      {u.avatar || u.name?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    background: u.role === 'ADMINISTRATOR' ? '#fee2e2' : u.role === 'FACULTY' ? '#fef3c7' : u.role === 'COORDINATOR' ? '#f5f3ff' : '#e0f2fe',
                    color: u.role === 'ADMINISTRATOR' ? '#991b1b' : u.role === 'FACULTY' ? '#92400e' : u.role === 'COORDINATOR' ? '#6b21a8' : '#0369a1'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td>{u.department || '—'}</td>
                <td>{u.section || u.semester || '—'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="saas-btn saas-btn-danger saas-btn-sm" 
                    onClick={() => setDeleteConfirmId(u.id)}
                    title="Remove Account"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Create Campus Account"
          maxWidth={500}
        >
          <form onSubmit={handleCreateUser}>
            <div className="saas-form-group">
              <label className="saas-label">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Priya Mohan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="saas-input"
              />
            </div>

            <div className="saas-form-group">
              <label className="saas-label">University Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. priya.mohan@univ.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="saas-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="saas-form-group">
                <label className="saas-label">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="saas-select"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="COORDINATOR">Coordinator</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                </select>
              </div>

              <div className="saas-form-group">
                <label className="saas-label">Class Section / ID</label>
                <input
                  type="text"
                  placeholder="e.g. Section A"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="saas-input"
                />
              </div>
            </div>

            <div className="saas-form-group">
              <label className="saas-label">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="saas-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button 
                type="button" 
                className="saas-btn saas-btn-secondary" 
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="saas-btn saas-btn-primary">
                <Check size={14} /> Create Account
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to remove this user account? Their authentication clearances and saved records will be deleted."
        confirmText="Remove"
        isDanger={true}
      />
    </div>
  );
}
