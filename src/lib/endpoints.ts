export const Endpoints = {
  Auth: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  Files: {
    UPLOAD: '/files',
  },
  Dashboard: {
    ACTIVITY: '/dashboard/activity',
  },
  Projects: {
    LIST: '/projects',
    DETAIL: '/projects/:id',
  },
  Members: {
    LIST: '/members',
    DETAIL: '/members/:id',
    /** Bulk action: a single PATCH for many ids. */
    STATUS: '/members/status',
    /** Sub-list keyed by the parent id. */
    SESSIONS: '/members/:id/sessions',
  },
} as const;
