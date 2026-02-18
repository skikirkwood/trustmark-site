import {
  ModuleEntry,
  isHeroEntry,
  isQuickLinksEntry,
  isFeatureCardsSectionEntry,
  isCtaBannerEntry,
  isArticleGridEntry,
  isStatsCtaEntry,
  isTestimonialEntry,
} from '@/types/contentful';
import Hero from './Hero';
import QuickLinks from './QuickLinks';
import FeatureCards from './FeatureCards';
import CtaBanner from './CtaBanner';
import ArticleGrid from './ArticleGrid';
import StatsCta from './StatsCta';
import Testimonial from './Testimonial';

interface ModuleRendererProps {
  modules: ModuleEntry[];
}

export default function ModuleRenderer({ modules }: ModuleRendererProps) {
  return (
    <>
      {modules.map((module) => {
        const key = module.sys.id;

        if (isHeroEntry(module)) {
          return <Hero key={key} entry={module} />;
        }

        if (isQuickLinksEntry(module)) {
          return <QuickLinks key={key} entry={module} />;
        }

        if (isFeatureCardsSectionEntry(module)) {
          return <FeatureCards key={key} entry={module} />;
        }

        if (isCtaBannerEntry(module)) {
          return <CtaBanner key={key} entry={module} />;
        }

        if (isArticleGridEntry(module)) {
          return <ArticleGrid key={key} entry={module} />;
        }

        if (isStatsCtaEntry(module)) {
          return <StatsCta key={key} entry={module} />;
        }

        if (isTestimonialEntry(module)) {
          return <Testimonial key={key} entry={module} />;
        }

        // Unknown module type - log warning in development
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          console.warn(`Unknown module type: ${(module as any).sys?.contentType?.sys?.id}`);
        }

        return null;
      })}
    </>
  );
}
