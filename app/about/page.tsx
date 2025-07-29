'use client';

import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            About Longevity Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Our mission is to provide evidence-based information on longevity and healthy aging
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Longevity Hub was founded in 2025 with a simple mission: to make the science of longevity accessible to everyone. We believe that the latest research on extending healthspan and lifespan should not be confined to academic journals or exclusive conferences.
              </p>
              <p className="text-gray-600 mb-4">
                Our team of scientists, health professionals, and science communicators work together to translate complex research into practical, actionable information that anyone can use to optimize their health and potentially extend their lifespan.
              </p>
              <p className="text-gray-600">
                We are committed to scientific accuracy, transparency, and a balanced approach that acknowledges both the promise and limitations of longevity science.
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
            <h2 className="text-3xl font-bold mb-6 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Evidence-Based</h3>
                <p className="text-gray-600">
                  We prioritize scientific evidence and rigorous research. All our content is backed by peer-reviewed studies and expert consensus.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Practical Application</h3>
                <p className="text-gray-600">
                  We translate complex science into actionable strategies that can be implemented in everyday life.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Personalization</h3>
                <p className="text-gray-600">
                  We recognize that there is no one-size-fits-all approach to longevity and provide tools for personalized optimization.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src="/images/placeholder-article.svg"
                    alt="Team Member"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-bold">Dr. Jane Smith</h3>
                <p className="text-blue-600 mb-2">Founder & Chief Science Officer</p>
                <p className="text-gray-600 text-sm">
                  PhD in Molecular Biology with 15+ years of research experience in aging mechanisms.
                </p>
              </div>
              
              {/* Team Member 2 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src="/images/placeholder-article.svg"
                    alt="Team Member"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-bold">Dr. Michael Johnson</h3>
                <p className="text-blue-600 mb-2">Medical Director</p>
                <p className="text-gray-600 text-sm">
                  Board-certified physician specializing in preventive medicine and longevity.
                </p>
              </div>
              
              {/* Team Member 3 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src="/images/placeholder-article.svg"
                    alt="Team Member"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-bold">Sarah Williams</h3>
                <p className="text-blue-600 mb-2">Head of Content</p>
                <p className="text-gray-600 text-sm">
                  Science journalist with expertise in translating complex research for general audiences.
                </p>
              </div>
              
              {/* Team Member 4 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src="/images/placeholder-article.svg"
                    alt="Team Member"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-bold">David Chen</h3>
                <p className="text-blue-600 mb-2">Technology Director</p>
                <p className="text-gray-600 text-sm">
                  Software engineer focused on creating interactive tools for health optimization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
