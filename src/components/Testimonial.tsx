import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { TestimonialEntry } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';

interface TestimonialProps {
  entry: TestimonialEntry;
}

export default function Testimonial({ entry }: TestimonialProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });

  const backgroundUrl = getImageUrl(data.fields.backgroundImage);
  const quote = String(data.fields.quote || '');
  const attribution = data.fields.attribution ? String(data.fields.attribution) : null;

  return (
    <section
      className="relative py-16 lg:py-20"
      style={{
        backgroundColor: 'rgb(255, 194, 38)',
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {backgroundUrl && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(255, 194, 38, 0.8)' }}
        />
      )}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <blockquote>
          <p
            className="text-xl md:text-2xl text-black font-light italic mb-6 leading-relaxed"
            {...inspectorProps({ fieldId: 'quote' })}
          >
            &ldquo;{quote}&rdquo;
          </p>
          {attribution && (
            <footer
              className="text-black/80 text-sm font-medium"
              {...inspectorProps({ fieldId: 'attribution' })}
            >
              — {attribution}
            </footer>
          )}
        </blockquote>
      </div>
    </section>
  );
}
