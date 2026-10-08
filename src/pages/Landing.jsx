import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Users, 
  Zap,
  TrendingUp,
  Brain,
  LayoutDashboard
} from 'lucide-react';
import Footer from '../components/Footer';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'FACULTY') return '/faculty';
    if (user.role === 'COORDINATOR') return '/coordinator';
    if (user.role === 'ADMINISTRATOR' || user.role === 'ADMIN') return '/admin';
    return '/student';
  };

  return (
    <div className="landing-wrapper">
      {/* Top Navbar */}
      <header className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-icon-sq">IQ</div>
          <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy-dark)' }}>
            deadline<span style={{ color: 'var(--primary-blue)' }}>IQ</span>
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#how-it-works" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>How It Works</a>
          <a href="#features" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>Features</a>
          <a href="#ai-copilot" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>AI Copilot</a>
          <a href="#opportunities" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>Careers</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <button 
              className="saas-btn saas-btn-primary" 
              onClick={() => navigate(getDashboardPath())}
            >
              Go to Dashboard <ArrowRight size={14} />
            </button>
          ) : (
            <>
              <button 
                className="saas-btn saas-btn-secondary" 
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button 
                className="saas-btn saas-btn-primary" 
                onClick={() => navigate('/register')}
              >
                Get Started <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div>
          <div className="hero-tag">
            <Sparkles size={14} /> Next-Gen Academic & Career Operating System
          </div>
          <h1 className="hero-h1">
            Never miss an academic deadline again.
          </h1>
          <p className="hero-p">
            Unify course assignments, lab submissions, exam dates, and campus recruitment drives into one intelligent command center powered by Google Gemini AI.
          </p>
          <div className="hero-cta-group">
            <button 
              className="saas-btn saas-btn-primary saas-btn-lg" 
              onClick={() => navigate(user ? getDashboardPath() : '/register')}
            >
              {user ? 'Open Your Dashboard' : 'Get Started for Free'} <ArrowRight size={16} />
            </button>
            <button 
              className="saas-btn saas-btn-secondary saas-btn-lg" 
              onClick={() => navigate('/login')}
            >
              {user ? 'Account Sign In' : 'Explore Demo Accounts'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--emerald-green)' }} /> Zero Configuration
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--emerald-green)' }} /> Desktop SaaS Ready
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--emerald-green)' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--emerald-green)' }} /> Spring Boot + AI
            </div>
          </div>
        </div>

        {/* Live UI Preview Mockup */}
        <div className="hero-preview-window">
          <div className="preview-window-topbar">
            <div className="window-dot" style={{ background: '#ef4444' }}></div>
            <div className="window-dot" style={{ background: '#f59e0b' }}></div>
            <div className="window-dot" style={{ background: '#10b981' }}></div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '10px', fontWeight: 600 }}>
              deadlineiq.app/student/dashboard
            </span>
          </div>

          <div style={{ padding: '20px', background: 'var(--bg-app)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Upcoming High Priority</span>
              <PriorityBadge priority="URGENT" />
            </div>

            <div style={{ background: 'white', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-light)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Operating Systems Simulation Lab</span>
                <StatusBadge status="DUE_SOON" />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary-blue)', fontWeight: 600, marginBottom: '8px' }}>
                CS301 • Dr. R. Sharma
              </div>
              <ProgressBar progress={70} showLabel={true} />
            </div>

            <div style={{ background: 'white', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--emerald-green)', fontWeight: 700, marginBottom: '4px' }}>
                <Sparkles size={14} /> AI Recommendation
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Allocate 90 minutes to verify round-robin Gantt charts before tomorrow's 11:59 PM deadline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="landing-section how-it-works-section">
        <div className="section-head-center">
          <div className="section-pill-tag">
            <Sparkles size={12} /> Simple 6-Step Workflow
          </div>
          <h2 className="section-title">How DeadlineIQ Works</h2>
          <p className="section-subtitle">
            Everything you need to stay ahead of your academic and career deadlines — in one place.
          </p>
        </div>

        <div className="workflow-pipeline-grid">
          {/* STEP 1: CREATE YOUR ACCOUNT */}
          <div className="workflow-step-card">
            <div className="step-badge-row">
              <span className="step-number-tag">01</span>
              <span className="step-arrow-indicator"><ArrowRight size={14} /></span>
            </div>
            <div className="workflow-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Users size={22} />
            </div>
            <h3 className="workflow-step-title">Create Account</h3>
            <span className="workflow-step-role" style={{ background: '#e0f2fe', color: '#0369a1' }}>
              Select Your Role
            </span>
            <p className="workflow-step-desc">
              Users register or log in to DeadlineIQ and select their appropriate role: Student, Faculty, Coordinator, or Admin.
            </p>
          </div>

          {/* STEP 2: MANAGE DEADLINES */}
          <div className="workflow-step-card">
            <div className="step-badge-row">
              <span className="step-number-tag">02</span>
              <span className="step-arrow-indicator"><ArrowRight size={14} /></span>
            </div>
            <div className="workflow-icon-wrap" style={{ background: '#ffedd5', color: '#ea580c' }}>
              <Clock size={22} />
            </div>
            <h3 className="workflow-step-title">Manage Deadlines</h3>
            <span className="workflow-step-role" style={{ background: '#ffedd5', color: '#c2410c' }}>
              Academic & Personal
            </span>
            <p className="workflow-step-desc">
              Students create personal deadlines and view academic deliverables. Faculty create and manage assignments with due dates, priority, and status.
            </p>
          </div>

          {/* STEP 3: DISCOVER OPPORTUNITIES */}
          <div className="workflow-step-card">
            <div className="step-badge-row">
              <span className="step-number-tag">03</span>
              <span className="step-arrow-indicator"><ArrowRight size={14} /></span>
            </div>
            <div className="workflow-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Briefcase size={22} />
            </div>
            <h3 className="workflow-step-title">Opportunities</h3>
            <span className="workflow-step-role" style={{ background: '#f5f3ff', color: '#6d28d9' }}>
              1-Click Registration
            </span>
            <p className="workflow-step-desc">
              Students find internships, placements, hackathons, and workshops with clear eligibility criteria and instant registration.
            </p>
          </div>

          {/* STEP 4: STAY ORGANIZED */}
          <div className="workflow-step-card">
            <div className="step-badge-row">
              <span className="step-number-tag">04</span>
              <span className="step-arrow-indicator"><ArrowRight size={14} /></span>
            </div>
            <div className="workflow-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <LayoutDashboard size={22} />
            </div>
            <h3 className="workflow-step-title">Stay Organized</h3>
            <span className="workflow-step-role" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              Visual Dashboard
            </span>
            <p className="workflow-step-desc">
              The dashboard displays upcoming deadlines, urgent tasks, completed tasks, calendar heatmaps, and progress indicators.
            </p>
          </div>

          {/* STEP 5: USE THE AI ASSISTANT */}
          <div className="workflow-step-card">
            <div className="step-badge-row">
              <span className="step-number-tag">05</span>
              <span className="step-arrow-indicator"><ArrowRight size={14} /></span>
            </div>
            <div className="workflow-icon-wrap" style={{ background: '#fdf2f8', color: '#db2777' }}>
              <Sparkles size={22} />
            </div>
            <h3 className="workflow-step-title">Ask AI Assistant</h3>
            <span className="workflow-step-role" style={{ background: '#fdf2f8', color: '#be185d' }}>
              Spring AI + Gemini
            </span>
            <p className="workflow-step-desc">
              Ask questions about academic tasks, deadlines, and planning. The AI communicates directly with Spring Boot and Gemini.
            </p>
          </div>

          {/* STEP 6: COMPLETE AND TRACK */}
          <div className="workflow-step-card">
            <div className="step-badge-row">
              <span className="step-number-tag">06</span>
              <span className="step-arrow-indicator"><CheckCircle2 size={15} style={{ color: 'var(--emerald-green)' }} /></span>
            </div>
            <div className="workflow-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
              <CheckCircle2 size={22} />
            </div>
            <h3 className="workflow-step-title">Track & Complete</h3>
            <span className="workflow-step-role" style={{ background: '#ecfdf5', color: '#047857' }}>
              Live Progress
            </span>
            <p className="workflow-step-desc">
              Students mark deadlines as completed. The dashboard updates completion percentages and highlights what is still pending.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="landing-section">
        <div className="section-head-center">
          <h2 className="section-title">Everything In One Place</h2>
          <p className="section-subtitle">
            Built specifically for desktop productivity with rich tables, full-width calendars, and zero clutter.
          </p>
        </div>

        <div className="features-grid-3">
          <div className="feature-box">
            <div className="feature-icon-circle" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <CheckSquare size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>Deadline Management</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Filter by Upcoming, Due Today, Due Soon, and Overdue. Toggle status and track completion percentage effortlessly.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
              <CalendarIcon size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>Full Desktop Calendar</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Monthly calendar with color-coded dots representing urgency. Click any date to view all deliverables due that day.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <Briefcase size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>Career Drives</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Curated campus placements and internships from Google, Microsoft, and Goldman Sachs with 1-click registration.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <Brain size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>Gemini AI Copilot</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Ask intelligent questions about your deadlines, course syllabus, and interview preparations with conversational memory.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle" style={{ background: '#fee2e2', color: '#ef4444' }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>Role-Based Architecture</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Dedicated consoles for Students, Faculty (assignments & submissions), Coordinators (drives), and Administrators.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-circle" style={{ background: '#f1f5f9', color: '#334155' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>Spring Boot & MySQL</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enterprise REST backend on port 8080 with automated fallback to resilient local storage during offline testing.
            </p>
          </div>
        </div>
      </section>

      {/* AI Assistant Showcase */}
      <section id="ai-copilot" className="landing-section" style={{ background: '#0f172a', color: 'white', borderRadius: '24px', padding: '60px 48px', marginBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>
              <Sparkles size={14} /> AI Copilot Integration
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1.2, marginBottom: '18px', color: 'white' }}>
              Ask anything about your academic schedule.
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
              DeadlineIQ connects to Spring Boot RAG and Google Gemini to calculate optimal study hours, review exam topics, and suggest actionable timelines.
            </p>
            <button 
              className="saas-btn saas-btn-primary" 
              onClick={() => navigate(user ? '/ai' : '/login')}
            >
              Open AI Assistant <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 800 }}>
                YOU
              </div>
              <div style={{ background: '#334155', padding: '10px 14px', borderRadius: '12px', fontSize: '13px' }}>
                What deadlines should I prioritize before this Friday?
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #0284c7, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Sparkles size={14} />
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#e2e8f0', lineHeight: 1.5 }}>
                You have 2 critical deadlines:<br/>
                1. 🔴 <strong>OS Lab CPU Simulation</strong> (Due tomorrow at 11:59 PM)<br/>
                2. 🟠 <strong>DBMS Phase 2 Schema</strong> (Due Friday at 6:00 PM)<br/>
                Tip: Finish your OS test cases tonight so you have 2 days dedicated to DBMS Normalization!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-section" style={{ textAlign: 'center', paddingTop: '0' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--brand-navy-dark)', marginBottom: '12px' }}>
          Stay organized. Stay ahead.
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '28px', maxWidth: '520px', margin: '0 auto 28px' }}>
          Join students, faculty, and coordinators using DeadlineIQ to streamline academic life.
        </p>
        <button 
          className="saas-btn saas-btn-primary saas-btn-lg" 
          onClick={() => navigate(user ? getDashboardPath() : '/login')}
        >
          {user ? 'Open Dashboard' : 'Launch DeadlineIQ Now'} <ArrowRight size={16} />
        </button>
      </section>

      <Footer />
    </div>
  );
}
