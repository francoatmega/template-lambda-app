export type Log<T> = {
  success: boolean;
  error?: string;
  details?: unknown;
  data: T;
};
