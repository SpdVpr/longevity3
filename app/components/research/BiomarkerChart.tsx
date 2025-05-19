'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Biomarker } from './ResearchDashboard';

interface BiomarkerChartProps {
  biomarkers: Biomarker[];
}

export default function BiomarkerChart({ biomarkers }: BiomarkerChartProps) {
  const t = useTranslations('research.biomarkers');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Získání unikátních kategorií
  const categories = ['all', ...new Set(biomarkers.map(b => b.category))];
  
  // Filtrování biomarkerů podle kategorie
  const filteredBiomarkers = selectedCategory === 'all' 
    ? biomarkers 
    : biomarkers.filter(b => b.category === selectedCategory);
  
  // Funkce pro získání barvy podle kategorie
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'blood':
        return 'bg-red-500';
      case 'vitamins':
        return 'bg-amber-500';
      case 'lipids':
        return 'bg-blue-500';
      case 'hormones':
        return 'bg-purple-500';
      case 'inflammation':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Funkce pro získání emoji podle kategorie
  const getCategoryEmoji = (category: string) => {
    switch(category) {
      case 'blood':
        return '🩸';
      case 'vitamins':
        return '💊';
      case 'lipids':
        return '🫀';
      case 'hormones':
        return '⚡';
      case 'inflammation':
        return '🔥';
      default:
        return '📊';
    }
  };
  
  return (
    <div>
      {/* Kategorie filtrů */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-teal text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? t('allCategories') : `${getCategoryEmoji(category)} ${t(`categories.${category}`)}`}
          </button>
        ))}
      </div>
      
      {/* Seznam biomarkerů */}
      {filteredBiomarkers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('noBiomarkers')}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBiomarkers.map(biomarker => (
            <div key={biomarker.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full ${getCategoryColor(biomarker.category)} mr-2`}></span>
                  <h3 className="font-medium text-gray-900">{biomarker.name}</h3>
                </div>
                <span className="text-sm text-gray-500">{new Date(biomarker.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-end">
                <div className="text-2xl font-bold text-gray-900">{biomarker.value}</div>
                <div className="ml-1 text-sm text-gray-600">{biomarker.unit}</div>
              </div>
              
              {/* Zde by mohla být vizualizace trendu nebo referenční rozsah */}
              <div className="mt-2 text-xs text-gray-500">
                {t('referenceRange')}: 
                {biomarker.name === 'Glucose' && ' 3.9 - 5.5 mmol/L'}
                {biomarker.name === 'Vitamin D' && ' 50 - 125 nmol/L'}
                {biomarker.name === 'HDL Cholesterol' && ' > 1.0 mmol/L'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
