'use client';

import { useState, useEffect } from 'react';
import ImagePlaceholder from './ImagePlaceholder';

// Define placeholder configurations
const placeholders = [
  {
    id: 'nutrition',
    text: 'Nutrition: Healthy eating for longevity',
    width: 800,
    height: 500,
    bgColor: '#e9f5e9',
    textColor: '#2f855a'
  },
  {
    id: 'fitness',
    text: 'Fitness: Exercise for healthspan',
    width: 800,
    height: 500,
    bgColor: '#e6f2ff',
    textColor: '#3182ce'
  },
  {
    id: 'mental-health',
    text: 'Mental Health: Cognitive wellness',
    width: 800,
    height: 500,
    bgColor: '#f8e9ff',
    textColor: '#805ad5'
  },
  {
    id: 'biomarkers',
    text: 'Biomarkers: Tracking health metrics',
    width: 800,
    height: 500,
    bgColor: '#fff8e6',
    textColor: '#dd6b20'
  },
  {
    id: 'supplements',
    text: 'Supplements: Evidence-based interventions',
    width: 800,
    height: 500,
    bgColor: '#e6fffa',
    textColor: '#319795'
  },
  {
    id: 'article-1',
    text: 'The Science of Intermittent Fasting',
    width: 800,
    height: 500,
    bgColor: '#f0fff4',
    textColor: '#38a169'
  },
  {
    id: 'article-2',
    text: 'Zone 2 Training for Longevity',
    width: 800,
    height: 500,
    bgColor: '#ebf8ff',
    textColor: '#4299e1'
  },
  {
    id: 'article-3',
    text: 'Understanding NAD+ and Aging',
    width: 800,
    height: 500,
    bgColor: '#f0f5ff',
    textColor: '#5a67d8'
  },
  {
    id: 'hero',
    text: 'Longevity Hub: Science-backed strategies for a longer, healthier life',
    width: 1200,
    height: 600,
    bgColor: '#f0f9ff',
    textColor: '#2b6cb0',
    fontSize: 24
  }
];

export default function PlaceholderGenerator() {
  const [generated, setGenerated] = useState<string[]>([]);

  const downloadAll = () => {
    const links = document.querySelectorAll('a.download-link');
    links.forEach((link: any) => {
      link.click();
    });
  };

  useEffect(() => {
    // Check if placeholders are already in localStorage
    const storedPlaceholders = placeholders.map(p => {
      return localStorage.getItem(`placeholder-${p.id}`);
    });

    if (storedPlaceholders.every(p => p !== null)) {
      setGenerated(storedPlaceholders.filter(p => p !== null) as string[]);
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Placeholder Generator</h1>
      
      <button 
        onClick={downloadAll}
        className="mb-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download All Placeholders
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholders.map((placeholder, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-md">
            <div className="relative" style={{ height: placeholder.height / 2 }}>
              {generated[index] ? (
                <img 
                  src={generated[index]} 
                  alt={placeholder.text}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center bg-gray-100"
                  style={{ backgroundColor: placeholder.bgColor }}
                >
                  <p className="text-center p-4" style={{ color: placeholder.textColor }}>
                    {placeholder.text}
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-bold mb-2">{placeholder.id}</h3>
              <p className="text-sm text-gray-600 mb-4">{placeholder.text}</p>
              
              {generated[index] && (
                <a 
                  href={generated[index]}
                  download={`placeholder-${placeholder.id}.png`}
                  className="download-link text-blue-600 hover:underline text-sm"
                >
                  Download Image
                </a>
              )}
            </div>
            
            <ImagePlaceholder
              width={placeholder.width}
              height={placeholder.height}
              text={placeholder.text}
              bgColor={placeholder.bgColor}
              textColor={placeholder.textColor}
              fontSize={placeholder.fontSize || 16}
              id={placeholder.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
