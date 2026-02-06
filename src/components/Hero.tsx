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
  const contentPosition = data.fields.contentPosition ? String(data.fields.contentPosition) : 'left';
  const isRight = contentPosition === 'right';

  return (
    <section className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[550px] overflow-hidden bg-gray-200">
      {/* Background Image */}
      {backgroundUrl && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      
      {/* Content - Blue Box with padding from edge */}
      <div className={`relative z-10 h-full min-h-[400px] md:min-h-[500px] lg:min-h-[550px] flex items-center ${isRight ? 'justify-end pr-4 sm:pr-6 md:pr-8 lg:pr-12' : 'justify-start pl-4 sm:pl-6 md:pl-8 lg:pl-12'}`}>
        {/* Blue Overlay Box - extends from screen edge */}
        <div 
          className={`bg-[#003366] py-10 md:py-14 lg:py-16 w-[85%] sm:w-[380px] md:w-[420px] lg:w-[480px] text-center px-4 sm:px-8 md:px-12 ${
            isRight 
              ? 'rounded-l-lg' 
              : 'rounded-r-lg'
          }`}
        >
          <h1 
            className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-2 leading-tight tracking-wide"
            {...inspectorProps({ fieldId: 'headline' })}
          >
            {headline}<span className="text-lg align-top">®</span>
          </h1>
          
          {subheadline && (
            <p 
              className="text-2xl md:text-3xl lg:text-4xl text-white/80 mb-6 font-light leading-tight"
              {...inspectorProps({ fieldId: 'subheadline' })}
            >
              {subheadline}
            </p>
          )}
          
          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className="inline-flex items-center bg-[#001a33] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#002244] transition-colors"
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
