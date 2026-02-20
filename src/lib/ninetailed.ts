/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
import { getClient } from './contentful';

const {
  ExperienceMapper,
  AudienceMapper,
} = require('@ninetailed/experience.js-utils-contentful');

export { ExperienceMapper };

export const {
  Experience,
  NinetailedProvider,
} = require('@ninetailed/experience.js-next');

export const {
  NinetailedPreviewPlugin,
} = require('@ninetailed/experience.js-plugin-preview');

export const {
  NinetailedInsightsPlugin,
} = require('@ninetailed/experience.js-plugin-insights');

export async function getAllExperiences(preview: boolean = false) {
  try {
    const client = getClient(preview);
    const entries = await client.getEntries({
      content_type: 'nt_experience',
      include: 1,
    });

    return (entries.items || [])
      .filter((entry: any) => ExperienceMapper.isExperienceEntry(entry))
      .map((entry: any) => ExperienceMapper.mapExperience(entry));
  } catch {
    return [];
  }
}

export async function getAllAudiences(preview: boolean = false) {
  try {
    const client = getClient(preview);
    const entries = await client.getEntries({
      content_type: 'nt_audience',
      include: 0,
    });

    return (entries.items || [])
      .filter((entry: any) => AudienceMapper.isAudienceEntry(entry))
      .map((entry: any) => AudienceMapper.mapAudience(entry));
  } catch {
    return [];
  }
}
