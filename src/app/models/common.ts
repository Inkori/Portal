export interface Page<T> {
  readonly number: number;
  readonly size: number;
  readonly content: T[];
  readonly totalElements: number;
  readonly totalPages: number;
}

export interface ParamRequest {
  pageNumber?: number;
  pageSize?: number;
  sortByProperty?: string;
  sortByDirection?: string;
}

