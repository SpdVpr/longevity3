'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface CategoryCardProps {
  title: string;
  description: string;
  imageSrc?: string;
  href: string;
  category?: string;
}

export default function CategoryCard({
  title,
  description,
  imageSrc,
  href,
  category
}: CategoryCardProps) {
  const params = useParams();
  const locale = params.locale as string;

  // Determine the image source based on category or provided imageSrc
  const imageSource = imageSrc || `/images/placeholder-${category || href.replace('/', '')}.svg`;

  // Ensure the href includes the locale
  const localizedHref = href.startsWith('/')
    ? `/${locale}${href}`
    : `/${locale}/${href}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48 group">
        <Link href={localizedHref} className="block w-full h-full">
          <Image
            src={imageSource}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </Link>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-700 mb-4">{description}</p>
        <Link
          href={localizedHref}
          className="text-blue-600 font-semibold hover:text-blue-800"
        >
          Learn More →
        </Link>
      </div>
    </div>
  );
}
