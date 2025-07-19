import Fuse from 'fuse.js';

// Search configuration
export interface SearchConfig {
  threshold: number;
  keys: SearchKey[];
  includeScore: boolean;
  includeMatches: boolean;
  minMatchCharLength: number;
  shouldSort: boolean;
}

export interface SearchKey {
  name: string;
  weight: number;
}

// Search index types
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
  documents: SearchDocument[];
  metadata: {
    totalDocuments: number;
    lastUpdated: Date;
    version: string;
  };
}

// Search result types
export interface SearchResult {
  item: SearchDocument;
  score?: number;
  matches?: SearchMatch[];
}

export interface SearchMatch {
  indices: [number, number][];
  value: string;
  key?: string;
  arrayIndex?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  totalResults: number;
  searchTime: number;
  suggestions?: string[];
}

// Trie data structure for efficient search
export interface TrieNode {
  [key: string]: TrieNode | SearchDocument[];
}

export interface SearchTrie {
  root: TrieNode;
  insert(word: string, document: SearchDocument): void;
  search(prefix: string): SearchDocument[];
  getSuggestions(prefix: string, limit?: number): string[];
}

// Search filters
export interface SearchFilters {
  types?: ('post' | 'page')[];
  categories?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  authors?: string[];
}

// Search history
export interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  resultCount: number;
}

export interface SearchHistory {
  items: SearchHistoryItem[];
  maxItems: number;
  add(query: string, resultCount: number): void;
  clear(): void;
  getRecent(limit?: number): SearchHistoryItem[];
}

// Search analytics
export interface SearchAnalytics {
  totalSearches: number;
  popularQueries: Array<{
    query: string;
    count: number;
  }>;
  averageResultCount: number;
  noResultQueries: string[];
}

// Fuse.js integration types
export type FuseSearchResult = Fuse.FuseResult<SearchDocument>;
export type FuseOptions = Fuse.IFuseOptions<SearchDocument>;