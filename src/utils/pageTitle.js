export const DEFAULT_TITLE = 'DeadlineIQ — Academic & Career Management';

export const ROUTE_TITLES = {
  '/': 'Academic & Career Management',
  '/login': 'Login',
  '/register': 'Register',
  '/student': 'Student Dashboard',
  '/student/dashboard': 'Student Dashboard',
  '/student/deadlines': 'Deadlines',
  '/student/add-deadline': 'Add Deadline',
  '/student/opportunities': 'Opportunities',
  '/student/profile': 'Student Profile',
  '/faculty': 'Faculty Dashboard',
  '/faculty/dashboard': 'Faculty Dashboard',
  '/faculty/assignments': 'Assignments',
  '/faculty/add-assignment': 'Create Assignment',
  '/coordinator': 'Coordinator Dashboard',
  '/coordinator/dashboard': 'Coordinator Dashboard',
  '/coordinator/opportunities': 'Opportunities',
  '/coordinator/registrations': 'Registrations',
  '/admin': 'Admin Dashboard',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/users': 'User Management',
  '/admin/deadlines': 'System Deadlines',
  '/ai': 'AI Assistant'
};

/**
 * Safely extract a valid display name for the user.
 * Guarantees that empty string, 'null', 'undefined', or '[object Object]' are rejected.
 */
export function getSafeDisplayName(user) {
  if (!user || typeof user !== 'object') return null;
  const raw = user.name || user.username || user.fullName || (user.email ? user.email.split('@')[0] : null);
  if (!raw || typeof raw !== 'string') return null;
  const clean = raw.trim();
  const lower = clean.toLowerCase();
  if (lower === '' || lower === 'null' || lower === 'undefined' || lower === '[object object]') {
    return null;
  }
  return clean;
}

/**
 * Resolves a human-readable title for a given pathname.
 */
export function getRouteTitle(pathname) {
  if (!pathname || typeof pathname !== 'string') return 'Academic & Career Management';

  const normalized = pathname.length > 1 && pathname.endsWith('/') 
    ? pathname.slice(0, -1) 
    : pathname;

  if (ROUTE_TITLES[normalized]) {
    return ROUTE_TITLES[normalized];
  }

  // Prefix matching for nested / dynamic routes
  if (normalized.startsWith('/student/deadlines')) return 'Deadlines';
  if (normalized.startsWith('/student/opportunities')) return 'Opportunities';
  if (normalized.startsWith('/student/profile')) return 'Student Profile';
  if (normalized.startsWith('/student')) return 'Student Dashboard';

  if (normalized.startsWith('/faculty/assignments')) return 'Assignments';
  if (normalized.startsWith('/faculty')) return 'Faculty Dashboard';

  if (normalized.startsWith('/coordinator/opportunities')) return 'Opportunities';
  if (normalized.startsWith('/coordinator/registrations')) return 'Registrations';
  if (normalized.startsWith('/coordinator')) return 'Coordinator Dashboard';

  if (normalized.startsWith('/admin/users')) return 'User Management';
  if (normalized.startsWith('/admin/deadlines')) return 'System Deadlines';
  if (normalized.startsWith('/admin')) return 'Admin Dashboard';

  if (normalized.startsWith('/ai')) return 'AI Assistant';

  return 'Academic & Career Management';
}

/**
 * Computes the complete document title with fallback guarantees.
 */
export function computeDocumentTitle(pathname, user) {
  const normalized = (!pathname || typeof pathname !== 'string') 
    ? '/' 
    : (pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname);

  const displayName = getSafeDisplayName(user);
  const pageTitle = getRouteTitle(normalized);

  // 1. Root landing page
  if (normalized === '/') {
    return displayName 
      ? `${displayName} — Academic & Career Management` 
      : DEFAULT_TITLE;
  }

  // 2. Auth pages (keep concise and clean)
  if (normalized === '/login') {
    return 'Login — DeadlineIQ';
  }
  if (normalized === '/register') {
    return 'Register — DeadlineIQ';
  }

  // 3. User authenticated on dashboard/protected routes
  if (displayName) {
    return `${displayName} — ${pageTitle} | DeadlineIQ`;
  }

  // 4. Fallback for unauthenticated or loading state
  return `${pageTitle} — DeadlineIQ`;
}
