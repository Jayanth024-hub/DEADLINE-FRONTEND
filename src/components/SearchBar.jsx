import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search deadlines, courses, or tags...' }) {
  return (
    <div className="search-bar-wrap">
      <Search className="search-bar-icon" size={16} />
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-bar-clear" onClick={() => onChange('')} title="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
