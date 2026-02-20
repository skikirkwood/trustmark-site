import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { ExternalAssetWrapperEntry, CloudinaryAsset } from '@/types/contentful';

interface ExternalAssetWrapperProps {
  entry: ExternalAssetWrapperEntry;
}

function isImageAsset(asset: CloudinaryAsset): boolean {
  return asset.resource_type === 'image';
}

export default function ExternalAssetWrapper({ entry }: ExternalAssetWrapperProps) {
  const data = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({ entryId: entry.sys.id });

  const raw = data.fields.externalAsset;
  const asset = Array.isArray(raw) ? raw[0] : raw;

  if (!asset || !isImageAsset(asset)) return null;

  const src = asset.secure_url || asset.url;
  const width = asset.width ?? 1920;
  const height = asset.height ?? 1080;
  const alt = asset.metadata?.alt_text || '';

  return (
    <section className="py-12" {...inspectorProps({ fieldId: 'externalAsset' })}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-xl">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 48px), 1280px"
          />
        </div>
      </div>
    </section>
  );
}
