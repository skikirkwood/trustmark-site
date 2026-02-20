import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { getPageBySlug } from '@/lib/contentful';
import { getAllExperiences, getAllAudiences } from '@/lib/ninetailed';
import { ModuleEntry, NavigationEntry, FooterEntry, FaqSkeleton } from '@/types/contentful';
import { Entry } from 'contentful';
import { Navigation, Footer, ModuleRenderer, FaqSection } from '@/components';

interface HomePageProps {
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

export default function HomePage({ page: initialPage, preview }: HomePageProps) {
  // Subscribe to live updates from Contentful
  const page = useContentfulLiveUpdates(initialPage);
  
  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Trustmark</h1>
        <p className="text-gray-600 mb-8">
          No homepage content found. Please create a Page entry with slug &quot;home&quot; in Contentful.
        </p>
        {preview && (
          <a
            href="/api/disable-draft"
            className="text-blue-600 hover:underline"
          >
            Exit Preview Mode
          </a>
        )}
      </div>
    );
  }

  const title = String(page.fields.title || '');
  const navigation = page.fields.navigation as NavigationEntry | undefined;
  const modules = (page.fields.modules || []) as ModuleEntry[];
  const relatedFaq = page.fields.relatedFaq as Entry<FaqSkeleton> | undefined;
  const relatedFaQs = relatedFaq ? [relatedFaq] : [];
  const footer = page.fields.footer as FooterEntry | undefined;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Banking services, mortgage loans, and wealth management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Preview mode indicator */}
      {preview && (
        <div className="fixed bottom-4 right-4 z-50 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
          <span className="font-medium">Preview Mode</span>
          <a
            href="/api/disable-draft"
            className="text-sm underline hover:no-underline"
          >
            Exit
          </a>
        </div>
      )}

      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        {navigation && <Navigation entry={navigation} />}

        {/* Main content */}
        <main className="flex-grow">
          <ModuleRenderer modules={modules} />
          {relatedFaQs.length > 0 && <FaqSection faqs={relatedFaQs} />}
        </main>

        {/* Footer */}
        {footer && <Footer entry={footer} />}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async ({ preview = false }) => {
  const page = await getPageBySlug('home', preview);

  const [allExperiences, allAudiences] = await Promise.all([
    getAllExperiences(preview),
    getAllAudiences(preview),
  ]);

  return {
    props: {
      page: page || null,
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
