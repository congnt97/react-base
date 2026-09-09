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
} as const;
