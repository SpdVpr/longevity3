'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestStrapiPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articlesData, setArticlesData] = useState<any>(null);
  const [categoriesData, setCategoriesData] = useState<any>(null);

  useEffect(() => {
    async function testStrapiConnection() {
      try {
        setLoading(true);
        setError(null);

        // Define the Strapi Cloud URL
        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
        
        console.log('Testing connection to Strapi Cloud at:', STRAPI_URL);
        
        // Test fetching articles
        console.log('Fetching articles from Strapi Cloud...');
        const articlesResponse = await fetch('/api/test-strapi?type=articles');
        
        if (!articlesResponse.ok) {
          throw new Error(`Failed to fetch articles: ${articlesResponse.status} ${articlesResponse.statusText}`);
        }
        
        const articlesData = await articlesResponse.json();
        setArticlesData(articlesData);
        
        // Test fetching categories
        console.log('Fetching categories from Strapi Cloud...');
        const categoriesResponse = await fetch('/api/test-strapi?type=categories');
        
        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch categories: ${categoriesResponse.status} ${categoriesResponse.statusText}`);
        }
        
        const categoriesData = await categoriesResponse.json();
        setCategoriesData(categoriesData);
        
        console.log('Strapi Cloud API test completed successfully!');
      } catch (error: any) {
        console.error('Error testing Strapi Cloud API:', error);
        setError(error.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    testStrapiConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-teal-500 mb-6">Strapi Cloud Connection Test</h1>
      <p className="mb-4">This page tests the connection to your Strapi Cloud instance.</p>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
        {loading ? (
          <p className="text-gray-600">Testing connection to Strapi Cloud...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <p className="text-green-500">Connection successful!</p>
        )}
      </div>
      
      {!loading && !error && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Articles Data</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p>Data structure check:</p>
              <ul className="list-disc ml-6">
                <li>Has data property: {articlesData?.data ? 'Yes' : 'No'}</li>
                <li>Data is array: {Array.isArray(articlesData?.data) ? 'Yes' : 'No'}</li>
                <li>Data length: {articlesData?.data?.length || 0}</li>
              </ul>
              
              {articlesData?.data?.length > 0 ? (
                <div className="mt-4">
                  <p className="font-medium">First article title: {articlesData.data[0].attributes.title}</p>
                </div>
              ) : (
                <p className="mt-4 text-gray-600">No articles found. This is normal for a new Strapi installation.</p>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Categories Data</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p>Data structure check:</p>
              <ul className="list-disc ml-6">
                <li>Has data property: {categoriesData?.data ? 'Yes' : 'No'}</li>
                <li>Data is array: {Array.isArray(categoriesData?.data) ? 'Yes' : 'No'}</li>
                <li>Data length: {categoriesData?.data?.length || 0}</li>
              </ul>
              
              {categoriesData?.data?.length > 0 ? (
                <div className="mt-4">
                  <p className="font-medium">First category name: {categoriesData.data[0].attributes.name}</p>
                </div>
              ) : (
                <p className="mt-4 text-gray-600">No categories found. This is normal for a new Strapi installation.</p>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Raw Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Articles</h3>
                <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-auto max-h-96 text-xs">
                  {JSON.stringify(articlesData, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Categories</h3>
                <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-auto max-h-96 text-xs">
                  {JSON.stringify(categoriesData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-8">
        <Link href="/" className="text-teal-500 hover:text-teal-700">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
