import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import { Download, Users, CheckCircle2, Filter } from 'lucide-react';

export default function Registrations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrive, setFilterDrive] = useState('ALL');

  const [applicants] = useState([
    { id: 1, name: 'Alex Morgan', email: 'alex.m@deadlineiq.com', roll: '22BCE1042', dept: 'CSE', cgpa: '8.94', drive: 'Google Summer Intern 2027', status: 'VERIFIED', date: '2026-10-02' },
    { id: 2, name: 'Aarav Patel', email: 'aarav.p@univ.edu', roll: '22BCE1015', dept: 'CSE', cgpa: '9.12', drive: 'Google Summer Intern 2027', status: 'VERIFIED', date: '2026-10-02' },
    { id: 3, name: 'Riya Sharma', email: 'riya.s@univ.edu', roll: '22BCE1078', dept: 'IT', cgpa: '8.65', drive: 'Microsoft Imagine Cup 2026', status: 'SHORTLISTED', date: '2026-10-03' },
    { id: 4, name: 'Karthik Rao', email: 'karthik.r@univ.edu', roll: '22ECE1004', dept: 'ECE', cgpa: '8.40', drive: 'Goldman Sachs Summer Analyst', status: 'VERIFIED', date: '2026-10-04' },
    { id: 5, name: 'Ananya Sen', email: 'ananya.s@univ.edu', roll: '22BCE1089', dept: 'CSE', cgpa: '9.35', drive: 'Google Summer Intern 2027', status: 'SHORTLISTED', date: '2026-10-04' },
    { id: 6, name: 'Vikram Seth', email: 'vikram.s@univ.edu', roll: '22BCE1033', dept: 'CSE', cgpa: '8.10', drive: 'Goldman Sachs Summer Analyst', status: 'UNDER_REVIEW', date: '2026-10-05' },
  ]);

  const filtered = applicants.filter(a => {
    const matchesSearch = !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDrive = filterDrive === 'ALL' || a.drive === filterDrive;
    return matchesSearch && matchesDrive;
  });

  const exportCSV = () => {
    const headers = 'Name,Roll,Email,Dept,CGPA,Drive,Status,Date\n';
    const rows = filtered.map(a => `${a.name},${a.roll},${a.email},${a.dept},${a.cgpa},"${a.drive}",${a.status},${a.date}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deadlineiq_applicants_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div>
      <PageHeader
        title="Student Registrations & Candidate Rosters"
        subtitle="Review applicant submissions, verify eligibility cutoffs, and export candidate rosters."
      >
        <button className="saas-btn saas-btn-secondary" onClick={exportCSV}>
          <Download size={14} /> Export CSV Roster
        </button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '14px', marginBottom: '20px' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by student name, roll number, or email..."
        />

        <select 
          className="saas-select" 
          value={filterDrive} 
          onChange={(e) => setFilterDrive(e.target.value)}
        >
          <option value="ALL">All Drives</option>
          <option value="Google Summer Intern 2027">Google Summer Intern</option>
          <option value="Microsoft Imagine Cup 2026">Microsoft Imagine Cup</option>
          <option value="Goldman Sachs Summer Analyst">Goldman Sachs Analyst</option>
        </select>
      </div>

      <div className="deadline-table-container">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Candidate Name & Roll</th>
              <th>Contact Email</th>
              <th>Dept & CGPA</th>
              <th>Applied Opportunity</th>
              <th>Registration Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(app => (
              <tr key={app.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.roll}</div>
                </td>
                <td>{app.email}</td>
                <td>
                  <span style={{ fontWeight: 600 }}>{app.dept}</span>
                  <div style={{ fontSize: '11px', color: 'var(--primary-blue)', fontWeight: 700 }}>
                    CGPA: {app.cgpa}
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.drive}</span>
                </td>
                <td>{app.date}</td>
                <td>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    background: app.status === 'SHORTLISTED' ? '#ecfdf5' : '#e0f2fe',
                    color: app.status === 'SHORTLISTED' ? '#047857' : '#0369a1'
                  }}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
