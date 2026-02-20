/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ModuleEntry } from '@/types/contentful';
import { Experience, ExperienceMapper } from '@/lib/ninetailed';
import Hero from './Hero';
import QuickLinks from './QuickLinks';
import FeatureCards from './FeatureCards';
import CtaBanner from './CtaBanner';
import ArticleGrid from './ArticleGrid';
import StatsCta from './StatsCta';
import Testimonial from './Testimonial';
import Newsroom from './Newsroom';
import ExternalAssetWrapper from './ExternalAssetWrapper';

const ContentTypeMap: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  quickLinks: QuickLinks,
  featureCardsSection: FeatureCards,
  ctaBanner: CtaBanner,
  articleGrid: ArticleGrid,
  statsCta: StatsCta,
  testimonial: Testimonial,
  newsroomSection: Newsroom,
  newsroom: Newsroom,
  externalAssetWrapper: ExternalAssetWrapper,
};

const ComponentRenderer = (props: any) => {
  const contentTypeId = props.sys?.contentType?.sys?.id;
  const Component = contentTypeId ? ContentTypeMap[contentTypeId] : null;

  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Unknown module type: ${contentTypeId}`);
    }
    return null;
  }

  return <Component entry={props} />;
};

function parseExperiences(entry: any) {
  const ntExperiences = entry?.fields?.nt_experiences;
  if (!Array.isArray(ntExperiences) || ntExperiences.length === 0) {
    return [];
  }

  return ntExperiences
    .filter((exp: any) => ExperienceMapper.isExperienceEntry(exp))
    .map((exp: any) => ExperienceMapper.mapExperience(exp));
}

interface ModuleRendererProps {
  modules: ModuleEntry[];
}

export default function ModuleRenderer({ modules }: ModuleRendererProps) {
  return (
    <>
      {modules.map((module) => {
        const { id } = module.sys;
        const parsedExperiences = parseExperiences(module);

        return (
          <Experience
            key={id}
            id={id}
            component={ComponentRenderer}
            experiences={parsedExperiences}
            {...module}
          />
        );
      })}
    </>
  );
}
