'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/categories', label: 'Categories' },
  { href: '/tags', label: 'Tags' },
];

export const Navigation: React.FC<NavigationProps> = ({ 
  mobile = false, 
  onItemClick 
}) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const baseClasses = mobile
    ? 'block px-3 py-2 rounded-md text-base font-medium transition-colors'
    : 'px-3 py-2 rounded-md text-sm font-medium transition-colors';

  const activeClasses = mobile
    ? 'bg-gray-700 text-white'
    : 'bg-gray-700 text-white';

  const inactiveClasses = mobile
    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
    : 'text-gray-300 hover:bg-gray-700 hover:text-white';

  if (mobile) {
    return (
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${baseClasses} ${
              isActive(item.href) ? activeClasses : inactiveClasses
            }`}
            onClick={onItemClick}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex space-x-4">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${baseClasses} ${
            isActive(item.href) ? activeClasses : inactiveClasses
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};