// Core content types
export interface Post {
  slug: string;
  title: string;
  date: Date;
  categories: string[];
  tags: string[];
  excerpt?: string;
  content: string;
  author?: string;
  featured_image?: string;
}

export interface Page {
  slug: string;
  title: string;
  content: string;
  description?: string;
  date?: Date;
}

// Search types
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

// Query system types
export interface QueryOptions {
  years?: number[];
  months?: number[];
  days?: number[];
  categories?: string[];
  tags?: string[];
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
}