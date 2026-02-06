import Link from 'next/link';
import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { FeatureCardsSectionEntry, FeatureCardEntry, FeatureCardSkeleton } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';
import { Entry } from 'contentful';

interface FeatureCardsProps {
  entry: FeatureCardsSectionEntry;
}

function FeatureCard({ card }: { card: FeatureCardEntry }) {
  const data = useContentfulLiveUpdates(card);
  const inspectorProps = useContentfulInspectorMode({ entryId: card.sys.id });
  const imageUrl = getImageUrl(data.fields.image);
  const title = String(data.fields.title || '');
  const description = data.fields.description ? String(data.fields.description) : null;
  const link = data.fields.link ? String(data.fields.link) : null;
  const linkText = data.fields.linkText ? String(data.fields.linkText) : null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <h3 
          className="text-xl font-semibold text-gray-900 mb-2"
          {...inspectorProps({ fieldId: 'title' })}
        >
          {title}
        </h3>
        {description && (
          <p 
            className="text-gray-600 mb-4 line-clamp-3"
            {...inspectorProps({ fieldId: 'description' })}
          >
            {description}
          </p>
        )}
        {link && (
          <Link
            href={link}
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
            {...inspectorProps({ fieldId: 'linkText' })}
          >
            {linkText || 'Learn more'}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function FeatureCards({ entry }: FeatureCardsProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });
  const sectionTitle = data.fields.sectionTitle ? String(data.fields.sectionTitle) : null;
  const cards = (data.fields.cards || []) as Entry<FeatureCardSkeleton>[];

  if (!cards.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sectionTitle && (
          <h2 
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            {...inspectorProps({ fieldId: 'sectionTitle' })}
          >
            {sectionTitle}
          </h2>
        )}
        <div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          {...inspectorProps({ fieldId: 'cards' })}
        >
          {cards.map((card) => (
            <FeatureCard key={card.sys.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
