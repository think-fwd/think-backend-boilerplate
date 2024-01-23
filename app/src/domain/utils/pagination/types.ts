export type PaginationType<T> = {
  results: Array<T>;
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
};
