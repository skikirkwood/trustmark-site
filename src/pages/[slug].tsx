import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { getPageBySlug, getAllPages } from '@/lib/contentful';
import { getAllExperiences, getAllAudiences } from '@/lib/ninetailed';
import { ModuleEntry, NavigationEntry, FooterEntry, FaqSkeleton } from '@/types/contentful';
import { Entry } from 'contentful';
import { Navigation, Footer, ModuleRenderer, FaqSection } from '@/components';

interface PageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any;
  preview: boolean;
  ninetailed?: {
    preview: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allExperiences: any[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allAudiences: any[];
    };
  };
}

export default function Page({ page: initialPage, preview }: PageProps) {
  // Subscribe to live updates from Contentful
  const page = useContentfulLiveUpdates(initialPage);
  
  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600">The page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const title = String(page.fields.title || '');
  const slug = String(page.fields.slug || '');
  const navigation = page.fields.navigation as NavigationEntry | undefined;
  const modules = (page.fields.modules || []) as ModuleEntry[];
  const relatedFaQs = (page.fields.relatedFaQs || []) as Entry<FaqSkeleton>[];
  const footer = page.fields.footer as FooterEntry | undefined;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Preview mode indicator */}
      {preview && (
        <div className="fixed bottom-4 right-4 z-50 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
          <span className="font-medium">Preview Mode</span>
          <a
            href={`/api/disable-draft?redirect=/${slug}`}
            className="text-sm underline hover:no-underline"
          >
            Exit
          </a>
        </div>
      )}

      <div className="min-h-screen flex flex-col">
        {navigation && <Navigation entry={navigation} />}

        <main className="flex-grow">
          <ModuleRenderer modules={modules} />
          {relatedFaQs.length > 0 && <FaqSection faqs={relatedFaQs} />}
        </main>

        {footer && <Footer entry={footer} />}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getAllPages();
  
  const paths = pages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((page: any) => page.fields.slug !== 'home')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((page: any) => ({
      params: { slug: page.fields.slug },
    }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params, preview = false }) => {
  const slug = params?.slug as string;
  const page = await getPageBySlug(slug, preview);

  if (!page) {
    return {
      notFound: true,
    };
  }

  const [allExperiences, allAudiences] = await Promise.all([
    getAllExperiences(preview),
    getAllAudiences(preview),
  ]);

  return {
    props: {
      page,
      preview,
      ninetailed: {
        preview: {
          allExperiences,
          allAudiences,
        },
      },
    },
    revalidate: 5,
  };
};
