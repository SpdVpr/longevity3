'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Biomarker } from './ResearchDashboard';

interface BiomarkerFormProps {
  onSubmit: (biomarker: Omit<Biomarker, 'id'>) => void;
}

export default function BiomarkerForm({ onSubmit }: BiomarkerFormProps) {
  const t = useTranslations('research.biomarkers');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    category: 'blood'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validace
    if (!formData.name || !formData.value || !formData.unit || !formData.date) {
      return;
    }
    
    onSubmit({
      name: formData.name,
      value: parseFloat(formData.value),
      unit: formData.unit,
      date: formData.date,
      category: formData.category
    });
    
    // Reset formuláře
    setFormData({
      name: '',
      value: '',
      unit: '',
      date: new Date().toISOString().split('T')[0],
      category: 'blood'
    });
    
    setIsFormOpen(false);
  };
  
  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-teal hover:border-teal flex items-center justify-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t('addNew')}
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('addNewBiomarker')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                {t('category')}
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              >
                <option value="blood">{t('categories.blood')}</option>
                <option value="vitamins">{t('categories.vitamins')}</option>
                <option value="lipids">{t('categories.lipids')}</option>
                <option value="hormones">{t('categories.hormones')}</option>
                <option value="inflammation">{t('categories.inflammation')}</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                {t('value')}
              </label>
              <input
                type="number"
                id="value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                {t('unit')}
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                {t('date')}
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-dark focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
            >
              {t('save')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
