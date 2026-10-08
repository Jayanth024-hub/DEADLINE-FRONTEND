import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AddDeadlineModal from './AddDeadlineModal';

export default function DashboardLayout() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="saas-layout">
      <Sidebar />
      <div className="saas-viewport">
        <Navbar onOpenAddDeadline={() => setShowAddModal(true)} />
        <main className="saas-content-area">
          <Outlet />
        </main>
      </div>

      {showAddModal && (
        <AddDeadlineModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
