import Link from 'next/link';
import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { QuickLinksEntry, QuickLinkItemEntry, QuickLinkItemSkeleton } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';
import { Entry } from 'contentful';

interface QuickLinksProps {
  entry: QuickLinksEntry;
}

// Maps a link label to a meaningful SVG icon
function FallbackIcon({ label }: { label: string }) {
  const l = label.toLowerCase();

  if (l.includes('claim')) {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0120 9.414V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  if (l.includes('bill') || l.includes('pay')) {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    );
  }
  if (l.includes('policy') && l.includes('change')) {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    );
  }
  if (l.includes('view') || l.includes('policy')) {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );
  }
  if (l.includes('death') || l.includes('report')) {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    );
  }
  // Generic fallback
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function QuickLinkItem({ item }: { item: QuickLinkItemEntry }) {
  const data = useContentfulLiveUpdates(item);
  const inspectorProps = useContentfulInspectorMode({ entryId: item.sys.id });
  const iconUrl = getImageUrl(data.fields.icon);
  const label = String(data.fields.label || '');
  const link = data.fields.link ? String(data.fields.link) : null;

  const inner = (
    <div className="group flex flex-col items-center gap-2.5 px-3 py-4 rounded-xl
                    hover:bg-white/15 active:bg-white/20 transition-all duration-200 cursor-pointer
                    focus-within:ring-2 focus-within:ring-white/50 outline-none">
      <div className="w-12 h-12 flex items-center justify-center rounded-full
                      bg-white/20 group-hover:bg-white/30 transition-colors duration-200 shrink-0">
        {iconUrl ? (
          <Image src={iconUrl} alt="" width={24} height={24} className="w-6 h-6" />
        ) : (
          <span className="text-white">
            <FallbackIcon label={label} />
          </span>
        )}
      </div>
      <span
        className="text-sm font-semibold text-white text-center leading-tight
                   group-hover:underline underline-offset-2 transition-all duration-200"
        {...inspectorProps({ fieldId: 'label' })}
      >
        {label}
      </span>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="outline-none">
        {inner}
      </Link>
    );
  }

  return inner;
}

export default function QuickLinks({ entry }: QuickLinksProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });
  const title = data.fields.title ? String(data.fields.title) : null;
  const placeholder = data.fields.placeholder ? String(data.fields.placeholder) : null;
  const items = (data.fields.items || []) as Entry<QuickLinkItemSkeleton>[];

  if (!items.length) return null;

  const colClass =
    items.length <= 3
      ? 'grid-cols-3'
      : items.length === 4
      ? 'grid-cols-4'
      : items.length === 5
      ? 'grid-cols-5'
      : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6';

  return (
    <section className="bg-[#006bb6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {(title || placeholder) && (
          <div className="flex items-center gap-3 mb-3">
            {title && (
              <p
                className="text-xs font-bold uppercase tracking-widest text-white/70"
                {...inspectorProps({ fieldId: 'title' })}
              >
                {title}
              </p>
            )}
            {placeholder && (
              <p
                className="text-xs text-white/60"
                {...inspectorProps({ fieldId: 'placeholder' })}
              >
                {placeholder}
              </p>
            )}
          </div>
        )}
        <div
          className={`grid ${colClass} gap-1`}
          {...inspectorProps({ fieldId: 'items' })}
        >
          {items.map((item) => (
            <QuickLinkItem key={item.sys.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
