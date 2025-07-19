// Core content types
export interface PostFrontmatter {
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  excerpt?: string;
  author?: string;
  featured_image?: string;
  draft?: boolean;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  date: Date;
  readingTime: number;
  wordCount: number;
  toc?: TableOfContents[];
}

export interface Page {
  slug: string;
  title: string;
  content: string;
  description?: string;
  date?: Date;
}

export interface TableOfContents {
  id: string;
  title: string;
  level: number;
  children?: TableOfContents[];
}

// Search types
export interface SearchDocument {
  id: string;
  type: 'post' | 'page';
  title: string;
  content: string;
  excerpt: string;
  url: string;
  categories: string[];
  tags: string[];
  date: string;
  keywords: string[];
}

export interface SearchIndex {
  textContent: string;
  href: string;
  words: string[];
  categories: string[];
  tags: string[];
}

export interface SearchResult {
  item: SearchIndex;
  score: number;
  matches: SearchMatch[];
}

export interface SearchMatch {
  indices: [number, number][];
  value: string;
  key: string;
}

export interface TrieNode {
  [key: string]: TrieNode | SearchDocument[];
}

// Query system types
export interface QueryFilters {
  years?: number[];
  months?: number[];
  days?: number[];
  categories?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SortOptions {
  field: 'title' | 'date' | 'categories' | 'tags';
  order: 'asc' | 'desc';
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface QueryOptions extends QueryFilters {
  orderBy?: 'title' | 'date' | 'categories' | 'tags';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  groupBy?: string[];
  groupByOrder?: 'asc' | 'desc';
}

export interface QueryResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  page?: number;
  totalPages?: number;
}

// Error handling types
export enum ErrorType {
  CONTENT_NOT_FOUND = 'CONTENT_NOT_FOUND',
  SEARCH_FAILED = 'SEARCH_FAILED',
  BUILD_ERROR = 'BUILD_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export interface AppError extends Error {
  type: ErrorType;
  code?: string;
  context?: Record<string, unknown>;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PostCardProps extends BaseComponentProps {
  post: Post;
  showExcerpt?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
}

export interface SearchInputProps extends BaseComponentProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
}

export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
}

// Utility types
export type ContentType = 'post' | 'page';
export type SortOrder = 'asc' | 'desc';
export type SortField = 'title' | 'date' | 'categories' | 'tags';

// Performance monitoring types
export interface PerformanceMetrics {
  searchLatency: number;
  pageLoadTime: number;
  buildTime: number;
  bundleSize: number;
  lighthouseScore: number;
}

// Content validation types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}