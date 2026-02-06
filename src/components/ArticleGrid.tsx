import Link from 'next/link';
import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { ArticleGridEntry, ArticleCardEntry } from '@/types/contentful';
import { getImageUrl } from '@/lib/contentful';
import { Entry } from 'contentful';
import { ArticleCardSkeleton } from '@/types/contentful';

interface ArticleGridProps {
  entry: ArticleGridEntry;
}

function ArticleCard({ article }: { article: ArticleCardEntry }) {
  const data = useContentfulLiveUpdates(article);
  const inspectorProps = useContentfulInspectorMode({ entryId: article.sys.id });
  const imageUrl = getImageUrl(data.fields.image);
  const title = String(data.fields.title || '');
  const category = data.fields.category ? String(data.fields.category) : null;
  const excerpt = data.fields.excerpt ? String(data.fields.excerpt) : null;
  const linkText = data.fields.linkText ? String(data.fields.linkText) : null;

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {category && (
            <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {category}
            </span>
          )}
        </div>
      )}
      <div className="p-6">
        <h3 
          className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
          {...inspectorProps({ fieldId: 'title' })}
        >
          {title}
        </h3>
        {excerpt && (
          <p 
            className="text-gray-600 text-sm mb-4 line-clamp-2"
            {...inspectorProps({ fieldId: 'excerpt' })}
          >
            {excerpt}
          </p>
        )}
        {data.fields.link && (
          <Link
            href={String(data.fields.link)}
            className="inline-flex items-center text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors"
            {...inspectorProps({ fieldId: 'linkText' })}
          >
            {linkText || 'Read the article'}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </article>
  );
}

export default function ArticleGrid({ entry }: ArticleGridProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });
  const sectionTitle = data.fields.sectionTitle ? String(data.fields.sectionTitle) : null;
  const subtitle = data.fields.subtitle ? String(data.fields.subtitle) : null;
  const articles = (data.fields.articles || []) as Entry<ArticleCardSkeleton>[];

  if (!articles.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(sectionTitle || subtitle) && (
          <div className="text-center mb-12">
            {sectionTitle && (
              <h2 
                className="text-3xl font-bold text-gray-900 mb-4"
                {...inspectorProps({ fieldId: 'sectionTitle' })}
              >
                {sectionTitle}
              </h2>
            )}
            {subtitle && (
              <p 
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                {...inspectorProps({ fieldId: 'subtitle' })}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          {...inspectorProps({ fieldId: 'articles' })}
        >
          {articles.map((article) => (
            <ArticleCard key={article.sys.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
