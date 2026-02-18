import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { NavigationEntry, NavigationItemEntry, NavigationItemSkeleton } from '@/types/contentful';
import { Entry } from 'contentful';

interface NavigationProps {
  entry: NavigationEntry;
}

interface NavItemProps {
  item: NavigationItemEntry;
  isMobile?: boolean;
}

function NavItem({ item, isMobile }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const data = useContentfulLiveUpdates(item);
  const inspectorProps = useContentfulInspectorMode({ entryId: item.sys.id });
  
  const title = String(data.fields.title || '');
  const link = data.fields.link ? String(data.fields.link) : '#';
  const children = (data.fields.children || []) as Entry<NavigationItemSkeleton>[];
  const hasChildren = children.length > 0;
  const isButton = Boolean(data.fields.isButton);

  if (isButton) {
    return (
      <Link
        href={link}
        className="bg-white text-[#001a33] px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors font-medium text-sm"
        {...inspectorProps({ fieldId: 'title' })}
      >
        {title}
      </Link>
    );
  }

  if (hasChildren) {
    return (
      <div 
        className="relative"
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
      >
        <button
          onClick={() => isMobile && setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-white/90 hover:text-white transition-colors font-medium py-2"
          {...inspectorProps({ fieldId: 'title' })}
        >
          {title}
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className={`${isMobile ? 'relative' : 'absolute top-full left-0'} bg-white shadow-lg rounded-lg py-2 min-w-[200px] z-50`}>
            {children.map((child) => (
              <Link
                key={child.sys.id}
                href={child.fields.link ? String(child.fields.link) : '#'}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                {String(child.fields.title || '')}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={link}
      className="text-white/90 hover:text-white transition-colors font-medium py-2"
      {...inspectorProps({ fieldId: 'title' })}
    >
      {title}
    </Link>
  );
}

export default function Navigation({ entry }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });
  
  const logoUrl =
    'https://marvel-b1-cdn.bc0a.com/f00000000221956/trustmarkbenefits.com/Trustmark-Benefits-Web/media/Trustmark-Logos/logo-with-tagline-inverse.png';
  const name = String(data.fields.name || '');
  const items = (data.fields.items || []) as Entry<NavigationItemSkeleton>[];

  return (
    <header className="sticky top-0 z-50 bg-[#001a33] shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" {...inspectorProps({ fieldId: 'logo' })}>
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={name}
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            ) : (
              <span className="text-2xl font-bold text-white">{name}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8" {...inspectorProps({ fieldId: 'items' })}>
            {items.map((item) => (
              <NavItem key={item.sys.id} item={item} />
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20">
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <NavItem key={item.sys.id} item={item} isMobile />
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
