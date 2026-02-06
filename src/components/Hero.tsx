import Link from 'next/link';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { HeroEntry } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';

interface HeroProps {
  entry: HeroEntry;
}

export default function Hero({ entry }: HeroProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });
  
  const backgroundUrl = getImageUrl(data.fields.backgroundImage);
  const headline = String(data.fields.headline || '');
  const subheadline = data.fields.subheadline ? String(data.fields.subheadline) : null;
  const ctaText = data.fields.ctaText ? String(data.fields.ctaText) : null;
  const ctaLink = data.fields.ctaLink ? String(data.fields.ctaLink) : null;

  return (
    <section 
      className="relative min-h-[500px] lg:min-h-[600px] flex items-center"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            {...inspectorProps({ fieldId: 'headline' })}
          >
            {headline}
          </h1>
          
          {subheadline && (
            <p 
              className="text-lg md:text-xl text-white/90 mb-8"
              {...inspectorProps({ fieldId: 'subheadline' })}
            >
              {subheadline}
            </p>
          )}
          
          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              {...inspectorProps({ fieldId: 'ctaText' })}
            >
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
