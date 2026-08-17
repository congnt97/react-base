export const Endpoints = {
  Auth: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },
} as const;
