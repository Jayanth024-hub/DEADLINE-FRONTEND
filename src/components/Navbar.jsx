import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';
import UserProfile from './UserProfile';
import { Sparkles, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onSearch, onOpenAddDeadline }) {
  const [searchValue, setSearchValue] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearchChange = (val) => {
    setSearchValue(val);
    if (onSearch) onSearch(val);
  };

  return (
    <header className="saas-topbar">
      <div className="topbar-left">
        <SearchBar 
          value={searchValue} 
          onChange={handleSearchChange} 
          placeholder="Search deadlines, assignments, or drives..." 
        />
      </div>

      <div className="topbar-right">
        {onOpenAddDeadline && (
          <button 
            className="saas-btn saas-btn-primary saas-btn-sm" 
            onClick={onOpenAddDeadline}
          >
            <Plus size={15} /> Add Deadline
          </button>
        )}

        <button 
          className="saas-btn saas-btn-secondary saas-btn-sm" 
          onClick={() => navigate('/ai')}
          title="Open AI Copilot"
        >
          <Sparkles size={14} style={{ color: 'var(--primary-blue)' }} /> Ask AI
        </button>

        <NotificationBell />

        <UserProfile />
      </div>
    </header>
  );
}
