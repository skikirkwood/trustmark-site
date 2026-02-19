import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { NavigationEntry } from '@/types/contentful';

const TRUSTMARK_BASE = 'https://www.trustmarkbenefits.com';

// Default nav matching trustmarkbenefits.com top navigation
const TRUSTMARK_NAV_ITEMS: Array<{
  title: string;
  link?: string;
  children?: Array<{ title: string; link: string }>;
  isButton?: boolean;
}> = [
  {
    title: 'What We Do',
    children: [
      { title: 'HealthFitness', link: `${TRUSTMARK_BASE}/HealthFitness` },
      { title: 'Small Business Benefits', link: `${TRUSTMARK_BASE}/Small-Business-Benefits` },
      { title: 'Voluntary Benefits', link: `${TRUSTMARK_BASE}/Voluntary-Benefits` },
    ],
  },
  {
    title: 'Individuals',
    children: [
      { title: 'Small Business Benefits', link: `${TRUSTMARK_BASE}/Individuals/Small-Business-Benefits` },
      { title: 'Voluntary Benefits', link: `${TRUSTMARK_BASE}/Individuals/Voluntary-Benefits` },
    ],
  },
  {
    title: 'Employers',
    children: [
      { title: 'HealthFitness', link: `${TRUSTMARK_BASE}/employers/healthfitness` },
      { title: 'Small Business Benefits', link: `${TRUSTMARK_BASE}/employers/small-business-benefits` },
      { title: 'Voluntary Benefits', link: `${TRUSTMARK_BASE}/employers/voluntary-benefits` },
    ],
  },
  {
    title: 'Brokers',
    children: [
      { title: 'HealthFitness', link: `${TRUSTMARK_BASE}/brokers/healthfitness` },
      { title: 'Small Business Benefits', link: `${TRUSTMARK_BASE}/brokers/small-business-benefits` },
      { title: 'Voluntary Benefits', link: `${TRUSTMARK_BASE}/brokers/voluntary-benefits` },
    ],
  },
  { title: 'Providers', link: `${TRUSTMARK_BASE}/providers` },
  {
    title: 'Who We Are',
    children: [
      { title: 'File a Claim', link: `${TRUSTMARK_BASE}/File-a-Claim` },
      { title: 'Contact Us', link: `${TRUSTMARK_BASE}/Contact-Us` },
      { title: 'Community Involvement', link: `${TRUSTMARK_BASE}/Community-Involvement` },
      { title: 'Newsroom', link: `${TRUSTMARK_BASE}/Newsroom` },
      { title: 'Diversity & Inclusion', link: `${TRUSTMARK_BASE}/Diversity-Inclusion` },
      { title: 'Careers', link: `${TRUSTMARK_BASE}/Careers` },
      { title: 'Leadership', link: `${TRUSTMARK_BASE}/Leadership` },
      { title: 'Our Story', link: `${TRUSTMARK_BASE}/Our-Story` },
    ],
  },
  { title: 'Login', link: `${TRUSTMARK_BASE}/login` },
];

interface NavigationProps {
  entry: NavigationEntry;
}

interface StaticNavItemProps {
  item: (typeof TRUSTMARK_NAV_ITEMS)[number];
  isMobile?: boolean;
  scrolled?: boolean;
}

function StaticNavItem({ item, isMobile, scrolled }: StaticNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { title, link = '#', children, isButton } = item;
  const hasChildren = children && children.length > 0;

  if (isButton) {
    return (
      <Link
        href={link}
        className="bg-white text-[#001a33] px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors font-medium text-sm"
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
          className={`flex items-center gap-1 font-medium py-2 transition-colors ${
            scrolled ? 'text-[#006bb6] hover:text-[#005a9e]' : 'text-white/90 hover:text-white'
          }`}
        >
          {title}
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className={`${isMobile ? 'relative' : 'absolute top-full left-0'} bg-white shadow-lg rounded-lg py-2 min-w-[200px] z-50`}>
            {children!.map((child) => (
              <Link key={child.link} href={child.link} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                {child.title}
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
      className={`font-medium py-2 transition-colors ${
        scrolled ? 'text-[#006bb6] hover:text-[#005a9e]' : 'text-white/90 hover:text-white'
      }`}
    >
      {title}
    </Link>
  );
}

const SCROLL_THRESHOLD = 50;

export default function Navigation({ entry }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll(); // Check initial position (e.g. if page loads scrolled)
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoUrl =
    'https://marvel-b1-cdn.bc0a.com/f00000000221956/trustmarkbenefits.com/Trustmark-Benefits-Web/media/Trustmark-Logos/logo-with-tagline-inverse.png';
  const name = String(data.fields.name || '');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-gradient-to-b from-black/50 to-transparent'
      }`}
    >
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
                className={`h-10 w-auto transition-opacity duration-200 ${scrolled ? 'invert' : ''}`}
              />
            ) : (
              <span className={`text-2xl font-bold ${scrolled ? 'text-[#001a33]' : 'text-white'}`}>{name}</span>
            )}
          </Link>

          {/* Desktop Navigation - trustmarkbenefits.com structure */}
          <div className="hidden lg:flex items-center gap-8" {...inspectorProps({ fieldId: 'items' })}>
            {TRUSTMARK_NAV_ITEMS.map((item, i) => (
              <StaticNavItem key={item.title + i} item={item} scrolled={scrolled} />
            ))}
            <button
              type="button"
              className={`transition-colors p-1 ${scrolled ? 'text-[#006bb6] hover:text-[#005a9e]' : 'text-white/90 hover:text-white'}`}
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 transition-colors ${scrolled ? 'text-[#006bb6]' : 'text-white'}`}
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
          <div className="lg:hidden py-4 border-t border-white/20 bg-[#001a33]/95 backdrop-blur-sm">
            <div className="flex flex-col gap-2">
              {TRUSTMARK_NAV_ITEMS.map((item, i) => (
                <StaticNavItem key={item.title + i} item={item} isMobile scrolled={false} />
              ))}
              <button
                type="button"
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors py-2"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
