'use client';

import Link from 'next/link';

export default function Footer() {

  return (
    <footer className="bg-indigo-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Longevity Hub</h3>
            <p className="text-indigo-light">
              Science-backed strategies for longevity and healthspan.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-teal-light hover:text-teal">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-teal-light hover:text-teal">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-teal-light hover:text-teal">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-teal-light hover:text-teal">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nutrition" className="text-teal-light hover:text-teal">
                  Nutrition
                </Link>
              </li>
              <li>
                <Link href="/fitness" className="text-teal-light hover:text-teal">
                  Fitness
                </Link>
              </li>
              <li>
                <Link href="/mental-health" className="text-teal-light hover:text-teal">
                  Mental Health
                </Link>
              </li>
              <li>
                <Link href="/biomarkers" className="text-teal-light hover:text-teal">
                  Biomarkers
                </Link>
              </li>
              <li>
                <Link href="/supplements" className="text-teal-light hover:text-teal">
                  Supplements
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-indigo-light mb-4">
              Subscribe to get the latest updates on longevity research.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded text-gray-800"
              />
              <button
                type="submit"
                className="bg-teal hover:bg-teal-dark px-4 py-2 rounded"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-indigo mt-8 pt-8 text-center">
          <p className="text-indigo-light">© {new Date().getFullYear()} Longevity Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
