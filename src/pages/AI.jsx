import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import AIChatBox from '../components/AIChatBox';
import PriorityBadge from '../components/PriorityBadge';
import { deadlineService, opportunityService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Calendar, BookOpen, Briefcase } from 'lucide-react';

export default function AIPage() {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const dl = await deadlineService.getDeadlines();
        const opp = await opportunityService.getOpportunities();
        if (Array.isArray(dl)) {
          setDeadlines(dl.filter(d => !d.completed).slice(0, 4));
        }
        if (Array.isArray(opp)) {
          setOpportunities(opp.slice(0, 3));
        }
      } catch (e) {}
    }
    loadData();
  }, []);

  return (
    <div>
      <PageHeader 
        title="AI Academic Copilot" 
        subtitle={`Personalized conversational planning and deadline breakdown for ${user?.name || 'your account'} (${user?.role || 'User'})`}
      />

      <div className="ai-page-grid">
        <div style={{ height: '100%', background: 'white', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <AIChatBox compact={false} />
        </div>

        {/* Right context panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', overflowY: 'auto' }}>
          {/* Tracked deadlines snippet */}
          <div style={{ background: 'white', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
              <Calendar size={16} style={{ color: 'var(--primary-blue)' }} />
              <span>Active Academic Context</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {deadlines.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No urgent deadlines pending.</div>
              ) : (
                deadlines.map(d => (
                  <div key={d.id} style={{ padding: '10px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{d.title}</span>
                      <PriorityBadge priority={d.priority} />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {d.course} • Due {d.dueDate?.split('T')[0]}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active opportunities snippet */}
          <div style={{ background: 'white', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
              <Briefcase size={16} style={{ color: 'var(--emerald-green)' }} />
              <span>Recommended Drives</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {opportunities.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No current opportunities listed.</div>
              ) : (
                opportunities.map(o => (
                  <div key={o.id} style={{ padding: '10px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{o.company}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{o.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--emerald-green)', fontWeight: 600, marginTop: '2px' }}>{o.stipend}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
