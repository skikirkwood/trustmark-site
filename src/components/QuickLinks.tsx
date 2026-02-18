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
    <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-white transition-colors group border border-gray-200 bg-white shadow-sm">
      <div className="w-14 h-14 flex items-center justify-center bg-[#006bb6]/10 rounded-full group-hover:bg-[#006bb6]/20 transition-colors">
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={label}
            width={32}
            height={32}
            className="w-8 h-8"
          />
        ) : (
          <svg className="w-8 h-8 text-[#006bb6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
      </div>
      <span 
        className="text-sm font-medium text-gray-700 text-center group-hover:text-[#006bb6] transition-colors"
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
  const title = data.fields.title ? String(data.fields.title) : null;
  const placeholder = data.fields.placeholder ? String(data.fields.placeholder) : null;
  const items = (data.fields.items || []) as Entry<QuickLinkItemSkeleton>[];

  if (!title && !items.length) return null;

  return (
    <section className="py-12 bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2
            className="text-xl md:text-2xl font-semibold text-gray-900 mb-4"
            {...inspectorProps({ fieldId: 'title' })}
          >
            {title}
          </h2>
        )}
        {placeholder && (
          <p
            className="text-gray-600 mb-6"
            {...inspectorProps({ fieldId: 'placeholder' })}
          >
            {placeholder}
          </p>
        )}
        {items.length > 0 && (
          <div
            className="flex flex-wrap gap-4"
            {...inspectorProps({ fieldId: 'items' })}
          >
            {items.map((item) => (
              <QuickLinkItem key={item.sys.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
