'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import SearchBar from './SearchBar';
import { FaHome, FaUtensils, FaDumbbell, FaBrain, FaChartLine, FaTablets, FaTools, FaUser, FaSignInAlt, FaUserPlus, FaBars, FaSignOutAlt, FaHistory } from 'react-icons/fa';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && dropdownRef.current.contains && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // No need for locale extraction anymore

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-teal">
              Longevity Hub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 flex items-center">
              <FaHome className="h-5 w-5 mr-1" />
              Home
            </Link>
            <Link href="/nutrition" className="text-gray-700 hover:text-blue-600 flex items-center">
              <FaUtensils className="h-5 w-5 mr-1" />
              Nutrition
            </Link>
            <Link href="/fitness" className="text-gray-700 hover:text-blue-600 flex items-center">
              <FaDumbbell className="h-5 w-5 mr-1" />
              Fitness
            </Link>
            <Link href="/mental-health" className="text-gray-700 hover:text-blue-600 flex items-center">
              <FaBrain className="h-5 w-5 mr-1" />
              Mental Health
            </Link>
            <Link href="/biomarkers" className="text-gray-700 hover:text-blue-600 flex items-center">
              <FaChartLine className="h-5 w-5 mr-1" />
              Biomarkers
            </Link>
            <Link href="/supplements" className="text-gray-700 hover:text-blue-600 flex items-center">
              <FaTablets className="h-5 w-5 mr-1" />
              Supplements
            </Link>
            <Link href="/tools" className="text-gray-700 hover:text-blue-600 flex items-center">
              <FaTools className="h-5 w-5 mr-1" />
              Tools
            </Link>
          </nav>

          <div className="flex items-center space-x-4">

            {/* Auth Buttons */}
            {status === 'authenticated' && session ? (
              <div className="hidden md:flex items-center space-x-2">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 bg-transparent border-none cursor-pointer"
                  >
                    <FaUser className="h-5 w-5 mr-1" />
                    <span>{session.user.name || 'Account'}</span>
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ${isDropdownOpen ? 'block' : 'hidden'}`}
                  >
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaUser className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaUser className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link href="/dashboard/bioage-history" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaHistory className="h-4 w-4 mr-2" />
                      Bio Age History
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <FaSignInAlt className="h-5 w-5 mr-1" />
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <FaUserPlus className="h-5 w-5 mr-1" />
                  Sign Up
                </Link>
              </div>
            )}



            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaBars className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {/* Desktop Search Bar */}
        <div className="hidden md:block mt-4 max-w-xl mx-auto">
          <SearchBar
            placeholder="Search..."
            showButton={true}
          />
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4">
            {/* Mobile Search Bar */}
            <div className="mb-4">
              <SearchBar
                placeholder="Search..."
                showButton={false}
              />
            </div>

            <nav className="space-y-2">
              <Link href="/" className="flex items-center py-2 text-gray-700 hover:text-blue-600">
                <FaHome className="h-5 w-5 mr-2" />
                Home
              </Link>
              <Link href="/nutrition" className="flex items-center py-2 text-gray-700 hover:text-blue-600">
                <FaUtensils className="h-5 w-5 mr-2" />
                Nutrition
              </Link>
              <Link href="/fitness" className="flex items-center py-2 text-gray-700 hover:text-blue-600">
                <FaDumbbell className="h-5 w-5 mr-2" />
                Fitness
              </Link>
              <Link href="/mental-health" className="flex items-center py-2 text-gray-700 hover:text-blue-600">
                <FaBrain className="h-5 w-5 mr-2" />
                Mental Health
              </Link>
              <Link href="/biomarkers" className="flex items-center py-2 text-gray-700 hover:text-blue-600">
                <FaChartLine className="h-5 w-5 mr-2" />
                Biomarkers
              </Link>
              <Link href="/supplements" className="flex items-center py-2 text-gray-700 hover:text-blue-600">
                <FaTablets className="h-5 w-5 mr-2" />
                Supplements
              </Link>
              <Link href="/tools" className="flex items-center py-2 text-gray-700 hover:text-blue-600">
                <FaTools className="h-5 w-5 mr-2" />
                Tools
              </Link>

              {/* Mobile Auth Links */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                {status === 'authenticated' && session ? (
                  <>
                    <Link href="/dashboard" className="flex items-center py-2 text-gray-700 hover:text-blue-600 font-medium">
                      <FaUser className="h-5 w-5 mr-2" />
                      {session.user.name || 'Account'}
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center py-2 text-gray-700 hover:text-blue-600 ml-4">
                      <FaUser className="h-5 w-5 mr-2" />
                      Profile
                    </Link>
                    <Link href="/dashboard/bioage-history" className="flex items-center py-2 text-gray-700 hover:text-blue-600 ml-4">
                      <FaHistory className="h-5 w-5 mr-2" />
                      Bio Age History
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center py-2 text-red-600 hover:text-red-800 w-full text-left ml-4"
                    >
                      <FaSignOutAlt className="h-5 w-5 mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" className="flex items-center py-2 text-gray-700 hover:text-blue-600">
                      <FaSignInAlt className="h-5 w-5 mr-2" />
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="flex items-center py-2 text-blue-600 hover:text-blue-800 font-medium">
                      <FaUserPlus className="h-5 w-5 mr-2" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
