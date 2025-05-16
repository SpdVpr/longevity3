'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


interface SearchBarProps {
  placeholder?: string;
  className?: string;
  buttonText?: string;
  showButton?: boolean;
}

export default function SearchBar({
  placeholder = 'Search articles...',
  className = '',
  buttonText = 'Search',
  showButton = true
}: SearchBarProps) {
  const router = useRouter();

  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showButton && (
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          {buttonText}
        </button>
      )}
    </form>
  );
}
