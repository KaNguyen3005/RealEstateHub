export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiClientErrorPayload<T = unknown> {
  status: number;
  message: string;
  data?: T;
  errors?: unknown;
}
