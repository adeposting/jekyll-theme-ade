import Link from 'next/link';
import { getAllPosts } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export default async function Home() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-green-500">
              NextJS Theme ADE
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            A modern, performant blog theme built with Next.js and TypeScript. 
            Featuring advanced search, dynamic content queries, and a beautiful dark theme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              <Link href="/blog" className="flex items-center">
                Explore Posts
                <Icon name="arrow_right" size="sm" className="ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/about" className="flex items-center">
                Learn More
                <Icon name="external_link" size="sm" className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Built with modern web technologies and best practices for optimal performance and developer experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Icon name="search" size="md" color="white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Advanced Search</h3>
            <p className="text-gray-400">
              Real-time search with fuzzy matching, suggestions, and advanced filtering capabilities.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <Icon name="folder" size="md" color="white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Content Management</h3>
            <p className="text-gray-400">
              Markdown-based content with frontmatter support, syntax highlighting, and table of contents.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Icon name="external_link" size="md" color="white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Performance First</h3>
            <p className="text-gray-400">
              Static site generation, code splitting, and optimized images for lightning-fast loading.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <section className="py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Recent Posts</h2>
            <Link
              href="/blog"
              className="text-pink-400 hover:text-pink-300 transition-colors flex items-center"
            >
              View all posts
              <Icon name="arrow_right" size="sm" className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <Icon name="calendar" size="sm" className="mr-1" />
                    {post.date.toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 hover:text-pink-400 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-pink-400 hover:text-pink-300 transition-colors text-sm font-medium flex items-center"
                  >
                    Read more
                    <Icon name="arrow_right" size="sm" className="ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="bg-gradient-to-r from-pink-500 to-green-500 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Explore the blog, search for topics that interest you, or learn more about the technology behind this theme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <Link href="/search" className="flex items-center">
                <Icon name="search" size="sm" className="mr-2" />
                Search Posts
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <a
                href="https://github.com/your-username/nextjs-theme-ade"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Icon name="github" size="sm" className="mr-2" />
                View Source
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}