import React from 'react';
import { 
  Clock, 
  AlertTriangle, 
  Briefcase, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  BookOpen, 
  ChevronRight,
  TrendingUp,
  Award,
  ExternalLink,
  Plus,
  Bell,
  Star
} from 'lucide-react';

export default function DashboardOverview({ 
  deadlines, 
  opportunities, 
  user, 
  onToggleComplete, 
  onOpenAddModal, 
  setActiveTab,
  onPreloadAiPrompt,
  onOpenProfile
}) {
  const pendingDeadlines = deadlines.filter(d => !d.completed && d.status !== 'COMPLETED');
  const completedDeadlines = deadlines.filter(d => d.completed || d.status === 'COMPLETED');
  const urgentDeadlines = pendingDeadlines.filter(d => d.priority === 'URGENT' || d.priority === 'HIGH' || d.status === 'DUE_SOON' || d.status === 'DUE_TODAY');
  const completionRate = Math.round((completedDeadlines.length / (deadlines.length || 1)) * 100) || 0;

  const handleAiQuickAction = (promptText) => {
    if (onPreloadAiPrompt) {
      onPreloadAiPrompt(promptText);
    }
    setActiveTab('ai-studio');
  };

  return (
    <div className="overview-container animate-fade-in">
      {/* ====================================================================
          Fastweb-Style Energetic Hero Section
          ==================================================================== */}
      <section className="fastweb-hero-card">
        <div className="fastweb-hero-left">
          <div className="hero-eyebrow-pill">
            <span className="eyebrow-dot"></span>
            Academic &amp; Career Command Center • {user.semester}
          </div>

          <h1 className="hero-main-title">
            Easily track deadlines for <br />
            <span className="hero-highlight-blue">College and Career</span>
          </h1>

          <p className="hero-description">
            DeadlineIQ is a <strong>centralized deadline management</strong> platform that connects students to academic assignments, lab submissions, exam schedules, and high-impact <span className="highlight-text-link">career opportunities</span> (internships, placements, and hackathons). Our goal is to make academic success and career preparation stress-free.
          </p>

          <div className="hero-buttons-row">
            <button className="btn-primary hero-btn-signup" onClick={onOpenAddModal}>
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Deadline</span>
            </button>
            <button 
              className="btn-secondary hero-btn-ai"
              onClick={() => handleAiQuickAction('Help me plan my study schedule for this week based on my pending assignments.')}
            >
              <Sparkles size={16} className="text-blue" />
              <span>AI Study Copilot</span>
            </button>
            <button className="btn-ghost hero-calendar-link" onClick={() => setActiveTab('calendar')}>
              <CalendarIcon size={16} />
              <span>View Calendar →</span>
            </button>
          </div>

          {/* Quick Stat Highlights - Clickable */}
          <div className="hero-quick-stats">
            <div 
              className="quick-stat-item clickable" 
              onClick={() => setActiveTab('deadlines')} 
              role="button" 
              tabIndex={0}
              title="Click to view urgent deadlines"
            >
              <strong>{urgentDeadlines.length}</strong>
              <span>Urgent Due Soon</span>
            </div>
            <div className="stat-divider"></div>
            <div 
              className="quick-stat-item clickable" 
              onClick={() => setActiveTab('opportunities')} 
              role="button" 
              tabIndex={0}
              title="Click to explore career drives"
            >
              <strong>{opportunities.length}</strong>
              <span>Career Drives Open</span>
            </div>
            <div className="stat-divider"></div>
            <div 
              className="quick-stat-item clickable" 
              onClick={() => setActiveTab('deadlines')} 
              role="button" 
              tabIndex={0}
              title="Click to view completion details"
            >
              <strong className="text-green">96.4%</strong>
              <span>On-Time Completion</span>
            </div>
          </div>
        </div>

        {/* Right Hero Graphic: Colorful Organic Blobs + College Student Visual */}
        <div className="fastweb-hero-right">
          <div className="blobs-composition-wrapper">
            {/* Background Dotted Matrix Motif */}
            <div className="dot-matrix-pattern"></div>

            {/* Giant Colorful Organic Shapes */}
            <div className="blob-shape blob-magenta"></div>
            <div className="blob-shape blob-coral"></div>
            <div className="blob-shape blob-yellow"></div>

            {/* Student Image Cutout */}
            <div className="student-photo-frame">
              <img 
                src="/hero_student.jpg" 
                alt="College Student using DeadlineIQ on Laptop" 
                className="student-hero-img"
              />
            </div>

            {/* Floating Live Indicator Badges - Clickable */}
            <div 
              className="floating-badge badge-top-right clickable" 
              onClick={() => onOpenProfile && onOpenProfile()}
              role="button"
              tabIndex={0}
              title="Click to view academic profile & CGPA"
            >
              <Star size={14} className="badge-star-icon" />
              <div className="float-badge-text">
                <strong>CGPA {user.cgpa || '8.94'}</strong>
                <small>Top 5% Batch</small>
              </div>
            </div>

            <div 
              className="floating-badge badge-bottom-left clickable" 
              onClick={() => setActiveTab('deadlines')}
              role="button"
              tabIndex={0}
              title="Click to inspect active deadlines"
            >
              <Bell size={14} className="badge-bell-icon" />
              <div className="float-badge-text">
                <strong>3 Deadlines Due</strong>
                <small>OS &amp; Networks Lab</small>
              </div>
            </div>

            <div 
              className="floating-badge badge-bottom-right clickable" 
              onClick={() => setActiveTab('opportunities')}
              role="button"
              tabIndex={0}
              title="Click to view Google Internship"
            >
              <Briefcase size={14} className="badge-briefcase-icon" />
              <div className="float-badge-text">
                <strong>Google SWE Intern</strong>
                <small>₹1,25,000 / mo</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4 KPI Metric Stats Cards with Energetic Accents
          ==================================================================== */}
      <section className="stats-grid">
        <div className="stat-card white-card stat-card-blue" onClick={() => setActiveTab('deadlines')} role="button">
          <div className="stat-header">
            <span className="stat-title">Active Coursework</span>
            <div className="stat-icon-box box-blue">
              <BookOpen size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number">{pendingDeadlines.length}</span>
            <span className="stat-pill pill-blue">{completedDeadlines.length} completed</span>
          </div>
          <span className="stat-hint">Across 5 enrolled semester courses</span>
        </div>

        <div className="stat-card white-card stat-card-coral urgent-highlight" onClick={() => setActiveTab('deadlines')} role="button">
          <div className="stat-header">
            <span className="stat-title">High Urgency Tasks</span>
            <div className="stat-icon-box box-coral">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number text-danger">{urgentDeadlines.length}</span>
            <span className="stat-pill pill-danger">Due in &lt; 72 hrs</span>
          </div>
          <span className="stat-hint">Operating Systems &amp; Networks Lab</span>
        </div>

        <div className="stat-card white-card stat-card-purple" onClick={() => setActiveTab('opportunities')} role="button">
          <div className="stat-header">
            <span className="stat-title">Career Opportunities</span>
            <div className="stat-icon-box box-purple">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number">{opportunities.length}</span>
            <span className="stat-pill pill-purple">2 Applied</span>
          </div>
          <span className="stat-hint">Google, Microsoft, Goldman Sachs</span>
        </div>

        <div 
          className="stat-card white-card stat-card-green clickable" 
          onClick={() => setActiveTab('deadlines')} 
          role="button"
          tabIndex={0}
          title="Click to view all deadlines and completion details"
        >
          <div className="stat-header">
            <span className="stat-title">Completion Rate</span>
            <div className="stat-icon-box box-green">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="stat-metric-row">
            <span className="stat-number text-green">{completionRate}%</span>
            <span className="stat-pill pill-green">Top Tier</span>
          </div>
          <div className="mini-progress-bar">
            <div className="mini-progress-fill" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          Main Dual Layout: Left Tasks & Horizon, Right AI Studio & Career
          ==================================================================== */}
      <div className="main-content-layout">
        {/* Left Column */}
        <div className="left-content-column">
          {/* Priority Deliverables */}
          <div className="section-card white-card">
            <div className="section-card-header">
              <div>
                <h3>Priority Tasks Due Soon</h3>
                <p className="section-subtitle">Deliverables scheduled for the next 7 days</p>
              </div>
              <button className="btn-ghost text-blue" onClick={() => setActiveTab('deadlines')}>
                <span>View all ({deadlines.length})</span>
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="tasks-flow-list">
              {urgentDeadlines.slice(0, 4).map(deadline => (
                <div key={deadline.id} className="task-flow-item">
                  <button 
                    className="task-checkbox-btn"
                    onClick={() => onToggleComplete(deadline.id)}
                    title="Mark as completed"
                  >
                    <div className="custom-check-box"></div>
                  </button>

                  <div className="task-info-block">
                    <div className="task-meta-top">
                      <span className="course-code-tag">{deadline.course}</span>
                      <span className={`badge badge-${deadline.priority.toLowerCase()}`}>
                        {deadline.priority}
                      </span>
                      <span className="category-pill">{deadline.category}</span>
                    </div>

                    <h4 className="task-heading">{deadline.title}</h4>
                    <p className="task-notes-snippet">{deadline.notes}</p>

                    <div className="task-meta-bottom">
                      <div className="due-countdown-tag">
                        <Clock size={13} />
                        <span>Due: {new Date(deadline.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <span className="instructor-tag">By {deadline.instructor}</span>
                    </div>
                  </div>

                  <div className="task-progress-box">
                    <span className="progress-number">{deadline.progress}%</span>
                    <div className="horizontal-bar">
                      <div className="horizontal-fill" style={{ width: `${deadline.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Horizon Bar */}
          <div className="section-card white-card horizon-timeline-card">
            <div className="section-card-header">
              <div>
                <h3>7-Day Horizon</h3>
                <p className="section-subtitle">Distribution of upcoming submission dates</p>
              </div>
            </div>

            <div className="horizon-grid">
              {['Thu 1', 'Fri 2', 'Sat 3', 'Sun 4', 'Mon 5', 'Tue 6', 'Wed 7'].map((day, idx) => {
                const isHeavy = idx === 3 || idx === 4 || idx === 5;
                return (
                  <div 
                    key={day} 
                    className={`horizon-col ${isHeavy ? 'day-has-due' : ''} clickable`}
                    onClick={() => setActiveTab('calendar')}
                    role="button"
                    tabIndex={0}
                    title={`Click to view ${day} in calendar`}
                  >
                    <span className="horizon-day-label">{day}</span>
                    <div className="horizon-pill-track">
                      {idx === 3 && <div className="event-dot dot-urgent" title="OS Scheduling Due"></div>}
                      {idx === 4 && <div className="event-dot dot-high" title="Networks Lab Due"></div>}
                      {idx === 5 && <div className="event-dot dot-high" title="DBMS Phase 2 Due"></div>}
                    </div>
                    <span className="horizon-count-label">{isHeavy ? '1 due' : '—'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-content-column">
          {/* AI Copilot Studio Teaser */}
          <div className="ai-teaser-card white-card">
            <div className="ai-teaser-header">
              <div className="ai-brand-badge">
                <Sparkles size={16} />
                <span>Google Gemini Copilot</span>
              </div>
              <span className="ai-model-tag">Live 2.0</span>
            </div>

            <h4>Need help prioritizing or planning study sessions?</h4>
            <p className="ai-teaser-desc">
              Your AI assistant has full context on your deadlines, syllabus requirements, and upcoming tests.
            </p>

            <div className="ai-quick-prompts">
              <button 
                className="ai-chip-prompt" 
                onClick={() => handleAiQuickAction('Create an hourly breakdown to solve my Operating Systems CPU scheduling assignment in 3 days.')}
              >
                📅 Plan OS Scheduling Lab
              </button>
              <button 
                className="ai-chip-prompt" 
                onClick={() => handleAiQuickAction('What is the most urgent deliverable I should focus on right now and why?')}
              >
                ⚡ Prioritize my tasks
              </button>
              <button 
                className="ai-chip-prompt" 
                onClick={() => handleAiQuickAction('What are the key technical concepts tested in Google SWE Intern interviews?')}
              >
                💼 Google SWE Interview Tips
              </button>
            </div>

            <button 
              className="btn-primary ai-launch-btn"
              onClick={() => setActiveTab('ai-studio')}
            >
              <span>Open AI Copilot Studio</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Opportunities Spotlight */}
          <div className="section-card white-card opportunities-spotlight">
            <div className="section-card-header">
              <div>
                <h3>Career Spotlight</h3>
                <p className="section-subtitle">Top internships &amp; hackathons</p>
              </div>
              <button className="btn-ghost text-blue" onClick={() => setActiveTab('opportunities')}>
                <span>All ({opportunities.length})</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="spotlight-list">
              {opportunities.slice(0, 3).map(opp => (
                <div key={opp.id} className="spotlight-item">
                  <div className="spotlight-header">
                    <span className="company-name-bold">{opp.company}</span>
                    <span className="opp-type-badge">{opp.type}</span>
                  </div>
                  <h5 className="opp-role-title">{opp.title}</h5>
                  <div className="opp-stipend-row">
                    <Award size={13} className="text-blue" />
                    <span>{opp.stipend}</span>
                  </div>
                  <div className="spotlight-footer">
                    <span className="opp-deadline-snippet">Due {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <a 
                      href={opp.applyUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="opp-link-btn"
                      title="Visit application portal"
                    >
                      <span>Apply</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .overview-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.25rem 0 3rem 0;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        /* ====================================================================
           Fastweb Hero Style Card
           ==================================================================== */

        .fastweb-hero-card {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 2rem;
          align-items: center;
          background: #ffffff;
          border: 1.5px solid var(--surface-border);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px -5px rgba(12, 46, 89, 0.07);
          box-sizing: border-box;
        }

        .fastweb-hero-left {
          display: flex;
          flex-direction: column;
          min-width: 0;
          z-index: 2;
        }

        .hero-eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--fastweb-blue);
          background: var(--bg-sky-light);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid #bfdbfe;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: fit-content;
          margin-bottom: 0.875rem;
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--fastweb-blue);
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.25);
        }

        .hero-main-title {
          font-family: var(--font-heading);
          font-size: 1.6rem; /* Clean, compact, restrained */
          font-weight: 750;
          color: var(--fastweb-navy);
          line-height: 1.25;
          letter-spacing: -0.025em;
          margin-bottom: 0.75rem;
        }

        .hero-highlight-blue {
          color: var(--fastweb-blue);
          position: relative;
        }

        .hero-description {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          max-width: 540px;
        }

        .hero-description strong {
          color: var(--text-main);
        }

        .highlight-text-link {
          color: var(--fastweb-blue);
          font-weight: 600;
        }

        .hero-buttons-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .hero-btn-signup {
          padding: 0.5rem 1.15rem;
          font-size: 0.8125rem;
          font-weight: 700;
        }

        .hero-btn-ai {
          padding: 0.5rem 1.15rem;
          font-size: 0.8125rem;
        }

        .hero-calendar-link {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--fastweb-blue);
        }

        .hero-calendar-link:hover {
          color: var(--fastweb-blue-hover);
          text-decoration: underline;
        }

        /* Quick Stat Highlights */
        .hero-quick-stats {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--surface-border-subtle);
        }

        .quick-stat-item {
          display: flex;
          flex-direction: column;
        }

        .quick-stat-item strong {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 750;
          color: var(--fastweb-navy);
          line-height: 1.1;
        }

        .quick-stat-item span {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 24px;
          background: var(--surface-border);
        }

        /* ====================================================================
           Right Hero: Layered Colorful Organic Blobs + Student Photography
           ==================================================================== */

        .fastweb-hero-right {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          min-height: 290px;
        }

        .blobs-composition-wrapper {
          position: relative;
          width: 100%;
          max-width: 360px;
          height: 290px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Geometric Dot Grid */
        .dot-matrix-pattern {
          position: absolute;
          top: -5px;
          right: 15px;
          width: 100px;
          height: 100px;
          background-image: radial-gradient(#94a3b8 1.5px, transparent 1.5px);
          background-size: 14px 14px;
          opacity: 0.4;
          z-index: 0;
        }

        /* Blob 1: Magenta / Violet */
        .blob-magenta {
          position: absolute;
          width: 220px;
          height: 220px;
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%);
          border-radius: 46% 54% 63% 37% / 54% 47% 53% 46%;
          bottom: 5px;
          left: 10px;
          opacity: 0.95;
          filter: blur(0px);
          box-shadow: 0 12px 28px rgba(236, 72, 153, 0.3);
          z-index: 1;
        }

        /* Blob 2: Sunset Coral / Orange */
        .blob-coral {
          position: absolute;
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #f97316 0%, #fb923c 60%, #f43f5e 100%);
          border-radius: 58% 42% 38% 62% / 42% 58% 42% 58%;
          top: 20px;
          right: 15px;
          opacity: 0.95;
          box-shadow: 0 12px 28px rgba(249, 115, 22, 0.3);
          z-index: 1;
        }

        /* Blob 3: Sunny Yellow Circle */
        .blob-yellow {
          position: absolute;
          width: 140px;
          height: 140px;
          background: #facc15;
          border-radius: 50%;
          top: -10px;
          right: 0px;
          opacity: 0.95;
          z-index: 0;
        }

        /* Student Photo Frame */
        .student-photo-frame {
          position: relative;
          width: 210px;
          height: 210px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 16px 36px rgba(12, 46, 89, 0.22);
          border: 3px solid #ffffff;
          z-index: 3;
        }

        .student-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Floating Micro-Badges */
        .floating-badge {
          position: absolute;
          background: #ffffff;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--surface-border);
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 5;
          animation: floatBob 4s ease-in-out infinite;
        }

        .badge-top-right {
          top: 15px;
          right: 0;
          animation-delay: 0.5s;
        }

        .badge-bottom-left {
          bottom: 20px;
          left: -10px;
          animation-delay: 1.5s;
        }

        .badge-bottom-right {
          bottom: -10px;
          right: 30px;
          animation-delay: 2.2s;
        }

        .badge-star-icon { color: #f59e0b; fill: #f59e0b; }
        .badge-bell-icon { color: #ef4444; }
        .badge-briefcase-icon { color: #0284c7; }

        .float-badge-text {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .float-badge-text strong {
          font-size: 0.75rem;
          color: var(--text-main);
          line-height: 1.1;
        }

        .float-badge-text small {
          font-size: 0.625rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* ====================================================================
           Stats Grid
           ==================================================================== */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .stat-card {
          padding: 1.25rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-top: 4px solid transparent;
        }

        .stat-card-blue { border-top-color: #0284c7; }
        .stat-card-coral { border-top-color: #f97316; }
        .stat-card-purple { border-top-color: #8b5cf6; }
        .stat-card-green { border-top-color: #10b981; }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .stat-title {
          font-size: 0.72rem;
          font-weight: 650;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .stat-icon-box {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .box-blue { background: #e0f2fe; color: #0284c7; }
        .box-coral { background: #ffedd5; color: #f97316; }
        .box-purple { background: #f3e8ff; color: #8b5cf6; }
        .box-green { background: #dcfce7; color: #10b981; }

        .stat-metric-row {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-bottom: 0.35rem;
        }

        .stat-number {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 750;
          line-height: 1;
          color: var(--text-main);
        }

        .stat-pill {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
        }

        .pill-blue { background: #e0f2fe; color: #0369a1; }
        .pill-danger { background: #fee2e2; color: #b91c1c; }
        .pill-purple { background: #f3e8ff; color: #6b21a8; }
        .pill-green { background: #dcfce7; color: #15803d; }

        .stat-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .mini-progress-bar {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .mini-progress-fill {
          height: 100%;
          background: #10b981;
          border-radius: var(--radius-full);
        }

        .text-blue { color: #0284c7; }
        .text-green { color: #10b981; }
        .text-danger { color: #ef4444; }

        /* ====================================================================
           Main Content Layout
           ==================================================================== */

        .main-content-layout {
          display: grid;
          grid-template-columns: 1fr 370px;
          gap: 1.5rem;
          align-items: start;
        }

        .left-content-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-width: 0;
        }

        .right-content-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-width: 0;
        }

        .section-card {
          padding: 1.5rem;
          background: #ffffff;
        }

        .section-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .section-card-header h3 {
          font-size: 1.125rem;
          margin-bottom: 0.125rem;
        }

        .section-subtitle {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        /* Tasks Flow List */
        .tasks-flow-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .task-flow-item {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          padding: 1rem;
          background: #ffffff;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          transition: all 0.15s ease;
        }

        .task-flow-item:hover {
          border-color: #93c5fd;
          box-shadow: var(--shadow-sm);
        }

        .task-checkbox-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding-top: 3px;
        }

        .custom-check-box {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid #cbd5e1;
          transition: all 0.15s ease;
        }

        .task-checkbox-btn:hover .custom-check-box {
          border-color: var(--fastweb-green);
          background: #e8f6f0;
        }

        .task-info-block {
          flex: 1;
          min-width: 0;
        }

        .task-meta-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
          flex-wrap: wrap;
        }

        .course-code-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #0284c7;
          background: #e0f2fe;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .category-pill {
          font-size: 0.6875rem;
          color: var(--text-muted);
          background: var(--bg-sky-light);
          border: 1px solid var(--surface-border);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .task-heading {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }

        .task-notes-snippet {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }

        .task-meta-bottom {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }

        .due-countdown-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #b91c1c;
          font-weight: 600;
        }

        .instructor-tag {
          color: var(--text-subtle);
        }

        .task-progress-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
          min-width: 55px;
        }

        .progress-number {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .horizontal-bar {
          width: 50px;
          height: 5px;
          background: var(--surface-border);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .horizontal-fill {
          height: 100%;
          background: #0284c7;
          border-radius: var(--radius-full);
        }

        /* 7-Day Horizon */
        .horizon-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0.375rem;
          padding-top: 0.5rem;
          width: 100%;
          min-width: 0;
        }

        .horizon-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.625rem 0.35rem;
          border-radius: var(--radius-md);
          background: var(--bg-sky-light);
          border: 1px solid var(--surface-border);
          transition: all 0.15s;
          min-width: 0;
          overflow: hidden;
        }

        .horizon-col.day-has-due {
          background: #ffffff;
          border-color: #93c5fd;
          box-shadow: var(--shadow-xs);
        }

        .horizon-day-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .horizon-pill-track {
          display: flex;
          gap: 0.25rem;
          margin: 0.4rem 0;
          height: 10px;
          align-items: center;
        }

        .event-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-urgent { background: #ef4444; }
        .dot-high { background: #f59e0b; }

        .horizon-count-label {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        /* AI Copilot Teaser Card */
        .ai-teaser-card {
          padding: 1.5rem;
          background: linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%);
          border: 1.5px solid #bae6fd;
        }

        .ai-teaser-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .ai-brand-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: #0284c7;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ai-model-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #065f46;
          background: #d1fae5;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .ai-teaser-card h4 {
          font-size: 1rem;
          margin-bottom: 0.375rem;
        }

        .ai-teaser-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 1rem;
        }

        .ai-quick-prompts {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .ai-chip-prompt {
          text-align: left;
          background: #ffffff;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .ai-chip-prompt:hover {
          border-color: #0284c7;
          color: #0284c7;
          background: #f0f9ff;
        }

        .ai-launch-btn {
          width: 100%;
        }

        /* Career Spotlight */
        .spotlight-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .spotlight-item {
          padding: 0.875rem;
          background: #ffffff;
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          transition: all 0.15s;
        }

        .spotlight-item:hover {
          border-color: #93c5fd;
        }

        .spotlight-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .company-name-bold {
          font-weight: 700;
          font-size: 0.8125rem;
          color: var(--text-main);
        }

        .opp-type-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #6b21a8;
          background: #f3e8ff;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .opp-role-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }

        .opp-stipend-row {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.625rem;
        }

        .spotlight-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid var(--surface-border-subtle);
        }

        .opp-deadline-snippet {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .opp-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #0284c7;
        }

        .opp-link-btn:hover {
          text-decoration: underline;
        }

        /* Responsive rules */
        @media (max-width: 1080px) {
          .fastweb-hero-card {
            grid-template-columns: 1fr;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .main-content-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .hero-main-title {
            font-size: 1.85rem;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .blobs-composition-wrapper {
            height: 300px;
          }
          .student-photo-frame {
            width: 220px;
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
}
