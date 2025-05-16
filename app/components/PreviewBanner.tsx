'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface PreviewBannerProps {
  isPreview: boolean;
}

/**
 * Banner displayed when in preview mode
 */
export default function PreviewBanner({ isPreview }: PreviewBannerProps) {
  const pathname = usePathname();
  
  if (!isPreview) {
    return null;
  }
  
  return (
    <div className="bg-yellow-500 text-black py-2 px-4 text-center sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="font-semibold">Preview Mode</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm">You are viewing unpublished content</span>
          <Link 
            href={`/api/exit-preview?redirect=${encodeURIComponent(pathname)}`}
            className="bg-black text-white px-3 py-1 rounded text-sm font-semibold hover:bg-gray-800"
          >
            Exit Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
