'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Supplement } from '../../types';
import SupplementPlaceholder from './SupplementPlaceholder';

interface SupplementCardProps {
  supplement: Supplement;
  locale: string;
}

export default function SupplementCard({ supplement, locale }: SupplementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 md:h-64 overflow-hidden">
        {supplement.imageUrl ? (
          <>
            <Image
              src={supplement.imageUrl}
              alt={supplement.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <h3 className="text-white text-2xl font-bold p-4">{supplement.name}</h3>
            </div>
          </>
        ) : (
          <div className="absolute inset-0">
            <SupplementPlaceholder supplement={supplement} />
          </div>
        )}
      </div>

      <div className="p-6">
        <p className="text-sm text-gray-500 mb-2 italic">{supplement.scientificName}</p>

        <p className="text-gray-700 mb-4">{supplement.description}</p>

        <div className="mb-4">
          <h4 className="font-bold text-gray-900 mb-2">Key Benefits:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {supplement.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-700">{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-bold text-gray-900 mb-2">Recommended Dosage:</h4>
          <p className="text-gray-700">{supplement.dosage}</p>
        </div>

        {isExpanded && (
          <>
            <div className="mb-4">
              <h4 className="font-bold text-gray-900 mb-2">Safety Profile:</h4>
              <p className="text-gray-700">{supplement.safetyProfile}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-bold text-gray-900 mb-2">Potential Interactions:</h4>
              <p className="text-gray-700">{supplement.interactions}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-bold text-gray-900 mb-2">Scientific Evidence:</h4>
              <div className="space-y-4">
                {supplement.studies.map((study, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-1">{study.title}</h5>
                    <p className="text-sm text-gray-600 mb-2">{study.authors} ({study.year}). {study.journal}.</p>
                    <p className="text-gray-700 mb-2">{study.findings}</p>
                    <Link
                      href={study.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-800 text-sm font-medium inline-flex items-center"
                    >
                      View Study
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-teal-600 hover:text-teal-800 font-medium flex items-center"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <Link
          href={`/${locale}/supplements/${supplement.id}`}
          className="mt-4 inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
