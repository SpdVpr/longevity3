'use client';

import { useTranslations } from 'next-intl';
import ResearchDashboard from '../../components/research/ResearchDashboard';

export default function ResearchPage() {
  const t = useTranslations('research');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal to-indigo text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">{t('hero.title')}</h1>
            <p className="text-xl opacity-90 mb-6">{t('hero.subtitle')}</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-teal hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors">
                {t('hero.joinButton')}
              </button>
              <button className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-medium transition-colors">
                {t('hero.learnButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ResearchDashboard />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h2>
          <p className="text-lg text-gray-600">{t('howItWorks.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Krok 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('howItWorks.step1.title')}</h3>
            <p className="text-gray-600">{t('howItWorks.step1.description')}</p>
          </div>
          
          {/* Krok 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('howItWorks.step2.title')}</h3>
            <p className="text-gray-600">{t('howItWorks.step2.description')}</p>
          </div>
          
          {/* Krok 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('howItWorks.step3.title')}</h3>
            <p className="text-gray-600">{t('howItWorks.step3.description')}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('faq.title')}</h2>
            <p className="text-lg text-gray-600">{t('faq.subtitle')}</p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* FAQ 1 */}
            <div className="border-b border-gray-200">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">{t('faq.q1')}</h3>
                <p className="mt-2 text-gray-600">{t('faq.a1')}</p>
              </div>
            </div>
            
            {/* FAQ 2 */}
            <div className="border-b border-gray-200">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">{t('faq.q2')}</h3>
                <p className="mt-2 text-gray-600">{t('faq.a2')}</p>
              </div>
            </div>
            
            {/* FAQ 3 */}
            <div className="border-b border-gray-200">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">{t('faq.q3')}</h3>
                <p className="mt-2 text-gray-600">{t('faq.a3')}</p>
              </div>
            </div>
            
            {/* FAQ 4 */}
            <div>
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">{t('faq.q4')}</h3>
                <p className="mt-2 text-gray-600">{t('faq.a4')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('cta.title')}</h2>
          <p className="text-lg text-gray-600 mb-8">{t('cta.subtitle')}</p>
          <button className="bg-teal text-white hover:bg-teal-dark px-8 py-3 rounded-md font-medium text-lg transition-colors">
            {t('cta.button')}
          </button>
        </div>
      </div>
    </div>
  );
}
