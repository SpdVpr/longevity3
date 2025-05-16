import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import { createTranslator } from 'next-intl';

// Define the locales and default locale - English only
export const locales = ['en'];
export const defaultLocale = 'en';

// Create the navigation functions
export const {Link, redirect, usePathname, useRouter} = createSharedPathnamesNavigation({
  locales,
  localePrefix: 'never'
});

// Function to get messages
export async function getMessages(locale = 'en') {
  try {
    // First try to load from en.json
    return await import(`../../messages/${locale}.json`).then(module => module.default);
  } catch (error) {
    try {
      // If that fails, try to load from en/index.json
      return await import(`../../messages/${locale}/index.json`).then(module => module.default);
    } catch (innerError) {
      console.error(`Error loading messages for locale ${locale}:`, innerError);
      return {}; // Return empty object to prevent crashes
    }
  }
}

// Create a translator helper
export async function getTranslator(namespace) {
  const messages = await getMessages();
  return createTranslator({ locale: 'en', messages, namespace });
}
