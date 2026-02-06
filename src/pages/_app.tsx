import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Enable preview mode if:
  // 1. Next.js preview mode is active (pageProps.preview)
  // 2. URL has ?preview=true query parameter (for Contentful Live Preview iframe)
  const isPreview = pageProps.preview || router.query.preview === 'true';
  
  return (
    <ContentfulLivePreviewProvider
      locale="en-US"
      enableInspectorMode={isPreview}
      enableLiveUpdates={isPreview}
    >
      <Component {...pageProps} />
    </ContentfulLivePreviewProvider>
  );
}
