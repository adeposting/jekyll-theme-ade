import { z } from 'zod';

// Zod schemas for content validation
export const PostFrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().datetime('Invalid date format'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  excerpt: z.string().optional(),
  author: z.string().optional(),
  featured_image: z.string().url().optional(),
  draft: z.boolean().default(false),
});

export const PageFrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
  draft: z.boolean().default(false),
});

export const PostSchema = PostFrontmatterSchema.extend({
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  readingTime: z.number().min(0),
  wordCount: z.number().min(0),
});

export const PageSchema = PageFrontmatterSchema.extend({
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
});

// Type inference from schemas
export type PostFrontmatterInput = z.input<typeof PostFrontmatterSchema>;
export type PostFrontmatterOutput = z.output<typeof PostFrontmatterSchema>;
export type PageFrontmatterInput = z.input<typeof PageFrontmatterSchema>;
export type PageFrontmatterOutput = z.output<typeof PageFrontmatterSchema>;
export type PostInput = z.input<typeof PostSchema>;
export type PostOutput = z.output<typeof PostSchema>;
export type PageInput = z.input<typeof PageSchema>;
export type PageOutput = z.output<typeof PageSchema>;

// Content processing types
export interface ContentProcessor {
  processMarkdown(content: string): Promise<string>;
  extractFrontmatter(content: string): { data: unknown; content: string };
  generateSlug(title: string): string;
  calculateReadingTime(content: string): number;
  extractTableOfContents(content: string): TableOfContents[];
}

export interface TableOfContents {
  id: string;
  title: string;
  level: number;
  children?: TableOfContents[];
}

// Content metadata
export interface ContentMetadata {
  lastModified: Date;
  fileSize: number;
  checksum: string;
}

// Content collection types
export interface ContentCollection<T> {
  items: T[];
  metadata: {
    total: number;
    lastUpdated: Date;
    categories: string[];
    tags: string[];
  };
}