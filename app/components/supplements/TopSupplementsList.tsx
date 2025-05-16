'use client';

import { useState } from 'react';
import { Supplement } from '../../types';
import SupplementCard from './SupplementCard';

interface TopSupplementsListProps {
  supplements: Supplement[];
  locale: string;
}

export default function TopSupplementsList({ supplements, locale }: TopSupplementsListProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Supplements' },
    { id: 'vitamins', name: 'Vitamins & Minerals' },
    { id: 'antioxidants', name: 'Antioxidants' },
    { id: 'nad', name: 'NAD+ Boosters' },
    { id: 'omega', name: 'Omega Fatty Acids' }
  ];

  // Filter supplements based on active filter
  const filteredSupplements = supplements.filter(supplement => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'vitamins' && (supplement.id === 'vitamin-d' || supplement.id === 'magnesium')) return true;
    if (activeFilter === 'antioxidants' && supplement.id === 'coq10') return true;
    if (activeFilter === 'nad' && supplement.id === 'nad-boosters') return true;
    if (activeFilter === 'omega' && supplement.id === 'omega-3') return true;
    return false;
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Top 5 Science-Backed Supplements for Longevity</h2>
        <p className="text-lg text-gray-700">
          These supplements have been selected based on rigorous scientific evidence supporting their benefits for healthy aging and longevity.
          Each has been extensively studied and shown to provide significant health benefits with a good safety profile.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === category.id
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Supplements grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSupplements.map(supplement => (
          <SupplementCard
            key={supplement.id}
            supplement={supplement}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
