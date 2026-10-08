import React from 'react';
import { X, ArrowDown, UserCheck, ShieldCheck, Database, Server, Clock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export default function SystemWorkflowModal({ isOpen, onClose, onSelectRole }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-dialog white-card workflow-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3>DeadlineIQ System Workflow Architecture</h3>
              <p>Role-Based Authentication, Date/Time Status Pipeline &amp; REST Data Flow</p>
            </div>
          </div>
          <button className="btn-ghost modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Workflow Diagram */}
        <div className="workflow-body">
          {/* Phase 1: Authentication Pipeline */}
          <div className="workflow-phase-box">
            <span className="phase-badge">Phase 1: Entry &amp; Role Identification</span>
            <div className="flow-steps-horizontal">
              <div className="flow-step-node">
                <span className="node-num">1</span>
                <strong>User Opens App</strong>
                <small>Entry to DeadlineIQ</small>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step-node">
                <span className="node-num">2</span>
                <strong>Register / Login</strong>
                <small>Credentials &amp; Section</small>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step-node">
                <span className="node-num">3</span>
                <strong>Authentication</strong>
                <small>Session Verification</small>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step-node highlight-node">
                <span className="node-num">4</span>
                <strong>Role Identification</strong>
                <small>5 Authorized Roles</small>
              </div>
            </div>
          </div>

          <div className="vertical-connector-line">
            <ArrowDown size={18} />
          </div>

          {/* Phase 2: Role-Specific Operations */}
          <div className="workflow-phase-box">
            <span className="phase-badge">Phase 2: Role-Specific Authorized Operations</span>
            <div className="roles-workflow-grid">
              {/* STUDENT */}
              <div className="role-flow-card card-student">
                <div className="role-card-top">
                  <span className="role-pill pill-student">STUDENT</span>
                  <button className="btn-secondary switch-role-mini-btn" onClick={() => { onSelectRole('STUDENT'); onClose(); }}>
                    Switch to Role →
                  </button>
                </div>
                <ul className="role-ops-list">
                  <li>• Manage personal &amp; course deadlines</li>
                  <li>• Set priority (Urgent, High, Med, Low) &amp; category</li>
                  <li>• Search and filter tasks</li>
                  <li>• Track completion &amp; progress</li>
                  <li>• View &amp; apply for career opportunities</li>
                </ul>
              </div>

              {/* FACULTY */}
              <div className="role-flow-card card-faculty">
                <div className="role-card-top">
                  <span className="role-pill pill-faculty">FACULTY</span>
                  <button className="btn-secondary switch-role-mini-btn" onClick={() => { onSelectRole('FACULTY'); onClose(); }}>
                    Switch to Role →
                  </button>
                </div>
                <ul className="role-ops-list">
                  <li>• Create academic deadlines &amp; assignments</li>
                  <li>• Select target course &amp; class/section</li>
                  <li>• Monitor student submissions</li>
                  <li>• View class performance statistics</li>
                  <li>• Grade deliverables</li>
                </ul>
              </div>

              {/* COORDINATOR */}
              <div className="role-flow-card card-coordinator">
                <div className="role-card-top">
                  <span className="role-pill pill-coordinator">COORDINATOR</span>
                  <button className="btn-secondary switch-role-mini-btn" onClick={() => { onSelectRole('COORDINATOR'); onClose(); }}>
                    Switch to Role →
                  </button>
                </div>
                <ul className="role-ops-list">
                  <li>• Create placement &amp; internship openings</li>
                  <li>• Create hackathons, workshops &amp; events</li>
                  <li>• Set eligibility criteria &amp; deadlines</li>
                  <li>• View student registrations</li>
                  <li>• Track student participation</li>
                </ul>
              </div>

              {/* DEAN */}
              <div className="role-flow-card card-dean">
                <div className="role-card-top">
                  <span className="role-pill pill-faculty">DEAN</span>
                  <button className="btn-secondary switch-role-mini-btn" onClick={() => { onSelectRole('DEAN'); onClose(); }}>
                    Switch to Role →
                  </button>
                </div>
                <ul className="role-ops-list">
                  <li>• Review academic milestones across courses</li>
                  <li>• Monitor institution-wide completion trends</li>
                  <li>• Identify overdue work requiring attention</li>
                  <li>• Review upcoming institutional deadlines</li>
                  <li>• Track active campus opportunities</li>
                </ul>
              </div>

              {/* ADMINISTRATOR */}
              <div className="role-flow-card card-admin">
                <div className="role-card-top">
                  <span className="role-pill pill-admin">ADMINISTRATOR</span>
                  <button className="btn-secondary switch-role-mini-btn" onClick={() => { onSelectRole('ADMINISTRATOR'); onClose(); }}>
                    Switch to Role →
                  </button>
                </div>
                <ul className="role-ops-list">
                  <li>• Manage users &amp; assign security roles</li>
                  <li>• Manage departments and courses</li>
                  <li>• Manage all deadlines across system</li>
                  <li>• Generate audit &amp; compliance reports</li>
                  <li>• Configure system settings</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="vertical-connector-line">
            <ArrowDown size={18} />
          </div>

          {/* Phase 3: Automatic Java Date/Time Business Logic */}
          <div className="workflow-phase-box logic-box">
            <div className="logic-header">
              <span className="phase-badge">Phase 3: Java Date/Time Business Logic (Automatic Status Pipeline)</span>
              <span className="logic-tag">Evaluated on Every Request</span>
            </div>
            <p className="logic-desc">
              Normal Java date/time logic evaluates the current date against due dates to guarantee instant, accurate urgency classification:
            </p>
            <div className="status-pipeline-track">
              <div className="pipeline-node node-upcoming">
                <strong>UPCOMING</strong>
                <small>&gt; 3 days remaining</small>
              </div>
              <span className="pipeline-arrow">→</span>
              <div className="pipeline-node node-duesoon">
                <strong>DUE SOON</strong>
                <small>1 to 3 days remaining</small>
              </div>
              <span className="pipeline-arrow">→</span>
              <div className="pipeline-node node-duetoday">
                <strong>DUE TODAY</strong>
                <small>Due before 23:59 tonight</small>
              </div>
              <span className="pipeline-arrow">→</span>
              <div className="pipeline-node node-overdue">
                <strong>OVERDUE</strong>
                <small>Past deadline &amp; unsubmitted</small>
              </div>
              <span className="pipeline-arrow">→</span>
              <div className="pipeline-node node-completed">
                <strong>COMPLETED</strong>
                <small>Marked verified by user</small>
              </div>
            </div>
          </div>

          <div className="vertical-connector-line">
            <ArrowDown size={18} />
          </div>

          {/* Phase 4: Spring Boot REST API & MySQL Layer */}
          <div className="workflow-phase-box architecture-layer">
            <span className="phase-badge">Phase 4: Layered Persistence Architecture</span>
            <div className="arch-flow-row">
              <div className="arch-pill">
                <Server size={14} className="text-primary" />
                <span>Spring Boot REST API (Controllers)</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="arch-pill">
                <span>Java Services (DeadlineService, UserService)</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="arch-pill">
                <span>Spring Data JPA Repositories</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="arch-pill db-pill">
                <Database size={14} className="text-primary" />
                <span>MySQL Database (deadlines, users, opportunities)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            <span>Got it, Return to Workspace</span>
          </button>
        </div>
      </div>

      <style>{`
        .workflow-modal-dialog {
          max-width: 920px;
          max-height: 92vh;
          overflow-y: auto;
        }

        .workflow-body {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0.5rem 0;
        }

        .workflow-phase-box {
          background: var(--bg-app);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .phase-badge {
          font-size: 0.6875rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .flow-steps-horizontal {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .flow-step-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0.75rem 1rem;
          background: #ffffff;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          min-width: 140px;
        }

        .highlight-node {
          border-color: var(--primary);
          background: #eef2ff;
        }

        .node-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--primary);
          color: #ffffff;
          font-size: 0.6875rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.25rem;
        }

        .flow-step-node strong {
          font-size: 0.8125rem;
          color: var(--text-main);
        }

        .flow-step-node small {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .flow-arrow {
          font-size: 1.125rem;
          color: var(--text-subtle);
          font-weight: 700;
        }

        .vertical-connector-line {
          display: flex;
          justify-content: center;
          color: var(--primary);
          padding: 0.25rem 0;
        }

        /* Roles Grid */
        .roles-workflow-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .role-flow-card {
          padding: 1rem;
          background: #ffffff;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .role-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.375rem;
          border-bottom: 1px solid var(--surface-border-subtle);
        }

        .role-pill {
          font-size: 0.6875rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .pill-student { background: #e0e7ff; color: #4338ca; }
        .pill-faculty { background: #fef3c7; color: #92400e; }
        .pill-coordinator { background: #f3e8ff; color: #6b21a8; }
        .pill-admin { background: #dcfce7; color: #166534; }

        .switch-role-mini-btn {
          font-size: 0.6875rem;
          padding: 0.25rem 0.5rem;
        }

        .role-ops-list {
          list-style: none;
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        /* Status Pipeline */
        .logic-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logic-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          background: #e2e8f0;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .logic-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .status-pipeline-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.375rem;
          overflow-x: auto;
          padding: 0.5rem 0;
        }

        .pipeline-node {
          padding: 0.625rem 0.75rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border: 1px solid transparent;
          min-width: 120px;
        }

        .pipeline-node strong {
          font-size: 0.75rem;
          font-weight: 800;
        }

        .pipeline-node small {
          font-size: 0.625rem;
        }

        .node-upcoming { background: #f1f5f9; color: #475569; border-color: #cbd5e1; }
        .node-duesoon { background: #fef3c7; color: #b45309; border-color: #fde68a; }
        .node-duetoday { background: #fee2e2; color: #b91c1c; border-color: #fecaca; }
        .node-overdue { background: #ffe4e6; color: #be123c; border-color: #fecdd3; }
        .node-completed { background: #dcfce7; color: #15803d; border-color: #bbf7d0; }

        .pipeline-arrow {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        /* Architecture Flow */
        .arch-flow-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .arch-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.75rem;
          background: #ffffff;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .db-pill {
          border-color: #93c5fd;
          background: #eff6ff;
        }

        @media (max-width: 768px) {
          .roles-workflow-grid {
            grid-template-columns: 1fr;
          }
          .status-pipeline-track {
            flex-direction: column;
            align-items: stretch;
          }
          .pipeline-arrow {
            text-align: center;
            transform: rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
}
