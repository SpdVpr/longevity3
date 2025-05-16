'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function ContactPage() {
  const params = useParams();
  const locale = params.locale as string;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    // Simulate API call
    try {
      // In a real application, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-50">
          <Image
            src="/images/placeholder-article.svg"
            alt="Contact Us"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-shadow">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
      </div>
      
      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                We're here to help with any questions about longevity, our content, or potential collaborations. Fill out the form or reach out to us directly using the contact information below.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">info@longevityhub.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Location</h3>
                    <p className="text-gray-600">123 Longevity Street<br />San Francisco, CA 94103</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              {isSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                  <p className="mb-4">Thank you for contacting us. We've received your message and will respond within 1-2 business days.</p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
                  
                  {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                      {error}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Content Suggestion">Content Suggestion</option>
                      <option value="Partnership Opportunity">Partnership Opportunity</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold w-full disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-gray-200 h-96 rounded-lg overflow-hidden">
            {/* In a real application, you would embed a Google Map or similar here */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg">Map Placeholder</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
