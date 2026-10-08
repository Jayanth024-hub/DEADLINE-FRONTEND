import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { computeDocumentTitle, DEFAULT_TITLE } from '../utils/pageTitle';

/**
 * Global component placed inside <BrowserRouter> to synchronize document.title.
 */
export default function PageTitleManager() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const title = computeDocumentTitle(location.pathname, user);

    // Absolute defensive check: never allow 'null' or 'undefined' in title
    if (!title || typeof title !== 'string' || title.includes('null') || title.includes('undefined') || title.includes('[object Object]')) {
      document.title = DEFAULT_TITLE;
    } else {
      document.title = title;
    }
  }, [location.pathname, user]);

  return null;
}

/**
 * Optional hook for custom page title overrides.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    if (
      title && 
      typeof title === 'string' && 
      !title.includes('null') && 
      !title.includes('undefined') &&
      !title.includes('[object Object]')
    ) {
      document.title = title;
    }
  }, [title]);
}
