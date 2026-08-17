import type { LoggerService } from '@/application/services/LoggerService';

export const LoggerServiceImpl = (): LoggerService => ({
  error: (message, context) => {
    console.error(message, context);
  },
  info: (message, context) => {
    console.info(message, context);
  },
});
