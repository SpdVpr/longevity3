'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ResearchProject } from './ResearchDashboard';

interface ResearchProjectsProps {
  projects: ResearchProject[];
}

export default function ResearchProjects({ projects }: ResearchProjectsProps) {
  const t = useTranslations('research.projects');
  const params = useParams();
  const locale = params.locale as string || 'en';
  
  // Funkce pro získání barvy podle statusu projektu
  const getStatusColor = (status: ResearchProject['status']) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'recruiting':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('noProjects')}
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map(project => (
            <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {t(`status.${project.status}`)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {project.participants} {t('participants')}
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(project.startDate).toLocaleDateString()}
                    {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                <Link 
                  href={`/${locale}/research/projects/${project.id}`}
                  className="text-teal hover:text-teal-dark font-medium text-sm"
                >
                  {t('viewDetails')}
                </Link>
                
                {project.status === 'recruiting' && (
                  <button className="bg-teal text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-teal-dark transition-colors">
                    {t('joinProject')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <Link 
          href={`/${locale}/research/projects`}
          className="inline-flex items-center text-teal hover:text-teal-dark font-medium"
        >
          {t('viewAllProjects')}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
