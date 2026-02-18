import Link from 'next/link';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { StatsCtaEntry } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';

interface StatsCtaProps {
  entry: StatsCtaEntry;
}

export default function StatsCta({ entry }: StatsCtaProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });

  const backgroundUrl = getImageUrl(data.fields.backgroundImage);
  const headline = String(data.fields.headline || '');
  const description = data.fields.description ? String(data.fields.description) : null;
  const buttonText = data.fields.buttonText ? String(data.fields.buttonText) : null;
  const buttonLink = data.fields.buttonLink ? String(data.fields.buttonLink) : null;

  return (
    <section
      className="relative py-16 lg:py-20"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundColor: !backgroundUrl ? '#006bb6' : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {backgroundUrl && (
        <div className="absolute inset-0 bg-[rgba(0,107,182,0.85)]" />
      )}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight"
          {...inspectorProps({ fieldId: 'headline' })}
        >
          {headline}
        </h2>
        {description && (
          <p
            className="text-lg text-white/90 mb-8"
            {...inspectorProps({ fieldId: 'description' })}
          >
            {description}
          </p>
        )}
        {buttonText && buttonLink && (
          <Link
            href={buttonLink}
            className="inline-flex items-center bg-white text-[#006bb6] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            {...inspectorProps({ fieldId: 'buttonText' })}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
