'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Simulate API call
    try {
      // In a real application, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-blue-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Subscribe to Our Newsletter</h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
          Stay updated with the latest research and insights on longevity science. We'll send you a monthly digest of our best content.
        </p>

        {isSuccess ? (
          <div className="bg-green-100 text-green-700 p-4 rounded max-w-md mx-auto">
            Thank you for subscribing! We've sent a confirmation email to your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>

            {error && (
              <div className="text-red-500 mt-2 text-sm text-left">
                {error}
              </div>
            )}

            <p className="text-gray-500 text-sm mt-4">
              We respect your privacy. You can unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
