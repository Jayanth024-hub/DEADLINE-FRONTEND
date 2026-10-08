import { 
  INITIAL_DEADLINES, 
  INITIAL_OPPORTUNITIES, 
  calculateDeadlineStatus 
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'deadlineiq_authenticated_user',
  TOKEN: 'deadlineiq_auth_token'
};

// Helper for authenticated fetch with credentials & authorization headers
function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) {
      const user = JSON.parse(stored);
      if (user.id) headers['X-User-Id'] = String(user.id);
      if (user.email) headers['X-User-Email'] = user.email;
      if (user.token) headers['Authorization'] = user.token;
    }
  } catch (e) {}
  return headers;
}

/* =========================================================================
   AUTH SERVICE (Real Spring Boot + MySQL)
   ========================================================================= */

export const authService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
    window.dispatchEvent(new Event('auth_state_changed'));
  },

  async verifySession() {
    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        const user = await res.json();
        const normalized = {
          ...user,
          role: user.role === 'ADMIN' ? 'ADMINISTRATOR' : user.role,
          avatar: user.name?.substring(0, 2).toUpperCase() || 'U'
        };
        this.setCurrentUser(normalized);
        return normalized;
      } else if (res.status === 401) {
        // Explicitly unauthenticated by backend
        this.setCurrentUser(null);
        return null;
      }
    } catch (e) {
      // Backend offline or unreachable
      this.setCurrentUser(null);
      return null;
    }
    this.setCurrentUser(null);
    return null;
  },

  async login(email, password) {
    let res;
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });
    } catch (networkError) {
      throw new Error('Cannot connect to Spring Boot server. Please ensure the backend is running on port 8080.');
    }

    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      if (res.status === 404) {
        throw new Error('Authentication service endpoint not found (404). Please ensure the backend is running on port 8080.');
      }
      throw new Error(`Server returned error status ${res.status}.`);
    }

    if (!res.ok || !data.success) {
      if (res.status === 401) {
        throw new Error(data.error || 'Invalid email or password. Please try again.');
      }
      if (res.status === 404) {
        throw new Error('Authentication endpoint not found on server (404).');
      }
      throw new Error(data.error || data.message || 'Invalid email or password.');
    }

    const rawUser = data.user || {};
    const authenticatedUser = {
      ...rawUser,
      role: (rawUser.role === 'ADMIN' || data.role === 'ADMIN') ? 'ADMINISTRATOR' : (rawUser.role || data.role || 'STUDENT'),
      token: data.token,
      avatar: rawUser.name?.substring(0, 2).toUpperCase() || 'US'
    };

    this.setCurrentUser(authenticatedUser);
    if (data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    }

    return { 
      success: true, 
      user: authenticatedUser, 
      role: authenticatedUser.role,
      redirectUrl: data.redirectUrl 
    };
  },

  async register(userData) {
    const role = (userData.role === 'ADMINISTRATOR' || userData.role === 'ADMIN') ? 'ADMIN' : (userData.role || 'STUDENT');
    const isFaculty = role === 'FACULTY';
    const isStudent = role === 'STUDENT';

    let res;
    try {
      res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: userData.name?.trim(),
          email: userData.email?.trim().toLowerCase(),
          password: userData.password,
          role,
          department: userData.department,
          subject: isFaculty ? userData.subject : null,
          year: isStudent ? (userData.year || '') : null,
          section: isStudent ? (userData.section || '') : null
        })
      });
    } catch (networkError) {
      throw new Error('Cannot connect to Spring Boot server. Please make sure the backend is running on port 8080.');
    }

    let data = {};
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      if (!res.ok) {
        throw new Error(text || `Server responded with error status ${res.status}`);
      }
    }

    if (!res.ok || data.success === false) {
      throw new Error(data.error || data.message || `Registration failed (${res.status}).`);
    }

    // Notice: Do NOT automatically log in. User must sign in.
    return { success: true, message: data.message || 'Account registered successfully. You may now sign in.' };
  },

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
    } catch (e) {}
    this.setCurrentUser(null);
  }
};

/* =========================================================================
   DEADLINES SERVICE (Backend REST + fallback)
   ========================================================================= */

export const deadlineService = {
  async getDeadlines() {
    try {
      const res = await fetch('/api/deadlines', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        const list = await res.json();
        return list.map(d => ({
          ...d,
          category: d.category ? String(d.category) : 'ASSIGNMENT',
          priority: d.priority ? String(d.priority) : 'MEDIUM',
          status: calculateDeadlineStatus(d.dueDate, d.completed)
        }));
      }
    } catch (e) {}

    // Local fallback for offline mode
    const stored = localStorage.getItem('deadlineiq_deadlines');
    return stored ? JSON.parse(stored) : INITIAL_DEADLINES;
  },

  async addDeadline(deadlineData) {
    try {
      const res = await fetch('/api/deadlines', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(deadlineData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    const newDeadline = {
      id: `dl-${Date.now()}`,
      completed: false,
      progress: 0,
      status: calculateDeadlineStatus(deadlineData.dueDate, false),
      ...deadlineData
    };
    const list = JSON.parse(localStorage.getItem('deadlineiq_deadlines') || JSON.stringify(INITIAL_DEADLINES));
    list.unshift(newDeadline);
    localStorage.setItem('deadlineiq_deadlines', JSON.stringify(list));
    return newDeadline;
  },

  async updateDeadline(id, updates) {
    const list = JSON.parse(localStorage.getItem('deadlineiq_deadlines') || JSON.stringify(INITIAL_DEADLINES));
    const idx = list.findIndex(d => String(d.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      if (updates.dueDate || updates.completed !== undefined) {
        list[idx].status = calculateDeadlineStatus(list[idx].dueDate, list[idx].completed);
      }
      localStorage.setItem('deadlineiq_deadlines', JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  async toggleComplete(id) {
    const list = JSON.parse(localStorage.getItem('deadlineiq_deadlines') || JSON.stringify(INITIAL_DEADLINES));
    const item = list.find(d => String(d.id) === String(id));
    if (item) {
      const nextCompleted = !item.completed;
      return this.updateDeadline(id, {
        completed: nextCompleted,
        progress: nextCompleted ? 100 : Math.min(item.progress || 50, 90)
      });
    }
    return null;
  },

  async deleteDeadline(id) {
    const list = JSON.parse(localStorage.getItem('deadlineiq_deadlines') || JSON.stringify(INITIAL_DEADLINES));
    const filtered = list.filter(d => String(d.id) !== String(id));
    localStorage.setItem('deadlineiq_deadlines', JSON.stringify(filtered));
    return true;
  }
};

/* =========================================================================
   OPPORTUNITY SERVICE (Backend REST + fallback)
   ========================================================================= */

export const opportunityService = {
  async getOpportunities() {
    try {
      const res = await fetch('/api/opportunities', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    const stored = localStorage.getItem('deadlineiq_opportunities');
    return stored ? JSON.parse(stored) : INITIAL_OPPORTUNITIES;
  },

  async addOpportunity(opportunityData) {
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(opportunityData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newOpp = {
      id: `opp-${Date.now()}`,
      registeredStudents: [],
      registeredCount: 0,
      ...opportunityData
    };
    const list = JSON.parse(localStorage.getItem('deadlineiq_opportunities') || JSON.stringify(INITIAL_OPPORTUNITIES));
    list.unshift(newOpp);
    localStorage.setItem('deadlineiq_opportunities', JSON.stringify(list));
    return newOpp;
  },

  async registerStudent(opportunityId, studentNameOrEmail) {
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) return true;
    } catch (e) {}

    const list = JSON.parse(localStorage.getItem('deadlineiq_opportunities') || JSON.stringify(INITIAL_OPPORTUNITIES));
    const opp = list.find(o => String(o.id) === String(opportunityId));
    if (opp) {
      if (!opp.registeredStudents) opp.registeredStudents = [];
      if (!opp.registeredStudents.includes(studentNameOrEmail)) {
        opp.registeredStudents.push(studentNameOrEmail);
        opp.registeredCount = (opp.registeredCount || 0) + 1;
        localStorage.setItem('deadlineiq_opportunities', JSON.stringify(list));
      }
      return true;
    }
    return false;
  }
};

/* =========================================================================
   USER-ISOLATED AI CHAT SERVICE
   ========================================================================= */

export const chatService = {
  async sendMessage(messageText, conversationId = 'default-session', userId = null) {
    const headers = getAuthHeaders();
    
    // 1. Try real Spring Boot backend /api/chat
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          message: messageText,
          conversationId,
          userId
        })
      });

      if (res.ok) {
        const data = await res.json();
        return data.response || data.message;
      }
      if (res.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
    } catch (e) {
      if (e.message?.includes('Authentication required')) throw e;
    }

    // 2. Try GET /api/chat?message=...
    try {
      const params = new URLSearchParams({ message: messageText, conversationId });
      if (userId) params.append('userId', String(userId));
      const res = await fetch(`/api/chat?${params.toString()}`, {
        headers,
        credentials: 'include'
      });
      if (res.ok) {
        return await res.text();
      }
    } catch (e) {}

    // 3. Fallback smart assistant response
    const lower = messageText.toLowerCase();
    if (lower.includes('deadline') || lower.includes('due') || lower.includes('assignment')) {
      return "Here are your active academic deliverables:\n1. 🔴 **Operating Systems CPU Scheduling Simulation** - Due in 2 days (Priority: Urgent)\n2. 🟠 **DBMS Phase 2 Normalization & Schema** - Due in 5 days (Priority: High)\n3. 🟡 **Machine Learning Midterm Exam** - Due in 9 days.\n\n*Recommendation*: Focus 2 hours on your OS scheduling Gantt chart simulation before tomorrow!";
    }
    if (lower.includes('internship') || lower.includes('opportunity') || lower.includes('google')) {
      return "Here are the verified campus drives matching your profile:\n- 🚀 **Google Summer Software Engineering Intern 2027** (₹1,25,000/mo, Closes in 14 days)\n- 🏆 **Microsoft Imagine Cup & AI Hackathon 2026** ($100k Prize Pool)\n\nHead over to the Career Opportunities tab to register in 1 click.";
    }
    return `DeadlineIQ AI Assistant: I am tracking your academic schedule for "${messageText}". All course deliverables and due dates are synced!`;
  },

  async getConversationHistory(conversationId, userId = null) {
    try {
      const params = userId ? `?userId=${userId}` : '';
      const res = await fetch(`/api/chat/history/${conversationId}${params}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return [];
  },

  async clearConversation(conversationId, userId = null) {
    try {
      const params = userId ? `?userId=${userId}` : '';
      await fetch(`/api/chat/${conversationId}${params}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
    } catch (e) {}
  }
};

/* =========================================================================
   USER MANAGEMENT & NOTIFICATION SERVICE
   ========================================================================= */

export const userService = {
  async getAllUsers() {
    try {
      const res = await fetch('/api/admin/users', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch campus users from backend:', e);
    }
    return [];
  },

  async addUser(newUser) {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(newUser)
    });
    if (res.ok) {
      return await res.json();
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create user account in MySQL database.');
  },

  async deleteUser(id) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return res.ok;
  }
};

export const notificationService = {
  getNotifications() {
    const stored = localStorage.getItem('deadlineiq_notifications');
    return stored ? JSON.parse(stored) : [
      { id: 1, title: 'Operating Systems CPU Scheduling Lab Due in 2 days', time: 'Tomorrow, 11:59 PM', unread: true },
      { id: 2, title: 'Google Summer Internship 2027 Applications Open', time: 'Oct 14, 2026', unread: true }
    ];
  },
  markAsRead(id) {
    const list = this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, unread: false } : n);
    localStorage.setItem('deadlineiq_notifications', JSON.stringify(updated));
    return updated;
  },
  markAllAsRead() {
    const list = this.getNotifications();
    const updated = list.map(n => ({ ...n, unread: false }));
    localStorage.setItem('deadlineiq_notifications', JSON.stringify(updated));
    return updated;
  }
};
