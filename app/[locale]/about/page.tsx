'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-700 to-gray-900 text-white py-32 md:py-40 lg:py-48 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-50">
          <Image
            src="/images/placeholder-article.svg"
            alt={t('hero.title')}
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 17%' }}
            className="transform scale-105"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow max-w-4xl mx-auto">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-shadow">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('story.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('story.paragraph1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('story.paragraph2')}
              </p>
              <p className="text-gray-600">
                {t('story.paragraph3')}
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/placeholder-article.svg"
                alt="Longevity Hub Team"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">{t('values.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('values.evidenceBased.title')}</h3>
                <p className="text-gray-600">
                  {t('values.evidenceBased.description')}
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('values.practical.title')}</h3>
                <p className="text-gray-600">
                  {t('values.practical.description')}
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('values.personalization.title')}</h3>
                <p className="text-gray-600">
                  {t('values.personalization.description')}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">{t('team.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src="/images/placeholder-article.svg"
                    alt={t('team.members.jane.name')}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-bold">{t('team.members.jane.name')}</h3>
                <p className="text-blue-600 mb-2">{t('team.members.jane.role')}</p>
                <p className="text-gray-600 text-sm">
                  {t('team.members.jane.bio')}
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src="/images/placeholder-article.svg"
                    alt={t('team.members.michael.name')}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-bold">{t('team.members.michael.name')}</h3>
                <p className="text-blue-600 mb-2">{t('team.members.michael.role')}</p>
                <p className="text-gray-600 text-sm">
                  {t('team.members.michael.bio')}
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src="/images/placeholder-article.svg"
                    alt={t('team.members.sarah.name')}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-bold">{t('team.members.sarah.name')}</h3>
                <p className="text-blue-600 mb-2">{t('team.members.sarah.role')}</p>
                <p className="text-gray-600 text-sm">
                  {t('team.members.sarah.bio')}
                </p>
              </div>

              {/* Team Member 4 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src="/images/placeholder-article.svg"
                    alt={t('team.members.david.name')}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-bold">{t('team.members.david.name')}</h3>
                <p className="text-blue-600 mb-2">{t('team.members.david.role')}</p>
                <p className="text-gray-600 text-sm">
                  {t('team.members.david.bio')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
