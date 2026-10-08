export const ACADEMIC_SEMESTERS = Array.from({ length: 8 }, (_, index) => {
  const semester = index + 1;
  const year = Math.ceil(semester / 2);
  return `Semester ${semester} (${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year)`;
});

export const DEMO_USERS = {
  STUDENT: {
    id: 'usr-student',
    name: 'Sai Jayanth',
    email: 'saijayanth@univ.edu',
    password: 'password123',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    batch: '2023 - 2027',
    semester: '6th Semester',
    section: 'CSE 3-1 Section A',
    rollNumber: '22BCE1042',
    cgpa: '8.94',
    avatar: 'SJ',
  },
  FACULTY: {
    id: 'usr-faculty',
    name: 'Dr. R. Sharma',
    email: 'faculty@deadlineiq.com',
    password: 'password123',
    role: 'FACULTY',
    facultyId: 'FAC-CSE-042',
    department: 'Computer Science & Engineering',
    courses: ['CS301 - Operating Systems', 'CS302 - Process Synchronization Lab'],
    section: 'CSE 3-1 Section A',
    avatar: 'RS',
  },
  COORDINATOR: {
    id: 'usr-coordinator',
    name: 'Prof. K. Venkatesh',
    email: 'coordinator@deadlineiq.com',
    password: 'password123',
    role: 'COORDINATOR',
    department: 'Career & Placement Cell',
    initiatives: ['Campus Placements 2027', 'Summer Internships', 'SIH 2026 Hackathons'],
    avatar: 'KV',
  },
  DEAN: {
    id: 'usr-dean',
    name: 'Dr. A. Menon',
    email: 'dean@deadlineiq.com',
    password: 'password123',
    role: 'DEAN',
    department: 'Office of the Dean',
    avatar: 'AM',
  },
  ADMINISTRATOR: {
    id: 'usr-admin',
    name: 'Dr. S. Nair',
    email: 'admin@deadlineiq.com',
    password: 'password123',
    role: 'ADMINISTRATOR',
    department: 'Academic Affairs & Administration',
    avatar: 'SN',
  },
};

export const INITIAL_REGISTERED_USERS = Object.values(DEMO_USERS);
export const INITIAL_USER = DEMO_USERS.STUDENT;

/**
 * Pure Java Date/Time Business Logic replica for frontend real-time status calculation:
 * UPCOMING -> DUE SOON -> DUE TODAY -> OVERDUE -> COMPLETED
 */
export function calculateDeadlineStatus(dueDateStr, isCompleted) {
  if (isCompleted) return 'COMPLETED';
  if (!dueDateStr) return 'UPCOMING';
  const due = new Date(dueDateStr);
  const now = new Date('2026-10-01T13:30:00'); // current simulated time
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.round((dueDateOnly - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'OVERDUE';
  if (diffDays === 0) return 'DUE_TODAY';
  if (diffDays <= 3) return 'DUE_SOON';
  return 'UPCOMING';
}

export const INITIAL_DEADLINES = [
  {
    id: 'dl-1',
    title: 'Operating Systems - CPU Scheduling Simulation',
    course: 'CS301 - Operating Systems',
    category: 'ASSIGNMENT',
    dueDate: '2026-10-04T23:59:00',
    priority: 'URGENT',
    status: 'DUE_SOON',
    targetClass: 'CSE 3-1',
    targetSection: 'Section A',
    createdBy: 'faculty@deadlineiq.com',
    instructor: 'Dr. R. Sharma',
    completed: false,
    progress: 70,
    tags: ['C++', 'Scheduling', 'Lab'],
    notes: 'Implement FCFS, Round Robin (q=2), and Priority Non-preemptive algorithms with Gantt chart output.',
    totalSubmissions: 48,
    totalEnrolled: 60,
  },
  {
    id: 'dl-2',
    title: 'DBMS Phase 2 - Normalization & Schema Architecture',
    course: 'CS304 - Database Systems',
    category: 'PROJECT',
    dueDate: '2026-10-06T18:00:00',
    priority: 'HIGH',
    status: 'UPCOMING',
    targetClass: 'CSE 3-1',
    targetSection: 'Section A',
    createdBy: 'faculty@deadlineiq.com',
    instructor: 'Prof. K. Venkatesh',
    completed: false,
    progress: 45,
    tags: ['SQL', '3NF', 'PostgreSQL'],
    notes: 'Deliver normalized ER schemas up to BCNF with DDL scripts and sample relational queries.',
    totalSubmissions: 32,
    totalEnrolled: 60,
  },
  {
    id: 'dl-3',
    title: 'Computer Networks - Wireshark TCP Handshake Lab',
    course: 'CS306 - Computer Networks',
    category: 'LAB',
    dueDate: '2026-10-01T23:59:00',
    priority: 'URGENT',
    status: 'DUE_TODAY',
    targetClass: 'CSE 3-1',
    targetSection: 'Section A',
    createdBy: 'faculty@deadlineiq.com',
    instructor: 'Dr. Priya Mohan',
    completed: false,
    progress: 20,
    tags: ['Wireshark', 'TCP/IP', 'Networking'],
    notes: 'Capture 3-way TCP handshake packets and analyze sequence numbers and window sizing.',
    totalSubmissions: 54,
    totalEnrolled: 60,
  },
  {
    id: 'dl-4',
    title: 'Machine Learning - Deep Learning Midterm Exam',
    course: 'CS310 - Machine Learning',
    category: 'EXAM',
    dueDate: '2026-10-09T10:00:00',
    priority: 'MEDIUM',
    status: 'UPCOMING',
    targetClass: 'CSE 3-1',
    targetSection: 'All',
    createdBy: 'faculty@deadlineiq.com',
    instructor: 'Dr. Anand Raman',
    completed: false,
    progress: 50,
    tags: ['Backprop', 'CNN', 'Optimization'],
    notes: 'Covers linear regression, logistic loss, backpropagation, and CNN kernel convolutions.',
    totalSubmissions: 0,
    totalEnrolled: 120,
  },
  {
    id: 'dl-5',
    title: 'Discrete Mathematics - Tutorial Sheet 1 (Proofs)',
    course: 'MA201 - Discrete Math',
    category: 'ASSIGNMENT',
    dueDate: '2026-09-28T23:59:00',
    priority: 'LOW',
    status: 'OVERDUE',
    targetClass: 'CSE 3-1',
    targetSection: 'Section A',
    createdBy: 'faculty@deadlineiq.com',
    instructor: 'Dr. S. Nair',
    completed: false,
    progress: 10,
    tags: ['Graph Theory', 'Hamiltonian', 'Euler'],
    notes: 'Proofs on planar graphs and Euler paths.',
    totalSubmissions: 57,
    totalEnrolled: 60,
  },
  {
    id: 'dl-6',
    title: 'Software Engineering - Sprint 3 Retrospective',
    course: 'CS308 - Software Engineering',
    category: 'PROJECT',
    dueDate: '2026-09-26T20:00:00',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    targetClass: 'CSE 3-1',
    targetSection: 'Section A',
    createdBy: 'faculty@deadlineiq.com',
    instructor: 'Prof. T. Adhikari',
    completed: true,
    progress: 100,
    tags: ['Scrum', 'Agile', 'Jira'],
    notes: 'Submitted sprint velocity metrics and retrospective notes.',
    totalSubmissions: 60,
    totalEnrolled: 60,
  },
];

export const INITIAL_OPPORTUNITIES = [
  {
    id: 'opp-1',
    title: 'Software Engineering Intern - Summer 2027',
    company: 'Google',
    type: 'INTERNSHIP',
    location: 'Bangalore / Hyderabad / Remote',
    stipend: '₹1,25,000 / month',
    deadline: '2026-10-14T23:59:00',
    eligibility: 'B.Tech / M.Tech CS, IT, ECE (2027 Graduating)',
    tags: ['Algorithms', 'Distributed Systems', 'C++/Java/Go'],
    status: 'SAVED',
    applyUrl: 'https://careers.google.com',
    registeredStudents: ['Sai Jayanth', 'Aarav Patel', 'Riya Sharma', 'Ananya Sen'],
    registeredCount: 142,
    description: 'Work alongside world-class software engineers on core Google services, cloud infrastructure, and AI systems.'
  },
  {
    id: 'opp-2',
    title: 'Microsoft Imagine Cup & Hackathon 2026',
    company: 'Microsoft',
    type: 'HACKATHON',
    location: 'Global Virtual + Seattle Finals',
    stipend: '$100,000 USD Prize Pool + Azure Credits',
    deadline: '2026-10-08T23:59:00',
    eligibility: 'All Enrolled College Students Worldwide',
    tags: ['AI/ML', 'Azure', 'Innovation', 'Team of 3-4'],
    status: 'APPLIED',
    applyUrl: 'https://imaginecup.microsoft.com',
    registeredStudents: ['Sai Jayanth', 'Karthik Rao', 'Meera Joshi'],
    registeredCount: 88,
    description: 'Transform your boldest tech ideas into groundbreaking startups powered by Microsoft AI technologies.'
  },
  {
    id: 'opp-3',
    title: 'Summer Technology Analyst - Campus Placement',
    company: 'Goldman Sachs',
    type: 'PLACEMENT',
    location: 'Bangalore, India',
    stipend: '₹1,50,000 / mo + PPO Opportunity',
    deadline: '2026-10-18T18:00:00',
    eligibility: 'CGPA >= 8.0, Computer Science & Related',
    tags: ['FinTech', 'High Frequency', 'Java', 'Python'],
    status: 'SAVED',
    applyUrl: 'https://www.goldmansachs.com/careers',
    registeredStudents: ['Sai Jayanth', 'Pooja Reddy', 'Vikram Seth'],
    registeredCount: 215,
    description: 'Build enterprise platforms, trade execution systems, and analytics models for global financial markets.'
  },
  {
    id: 'opp-4',
    title: 'Uber STAR Engineering Apprenticeship',
    company: 'Uber',
    type: 'INTERNSHIP',
    location: 'Hyderabad, India',
    stipend: '₹1,10,000 / month',
    deadline: '2026-10-10T23:59:00',
    eligibility: 'Pre-final Year CS / Engineering Students',
    tags: ['Backend', 'Go', 'Microservices', 'Real-time'],
    status: 'INTERVIEWING',
    applyUrl: 'https://www.uber.com/careers',
    registeredStudents: ['Sai Jayanth', 'Siddharth V.'],
    registeredCount: 96,
    description: 'Deep dive into Uber’s dispatch engine, mapping pipelines, and rider/driver experience optimization.'
  },
  {
    id: 'opp-5',
    title: 'Smart India Hackathon (SIH) 2026 - Smart Education',
    company: 'Ministry of Education',
    type: 'HACKATHON',
    location: 'National Center / Hybrid',
    stipend: '₹1,00,000 Cash Prize per Problem Statement',
    deadline: '2026-10-06T17:00:00',
    eligibility: 'College Teams of 6 (Minimum 1 Female Member)',
    tags: ['Nation Building', 'Full Stack', 'AI/EdTech'],
    status: 'APPLIED',
    applyUrl: 'https://sih.gov.in',
    registeredStudents: ['Sai Jayanth', 'Team CyberKnights (6 members)'],
    registeredCount: 34,
    description: 'Solve real-world challenges faced by ministries and premier industries in India’s biggest innovation hackathon.'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Urgent Deadline Approaching',
    message: 'Operating Systems CPU Scheduling Simulation is due in 3 days.',
    time: '10 mins ago',
    type: 'warning',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Opportunity Reminder',
    message: 'SIH 2026 College round submissions close in 5 days.',
    time: '2 hours ago',
    type: 'info',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Submission Confirmed',
    message: 'Discrete Mathematics Problem Set 4 verified on university portal.',
    time: 'Yesterday',
    type: 'success',
    unread: false,
  }
];

export const SYSTEM_AUDIT_LOGS = [
  { id: 'log-1', timestamp: '2026-10-01 13:20', action: 'ROLE_SWITCH', user: 'admin@deadlineiq.com', details: 'Authorized Administrator role session.' },
  { id: 'log-2', timestamp: '2026-10-01 12:45', action: 'STATUS_RECALCULATED', user: 'SYSTEM_CRON', details: 'Batch updated 6 deadlines to DUE_TODAY and DUE_SOON.' },
  { id: 'log-3', timestamp: '2026-10-01 11:30', action: 'DEADLINE_CREATED', user: 'faculty@deadlineiq.com', details: 'Added CS301 CPU Scheduling Simulation for CSE 3-1 Sec A.' },
  { id: 'log-4', timestamp: '2026-10-01 10:15', action: 'OPPORTUNITY_PUBLISHED', user: 'coordinator@deadlineiq.com', details: 'Published Google SWE Summer 2027 opportunity.' },
  { id: 'log-5', timestamp: '2026-10-01 09:00', action: 'USER_LOGIN', user: 'saijayanth@univ.edu', details: 'Student authenticated via session token.' },
];

export const SYSTEM_DEPARTMENTS = [
  { id: 'dept-1', name: 'Computer Science & Engineering', code: 'CSE', coursesCount: 14, studentCount: 360, facultyCount: 22 },
  { id: 'dept-2', name: 'Information Technology', code: 'IT', coursesCount: 10, studentCount: 240, facultyCount: 16 },
  { id: 'dept-3', name: 'Electronics & Communication', code: 'ECE', coursesCount: 12, studentCount: 300, facultyCount: 20 },
];
