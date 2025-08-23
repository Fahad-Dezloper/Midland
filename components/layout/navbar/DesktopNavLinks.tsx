'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DesktopNavLinks() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/blogs', label: 'Blog' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/events', label: 'Events' }
  ];

  return (
    <div className="hidden md:flex items-center space-x-6">
      {navLinks.map(({ href, label }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

        const activeClass =
          'btn-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/80 ease-in-out duration-200 transition-colors';
        const inactiveClass = 'text-gray-700 hover:text-primary text-sm font-medium';

        return (
          <Link key={href} href={href} className={isActive ? activeClass : inactiveClass}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}


