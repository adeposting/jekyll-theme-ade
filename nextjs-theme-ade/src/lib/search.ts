import Fuse from 'fuse.js';
import { Post, Page } from '@/types';
import { 
  SearchDocument, 
  SearchIndex, 
  SearchResult, 
  SearchConfig, 
  SearchResponse,
  SearchFilters,
  TrieNode,
  SearchTrie
} from '@/types/search';

// Default search configuration
const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  threshold: 0.3,
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'excerpt', weight: 0.3 },
    { name: 'content', weight: 0.2 },
    { name: 'categories', weight: 0.05 },
    { name: 'tags', weight: 0.05 },
  ],
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  shouldSort: true,
};

// Build search index from content
export function buildSearchIndex(posts: Post[], pages: Page[]): SearchIndex {
  const documents: SearchDocument[] = [];

  // Add posts to search index
  posts.forEach(post => {
    documents.push({
      id: `post-${post.slug}`,
      type: 'post',
      title: post.title,
      content: stripHtml(post.content),
      excerpt: post.excerpt || '',
      url: `/blog/${post.slug}`,
      categories: post.categories,
      tags: post.tags,
      date: post.date.toISOString(),
      keywords: [...post.categories, ...post.tags, post.title.toLowerCase()],
    });
  });

  // Add pages to search index
  pages.forEach(page => {
    documents.push({
      id: `page-${page.slug}`,
      type: 'page',
      title: page.title,
      content: stripHtml(page.content),
      excerpt: page.description || '',
      url: `/${page.slug}`,
      categories: [],
      tags: [],
      date: page.date?.toISOString() || '',
      keywords: [page.title.toLowerCase()],
    });
  });

  return {
    documents,
    metadata: {
      totalDocuments: documents.length,
      lastUpdated: new Date(),
      version: '1.0.0',
    },
  };
}

// Strip HTML tags from content
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// Fuse.js search implementation
export class FuseSearch {
  private fuse: Fuse<SearchDocument>;
  private documents: SearchDocument[];

  constructor(searchIndex: SearchIndex, config: Partial<SearchConfig> = {}) {
    this.documents = searchIndex.documents;
    const fuseConfig = { ...DEFAULT_SEARCH_CONFIG, ...config };
    
    this.fuse = new Fuse(this.documents, {
      threshold: fuseConfig.threshold,
      keys: fuseConfig.keys.map(key => ({ name: key.name, weight: key.weight })),
      includeScore: fuseConfig.includeScore,
      includeMatches: fuseConfig.includeMatches,
      minMatchCharLength: fuseConfig.minMatchCharLength,
      shouldSort: fuseConfig.shouldSort,
    });
  }

  search(query: string, filters?: SearchFilters): SearchResponse {
    const startTime = performance.now();
    
    let results = this.fuse.search(query);
    
    // Apply filters
    if (filters) {
      results = this.applyFilters(results, filters);
    }

    const endTime = performance.now();
    const searchTime = endTime - startTime;

    return {
      results: results.map(result => ({
        item: result.item,
        score: result.score,
        matches: result.matches,
      })),
      query,
      totalResults: results.length,
      searchTime,
      suggestions: this.getSuggestions(query),
    };
  }

  private applyFilters(results: Fuse.FuseResult<SearchDocument>[], filters: SearchFilters): Fuse.FuseResult<SearchDocument>[] {
    return results.filter(result => {
      const doc = result.item;

      // Filter by content type
      if (filters.types && !filters.types.includes(doc.type)) {
        return false;
      }

      // Filter by categories
      if (filters.categories && filters.categories.length > 0) {
        const hasMatchingCategory = filters.categories.some(category =>
          doc.categories.some(docCategory =>
            docCategory.toLowerCase().includes(category.toLowerCase())
          )
        );
        if (!hasMatchingCategory) return false;
      }

      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag =>
          doc.tags.some(docTag =>
            docTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) return false;
      }

      // Filter by date range
      if (filters.dateRange && doc.date) {
        const docDate = new Date(doc.date);
        if (docDate < filters.dateRange.start || docDate > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }

  private getSuggestions(query: string, limit: number = 5): string[] {
    // Simple suggestion algorithm - in a real implementation, you might use a more sophisticated approach
    const words = query.toLowerCase().split(' ');
    const suggestions = new Set<string>();

    this.documents.forEach(doc => {
      const allText = `${doc.title} ${doc.content} ${doc.categories.join(' ')} ${doc.tags.join(' ')}`.toLowerCase();
      
      words.forEach(word => {
        if (word.length >= 2) {
          const regex = new RegExp(`\\b\\w*${word}\\w*\\b`, 'g');
          const matches = allText.match(regex);
          if (matches) {
            matches.forEach(match => {
              if (match !== word && match.length >= 3) {
                suggestions.add(match);
              }
            });
          }
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }

  getAllDocuments(): SearchDocument[] {
    return this.documents;
  }

  getDocumentById(id: string): SearchDocument | undefined {
    return this.documents.find(doc => doc.id === id);
  }
}

// Trie implementation for efficient prefix search
export class SearchTrieImpl implements SearchTrie {
  root: TrieNode = {};

  insert(word: string, document: SearchDocument): void {
    let current = this.root;
    const normalizedWord = word.toLowerCase();

    for (const char of normalizedWord) {
      if (!current[char]) {
        current[char] = {};
      }
      current = current[char] as TrieNode;
    }

    // Store documents at the end of the word
    if (!current['$documents']) {
      current['$documents'] = [];
    }
    (current['$documents'] as SearchDocument[]).push(document);
  }

  search(prefix: string): SearchDocument[] {
    let current = this.root;
    const normalizedPrefix = prefix.toLowerCase();

    // Navigate to the prefix
    for (const char of normalizedPrefix) {
      if (!current[char]) {
        return [];
      }
      current = current[char] as TrieNode;
    }

    // Collect all documents from this point
    return this.collectDocuments(current);
  }

  getSuggestions(prefix: string, limit: number = 10): string[] {
    let current = this.root;
    const normalizedPrefix = prefix.toLowerCase();

    // Navigate to the prefix
    for (const char of normalizedPrefix) {
      if (!current[char]) {
        return [];
      }
      current = current[char] as TrieNode;
    }

    // Collect all words from this point
    const suggestions: string[] = [];
    this.collectWords(current, normalizedPrefix, suggestions, limit);
    return suggestions;
  }

  private collectDocuments(node: TrieNode): SearchDocument[] {
    const documents: SearchDocument[] = [];

    if (node['$documents']) {
      documents.push(...(node['$documents'] as SearchDocument[]));
    }

    Object.keys(node).forEach(key => {
      if (key !== '$documents') {
        documents.push(...this.collectDocuments(node[key] as TrieNode));
      }
    });

    return documents;
  }

  private collectWords(node: TrieNode, currentWord: string, suggestions: string[], limit: number): void {
    if (suggestions.length >= limit) return;

    if (node['$documents']) {
      suggestions.push(currentWord);
    }

    Object.keys(node).forEach(key => {
      if (key !== '$documents' && suggestions.length < limit) {
        this.collectWords(node[key] as TrieNode, currentWord + key, suggestions, limit);
      }
    });
  }
}

// Build trie from search index
export function buildSearchTrie(searchIndex: SearchIndex): SearchTrieImpl {
  const trie = new SearchTrieImpl();

  searchIndex.documents.forEach(doc => {
    // Index title words
    doc.title.split(/\s+/).forEach(word => {
      if (word.length >= 2) {
        trie.insert(word, doc);
      }
    });

    // Index content words (first 100 words to avoid performance issues)
    const contentWords = doc.content.split(/\s+/).slice(0, 100);
    contentWords.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length >= 3) {
        trie.insert(cleanWord, doc);
      }
    });

    // Index categories and tags
    [...doc.categories, ...doc.tags].forEach(term => {
      trie.insert(term, doc);
    });
  });

  return trie;
}

// Search result ranking and highlighting
export function highlightSearchTerms(text: string, query: string): string {
  if (!query.trim()) return text;

  const words = query.toLowerCase().split(/\s+/).filter(word => word.length >= 2);
  let highlightedText = text;

  words.forEach(word => {
    const regex = new RegExp(`(${escapeRegExp(word)})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });

  return highlightedText;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Search utilities
export function extractSearchSnippet(content: string, query: string, maxLength: number = 200): string {
  if (!query.trim()) {
    return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
  }

  const words = query.toLowerCase().split(/\s+/).filter(word => word.length >= 2);
  const lowerContent = content.toLowerCase();

  // Find the first occurrence of any search term
  let bestIndex = -1;
  let bestWord = '';

  words.forEach(word => {
    const index = lowerContent.indexOf(word);
    if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
      bestIndex = index;
      bestWord = word;
    }
  });

  if (bestIndex === -1) {
    return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
  }

  // Extract snippet around the found term
  const start = Math.max(0, bestIndex - maxLength / 2);
  const end = Math.min(content.length, start + maxLength);
  let snippet = content.substring(start, end);

  // Add ellipsis if needed
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';

  return snippet;
}