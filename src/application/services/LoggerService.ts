export interface LoggerService {
  error: (message: string, context?: unknown) => void;
  info: (message: string, context?: unknown) => void;
}
