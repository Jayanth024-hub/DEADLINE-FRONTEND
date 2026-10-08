import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 540 }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="saas-modal-backdrop" onClick={onClose}>
      <div 
        className="saas-modal-dialog" 
        style={{ maxWidth: `${maxWidth}px` }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="saas-modal-header">
          <h3>{title}</h3>
          <button className="saas-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="saas-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
