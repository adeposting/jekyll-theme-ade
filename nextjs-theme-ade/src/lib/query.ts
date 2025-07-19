import { Post, Page, QueryOptions, QueryResult, QueryFilters, SortOptions, PaginationOptions } from '@/types';

// Content Query Builder Class
export class ContentQuery {
  private filters: QueryFilters = {};
  private sorting: SortOptions = { field: 'date', order: 'desc' };
  private pagination: PaginationOptions = { limit: 10, offset: 0 };
  private grouping: string[] = [];
  private groupOrder: 'asc' | 'desc' = 'asc';

  constructor(private posts: Post[], private pages: Page[] = []) {}

  // Filtering methods
  filterByCategory(categories: string[]): ContentQuery {
    this.filters.categories = categories;
    return this;
  }

  filterByTag(tags: string[]): ContentQuery {
    this.filters.tags = tags;
    return this;
  }

  filterByYear(years: number[]): ContentQuery {
    this.filters.years = years;
    return this;
  }

  filterByMonth(months: number[]): ContentQuery {
    this.filters.months = months;
    return this;
  }

  filterByDay(days: number[]): ContentQuery {
    this.filters.days = days;
    return this;
  }

  filterByDateRange(start: Date, end: Date): ContentQuery {
    this.filters.dateRange = { start, end };
    return this;
  }

  // Sorting methods
  sortBy(field: 'title' | 'date' | 'categories' | 'tags', order: 'asc' | 'desc' = 'asc'): ContentQuery {
    this.sorting = { field, order };
    return this;
  }

  sortByTitle(order: 'asc' | 'desc' = 'asc'): ContentQuery {
    return this.sortBy('title', order);
  }

  sortByDate(order: 'asc' | 'desc' = 'desc'): ContentQuery {
    return this.sortBy('date', order);
  }

  // Pagination methods
  paginate(limit: number, offset: number = 0): ContentQuery {
    this.pagination = { limit, offset };
    return this;
  }

  limit(count: number): ContentQuery {
    this.pagination.limit = count;
    return this;
  }

  offset(count: number): ContentQuery {
    this.pagination.offset = count;
    return this;
  }

  page(pageNumber: number, pageSize: number = 10): ContentQuery {
    this.pagination = {
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
    };
    return this;
  }

  // Grouping methods
  groupBy(fields: string[]): ContentQuery {
    this.grouping = fields;
    return this;
  }

  groupByOrder(order: 'asc' | 'desc'): ContentQuery {
    this.groupOrder = order;
    return this;
  }

  // Execution method
  async execute(): Promise<QueryResult<Post>> {
    let filteredPosts = this.applyFilters([...this.posts]);
    
    // Apply sorting
    filteredPosts = this.applySorting(filteredPosts);
    
    // Calculate total before pagination
    const total = filteredPosts.length;
    
    // Apply pagination
    const paginatedPosts = this.applyPagination(filteredPosts);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / this.pagination.limit);
    const currentPage = Math.floor(this.pagination.offset / this.pagination.limit) + 1;
    const hasMore = this.pagination.offset + this.pagination.limit < total;

    return {
      items: paginatedPosts,
      total,
      hasMore,
      page: currentPage,
      totalPages,
    };
  }

  // Execute with grouping
  async executeGrouped(): Promise<Record<string, QueryResult<Post>>> {
    if (this.grouping.length === 0) {
      throw new Error('No grouping fields specified. Use groupBy() first.');
    }

    let filteredPosts = this.applyFilters([...this.posts]);
    filteredPosts = this.applySorting(filteredPosts);

    const grouped = this.groupPosts(filteredPosts, this.grouping[0]);
    const result: Record<string, QueryResult<Post>> = {};

    Object.keys(grouped).forEach(key => {
      const posts = grouped[key];
      const paginatedPosts = this.applyPagination(posts);
      const totalPages = Math.ceil(posts.length / this.pagination.limit);
      const currentPage = Math.floor(this.pagination.offset / this.pagination.limit) + 1;
      const hasMore = this.pagination.offset + this.pagination.limit < posts.length;

      result[key] = {
        items: paginatedPosts,
        total: posts.length,
        hasMore,
        page: currentPage,
        totalPages,
      };
    });

    return result;
  }

  // Get unique values for filtering
  async getUniqueCategories(): Promise<string[]> {
    const categories = new Set<string>();
    this.posts.forEach(post => {
      post.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories).sort();
  }

  async getUniqueTags(): Promise<string[]> {
    const tags = new Set<string>();
    this.posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  async getUniqueYears(): Promise<number[]> {
    const years = new Set<number>();
    this.posts.forEach(post => {
      years.add(post.date.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }

  async getUniqueMonths(): Promise<Array<{ year: number; month: number; name: string }>> {
    const months = new Set<string>();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    this.posts.forEach(post => {
      const year = post.date.getFullYear();
      const month = post.date.getMonth();
      months.add(`${year}-${month}`);
    });

    return Array.from(months)
      .map(key => {
        const [year, month] = key.split('-').map(Number);
        return {
          year,
          month: month + 1,
          name: monthNames[month],
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
  }

  // Private helper methods
  private applyFilters(posts: Post[]): Post[] {
    return posts.filter(post => {
      // Filter by categories
      if (this.filters.categories && this.filters.categories.length > 0) {
        const hasMatchingCategory = this.filters.categories.some(category =>
          post.categories.some(postCategory =>
            postCategory.toLowerCase().includes(category.toLowerCase())
          )
        );
        if (!hasMatchingCategory) return false;
      }

      // Filter by tags
      if (this.filters.tags && this.filters.tags.length > 0) {
        const hasMatchingTag = this.filters.tags.some(tag =>
          post.tags.some(postTag =>
            postTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) return false;
      }

      // Filter by years
      if (this.filters.years && this.filters.years.length > 0) {
        if (!this.filters.years.includes(post.date.getFullYear())) {
          return false;
        }
      }

      // Filter by months
      if (this.filters.months && this.filters.months.length > 0) {
        if (!this.filters.months.includes(post.date.getMonth() + 1)) {
          return false;
        }
      }

      // Filter by days
      if (this.filters.days && this.filters.days.length > 0) {
        if (!this.filters.days.includes(post.date.getDate())) {
          return false;
        }
      }

      // Filter by date range
      if (this.filters.dateRange) {
        if (post.date < this.filters.dateRange.start || post.date > this.filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }

  private applySorting(posts: Post[]): Post[] {
    return posts.sort((a, b) => {
      let comparison = 0;

      switch (this.sorting.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'categories':
          comparison = a.categories[0]?.localeCompare(b.categories[0] || '') || 0;
          break;
        case 'tags':
          comparison = a.tags[0]?.localeCompare(b.tags[0] || '') || 0;
          break;
      }

      return this.sorting.order === 'desc' ? -comparison : comparison;
    });
  }

  private applyPagination(posts: Post[]): Post[] {
    const start = this.pagination.offset;
    const end = start + this.pagination.limit;
    return posts.slice(start, end);
  }

  private groupPosts(posts: Post[], field: string): Record<string, Post[]> {
    const grouped: Record<string, Post[]> = {};

    posts.forEach(post => {
      let groupKey: string;

      switch (field) {
        case 'category':
          post.categories.forEach(category => {
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(post);
          });
          return;
        case 'tag':
          post.tags.forEach(tag => {
            if (!grouped[tag]) grouped[tag] = [];
            grouped[tag].push(post);
          });
          return;
        case 'year':
          groupKey = post.date.getFullYear().toString();
          break;
        case 'month':
          groupKey = `${post.date.getFullYear()}-${String(post.date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'author':
          groupKey = post.author || 'Unknown';
          break;
        default:
          groupKey = 'All';
      }

      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(post);
    });

    // Sort group keys
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      return this.groupOrder === 'desc' ? b.localeCompare(a) : a.localeCompare(b);
    });

    const sortedGrouped: Record<string, Post[]> = {};
    sortedKeys.forEach(key => {
      sortedGrouped[key] = grouped[key];
    });

    return sortedGrouped;
  }

  // Static factory methods
  static fromPosts(posts: Post[]): ContentQuery {
    return new ContentQuery(posts);
  }

  static fromPostsAndPages(posts: Post[], pages: Page[]): ContentQuery {
    return new ContentQuery(posts, pages);
  }
}

// Utility functions for common queries
export class QueryPresets {
  static recentPosts(posts: Post[], limit: number = 5): ContentQuery {
    return ContentQuery.fromPosts(posts)
      .sortByDate('desc')
      .limit(limit);
  }

  static popularCategories(posts: Post[], limit: number = 10): Promise<Array<{ category: string; count: number }>> {
    const categoryCount: Record<string, number> = {};
    
    posts.forEach(post => {
      post.categories.forEach(category => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });

    return Promise.resolve(
      Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
    );
  }

  static popularTags(posts: Post[], limit: number = 20): Promise<Array<{ tag: string; count: number }>> {
    const tagCount: Record<string, number> = {};
    
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    return Promise.resolve(
      Object.entries(tagCount)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
    );
  }

  static postsByYear(posts: Post[]): Promise<Record<string, Post[]>> {
    return ContentQuery.fromPosts(posts)
      .groupBy(['year'])
      .executeGrouped()
      .then(result => {
        const simplified: Record<string, Post[]> = {};
        Object.entries(result).forEach(([year, queryResult]) => {
          simplified[year] = queryResult.items;
        });
        return simplified;
      });
  }

  static relatedPosts(post: Post, allPosts: Post[], limit: number = 3): Promise<Post[]> {
    // Find posts with similar categories or tags
    const related = allPosts
      .filter(p => p.slug !== post.slug)
      .map(p => {
        let score = 0;
        
        // Score based on shared categories
        const sharedCategories = p.categories.filter(cat => 
          post.categories.includes(cat)
        ).length;
        score += sharedCategories * 3;
        
        // Score based on shared tags
        const sharedTags = p.tags.filter(tag => 
          post.tags.includes(tag)
        ).length;
        score += sharedTags * 2;
        
        return { post: p, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);

    return Promise.resolve(related);
  }
}

// Query result caching
export class QueryCache {
  private cache = new Map<string, { result: any; timestamp: number; ttl: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, result: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      result,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.result as T;
  }

  clear(): void {
    this.cache.clear();
  }

  generateKey(query: ContentQuery): string {
    // Generate a unique key based on query parameters
    return JSON.stringify({
      filters: query['filters'],
      sorting: query['sorting'],
      pagination: query['pagination'],
      grouping: query['grouping'],
    });
  }
}