import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";
import {
  NinetailedProvider,
  NinetailedPreviewPlugin,
  NinetailedInsightsPlugin,
} from "@/lib/ninetailed";

interface CustomPageProps {
  ninetailed?: {
    preview: {
      allExperiences: unknown[];
      allAudiences: unknown[];
    };
  };
  [key: string]: unknown;
}

export default function App({
  Component,
  pageProps,
}: AppProps<CustomPageProps>) {
  const previewData = pageProps.ninetailed?.preview;

  return (
    <NinetailedProvider
      clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID ?? process.env.NEXT_PUBLIC_NINETAILED_API_KEY ?? ""}
      environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? "main"}
      componentViewTrackingThreshold={0}
      plugins={[
        new NinetailedInsightsPlugin(),
        ...(previewData
          ? [
              new NinetailedPreviewPlugin({
                experiences: previewData.allExperiences ?? [],
                audiences: previewData.allAudiences ?? [],
                onOpenExperienceEditor: (experience: { id: string }) => {
                  if (process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
                    window.open(
                      `https://app.contentful.com/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/${process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master"}/entries/${experience.id}`,
                      "_blank"
                    );
                  }
                },
                onOpenAudienceEditor: (audience: { id: string }) => {
                  if (process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
                    window.open(
                      `https://app.contentful.com/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/${process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master"}/entries/${audience.id}`,
                      "_blank"
                    );
                  }
                },
              }),
            ]
          : []),
      ]}
    >
      <ContentfulLivePreviewProvider
        locale="en-US"
        enableInspectorMode={true}
        enableLiveUpdates={true}
      >
        <Component {...pageProps} />
      </ContentfulLivePreviewProvider>
    </NinetailedProvider>
  );
}
