/**
 * Contract giữa core (headless) và components (adapter cho thư viện UI).
 * Adapter nào cũng phải thoả các type này; test contract trong components/ kiểm tra hành vi.
 * Không import thư viện UI ở đây.
 */
import type { ReactNode } from 'react';

/** Hành động async: gọi khi đang chạy thì bị bỏ qua (chặn click spam). */
export type AsyncAction<TArgs extends unknown[] = []> = {
  /** Trả true nếu đã chạy, false nếu bị bỏ qua vì đang chạy. */
  run: (...args: TArgs) => Promise<boolean>;
  /** Cho render: bind vào `loading` của nút. */
  pending: boolean;
  /** Đọc đồng bộ trong handler (state `pending` chỉ đúng sau lần render kế). */
  isRunning: () => boolean;
};

/** Hộp thoại xác nhận: luôn có huỷ, hành động phá huỷ phải `danger`. */
export type ConfirmOptions = {
  title: string;
  content?: ReactNode;
  okText: string;
  cancelText: string;
  danger?: boolean;
  /** Việc cần làm khi xác nhận; nút OK loading và không bấm được lần hai tới khi xong. */
  onConfirm?: () => Promise<unknown>;
};

/** Trả true khi người dùng xác nhận (và `onConfirm` nếu có đã chạy xong). */
export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

/** Trạng thái list đã chuẩn hoá cho mọi thư viện bảng. */
export type ListState<TItem> = {
  items: TItem[];
  total: number;
  /** true chỉ khi thật sự đang tải lần đầu; query bị tắt không tính là loading. */
  isLoading: boolean;
  /** Đang tải trang mới nhưng còn data cũ để hiện. */
  isRefreshing: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};
