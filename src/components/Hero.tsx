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
  const contentPosition = data.fields.contentPosition || 'left';
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
      
      {/* Content - Blue Box from edge */}
      <div className={`relative z-10 h-full min-h-[400px] md:min-h-[500px] lg:min-h-[550px] flex items-center ${isRight ? 'justify-end' : 'justify-start'}`}>
        {/* Blue Overlay Box - extends from screen edge */}
        <div 
          className={`bg-[#003366] py-10 md:py-14 lg:py-16 w-[85%] sm:w-[380px] md:w-[420px] lg:w-[480px] ${
            isRight 
              ? 'pl-8 md:pl-12 pr-4 sm:pr-8 md:pr-12 rounded-l-lg' 
              : 'pr-8 md:pr-12 pl-4 sm:pl-8 md:pl-12 rounded-r-lg'
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
              className="text-sm md:text-base text-white/80 mb-6 font-light"
              {...inspectorProps({ fieldId: 'subheadline' })}
            >
              {subheadline}
            </p>
          )}
          
          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className="inline-flex items-center text-white text-sm font-medium hover:underline transition-all group"
              {...inspectorProps({ fieldId: 'ctaText' })}
            >
              {ctaText}
              <svg 
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
