import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getPageBySlug } from '@/lib/contentful';
import { ModuleEntry, NavigationEntry, FooterEntry } from '@/types/contentful';
import { Navigation, Footer, ModuleRenderer } from '@/components';

interface PageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any;
  preview: boolean;
}

export default function Page({ page, preview }: PageProps) {
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
        </main>

        {footer && <Footer entry={footer} />}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ params, query, preview = false }) => {
  const slug = params?.slug as string;
  
  // Enable preview mode if query param is present or Next.js preview mode is active
  const isPreview = preview || query.preview === 'true';
  
  const page = await getPageBySlug(slug, isPreview);

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
      preview: isPreview,
    },
  };
};
