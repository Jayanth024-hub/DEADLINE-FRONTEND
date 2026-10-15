/**
 * Centralized API configuration for DeadlineIQ.
 *
 * In development, VITE_API_BASE_URL can either be unset (relying on Vite's /api proxy)
 * or explicitly set to http://localhost:8080.
 * In production (e.g. deployed on Vercel), VITE_API_BASE_URL must be set to the
 * public Spring Boot API root URL (e.g. https://api.deadlineiq.example.com).
 */

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

// Strip any trailing slash for consistent concatenation
export const API_BASE_URL = rawBaseUrl.endsWith('/')
  ? rawBaseUrl.slice(0, -1)
  : rawBaseUrl;

/**
 * Builds a normalized API endpoint URL.
 * If endpoint starts with http:// or https://, it is returned as-is.
 * Otherwise, prepends API_BASE_URL (if configured) to the relative path.
 *
 * @param {string} path - e.g. '/api/auth/login'
 * @returns {string} - e.g. 'https://api.deadlineiq.example.com/api/auth/login' or '/api/auth/login'
 */
export function buildApiUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanPath}` : cleanPath;
}
