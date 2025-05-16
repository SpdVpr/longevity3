import { createTranslator } from 'next-intl';

// Define supported locales - English only
export const locales = ['en'];
export const defaultLocale = 'en';

// Function to get messages
export async function getMessages() {
  try {
    // First try to load from en.json
    return await import(`../messages/en.json`).then(module => module.default);
  } catch (error) {
    try {
      // If that fails, try to load from en/index.json
      return await import(`../messages/en/index.json`).then(module => module.default);
    } catch (innerError) {
      console.error(`Error loading messages:`, innerError);
      return {}; // Return empty object to prevent crashes
    }
  }
}

// Create a translator helper
export async function getTranslator(namespace) {
  const messages = await getMessages();
  return createTranslator({ locale: 'en', messages, namespace });
}
