'use client';

import { useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { FaqEntry, FaqSkeleton } from '@/types/contentful';
import { Entry } from 'contentful';

interface FaqSectionProps {
  faqs: Entry<FaqSkeleton>[];
}

function FaqItem({ faq, isOpen, onToggle }: { faq: FaqEntry; isOpen: boolean; onToggle: () => void }) {
  const data = useContentfulLiveUpdates(faq);
  const inspectorProps = useContentfulInspectorMode({ entryId: faq.sys.id });

  const question = data?.fields?.question ? String(data.fields.question) : '';
  const answer = data?.fields?.answer as unknown as Document | undefined;
  const hasAnswer = answer?.content && answer.content.length > 0;

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        aria-expanded={isOpen}
        {...inspectorProps({ fieldId: 'question' })}
      >
        <span className="text-base font-semibold text-gray-900 group-hover:text-[#006bb6] transition-colors">
          {question}
        </span>
        <span className="flex-shrink-0 ml-6 h-7 w-7 flex items-center justify-center rounded-full border border-gray-300 group-hover:border-[#006bb6] transition-colors">
          <svg
            className={`h-4 w-4 text-gray-500 group-hover:text-[#006bb6] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && hasAnswer && (
        <div
          className="pb-5 pr-14 text-gray-600 prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:list-disc [&_ol]:list-decimal [&_a]:text-[#006bb6] [&_a]:underline"
          {...inspectorProps({ fieldId: 'answer' })}
        >
          {documentToReactComponents(answer as Document)}
        </div>
      )}
    </div>
  );
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Frequently Asked Questions</h2>
        <div className="divide-y divide-gray-200 border-t border-gray-200">
          {faqs.map((faq) => (
            <FaqItem
              key={faq.sys.id}
              faq={faq as FaqEntry}
              isOpen={openId === faq.sys.id}
              onToggle={() => setOpenId((prev) => (prev === faq.sys.id ? null : faq.sys.id))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
