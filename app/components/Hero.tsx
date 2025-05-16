'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {

  return (
    <div className="relative bg-gradient-to-r from-teal-500 to-indigo-600 text-white py-32 md:py-40 lg:py-48 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="/images/hero/designer.jfif"
          alt="Longevity background"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 17%' }}
          className="transform scale-105"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow max-w-4xl mx-auto">
          Science-Backed Strategies for Longevity
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-shadow">
          Discover evidence-based approaches to extend your healthspan and lifespan
        </p>
        <Link
          href="/nutrition"
          className="bg-amber-500 text-white hover:bg-amber-600 px-8 py-4 rounded-full font-bold text-lg inline-block shadow-lg transition-transform hover:scale-105"
        >
          Explore Nutrition
        </Link>
      </div>
    </div>
  );
}

// Note: The text-shadow class should be defined in your global CSS
// .text-shadow {
//   text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
// }
