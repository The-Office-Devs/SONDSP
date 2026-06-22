export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export function buildPaginationProps<T>(
  page: PageResponse<T>,
  onPageChange: (page: number) => void
) {
  return {
    page: page.page,
    totalPages: page.totalPages,
    onPageChange,
    hasNext: page.hasNext,
    hasPrevious: page.hasPrevious,
    totalElements: page.totalElements,
    size: page.size,
  };
}

