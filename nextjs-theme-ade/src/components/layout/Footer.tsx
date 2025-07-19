import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-lg font-bold text-white">
                NextJS Theme <span className="text-pink-500">ADE</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              A modern, performant blog theme built with Next.js and TypeScript.
              Minimalist design with powerful features.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              <Link
                href="/blog"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                All Posts
              </Link>
              <Link
                href="/categories"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Categories
              </Link>
              <Link
                href="/tags"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Tags
              </Link>
              <Link
                href="/about"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                About
              </Link>
              <Link
                href="/search"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Search
              </Link>
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/your-username"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Icon name="github" size="md" />
              </a>
              <a
                href="https://twitter.com/your-handle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Icon name="twitter" size="md" />
              </a>
              <a
                href="mailto:your-email@example.com"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Icon name="external_link" size="md" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} NextJS Theme ADE. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <a
              href="https://github.com/your-username/nextjs-theme-ade"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Source Code
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};