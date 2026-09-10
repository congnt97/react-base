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
    /** Hành động hàng loạt: PATCH một lần cho nhiều id. */
    STATUS: '/members/status',
    /** List con theo id cha. */
    SESSIONS: '/members/:id/sessions',
  },
} as const;
