import { createClient, ContentfulClientApi } from 'contentful';

// Lazy-initialized clients (only created on server-side when needed)
let client: ContentfulClientApi<undefined> | null = null;
let previewClient: ContentfulClientApi<undefined> | null = null;

// Get delivery client (published content)
function getDeliveryClient(): ContentfulClientApi<undefined> {
  if (!client) {
    client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    });
  }
  return client;
}

// Get preview client (draft content)
function getPreviewClient(): ContentfulClientApi<undefined> {
  if (!previewClient) {
    previewClient = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!,
      host: 'preview.contentful.com',
    });
  }
  return previewClient;
}

// Get the appropriate client based on preview mode
export const getClient = (preview: boolean = false) => 
  preview ? getPreviewClient() : getDeliveryClient();

// Fetch page by slug
// NOTE: Use include: 10 to resolve all nested links - this preserves
// the data structure that useContentfulLiveUpdates needs to track updates
export async function getPageBySlug(slug: string, preview: boolean = false) {
  const entries = await getClient(preview).getEntries({
    content_type: 'page',
    'fields.slug': slug,
    include: 10,
  });
  return entries.items[0] || null;
}

// Fetch all pages (for static paths)
export async function getAllPages(preview: boolean = false) {
  const entries = await getClient(preview).getEntries({
    content_type: 'page',
    select: ['fields.slug'],
  });
  return entries.items;
}

// Helper to extract image URL from asset (accepts any asset-like object)
// Handles both direct structure and localized (e.g. file['en-US'])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getImageUrl(asset: any): string | null {
  const file = asset?.fields?.file;
  if (!file) return null;
  const url = typeof file.url === 'string' ? file.url : (file['en-US'] ?? Object.values(file)[0])?.url;
  if (!url) return null;
  return url.startsWith('//') ? `https:${url}` : url;
}

// Helper to get image dimensions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getImageDimensions(asset: any): { width: number; height: number } | null {
  const details = asset?.fields?.file?.details;
  if (!details?.image) return null;
  return {
    width: details.image.width,
    height: details.image.height,
  };
}
