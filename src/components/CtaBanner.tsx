import Link from 'next/link';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { CtaBannerEntry } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';

interface CtaBannerProps {
  entry: CtaBannerEntry;
}

export default function CtaBanner({ entry }: CtaBannerProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });
  
  const backgroundUrl = getImageUrl(data.fields.backgroundImage);
  const backgroundColor = data.fields.backgroundColor ? String(data.fields.backgroundColor) : '#0066b3';
  const headline = String(data.fields.headline || '');
  const description = data.fields.description ? String(data.fields.description) : null;
  const buttonText = data.fields.buttonText ? String(data.fields.buttonText) : null;
  const buttonLink = data.fields.buttonLink ? String(data.fields.buttonLink) : null;

  return (
    <section 
      className="relative py-16 lg:py-24"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundColor: !backgroundUrl ? backgroundColor : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for background images */}
      {backgroundUrl && (
        <div className="absolute inset-0 bg-blue-900/70" />
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          {...inspectorProps({ fieldId: 'headline' })}
        >
          {headline}
        </h2>
        
        {description && (
          <p 
            className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
            {...inspectorProps({ fieldId: 'description' })}
          >
            {description}
          </p>
        )}
        
        {buttonText && buttonLink && (
          <Link
            href={buttonLink}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            {...inspectorProps({ fieldId: 'buttonText' })}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
