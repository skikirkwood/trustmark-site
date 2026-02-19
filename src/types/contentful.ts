import { Entry, EntrySkeletonType } from 'contentful';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContentfulAsset = any;

// Base type for Contentful sys metadata
export interface ContentfulSys {
  id: string;
  type: string;
  contentType?: {
    sys: {
      id: string;
    };
  };
}

// Navigation Item
export interface NavigationItemFields {
  title: string;
  link?: string;
  isButton?: boolean;
  children?: Entry<NavigationItemSkeleton>[];
}

export interface NavigationItemSkeleton extends EntrySkeletonType {
  contentTypeId: 'navigationItem';
  fields: NavigationItemFields;
}

export type NavigationItemEntry = Entry<NavigationItemSkeleton>;

// Navigation
export interface NavigationFields {
  name: string;
  logo?: ContentfulAsset;
  items?: Entry<NavigationItemSkeleton>[];
}

export interface NavigationSkeleton extends EntrySkeletonType {
  contentTypeId: 'navigation';
  fields: NavigationFields;
}

export type NavigationEntry = Entry<NavigationSkeleton>;

// Hero Slide
export interface HeroSlideFields {
  headline: string;
  subheadline?: string;
  backgroundImage?: ContentfulAsset;
  ctaText?: string;
  ctaLink?: string;
  contentPosition?: 'left' | 'right';
}

export interface HeroSlideSkeleton extends EntrySkeletonType {
  contentTypeId: '5YkWjInnJCcM0WKHRePZde';
  fields: HeroSlideFields;
}

export type HeroSlideEntry = Entry<HeroSlideSkeleton>;

// Hero
export interface HeroFields {
  name?: string;
  slides?: Entry<HeroSlideSkeleton>[];
}

export interface HeroSkeleton extends EntrySkeletonType {
  contentTypeId: 'hero';
  fields: HeroFields;
}

export type HeroEntry = Entry<HeroSkeleton>;

// Quick Link Item
export interface QuickLinkItemFields {
  label: string;
  icon?: ContentfulAsset;
  link?: string;
}

export interface QuickLinkItemSkeleton extends EntrySkeletonType {
  contentTypeId: 'quickLinkItem';
  fields: QuickLinkItemFields;
}

export type QuickLinkItemEntry = Entry<QuickLinkItemSkeleton>;

// Quick Links
export interface QuickLinksFields {
  title: string;
  items?: Entry<QuickLinkItemSkeleton>[];
  placeholder?: string;
}

export interface QuickLinksSkeleton extends EntrySkeletonType {
  contentTypeId: 'quickLinks';
  fields: QuickLinksFields;
}

export type QuickLinksEntry = Entry<QuickLinksSkeleton>;

// Feature Card
export interface FeatureCardFields {
  title: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
  image?: ContentfulAsset;
  link?: string;
  linkText?: string;
}

export interface FeatureCardSkeleton extends EntrySkeletonType {
  contentTypeId: 'featureCard';
  fields: FeatureCardFields;
}

export type FeatureCardEntry = Entry<FeatureCardSkeleton>;

// Feature Cards Section
export interface FeatureCardsSectionFields {
  sectionTitle?: string;
  subtitle?: string;
  cards?: Entry<FeatureCardSkeleton>[];
}

export interface FeatureCardsSectionSkeleton extends EntrySkeletonType {
  contentTypeId: 'featureCardsSection';
  fields: FeatureCardsSectionFields;
}

export type FeatureCardsSectionEntry = Entry<FeatureCardsSectionSkeleton>;

// CTA Banner
export interface CtaBannerFields {
  headline: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: ContentfulAsset;
  backgroundColor?: string;
}

export interface CtaBannerSkeleton extends EntrySkeletonType {
  contentTypeId: 'ctaBanner';
  fields: CtaBannerFields;
}

export type CtaBannerEntry = Entry<CtaBannerSkeleton>;

// Article Card
export interface ArticleCardFields {
  title: string;
  category?: string;
  excerpt?: string;
  image?: ContentfulAsset;
  link?: string;
  linkText?: string;
}

export interface ArticleCardSkeleton extends EntrySkeletonType {
  contentTypeId: 'articleCard';
  fields: ArticleCardFields;
}

export type ArticleCardEntry = Entry<ArticleCardSkeleton>;

// Article Grid
export interface ArticleGridFields {
  sectionTitle?: string;
  subtitle?: string;
  articles?: Entry<ArticleCardSkeleton>[];
}

export interface ArticleGridSkeleton extends EntrySkeletonType {
  contentTypeId: 'articleGrid';
  fields: ArticleGridFields;
}

export type ArticleGridEntry = Entry<ArticleGridSkeleton>;

// News item
export interface NewsItemFields {
  image?: ContentfulAsset;
  title: string;
  ctaLink?: string;
}

export interface NewsItemSkeleton extends EntrySkeletonType {
  contentTypeId: 'newsItem';
  fields: NewsItemFields;
}

export type NewsItemEntry = Entry<NewsItemSkeleton>;

// Newsroom
export interface NewsroomFields {
  name: string;
  title: string;
  newsItems?: Entry<NewsItemSkeleton>[];
  defaultImage?: ContentfulAsset;
}

export interface NewsroomSkeleton extends EntrySkeletonType {
  contentTypeId: 'newsroom';
  fields: NewsroomFields;
}

export type NewsroomEntry = Entry<NewsroomSkeleton>;

// Newsroom Section
export interface NewsroomSectionFields {
  sectionTitle?: string;
  newsroom?: Entry<NewsroomSkeleton>;
}

export interface NewsroomSectionSkeleton extends EntrySkeletonType {
  contentTypeId: 'newsroomSection';
  fields: NewsroomSectionFields;
}

export type NewsroomSectionEntry = Entry<NewsroomSectionSkeleton>;

// Stats CTA
export interface StatsCtaFields {
  headline: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: ContentfulAsset;
  imagePosition?: 'left' | 'right';
}

export interface StatsCtaSkeleton extends EntrySkeletonType {
  contentTypeId: 'statsCta';
  fields: StatsCtaFields;
}

export type StatsCtaEntry = Entry<StatsCtaSkeleton>;

// Testimonial
export interface TestimonialFields {
  image?: ContentfulAsset;
  quote: string;
  attribution?: string;
  backgroundImage?: ContentfulAsset;
}

export interface TestimonialSkeleton extends EntrySkeletonType {
  contentTypeId: 'testimonial';
  fields: TestimonialFields;
}

export type TestimonialEntry = Entry<TestimonialSkeleton>;

// Footer
export interface FooterLinkColumn {
  title: string;
  links: { label: string; url: string }[];
}

export interface FooterFields {
  name: string;
  logo?: ContentfulAsset;
  copyrightText?: string;
  linkColumns?: FooterLinkColumn[];
  socialLinks?: { platform: string; url: string; icon?: string }[];
  disclaimer?: string;
}

export interface FooterSkeleton extends EntrySkeletonType {
  contentTypeId: 'footer';
  fields: FooterFields;
}

export type FooterEntry = Entry<FooterSkeleton>;

// Page
export interface PageFields {
  title: string;
  slug: string;
  navigation?: Entry<NavigationSkeleton>;
  modules?: (
    | Entry<HeroSkeleton>
    | Entry<QuickLinksSkeleton>
    | Entry<FeatureCardsSectionSkeleton>
    | Entry<CtaBannerSkeleton>
    | Entry<ArticleGridSkeleton>
    | Entry<StatsCtaSkeleton>
    | Entry<TestimonialSkeleton>
    | Entry<NewsroomSectionSkeleton>
  )[];
  footer?: Entry<FooterSkeleton>;
}

export interface PageSkeleton extends EntrySkeletonType {
  contentTypeId: 'page';
  fields: PageFields;
}

export type PageEntry = Entry<PageSkeleton>;

// Module type union for type guards
export type ModuleEntry =
  | HeroEntry
  | QuickLinksEntry
  | FeatureCardsSectionEntry
  | CtaBannerEntry
  | ArticleGridEntry
  | StatsCtaEntry
  | TestimonialEntry
  | NewsroomSectionEntry;

// Type guard helpers
export function isHeroEntry(entry: ModuleEntry): entry is HeroEntry {
  return entry.sys.contentType?.sys.id === 'hero';
}

export function isQuickLinksEntry(entry: ModuleEntry): entry is QuickLinksEntry {
  return entry.sys.contentType?.sys.id === 'quickLinks';
}

export function isFeatureCardsSectionEntry(entry: ModuleEntry): entry is FeatureCardsSectionEntry {
  return entry.sys.contentType?.sys.id === 'featureCardsSection';
}

export function isCtaBannerEntry(entry: ModuleEntry): entry is CtaBannerEntry {
  return entry.sys.contentType?.sys.id === 'ctaBanner';
}

export function isArticleGridEntry(entry: ModuleEntry): entry is ArticleGridEntry {
  return entry.sys.contentType?.sys.id === 'articleGrid';
}

export function isStatsCtaEntry(entry: ModuleEntry): entry is StatsCtaEntry {
  return entry.sys.contentType?.sys.id === 'statsCta';
}

export function isTestimonialEntry(entry: ModuleEntry): entry is TestimonialEntry {
  return entry.sys.contentType?.sys.id === 'testimonial';
}

export function isNewsroomSectionEntry(entry: ModuleEntry): entry is NewsroomSectionEntry {
  return entry.sys.contentType?.sys.id === 'newsroomSection';
}
