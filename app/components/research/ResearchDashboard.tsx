'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import BiomarkerChart from './BiomarkerChart';
import BiomarkerForm from './BiomarkerForm';
import ResearchProjects from './ResearchProjects';
import CommunityStats from './CommunityStats';

// Typy pro biomarkery
export type Biomarker = {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  category: string;
};

// Typy pro výzkumné projekty
export type ResearchProject = {
  id: string;
  title: string;
  description: string;
  participants: number;
  status: 'active' | 'completed' | 'recruiting';
  startDate: string;
  endDate?: string;
};

export default function ResearchDashboard() {
  const t = useTranslations('research');
  const params = useParams();
  const locale = params.locale as string || 'en';
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([]);
  const [activeProjects, setActiveProjects] = useState<ResearchProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulace načtení dat
  useEffect(() => {
    // V reálné aplikaci by zde byl API call pro načtení dat uživatele
    setTimeout(() => {
      // Simulovaná data
      setBiomarkers([
        {
          id: '1',
          name: 'Glucose',
          value: 5.2,
          unit: 'mmol/L',
          date: '2023-05-15',
          category: 'blood'
        },
        {
          id: '2',
          name: 'Vitamin D',
          value: 75,
          unit: 'nmol/L',
          date: '2023-05-15',
          category: 'vitamins'
        },
        {
          id: '3',
          name: 'HDL Cholesterol',
          value: 1.6,
          unit: 'mmol/L',
          date: '2023-05-15',
          category: 'lipids'
        }
      ]);
      
      setActiveProjects([
        {
          id: '1',
          title: 'Impact of Intermittent Fasting on Metabolic Health',
          description: 'Studying how different fasting protocols affect glucose levels and other metabolic markers.',
          participants: 342,
          status: 'active',
          startDate: '2023-01-15'
        },
        {
          id: '2',
          title: 'Sleep Quality and Cognitive Performance',
          description: 'Investigating the relationship between sleep metrics and cognitive test results.',
          participants: 189,
          status: 'recruiting',
          startDate: '2023-04-10'
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Přidání nového biomarkeru
  const handleAddBiomarker = (biomarker: Omit<Biomarker, 'id'>) => {
    const newBiomarker = {
      ...biomarker,
      id: Date.now().toString()
    };
    
    setBiomarkers([...biomarkers, newBiomarker]);
  };
  
  // Přihlášení uživatele (simulace)
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
        <p className="text-lg text-gray-600">{t('dashboard.subtitle')}</p>
      </div>
      
      {!isLoggedIn ? (
        <div className="bg-indigo-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">{t('dashboard.join')}</h2>
          <p className="text-indigo-600 mb-6 max-w-2xl mx-auto">
            {t('dashboard.joinDescription')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleLogin}
              className="bg-teal hover:bg-teal-dark text-white py-3 px-6 rounded-md font-medium transition-colors"
            >
              {t('dashboard.signIn')}
            </button>
            <Link 
              href={`/${locale}/research/register`}
              className="bg-white border border-teal text-teal hover:bg-teal-light hover:text-teal-dark py-3 px-6 rounded-md font-medium transition-colors"
            >
              {t('dashboard.register')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Levý sloupec - Biomarkery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('biomarkers.title')}</h2>
                <Link 
                  href={`/${locale}/research/biomarkers`}
                  className="text-teal hover:text-teal-dark text-sm font-medium"
                >
                  {t('biomarkers.viewAll')}
                </Link>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
                </div>
              ) : (
                <>
                  <BiomarkerChart biomarkers={biomarkers} />
                  <BiomarkerForm onSubmit={handleAddBiomarker} />
                </>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('projects.title')}</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
                </div>
              ) : (
                <ResearchProjects projects={activeProjects} />
              )}
            </div>
          </div>
          
          {/* Pravý sloupec - Statistiky a informace */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('community.title')}</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
                </div>
              ) : (
                <CommunityStats />
              )}
            </div>
            
            <div className="bg-gradient-to-br from-teal to-indigo text-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">{t('impact.title')}</h2>
              <p className="mb-4">{t('impact.description')}</p>
              <Link 
                href={`/${locale}/research/impact`}
                className="inline-block bg-white text-teal hover:bg-gray-100 py-2 px-4 rounded-md font-medium transition-colors"
              >
                {t('impact.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
