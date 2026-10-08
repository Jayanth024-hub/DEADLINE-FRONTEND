import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import AssignmentCard from '../../components/AssignmentCard';
import ConfirmDialog from '../../components/ConfirmDialog';
import Modal from '../../components/Modal';
import ProgressBar from '../../components/ProgressBar';
import { deadlineService } from '../../services/api';
import { Plus, Users, CheckCircle, FileText } from 'lucide-react';

export default function Assignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [viewingSubmissions, setViewingSubmissions] = useState(null);

  const loadData = async () => {
    const list = await deadlineService.getDeadlines();
    setAssignments(list);
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

  const filtered = assignments.filter(a => 
    !searchQuery || 
    a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.course?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Class Assignments & Labs"
        subtitle="Track submissions, review rubrics, and publish class deliverables."
      >
        <button 
          className="saas-btn saas-btn-primary" 
          onClick={() => navigate('/faculty/add-assignment')}
        >
          <Plus size={15} /> Create Assignment
        </button>
      </PageHeader>

      <div style={{ marginBottom: '22px' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by assignment title, course, or class..."
        />
      </div>

      <div className="deadline-card-grid">
        {filtered.map(asg => (
          <AssignmentCard
            key={asg.id}
            assignment={asg}
            onDelete={(id) => setDeleteConfirmId(id)}
            onViewSubmissions={(asg) => setViewingSubmissions(asg)}
          />
        ))}
      </div>

      {/* Submissions Detail Modal */}
      {viewingSubmissions && (
        <Modal 
          isOpen={Boolean(viewingSubmissions)} 
          onClose={() => setViewingSubmissions(null)}
          title={`Submissions: ${viewingSubmissions.title}`}
          maxWidth={620}
        >
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <strong>Class:</strong> {viewingSubmissions.targetClass || 'CSE 3-1'} • {viewingSubmissions.targetSection || 'Section A'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <strong>Submissions received:</strong> {viewingSubmissions.totalSubmissions || 48} of {viewingSubmissions.totalEnrolled || 60} students
            </div>
            <ProgressBar progress={Math.round(((viewingSubmissions.totalSubmissions || 48) / (viewingSubmissions.totalEnrolled || 60)) * 100)} height={8} showLabel={true} />
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Sample Student Submissions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Alex Morgan', roll: '22BCE1042', time: 'Yesterday 10:24 PM', score: '95/100' },
                { name: 'Aarav Patel', roll: '22BCE1015', time: 'Yesterday 11:15 PM', score: '92/100' },
                { name: 'Riya Sharma', roll: '22BCE1078', time: 'Today 8:40 AM', score: 'Pending' }
              ].map((sub, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-app)', borderRadius: '6px', fontSize: '13px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{sub.name} ({sub.roll})</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Submitted: {sub.time}</div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: sub.score === 'Pending' ? 'var(--amber-orange)' : 'var(--emerald-green)' }}>
                    {sub.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        message="Are you sure you want to delete this course assignment? All student records for this task will be removed."
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}
