'use client';

import { useTranslations } from 'next-intl';

export default function CommunityStats() {
  const t = useTranslations('research.community');
  
  // Simulovaná data pro statistiky komunity
  const stats = [
    {
      id: 'users',
      label: t('stats.users'),
      value: '2,547',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'dataPoints',
      label: t('stats.dataPoints'),
      value: '187,392',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'projects',
      label: t('stats.projects'),
      value: '12',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      id: 'publications',
      label: t('stats.publications'),
      value: '5',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];
  
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {stats.map(stat => (
          <div key={stat.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">{t('topContributors')}</h3>
        <div className="space-y-3">
          {/* Simulovaní top přispěvatelé */}
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                {/* Anonymizované iniciály */}
                {String.fromCharCode(64 + i)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {/* Anonymizovaná jména */}
                  {t('anonymousUser')} {i}
                </div>
                <div className="text-xs text-gray-500">
                  {/* Náhodný počet příspěvků */}
                  {Math.floor(Math.random() * 100) + 50} {t('contributions')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">{t('recentFindings')}</h3>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-900 mb-1">
              {t('findings.sleep')}
            </div>
            <div className="text-xs text-gray-600">
              {t('findings.sleepDescription')}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-900 mb-1">
              {t('findings.vitamin')}
            </div>
            <div className="text-xs text-gray-600">
              {t('findings.vitaminDescription')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
