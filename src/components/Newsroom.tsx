import Link from 'next/link';
import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import {
  NewsroomEntry,
  NewsroomSectionEntry,
  NewsroomSectionFields,
  NewsItemEntry,
  NewsItemSkeleton,
} from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';
import { Entry } from 'contentful';

interface NewsroomProps {
  entry: NewsroomEntry | NewsroomSectionEntry;
}

function NewsItemCard({
  item,
  defaultImage,
}: {
  item: NewsItemEntry;
  defaultImage: ReturnType<typeof getImageUrl>;
}) {
  const data = useContentfulLiveUpdates(item);
  const inspectorProps = useContentfulInspectorMode({ entryId: item.sys.id });
  const itemImage = getImageUrl(data?.fields?.image);
  const imageUrl = itemImage ?? defaultImage;
  const title = String(data?.fields?.title || '');
  const ctaLink = data?.fields?.ctaLink ? String(data.fields.ctaLink) : null;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      {imageUrl && (
        <div className="relative h-32 overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <h3
          className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-[#006bb6] transition-colors line-clamp-2"
          {...inspectorProps({ fieldId: 'title' })}
        >
          {title}
        </h3>
        {ctaLink && (
          <Link
            href={ctaLink}
            className="inline-flex items-center text-[#006bb6] font-medium text-xs hover:text-[#004d8a] transition-colors"
            {...inspectorProps({ fieldId: 'ctaLink' })}
          >
            Learn more
            <svg
              className="w-3 h-3 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>
    </article>
  );
}

function NewsroomContent({
  newsroom,
  sectionTitle,
  titleFieldId,
  gridFieldId,
  inspectorProps,
}: {
  newsroom: NewsroomEntry;
  sectionTitle: string | null;
  titleFieldId: string;
  gridFieldId: string;
  inspectorProps: (opts: { fieldId: string }) => object | null;
}) {
  const newsroomData = useContentfulLiveUpdates(newsroom);
  const name = newsroomData?.fields?.name ? String(newsroomData.fields.name) : null;
  const title = newsroomData?.fields?.title ? String(newsroomData.fields.title) : null;
  const displayTitle = String(sectionTitle ?? title ?? 'Newsroom');
  const newsItems = (newsroomData?.fields?.newsItems || []) as Entry<NewsItemSkeleton>[];
  const defaultImage = getImageUrl(newsroomData?.fields?.defaultImage);

  if (!newsItems.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          {name && (
            <p
              className="text-[17px] font-light text-[#006bb6] uppercase mb-2"
              {...inspectorProps({ fieldId: 'name' })}
            >
              {name}
            </p>
          )}
          <h2
            className="text-3xl font-bold text-gray-900"
            {...inspectorProps({ fieldId: titleFieldId })}
          >
            {displayTitle}
          </h2>
        </div>
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          {...inspectorProps({ fieldId: gridFieldId })}
        >
          {newsItems.map((item) => (
            <NewsItemCard
              key={item.sys.id}
              item={item as NewsItemEntry}
              defaultImage={defaultImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Newsroom({ entry }: NewsroomProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });

  const isSection = entry.sys.contentType?.sys.id === 'newsroomSection';
  const sectionFields = isSection ? (data?.fields as NewsroomSectionFields) : null;
  const newsroom = isSection
    ? (sectionFields?.newsroom as NewsroomEntry | undefined)
    : (entry as NewsroomEntry);
  const sectionTitle = isSection && sectionFields?.sectionTitle
    ? String(sectionFields.sectionTitle)
    : null;

  if (!newsroom) return null;

  return (
    <NewsroomContent
      newsroom={newsroom}
      sectionTitle={sectionTitle}
      titleFieldId={isSection ? 'sectionTitle' : 'title'}
      gridFieldId={isSection ? 'newsroom' : 'newsItems'}
      inspectorProps={inspectorProps}
    />
  );
}
