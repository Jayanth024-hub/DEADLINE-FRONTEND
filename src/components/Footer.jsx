import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="brand-icon-sq" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
          IQ
        </div>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>DeadlineIQ</span>
        <span>• Enterprise Academic & Career Command Center</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} style={{ color: 'var(--emerald-green)' }} />
          <span>AES-256 Cloud Verified</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={14} style={{ color: 'var(--primary-blue)' }} />
          <span>Gemini AI Connected</span>
        </span>
        <span>© {new Date().getFullYear()} DeadlineIQ Inc. All rights reserved.</span>
      </div>
    </footer>
  );
}
