export type PaginationProps = {
  page?: string;
  limit?: string;
  fields?: string[];
  allowedFields?: string[];
  sortCursor?: 'asc' | 'desc';
  cursor?: string;
};
