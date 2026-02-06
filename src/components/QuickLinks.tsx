import Link from 'next/link';
import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { QuickLinksEntry, QuickLinkItemEntry, QuickLinkItemSkeleton } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';
import { Entry } from 'contentful';

interface QuickLinksProps {
  entry: QuickLinksEntry;
}

function QuickLinkItem({ item }: { item: QuickLinkItemEntry }) {
  const data = useContentfulLiveUpdates(item);
  const inspectorProps = useContentfulInspectorMode({ entryId: item.sys.id });
  const iconUrl = getImageUrl(data.fields.icon);
  const label = String(data.fields.label || '');
  const link = data.fields.link ? String(data.fields.link) : null;

  const content = (
    <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={label}
            width={32}
            height={32}
            className="w-8 h-8"
          />
        ) : (
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
      </div>
      <span 
        className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors"
        {...inspectorProps({ fieldId: 'label' })}
      >
        {label}
      </span>
    </div>
  );

  if (link) {
    return (
      <Link href={link}>
        {content}
      </Link>
    );
  }

  return content;
}

export default function QuickLinks({ entry }: QuickLinksProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });
  const items = (data.fields.items || []) as Entry<QuickLinkItemSkeleton>[];

  if (!items.length) return null;

  return (
    <section className="py-8 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
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
