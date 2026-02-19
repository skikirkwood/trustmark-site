import Link from 'next/link';
import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { StatsCtaEntry } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';

interface StatsCtaProps {
  entry: StatsCtaEntry;
}

export default function StatsCta({ entry }: StatsCtaProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });

  const imageUrl = getImageUrl(data.fields.backgroundImage);
  const imagePosition = String(data.fields.imagePosition ?? 'left') === 'right' ? 'right' : 'left';
  const headline = String(data.fields.headline || '');
  const description = data.fields.description ? String(data.fields.description) : null;
  const buttonText = data.fields.buttonText ? String(data.fields.buttonText) : null;
  const buttonLink = data.fields.buttonLink ? String(data.fields.buttonLink) : null;

  const contentBlock = (
    <div className="flex flex-col justify-center px-6 py-12 lg:px-12 lg:py-16 bg-white">
      <h2
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight"
        {...inspectorProps({ fieldId: 'headline' })}
      >
        {headline}
      </h2>
      {description && (
        <p
          className="text-lg text-black mb-8"
          {...inspectorProps({ fieldId: 'description' })}
        >
          {description}
        </p>
      )}
      {buttonText && buttonLink && (
        <Link
          href={buttonLink}
          className="inline-flex items-center justify-center bg-[#006bb6] text-white px-6 py-3 font-semibold hover:bg-[#005a9e] transition-colors w-fit"
          {...inspectorProps({ fieldId: 'buttonText' })}
        >
          {buttonText}
        </Link>
      )}
    </div>
  );

  const imageBlock = imageUrl && (
    <div
      className={`relative w-full lg:w-1/3 lg:shrink-0 min-h-[250px] lg:min-h-[400px] ${imagePosition === 'right' ? 'order-1 lg:order-2' : ''}`}
      {...inspectorProps({ fieldId: 'backgroundImage' })}
    >
      <Image
        src={imageUrl}
        alt=""
        fill
        className="object-contain"
        sizes="33vw"
      />
    </div>
  );

  if (imageUrl) {
    return (
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row">
            <div className={`flex-1 lg:w-2/3 min-w-0 ${imagePosition === 'right' ? 'order-2 lg:order-1' : ''}`}>
              {contentBlock}
            </div>
            {imageBlock}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight"
          {...inspectorProps({ fieldId: 'headline' })}
        >
          {headline}
        </h2>
        {description && (
          <p
            className="text-lg text-black mb-8"
            {...inspectorProps({ fieldId: 'description' })}
          >
            {description}
          </p>
        )}
        {buttonText && buttonLink && (
          <Link
            href={buttonLink}
            className="inline-flex items-center justify-center bg-[#006bb6] text-white px-6 py-3 font-semibold hover:bg-[#005a9e] transition-colors"
            {...inspectorProps({ fieldId: 'buttonText' })}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
