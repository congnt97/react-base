/**
 * Contract between core (headless) and components (the adapter for the UI library).
 * Every adapter must satisfy these types; contract tests in components/ check the behavior.
 * Do not import any UI library here.
 */
import type { ReactNode } from 'react';

/** Async action: a call made while it's already running is ignored (blocks click spam). */
export type AsyncAction<TArgs extends unknown[] = []> = {
  /** Returns true if it actually ran, false if skipped because it was already running. */
  run: (...args: TArgs) => Promise<boolean>;
  /** For rendering: bind to the button's `loading`. */
  pending: boolean;
  /** Synchronous read inside a handler (the `pending` state is only accurate after the next render). */
  isRunning: () => boolean;
};

/** Confirmation dialog: always has a cancel; a destructive action must be `danger`. */
export type ConfirmOptions = {
  title: string;
  content?: ReactNode;
  okText: string;
  cancelText: string;
  danger?: boolean;
  /** Work to do on confirm; the OK button shows loading and can't be clicked again until it finishes. */
  onConfirm?: () => Promise<unknown>;
};

/** Returns true once the user confirms (and `onConfirm`, if provided, has finished running). */
export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

/** List state normalized for any table library. */
export type ListState<TItem> = {
  items: TItem[];
  total: number;
  /** true only while actually loading for the first time; a disabled query doesn't count as loading. */
  isLoading: boolean;
  /** Fetching a new page while still showing the old data. */
  isRefreshing: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};
