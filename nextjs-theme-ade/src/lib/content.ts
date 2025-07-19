import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { Post, Page, PostFrontmatter, TableOfContents } from '@/types';
import { PostFrontmatterSchema, PageFrontmatterSchema } from '@/types/content';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');

// Utility functions
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function calculateWordCount(content: string): number {
  return content.split(/\s+/).filter(word => word.length > 0).length;
}

export function extractTableOfContents(content: string): TableOfContents[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TableOfContents[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = generateSlug(title);

    toc.push({
      id,
      title,
      level,
    });
  }

  // Build hierarchical structure
  return buildTocHierarchy(toc);
}

function buildTocHierarchy(flatToc: TableOfContents[]): TableOfContents[] {
  const result: TableOfContents[] = [];
  const stack: TableOfContents[] = [];

  for (const item of flatToc) {
    // Remove items from stack that are at the same level or deeper
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(item);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }

    stack.push(item);
  }

  return result;
}

// Content processing
export async function processMarkdown(content: string): Promise<string> {
  const result = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(content);
  
  return result.toString();
}

// Post functions
export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  
  return fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => file.replace(/\.(md|mdx)$/, ''));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const possibleFiles = [
      path.join(POSTS_DIR, `${slug}.md`),
      path.join(POSTS_DIR, `${slug}.mdx`),
    ];

    let fullPath: string | null = null;
    for (const filePath of possibleFiles) {
      if (fs.existsSync(filePath)) {
        fullPath = filePath;
        break;
      }
    }

    if (!fullPath) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate frontmatter
    const validatedData = PostFrontmatterSchema.parse(data);

    const processedContent = await processMarkdown(content);
    const readingTime = calculateReadingTime(content);
    const wordCount = calculateWordCount(content);
    const toc = extractTableOfContents(content);

    return {
      slug,
      ...validatedData,
      date: new Date(validatedData.date),
      content: processedContent,
      readingTime,
      wordCount,
      toc,
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = getPostSlugs();
  const posts = await Promise.all(
    slugs.map(slug => getPostBySlug(slug))
  );

  return posts
    .filter((post): post is Post => post !== null)
    .filter(post => !post.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(post => !post.draft);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(post => 
    post.categories.some(cat => 
      cat.toLowerCase() === category.toLowerCase()
    )
  );
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(post => 
    post.tags.some(t => 
      t.toLowerCase() === tag.toLowerCase()
    )
  );
}

// Page functions
export function getPageSlugs(): string[] {
  if (!fs.existsSync(PAGES_DIR)) {
    return [];
  }
  
  return fs.readdirSync(PAGES_DIR)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => file.replace(/\.(md|mdx)$/, ''));
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const possibleFiles = [
      path.join(PAGES_DIR, `${slug}.md`),
      path.join(PAGES_DIR, `${slug}.mdx`),
    ];

    let fullPath: string | null = null;
    for (const filePath of possibleFiles) {
      if (fs.existsSync(filePath)) {
        fullPath = filePath;
        break;
      }
    }

    if (!fullPath) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate frontmatter
    const validatedData = PageFrontmatterSchema.parse(data);

    const processedContent = await processMarkdown(content);

    return {
      slug,
      title: validatedData.title,
      description: validatedData.description,
      date: validatedData.date ? new Date(validatedData.date) : undefined,
      content: processedContent,
    };
  } catch (error) {
    console.error(`Error loading page ${slug}:`, error);
    return null;
  }
}

export async function getAllPages(): Promise<Page[]> {
  const slugs = getPageSlugs();
  const pages = await Promise.all(
    slugs.map(slug => getPageBySlug(slug))
  );

  return pages.filter((page): page is Page => page !== null);
}

// Metadata functions
export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categories = new Set<string>();
  
  posts.forEach(post => {
    post.categories.forEach(category => categories.add(category));
  });
  
  return Array.from(categories).sort();
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

export async function getContentStats() {
  const posts = await getAllPosts();
  const pages = await getAllPages();
  const categories = await getAllCategories();
  const tags = await getAllTags();

  return {
    totalPosts: posts.length,
    totalPages: pages.length,
    totalCategories: categories.length,
    totalTags: tags.length,
    totalWords: posts.reduce((sum, post) => sum + post.wordCount, 0),
    averageReadingTime: posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length,
  };
}