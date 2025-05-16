'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SimpleBioAgeCalculator from '@/app/components/SimpleBioAgeCalculator';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export default function SmartBioAgeCalculatorPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 to-blue-700 text-white py-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/placeholder-biomarkers.svg"
            alt="Smart Biological Age Calculator"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 17%' }}
            className="transform scale-105"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
            Smart Biological Age Calculator
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto text-shadow">
            Calculate your biological age using data from your smart devices
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Tools', href: `/${locale}/tools` },
          { label: 'Smart Biological Age Calculator' }
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2">
            <SimpleBioAgeCalculator />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About This Calculator</h2>
              <p className="text-gray-700 mb-4">
                Our Smart Biological Age Calculator uses data that can be easily obtained from your smart watch, fitness tracker, or smart ring, combined with basic health metrics and lifestyle factors.
              </p>
              <p className="text-gray-700">
                Unlike traditional biological age calculators that require extensive blood tests, this tool focuses on metrics that are readily available to most people with wearable devices.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">How This Calculator Works</h2>
              <p className="text-gray-700 mb-4">
                This calculator analyzes five key health dimensions:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Cardiovascular health (heart rate, blood pressure)</li>
                <li>Physical activity (steps, active minutes)</li>
                <li>Sleep patterns (duration, quality)</li>
                <li>Lifestyle factors (smoking, alcohol, diet)</li>
                <li>Recovery capacity (how quickly your body recovers)</li>
              </ul>
              <p className="text-gray-700">
                Each dimension receives a score, and these scores collectively determine your biological age relative to your chronological age.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Finding Your Data</h2>
              <p className="text-gray-700 mb-4">
                Most of the data needed for this calculator can be found in your smart device's app:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Resting heart rate: Check your device's health or heart rate section</li>
                <li>Steps and active minutes: Look in your activity or exercise summary</li>
                <li>Sleep data: Review your sleep tracking statistics</li>
                <li>Recovery time: Some devices track "recovery" or "readiness" scores</li>
              </ul>
              <p className="text-gray-700 mt-4">
                For blood pressure, you'll need a blood pressure monitor. For lifestyle factors, provide your best estimate based on your habits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">How accurate is this calculator?</h3>
              <p className="text-gray-700">
                While not as precise as clinical tests, this calculator provides a reasonable estimate based on key health metrics that are strongly correlated with biological aging. It's designed to give you insights into your overall health status and identify areas for improvement.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">How often should I calculate my biological age?</h3>
              <p className="text-gray-700">
                We recommend recalculating every 3-6 months. This timeframe allows enough time for lifestyle changes to potentially impact your results. More frequent calculations might show normal fluctuations rather than meaningful changes.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">What's the difference between this and the standard Biological Age Calculator?</h3>
              <p className="text-gray-700">
                Our standard calculator includes blood biomarkers that require laboratory testing. This smart version focuses on metrics available from wearable devices and simple self-assessments, making it more accessible for regular monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Track Your Progress Over Time</h2>
            <p className="text-gray-700 mb-6">
              Create an account to save your results and track changes in your biological age as you implement lifestyle improvements.
            </p>
            <Link
              href={`/${locale}/auth/signup`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
