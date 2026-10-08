import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={bellRef}>
      <button 
        className="notification-bell-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="View notifications"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h4>Notifications ({notifications.length})</h4>
            {unreadCount > 0 && (
              <button 
                onClick={markAllNotificationsRead} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--primary-blue)', 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <div 
                  key={item.id} 
                  className={`notification-item ${item.unread ? 'unread' : ''}`}
                  onClick={() => markNotificationRead(item.id)}
                >
                  <div className="notification-item-title">{item.title}</div>
                  <div className="notification-item-time">{item.time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
