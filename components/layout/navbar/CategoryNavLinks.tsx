'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type CategoryItem = {
  title: string;
};

export default function CategoryNavLinks({ items }: { items: CategoryItem[] }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const [indicatorLeft, setIndicatorLeft] = useState<number>(0);
  const [indicatorWidth, setIndicatorWidth] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const encodedTitles = useMemo(() => items.map((i) => encodeURIComponent(i.title)), [items]);

  const activeIndex = useMemo(() => {
    if (!pathname) return null;
    const collectionPrefix = '/collections/';
    const isCollection = pathname.startsWith(collectionPrefix);
    if (!isCollection) return null;
    const slug = pathname.slice(collectionPrefix.length);
    const cleanSlug = slug.split('/')[0];
    const matchIndex = encodedTitles.findIndex((t) => t === cleanSlug);
    return matchIndex >= 0 ? matchIndex : null;
  }, [pathname, encodedTitles]);

  const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  const updateIndicatorToIndex = useCallback(
    (index: number | null) => {
      if (index === null) {
        setIndicatorWidth(0);
        return;
      }
      const el = itemRefs.current[index];
      const container = containerRef.current;
      if (!el || !container) return;

      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const width = elRect.width * 0.65; // 65% of item width
      const left = elRect.left - containerRect.left; // align to start of item

      setIndicatorLeft(left);
      setIndicatorWidth(width);
    },
    []
  );

  useEffect(() => {
    updateIndicatorToIndex(targetIndex ?? null);
  }, [targetIndex, updateIndicatorToIndex, items]);

  useEffect(() => {
    const onResize = () => updateIndicatorToIndex(targetIndex ?? null);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [targetIndex, updateIndicatorToIndex]);

  return (
    <div
      className="flex items-center space-x-6 md:space-x-8 min-w-max pb-1 relative"
      ref={containerRef}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {items.map((item, index) => (
        <Link
          key={item.title}
          href={`/collections/${encodeURIComponent(item.title)}`}
          className="text-gray-700 hover:text-primary text-sm font-medium whitespace-nowrap"
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          onMouseEnter={() => setHoveredIndex(index)}
        >
          {item.title}
        </Link>
      ))}

      <div
        className="absolute bottom-0 h-1 bg-[#89C63F] rounded-full transition-all duration-300"
        style={{ left: `${indicatorLeft}px`, width: `${indicatorWidth}px` }}
      />
    </div>
  );
}


