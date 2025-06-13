export interface ApiResponse<T> {
  [key: string]:
    | T[]
    | { current_page: number; next_page: number | null }
    | undefined;
  pagination?: {
    current_page: number;
    next_page: number | null;
  };
}

export interface SelectOption {
  id: string;
  name: string;
  options?: SelectOption[];
}

export interface InfiniteScrollParams<T> {
  api: (query: string, isInfinite: boolean) => Promise<ApiResponse<T>>;
  query?: string;
  key: string;
  page?: number;
  extraParams?: Record<string, string | number | boolean | null | undefined>;
}
