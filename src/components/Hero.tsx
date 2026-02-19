import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { HeroEntry, HeroSlideEntry } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';

interface HeroProps {
  entry: HeroEntry;
}

const HERO_SLIDE_INTERVAL = 6000;

function HeroSlideContent({ slide }: { slide: HeroSlideEntry }) {
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
  const contentPosition =
    rawPosition.toLowerCase() === 'right'
      ? ('right' as const)
      : rawPosition.toLowerCase() === 'left'
        ? ('left' as const)
        : 'left';
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
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
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
            className="inline-flex items-center bg-yellow-400 text-black px-6 py-3 rounded-none font-semibold hover:bg-yellow-500 transition-colors"
            {...inspectorProps({ fieldId: 'ctaText' })}
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Hero({ entry }: HeroProps) {
  const data = useContentfulLiveUpdates(entry);
  const slides = (data?.fields?.slides || []) as HeroSlideEntry[];
  const hasSlides = slides.length > 0;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!hasSlides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, HERO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [hasSlides, slides.length]);

  if (!hasSlides) {
    return null;
  }

  return (
    <section className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[550px] overflow-hidden bg-gray-200">
      {slides.map((slide, index) => (
        <div
          key={slide.sys.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <HeroSlideContent slide={slide as HeroSlideEntry} />
        </div>
      ))}
      {slides.length > 1 && (
        <div className="absolute top-1/2 right-6 -translate-y-1/2 z-20 flex flex-col gap-2">
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
    </section>
  );
}
