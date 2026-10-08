import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Users, 
  ChevronRight, 
  Star, 
  Zap, 
  Award,
  Lock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function LandingPageView({ 
  onNavigate, 
  onRequireAuth, 
  opportunities = [] 
}) {
  const [selectedRole, setSelectedRole] = useState('STUDENT');

  const roleDetails = {
    STUDENT: {
      title: 'Student Academic Workspace',
      badge: 'Academic & Career',
      desc: 'Never miss an assignment, quiz, or placement drive. Get AI-powered study plans, automatic deadline prioritization, and resume-ready career tracking.',
      features: [
        'Automated deadline priority scoring (Urgent, High, Medium, Low)',
        'Responsive 7-day academic calendar with zero horizontal overflow',
        'Google Gemini 3.6 Flash Copilot with RAG PDF syllabus search',
        'Direct registration for campus placement & internship drives'
      ],
      ctaText: 'Access Student Portal',
      metric: '850+ Active Students'
    },
    FACULTY: {
      title: 'Faculty & Course Coordinator Console',
      badge: 'Curriculum & Assessment',
      desc: 'Seamlessly distribute lab briefs, track class submission statuses in real time, and verify assignment deliverables with transparent rubrics.',
      features: [
        'Instant assignment and lab deliverable publishing',
        'Real-time class completion percentage analytics',
        'Automated student submission alerts and deadline reminders',
        'Department-wide syllabus milestones synchronization'
      ],
      ctaText: 'Access Faculty Console',
      metric: '42 Academic Faculty'
    },
    COORDINATOR: {
      title: 'Training & Placement Cell (CDC)',
      badge: 'Career & Drives',
      desc: 'Manage campus placement drives, company presentations, eligibility filters, and track candidate interview rounds with end-to-end transparency.',
      features: [
        'Publish verified company drives and internship listings',
        'Enforce minimum CGPA and department eligibility cutoffs',
        'Real-time registration counts and candidate rosters',
        'Interview round scheduling and notification broadcasting'
      ],
      ctaText: 'Access Placement Cell',
      metric: '18 Active Recruiters'
    },
    DEAN: {
      title: 'Institutional Academic Overview',
      badge: 'Academic Leadership',
      desc: 'Review institution-wide academic milestones, course completion trends, overdue work, and campus opportunities from a dedicated leadership dashboard.',
      features: [
        'Cross-course academic milestone and completion overview',
        'Institution-wide view of upcoming and overdue deadlines',
        'Course-level completion progress based on tracked work',
        'Visibility into active career opportunities and events'
      ],
      ctaText: 'Access Dean Dashboard',
      metric: 'Academic Affairs'
    },
    ADMINISTRATOR: {
      title: 'Institutional Academic Governance',
      badge: 'System Governance',
      desc: 'Full visibility over campus accounts, departmental audit logs, system telemetry, and role authorization policies.',
      features: [
        'Role-based access control and clearance code verification',
        'Departmental workload and submission compliance metrics',
        'MySQL database persistence & Pinecone vector storage health',
        'Audit-ready academic reporting and record exports'
      ],
      ctaText: 'Access Admin Console',
      metric: 'Tier-1 Clearance'
    }
  };

  const publicOpportunities = opportunities.slice(0, 4);

  return (
    <div className="landing-page-root animate-fade-in">
      {/* =========================================================
          HERO SECTION
          ========================================================= */}
      <section className="landing-hero-section">
        <div className="landing-container">
          <div className="landing-hero-grid">
            {/* Left Content */}
            <div className="hero-text-col">
              <div className="hero-badge-pill">
                <span className="badge-icon">🎓</span>
                <span className="badge-label">Institutional Academic &amp; Career Operating System</span>
              </div>

              <h1 className="landing-hero-headline">
                Never Miss<br />
                <span className="hero-gradient-text">What Matters.</span>
              </h1>

              <p className="landing-hero-sub">
                DeadlineIQ is the unified platform for university students, faculty, and placement cells. 
                Manage academic deliverables, placement drives, interactive calendars, and AI-powered study schedules in one seamless place.
              </p>

              <div className="hero-actions-row">
                <button 
                  onClick={() => onNavigate('/register')} 
                  className="btn-primary hero-btn-main"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={16} />
                </button>

                <button 
                  onClick={() => onNavigate('/login')} 
                  className="btn-secondary hero-btn-sub"
                >
                  <span>Sign In to Portal</span>
                </button>

                <button 
                  onClick={() => {
                    const el = document.getElementById('opportunities');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="btn-ghost hero-btn-link"
                >
                  <span>Browse Opportunities</span>
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Trust & Metrics Row */}
              <div className="hero-metrics-strip">
                <div className="metric-item">
                  <span className="metric-val">4</span>
                  <span className="metric-lbl">Campus Roles</span>
                </div>
                <div className="metric-sep"></div>
                <div className="metric-item">
                  <span className="metric-val">99.4%</span>
                  <span className="metric-lbl">On-Time Submissions</span>
                </div>
                <div className="metric-sep"></div>
                <div className="metric-item">
                  <span className="metric-val" style={{ color: '#6366f1' }}>Gemini 3.6</span>
                  <span className="metric-lbl">AI Study Copilot</span>
                </div>
                <div className="metric-sep"></div>
                <div className="metric-item">
                  <span className="metric-val" style={{ color: '#059669' }}>MySQL</span>
                  <span className="metric-lbl">Relational Memory</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="hero-preview-col">
              <div className="preview-floating-card white-card shadow-lg">
                <div className="preview-card-header">
                  <div className="preview-brand">
                    <span className="brand-dot"></span>
                    <span className="brand-name">DeadlineIQ Interactive Preview</span>
                  </div>
                  <span className="preview-live-pill">Live System</span>
                </div>

                <div className="preview-card-body">
                  <div className="preview-meta-banner">
                    <div>
                      <h4 className="preview-meta-title">Computer Science &amp; Engineering</h4>
                      <p className="preview-meta-sub">Semester 6 • 4 Deliverables Ahead</p>
                    </div>
                    <span className="preview-cgpa-pill">8.94 CGPA</span>
                  </div>

                  {/* Sample Deadlines List */}
                  <div className="preview-deadlines-list">
                    <div className="preview-deadline-row urgent">
                      <div className="deadline-row-left">
                        <span className="priority-dot urgent"></span>
                        <div>
                          <strong>Operating Systems - CPU Scheduling Simulation</strong>
                          <p>Due in 3 days • Lab Report &amp; Gantt Chart</p>
                        </div>
                      </div>
                      <span className="status-badge urgent">URGENT</span>
                    </div>

                    <div className="preview-deadline-row high">
                      <div className="deadline-row-left">
                        <span className="priority-dot high"></span>
                        <div>
                          <strong>Computer Networks - Wireshark TCP Handshake</strong>
                          <p>Due in 4 days • Packet trace capture</p>
                        </div>
                      </div>
                      <span className="status-badge high">HIGH</span>
                    </div>

                    <div className="preview-deadline-row opp">
                      <div className="deadline-row-left">
                        <span className="priority-dot opp"></span>
                        <div>
                          <strong>Google SWE Summer Intern 2027</strong>
                          <p>CTC: ₹1.25L/mo • CTC On-Campus Drive</p>
                        </div>
                      </div>
                      <span className="status-badge opp">PLACEMENT</span>
                    </div>
                  </div>

                  {/* AI Copilot Callout */}
                  <div className="preview-ai-callout">
                    <div className="ai-icon-spark">
                      <Sparkles size={16} />
                    </div>
                    <div className="ai-callout-text">
                      <strong>Gemini 3.6 Flash Copilot:</strong>
                      <p>"Finish OS simulation before Friday so you don't bottleneck when Networks Lab is due Sunday!"</p>
                    </div>
                  </div>

                  <div className="preview-actions-bar">
                    <button 
                      onClick={() => onRequireAuth('/dashboard', 'Sign in to access your interactive Student Dashboard.')} 
                      className="btn-primary preview-full-btn"
                    >
                      <span>Explore Live Dashboard</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHAT DEADLINEIQ DOES (PILLARS)
          ========================================================= */}
      <section id="features" className="landing-section bg-subtle-section">
        <div className="landing-container">
          <div className="section-header-center">
            <span className="section-kicker">Core System Architecture</span>
            <h2 className="section-headline">Everything Needed for Campus Excellence</h2>
            <p className="section-sub">
              Designed specifically for modern engineering colleges and universities to eliminate missed deadlines and placement bottlenecks.
            </p>
          </div>

          <div className="features-six-grid">
            {/* Feature 1 */}
            <div className="feature-card white-card" onClick={() => onRequireAuth('/deadlines', 'Sign in to view your academic deliverables.')}>
              <div className="feature-icon-box bg-blue-light text-blue">
                <CheckSquare size={22} />
              </div>
              <h3>Deadline Management</h3>
              <p>
                Automatic priority calculation using turnaround time and submission dates. Track assignments, lab records, and project milestones.
              </p>
              <div className="feature-card-footer">
                <span>Explore Deliverables</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-card white-card" onClick={() => onRequireAuth('/calendar', 'Sign in to access your academic calendar.')}>
              <div className="feature-icon-box bg-purple-light text-purple">
                <CalendarIcon size={22} />
              </div>
              <h3>Responsive Academic Calendar</h3>
              <p>
                Pixel-perfect 7-day calendar engineered with responsive CSS grid. Never clips columns, zero horizontal overflow, and day-by-day deadline cards.
              </p>
              <div className="feature-card-footer">
                <span>View Calendar</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-card white-card" onClick={() => onRequireAuth('/opportunities', 'Sign in to browse campus placement drives.')}>
              <div className="feature-icon-box bg-green-light text-green">
                <Briefcase size={22} />
              </div>
              <h3>Campus Opportunities &amp; Drives</h3>
              <p>
                Direct placement feeds for top tech companies, research internships, and hackathons with explicit eligibility criteria and deadlines.
              </p>
              <div className="feature-card-footer">
                <span>Explore Drives</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="feature-card white-card" onClick={() => onRequireAuth('/ai-copilot', 'Sign in to launch your Gemini AI Academic Copilot.')}>
              <div className="feature-icon-box bg-indigo-light text-indigo">
                <Sparkles size={22} />
              </div>
              <h3>Google Gemini 3.6 AI Copilot</h3>
              <p>
                Integrated with Spring AI, Apache PDFBox, and Pinecone RAG. Upload course PDFs to ask detailed questions and generate study timelines.
              </p>
              <div className="feature-card-footer">
                <span>AI Copilot</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="feature-card white-card" onClick={() => onNavigate('/#roles')}>
              <div className="feature-icon-box bg-amber-light text-amber">
                <Users size={22} />
              </div>
              <h3>Role-Based Institutional Access</h3>
              <p>
                Tailored consoles for Students, Faculty, Training &amp; Placement Officers, and Administrators with strict data safety.
              </p>
              <div className="feature-card-footer">
                <span>View Roles</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="feature-card white-card" onClick={() => onRequireAuth('/dashboard', 'Sign in to view academic analytics.')}>
              <div className="feature-icon-box bg-rose-light text-rose">
                <Award size={22} />
              </div>
              <h3>Progress &amp; Workload Analytics</h3>
              <p>
                Visual progress indicators, course workload distributions, and semester CGPA benchmarks to keep you ahead of exam horizons.
              </p>
              <div className="feature-card-footer">
                <span>View Analytics</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ROLE-BASED ACCESS OVERVIEW
          ========================================================= */}
      <section id="roles" className="landing-section">
        <div className="landing-container">
          <div className="section-header-center">
            <span className="section-kicker">Multi-Persona Ecosystem</span>
            <h2 className="section-headline">Engineered for the Entire Campus</h2>
            <p className="section-sub">
              Every member of the academic community receives a dedicated interface tuned to their exact workflow.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="role-switcher-row">
            {(['STUDENT', 'FACULTY', 'COORDINATOR', 'DEAN', 'ADMINISTRATOR']).map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`role-switch-btn ${selectedRole === role ? 'active' : ''}`}
              >
                {role === 'STUDENT' && <GraduationCap size={16} />}
                {role === 'FACULTY' && <BookOpen size={16} />}
                {role === 'COORDINATOR' && <Briefcase size={16} />}
                {role === 'DEAN' && <GraduationCap size={16} />}
                {role === 'ADMINISTRATOR' && <ShieldCheck size={16} />}
                <span>{role === 'COORDINATOR' ? 'Placement Cell' : (role === 'ADMINISTRATOR' ? 'Admin' : role.charAt(0) + role.slice(1).toLowerCase())}</span>
              </button>
            ))}
          </div>

          {/* Active Role Showcase Card */}
          <div className="role-showcase-card white-card">
            <div className="role-showcase-grid">
              <div className="role-info-side">
                <span className="role-badge-capsule">{roleDetails[selectedRole].badge}</span>
                <h3>{roleDetails[selectedRole].title}</h3>
                <p className="role-desc-text">{roleDetails[selectedRole].desc}</p>

                <div className="role-features-checklist">
                  {roleDetails[selectedRole].features.map((feat, idx) => (
                    <div key={idx} className="checklist-item">
                      <CheckCircle2 size={16} className="text-success check-icon" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="role-cta-row">
                  <button 
                    onClick={() => onNavigate('/login')} 
                    className="btn-primary"
                  >
                    <span>{roleDetails[selectedRole].ctaText}</span>
                    <ArrowRight size={14} />
                  </button>
                  <span className="role-metric-note">{roleDetails[selectedRole].metric}</span>
                </div>
              </div>

              <div className="role-preview-side">
                <div className="role-box-highlight">
                  <div className="role-box-top">
                    <span className="status-indicator"></span>
                    <strong>{selectedRole} Workspace Profile</strong>
                  </div>
                  <div className="role-mock-lines">
                    <div className="mock-line wide"></div>
                    <div className="mock-line medium"></div>
                    <div className="mock-line narrow"></div>
                  </div>
                  <div className="role-quote-box">
                    <p>
                      {selectedRole === 'STUDENT' && '"DeadlineIQ cut my late submissions to zero and helped me balance OS lab with Google interview prep."'}
                      {selectedRole === 'FACULTY' && '"Publishing lab assignments and watching class completion in real time saves 5 hours every week."'}
                      {selectedRole === 'COORDINATOR' && '"Managing 500+ student applications for Microsoft and Google drives has never been this smooth."'}
                      {selectedRole === 'DEAN' && '"A clear institutional view of course progress and deadlines helps academic leadership act early."'}
                      {selectedRole === 'ADMINISTRATOR' && '"Complete departmental governance and database integrity with zero security compromises."'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PUBLIC OPPORTUNITIES SHOWCASE
          ========================================================= */}
      <section id="opportunities" className="landing-section bg-subtle-section">
        <div className="landing-container">
          <div className="section-header-split">
            <div>
              <span className="section-kicker">Placement &amp; Career Hub</span>
              <h2 className="section-headline">Active Campus Opportunities</h2>
              <p className="section-sub">
                Explore verified opportunities from top global recruiters. Sign in to submit your profile.
              </p>
            </div>
            <div>
              <button 
                onClick={() => onNavigate('/register')} 
                className="btn-secondary"
              >
                <span>Register to Apply</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="opportunities-grid-landing">
            {publicOpportunities.map(opp => (
              <div key={opp.id} className="landing-opp-card white-card">
                <div className="opp-header-row">
                  <div className="opp-logo-box">
                    {opp.company?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h4 className="opp-company-name">{opp.company}</h4>
                    <span className="opp-type-badge">{opp.type}</span>
                  </div>
                </div>

                <h3 className="opp-title">{opp.title}</h3>
                <p className="opp-desc">{opp.description}</p>

                <div className="opp-meta-list">
                  <div className="opp-meta-item">
                    <span className="meta-lbl">Eligibility:</span>
                    <span className="meta-val">{opp.eligibility}</span>
                  </div>
                  <div className="opp-meta-item">
                    <span className="meta-lbl">Package / Stipend:</span>
                    <span className="meta-val highlight">{opp.stipend || opp.package || 'Competitive'}</span>
                  </div>
                  <div className="opp-meta-item">
                    <span className="meta-lbl">Registration Deadline:</span>
                    <span className="meta-val text-urgent">{opp.deadline}</span>
                  </div>
                </div>

                <div className="opp-card-action">
                  <button 
                    onClick={() => onRequireAuth('/opportunities', `Sign in to register for ${opp.company} - ${opp.title}.`)} 
                    className="btn-primary apply-opp-btn"
                  >
                    <span>Register for Drive</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS (4 STEPS)
          ========================================================= */}
      <section id="how-it-works" className="landing-section">
        <div className="landing-container">
          <div className="section-header-center">
            <span className="section-kicker">Simple 4-Step Workflow</span>
            <h2 className="section-headline">How DeadlineIQ Works</h2>
            <p className="section-sub">
              From day one of the semester to placement day, stay organized with zero friction.
            </p>
          </div>

          <div className="steps-four-grid">
            <div className="step-card white-card">
              <span className="step-num">01</span>
              <h4>Select Your Role</h4>
              <p>Sign in with your institutional credentials as Student, Faculty, Placement Officer, or Administrator.</p>
            </div>

            <div className="step-card white-card">
              <span className="step-num">02</span>
              <h4>Sync Deliverables</h4>
              <p>Your course lab schedules, project milestones, and placement test dates load automatically.</p>
            </div>

            <div className="step-card white-card">
              <span className="step-num">03</span>
              <h4>Consult AI Copilot</h4>
              <p>Ask Google Gemini 3.6 Flash to order your deadlines by effort vs urgency and build study timelines.</p>
            </div>

            <div className="step-card white-card">
              <span className="step-num">04</span>
              <h4>Submit Ahead of Time</h4>
              <p>Track completion status, view the 7-day visual calendar, and submit deliverables with total peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CALL TO ACTION
          ========================================================= */}
      <section className="landing-cta-section">
        <div className="landing-container">
          <div className="cta-banner-card white-card">
            <div className="cta-content-inner">
              <div className="cta-icon-box">
                <Sparkles size={28} />
              </div>
              <h2>Ready to Supercharge Your Academic Journey?</h2>
              <p>
                Join hundreds of students and faculty members who manage coursework, projects, and careers with DeadlineIQ.
              </p>
              <div className="cta-buttons-row">
                <button 
                  onClick={() => onNavigate('/register')} 
                  className="btn-primary cta-btn-large"
                >
                  <span>Create Institutional Account</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => onNavigate('/login')} 
                  className="btn-secondary cta-btn-large"
                >
                  <span>Sign In to Existing Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PUBLIC FOOTER
          ========================================================= */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-top-grid">
            <div className="footer-brand-side">
              <div className="brand-logo-text">
                deadline<span className="brand-iq-accent">IQ</span>
              </div>
              <p className="footer-tagline">
                Institutional Academic &amp; Career Operating System.<br />
                One platform. Every deadline. Nothing missed.
              </p>
              <div className="institutional-badge">
                <ShieldCheck size={14} className="text-success" />
                <span>Tier-1 Academic Governance &amp; Security</span>
              </div>
            </div>

            <div className="footer-links-col">
              <h5>Product</h5>
              <ul>
                <li><button onClick={() => onNavigate('/#features')} className="footer-link">Features</button></li>
                <li><button onClick={() => onNavigate('/#opportunities')} className="footer-link">Campus Drives</button></li>
                <li><button onClick={() => onRequireAuth('/calendar', 'Sign in to access your Academic Calendar.')} className="footer-link">Academic Calendar</button></li>
                <li><button onClick={() => onRequireAuth('/ai-copilot', 'Sign in to launch AI Copilot.')} className="footer-link">Gemini 3.6 AI</button></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h5>Roles</h5>
              <ul>
                <li><button onClick={() => onNavigate('/login')} className="footer-link">Student Portal</button></li>
                <li><button onClick={() => onNavigate('/login')} className="footer-link">Faculty Console</button></li>
                <li><button onClick={() => onNavigate('/login')} className="footer-link">Placement Cell</button></li>
                <li><button onClick={() => onNavigate('/login')} className="footer-link">Institutional Admin</button></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h5>Access</h5>
              <ul>
                <li><button onClick={() => onNavigate('/login')} className="footer-link">Sign In</button></li>
                <li><button onClick={() => onNavigate('/register')} className="footer-link">Register Account</button></li>
                <li><button onClick={() => onRequireAuth('/dashboard', 'Sign in to view your dashboard.')} className="footer-link">Explore Dashboard</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-row">
            <p>© 2026 DeadlineIQ Academic Technologies. All rights reserved.</p>
            <p>Powered by Spring Boot 4.0.8, Java 21, MySQL &amp; Google Gemini 3.6 Flash.</p>
          </div>
        </div>
      </footer>

      {/* =========================================================
          LANDING PAGE COMPONENT STYLES
          ========================================================= */}
      <style>{`
        .landing-page-root {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          font-family: var(--font-body, system-ui, -apple-system, sans-serif);
        }

        .landing-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Hero */
        .landing-hero-section {
          padding: 3.5rem 0 4rem 0;
          background: linear-gradient(180deg, #f0f7ff 0%, #f8fafc 100%);
          border-bottom: 1px solid #e2e8f0;
        }

        .landing-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3rem;
          align-items: center;
        }

        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.25rem;
        }

        .landing-hero-headline {
          font-size: 3.25rem;
          line-height: 1.12;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin-bottom: 1.25rem;
        }

        .hero-gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .landing-hero-sub {
          font-size: 1.0625rem;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 2rem;
          max-width: 540px;
        }

        .hero-actions-row {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .hero-btn-main {
          padding: 0.75rem 1.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 10px;
        }

        .hero-btn-sub {
          padding: 0.75rem 1.35rem;
          font-size: 0.9375rem;
          font-weight: 600;
          border-radius: 10px;
        }

        .hero-btn-link {
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.75rem 1rem;
        }

        .hero-metrics-strip {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
        }

        .metric-val {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }

        .metric-lbl {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .metric-sep {
          width: 1px;
          height: 28px;
          background: #cbd5e1;
        }

        /* Floating Preview Card */
        .preview-floating-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 20px 35px -10px rgba(15, 23, 42, 0.12);
        }

        .preview-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.25rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .preview-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
        }

        .brand-name {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #334155;
        }

        .preview-live-pill {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #047857;
          background: #d1fae5;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
        }

        .preview-card-body {
          padding: 1.25rem;
        }

        .preview-meta-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .preview-meta-title {
          font-size: 0.9375rem;
          font-weight: 700;
          margin: 0;
          color: #0f172a;
        }

        .preview-meta-sub {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0.15rem 0 0 0;
        }

        .preview-cgpa-pill {
          font-size: 0.75rem;
          font-weight: 700;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
        }

        .preview-deadlines-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1rem;
        }

        .preview-deadline-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .deadline-row-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .deadline-row-left strong {
          font-size: 0.8125rem;
          display: block;
          color: #1e293b;
        }

        .deadline-row-left p {
          font-size: 0.6875rem;
          color: #64748b;
          margin: 0;
        }

        .priority-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .priority-dot.urgent { background: #ef4444; }
        .priority-dot.high { background: #f59e0b; }
        .priority-dot.opp { background: #8b5cf6; }

        .status-badge {
          font-size: 0.625rem;
          font-weight: 800;
          padding: 0.2rem 0.45rem;
          border-radius: 4px;
        }

        .status-badge.urgent { background: #fee2e2; color: #991b1b; }
        .status-badge.high { background: #fef3c7; color: #92400e; }
        .status-badge.opp { background: #ede9fe; color: #5b21b6; }

        .preview-ai-callout {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.75rem;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          margin-bottom: 1.25rem;
        }

        .ai-icon-spark {
          color: #2563eb;
          margin-top: 2px;
        }

        .ai-callout-text strong {
          font-size: 0.75rem;
          color: #1e40af;
          display: block;
        }

        .ai-callout-text p {
          font-size: 0.6875rem;
          color: #1e3a8a;
          margin: 0.15rem 0 0 0;
          font-style: italic;
        }

        .preview-full-btn {
          width: 100%;
          justify-content: center;
          padding: 0.65rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 8px;
        }

        /* Generic Section Styling */
        .landing-section {
          padding: 4.5rem 0;
        }

        .bg-subtle-section {
          background: #f1f5f9;
        }

        .section-header-center {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 3rem auto;
        }

        .section-header-split {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .section-kicker {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #2563eb;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.5rem;
          display: block;
        }

        .section-headline {
          font-size: 2.25rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }

        .section-sub {
          font-size: 1rem;
          line-height: 1.6;
          color: #475569;
          margin: 0;
        }

        /* Features Six Grid */
        .features-six-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .feature-card {
          padding: 1.75rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          display: flex;
          flex-direction: column;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(15, 23, 42, 0.08);
          border-color: #cbd5e1;
        }

        .feature-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .bg-blue-light { background: #eff6ff; }
        .text-blue { color: #2563eb; }
        .bg-purple-light { background: #f5f3ff; }
        .text-purple { color: #7c3aed; }
        .bg-green-light { background: #ecfdf5; }
        .text-green { color: #059669; }
        .bg-indigo-light { background: #e0e7ff; }
        .text-indigo { color: #4338ca; }
        .bg-amber-light { background: #fffbeb; }
        .text-amber { color: #d97706; }
        .bg-rose-light { background: #fff1f2; }
        .text-rose { color: #e11d48; }

        .feature-card h3 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.55;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .feature-card-footer {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #2563eb;
        }

        /* Role Switcher */
        .role-switcher-row {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .role-switch-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          border-radius: 9999px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .role-switch-btn.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }

        .role-showcase-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
        }

        .role-showcase-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 3rem;
          align-items: center;
        }

        .role-badge-capsule {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #2563eb;
          background: #eff6ff;
          padding: 0.2rem 0.65rem;
          border-radius: 9999px;
          margin-bottom: 0.75rem;
        }

        .role-info-side h3 {
          font-size: 1.625rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }

        .role-desc-text {
          font-size: 0.9375rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .role-features-checklist {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.875rem;
          color: #334155;
          font-weight: 500;
        }

        .role-cta-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .role-metric-note {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #64748b;
        }

        .role-box-highlight {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.75rem;
        }

        .role-box-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #1e293b;
          margin-bottom: 1.25rem;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
        }

        .role-mock-lines {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .mock-line {
          height: 8px;
          border-radius: 4px;
          background: #e2e8f0;
        }

        .mock-line.wide { width: 85%; }
        .mock-line.medium { width: 65%; }
        .mock-line.narrow { width: 45%; }

        .role-quote-box {
          background: #ffffff;
          padding: 1rem 1.25rem;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
        }

        .role-quote-box p {
          font-size: 0.8125rem;
          color: #334155;
          font-style: italic;
          margin: 0;
          line-height: 1.5;
        }

        /* Opportunities Grid */
        .opportunities-grid-landing {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .landing-opp-card {
          padding: 1.75rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          display: flex;
          flex-direction: column;
        }

        .opp-header-row {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          margin-bottom: 1rem;
        }

        .opp-logo-box {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #0f172a;
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
        }

        .opp-company-name {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .opp-type-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #2563eb;
          background: #eff6ff;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
        }

        .opp-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .opp-desc {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .opp-meta-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding: 0.875rem;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 1.25rem;
        }

        .opp-meta-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .meta-lbl {
          color: #64748b;
        }

        .meta-val {
          font-weight: 600;
          color: #1e293b;
        }

        .meta-val.highlight {
          color: #059669;
          font-weight: 700;
        }

        .meta-val.text-urgent {
          color: #dc2626;
          font-weight: 700;
        }

        .apply-opp-btn {
          width: 100%;
          justify-content: center;
          padding: 0.6rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 8px;
        }

        /* 4 Steps Grid */
        .steps-four-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .step-card {
          padding: 1.75rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .step-num {
          font-size: 1.5rem;
          font-weight: 800;
          color: #2563eb;
          display: block;
          margin-bottom: 0.75rem;
        }

        .step-card h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .step-card p {
          font-size: 0.8125rem;
          color: #64748b;
          line-height: 1.55;
          margin: 0;
        }

        /* CTA Section */
        .landing-cta-section {
          padding: 2rem 0 5rem 0;
        }

        .cta-banner-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 20px;
          padding: 3.5rem 2rem;
          text-align: center;
          color: #ffffff;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.25);
        }

        .cta-content-inner {
          max-width: 640px;
          margin: 0 auto;
        }

        .cta-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.1);
          color: #a5b4fc;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .cta-banner-card h2 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 0.875rem;
          letter-spacing: -0.02em;
        }

        .cta-banner-card p {
          font-size: 1rem;
          color: #cbd5e1;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .cta-buttons-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cta-btn-large {
          padding: 0.85rem 1.75rem;
          font-size: 0.9375rem;
          font-weight: 600;
          border-radius: 10px;
        }

        /* Footer */
        .landing-footer {
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          padding: 4rem 0 2.5rem 0;
        }

        .footer-top-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }

        .footer-brand-side .brand-logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }

        .footer-tagline {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.55;
          margin-bottom: 1.25rem;
        }

        .institutional-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #334155;
          background: #f8fafc;
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .footer-links-col h5 {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .footer-links-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .footer-link {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.875rem;
          color: #64748b;
          cursor: pointer;
          text-align: left;
          transition: color 0.15s;
        }

        .footer-link:hover {
          color: #2563eb;
        }

        .footer-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2rem;
          border-top: 1px solid #f1f5f9;
          font-size: 0.8125rem;
          color: #94a3b8;
          flex-wrap: wrap;
          gap: 1rem;
        }

        @media (max-width: 900px) {
          .landing-hero-grid,
          .role-showcase-grid,
          .footer-top-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 2rem;
          }
          .hero-text-col,
          .hero-preview-col,
          .role-info-side,
          .role-features-side {
            min-width: 0;
          }
          .features-six-grid {
            grid-template-columns: 1fr 1fr;
          }
          .opportunities-grid-landing {
            grid-template-columns: 1fr;
          }
          .steps-four-grid {
            grid-template-columns: 1fr 1fr;
          }
          .landing-hero-headline {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 600px) {
          .landing-container {
            padding: 0 1rem;
          }
          .landing-hero-section {
            padding: 2.5rem 0 3rem;
          }
          .landing-hero-headline {
            font-size: clamp(2rem, 10vw, 2.5rem);
          }
          .role-showcase-card {
            padding: 1.25rem;
          }
          .role-cta-row {
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .landing-section {
            padding: 3rem 0;
          }
          .features-six-grid,
          .steps-four-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
