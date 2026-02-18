import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { HeroEntry, HeroSlideEntry } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';
import { Entry } from 'contentful';

interface HeroProps {
  entry: HeroEntry;
}

const HERO_SLIDE_INTERVAL = 6000;

function HeroSlideContent({
  slide,
  fallbackPosition = 'left',
}: {
  slide: HeroSlideEntry;
  fallbackPosition?: 'left' | 'right';
}) {
  const data = useContentfulLiveUpdates(slide);
  const inspectorProps = useContentfulInspectorMode({ entryId: slide.sys.id });
  const fields = data?.fields ?? {};
  const backgroundUrl = getImageUrl(fields.backgroundImage);
  const headline = String(fields.headline || '');
  const subheadline = fields.subheadline ? String(fields.subheadline) : null;
  const ctaText = fields.ctaText ? String(fields.ctaText) : null;
  const ctaLink = fields.ctaLink ? String(fields.ctaLink) : null;
  const raw = fields.contentPosition;
  const rawPosition =
    typeof raw === 'string'
      ? raw
      : raw && typeof raw === 'object' && 'en-US' in raw
        ? String((raw as { 'en-US'?: string })['en-US'] ?? '')
        : '';
  const slidePosition =
    rawPosition.toLowerCase() === 'right'
      ? ('right' as const)
      : rawPosition.toLowerCase() === 'left'
        ? ('left' as const)
        : null;
  const contentPosition = slidePosition ?? fallbackPosition;
  const isRight = contentPosition === 'right';

  return (
    <div className="absolute inset-0 flex w-full items-center">
      {backgroundUrl && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
          aria-hidden
        />
      )}
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: 'rgba(0, 107, 182, 0.6)' }}
        aria-hidden
      />
      <div
        className={`relative z-10 max-w-xl lg:max-w-2xl px-4 sm:px-6 md:px-8 lg:px-12 ${
          isRight ? 'ml-auto text-right' : 'mr-auto text-left'
        }`}
      >
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 leading-tight"
          {...inspectorProps({ fieldId: 'headline' })}
        >
          {headline}
        </h1>
        {subheadline && (
          <p
            className="text-xl md:text-2xl text-white/90 mb-8 font-light"
            {...inspectorProps({ fieldId: 'subheadline' })}
          >
            {subheadline}
          </p>
        )}
        {ctaText && ctaLink && (
          <Link
            href={ctaLink}
            className="inline-flex items-center bg-white text-[#006bb6] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            {...inspectorProps({ fieldId: 'ctaText' })}
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}

function SingleHeroContent({
  entry,
  inspectorProps,
}: {
  entry: HeroEntry;
  inspectorProps: (opts: { fieldId: string }) => object | null;
}) {
  const data = useContentfulLiveUpdates(entry);
  const backgroundUrl = getImageUrl(data.fields.backgroundImage);
  const headline = String(data.fields.headline || '');
  const subheadline = data.fields.subheadline ? String(data.fields.subheadline) : null;
  const ctaText = data.fields.ctaText ? String(data.fields.ctaText) : null;
  const ctaLink = data.fields.ctaLink ? String(data.fields.ctaLink) : null;
  const contentPosition = data.fields.contentPosition ? String(data.fields.contentPosition) : 'left';
  const isRight = contentPosition === 'right';

  return (
    <>
      {backgroundUrl && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      <div
        className={`relative z-10 h-full min-h-[400px] md:min-h-[500px] lg:min-h-[550px] flex items-center ${isRight ? 'justify-end pr-4 sm:pr-6 md:pr-8 lg:pr-12' : 'justify-start pl-4 sm:pl-6 md:pl-8 lg:pl-12'}`}
      >
        <div
          className={`bg-[rgba(0,107,182,0.8)] py-10 md:py-14 lg:py-16 w-[85%] sm:w-[380px] md:w-[420px] lg:w-[480px] text-center px-4 sm:px-8 md:px-12 ${isRight ? 'rounded-l-lg' : 'rounded-r-lg'}`}
        >
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-2 leading-tight tracking-wide"
            {...inspectorProps({ fieldId: 'headline' })}
          >
            {headline}
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
    </>
  );
}

export default function Hero({ entry }: HeroProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });
  const slides = (data.fields.slides || []) as HeroSlideEntry[];
  const hasSlides = slides.length > 0;
  const contentPosition =
    String(data.fields.contentPosition || '') === 'right' ? 'right' : 'left';

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!hasSlides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, HERO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [hasSlides, slides.length]);

  return (
    <section className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[550px] overflow-hidden bg-gray-200">
      {hasSlides ? (
        <>
          {slides.map((slide, index) => (
            <div
              key={slide.sys.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <HeroSlideContent
                slide={slide as HeroSlideEntry}
                fallbackPosition={contentPosition}
              />
            </div>
          ))}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <SingleHeroContent entry={entry} inspectorProps={inspectorProps} />
      )}
    </section>
  );
}
