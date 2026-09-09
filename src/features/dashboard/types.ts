export type Activity = {
  id: string;
  actor: string;
  message: string;
  createdAt: string;
};

export type ActivityListParams = {
  cursor?: string;
  limit?: number;
};
