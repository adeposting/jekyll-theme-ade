'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Navigation } from './Navigation';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">
                NextJS Theme <span className="text-pink-500">ADE</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Navigation />
          </div>

          {/* Search Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/search"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Icon name="search" size="md" />
            </Link>
            
            {/* Social Links */}
            <div className="flex items-center space-x-2">
              <a
                href="https://github.com/your-username"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Icon name="github" size="md" />
              </a>
              <a
                href="https://twitter.com/your-handle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Icon name="twitter" size="md" />
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <Icon name={isMenuOpen ? 'close' : 'menu'} size="md" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-700">
              <Navigation mobile onItemClick={() => setIsMenuOpen(false)} />
              
              {/* Mobile Search */}
              <Link
                href="/search"
                className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon name="search" size="sm" className="mr-2" />
                Search
              </Link>
              
              {/* Mobile Social Links */}
              <div className="flex items-center space-x-4 px-3 py-2">
                <a
                  href="https://github.com/your-username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Icon name="github" size="sm" />
                </a>
                <a
                  href="https://twitter.com/your-handle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Icon name="twitter" size="sm" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};