import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { FeatureCardsSectionEntry, FeatureCardEntry, FeatureCardSkeleton } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';
import { Entry } from 'contentful';

interface FeatureCardsProps {
  entry: FeatureCardsSectionEntry;
}

function FeatureCard({
  card,
  isExpanded,
  onToggle,
}: {
  card: FeatureCardEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const data = useContentfulLiveUpdates(card);
  const inspectorProps = useContentfulInspectorMode({ entryId: card.sys.id });
  const imageUrl = getImageUrl(data?.fields?.image);
  const title = String(data?.fields?.title || '');
  const description = data?.fields?.description ? String(data.fields.description) : null;
  const details = data?.fields?.details;
  const link = data?.fields?.link ? String(data.fields.link) : null;
  const linkText = data?.fields?.linkText ? String(data.fields.linkText) : null;

  const hasDetails =
    details &&
    typeof details === 'object' &&
    'nodeType' in details &&
    details.nodeType === 'document' &&
    Array.isArray((details as { content?: unknown[] }).content) &&
    (details as { content: unknown[] }).content.length > 0;

  const hoverStyles = isHovered
    ? 'bg-[#006bb6] text-white transition-colors'
    : '';
  const clickableStyles = hasDetails ? 'cursor-pointer' : '';

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group ${
        isExpanded ? 'md:col-span-2' : ''
      }`}
    >
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
        <div
          role="button"
          tabIndex={0}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => hasDetails && onToggle()}
          onKeyDown={(e) =>
            hasDetails && (e.key === 'Enter' || e.key === ' ') && onToggle()
          }
          className={`rounded px-1 -mx-1 py-0.5 -my-0.5 ${hoverStyles} ${clickableStyles}`}
        >
          <h3
            className={`text-xl font-semibold mb-2 ${isHovered ? 'text-white' : 'text-gray-900'}`}
            {...inspectorProps({ fieldId: 'title' })}
          >
            {title}
          </h3>
          {description && (
            <p
              className={`line-clamp-3 ${isHovered ? 'text-white' : 'text-gray-600'}`}
              {...inspectorProps({ fieldId: 'description' })}
            >
              {description}
            </p>
          )}
        </div>
        {isExpanded && hasDetails && (
          <div className="mt-6 flex flex-col">
            <div
              className="w-full max-w-[66.666vw] text-black prose prose-sm [&_p]:mb-2 [&_ul]:list-disc [&_ol]:list-decimal"
              {...inspectorProps({ fieldId: 'details' })}
            >
              {documentToReactComponents(details as Document)}
            </div>
            {link && (
              <div className="mt-4">
                <Link
                  href={link}
                  className="inline-flex items-center text-[#006bb6] font-medium hover:text-[#004d8a] transition-colors"
                  {...inspectorProps({ fieldId: 'linkText' })}
                >
                  {linkText || 'Learn more'}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeatureCards({ entry }: FeatureCardsProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });
  const sectionTitle = data.fields.sectionTitle ? String(data.fields.sectionTitle) : null;
  const subtitle = data.fields.subtitle ? String(data.fields.subtitle) : null;
  const cards = (data.fields.cards || []) as Entry<FeatureCardSkeleton>[];

  if (!cards.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(sectionTitle || subtitle) && (
          <div className="text-left mb-12">
            {sectionTitle && (
              <h2
                className="text-3xl font-bold text-gray-900 mb-4"
                {...inspectorProps({ fieldId: 'sectionTitle' })}
              >
                {sectionTitle}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-lg text-gray-600 max-w-2xl"
                {...inspectorProps({ fieldId: 'subtitle' })}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          {...inspectorProps({ fieldId: 'cards' })}
        >
          {cards.map((card) => (
            <FeatureCard
              key={card.sys.id}
              card={card}
              isExpanded={expandedCardId === card.sys.id}
              onToggle={() =>
                setExpandedCardId((prev) =>
                  prev === card.sys.id ? null : card.sys.id
                )
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
