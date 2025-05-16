// i18n.js - Root configuration for next-intl
export const locales = ['en'];
export const defaultLocale = 'en';

// Function to get messages
export async function getMessages() {
  try {
    // First try to load from en.json
    return await import('./messages/en.json').then(module => module.default);
  } catch (error) {
    try {
      // If that fails, try to load from en/index.json
      return await import('./messages/en/index.json').then(module => module.default);
    } catch (innerError) {
      console.error(`Error loading messages:`, innerError);
      return {}; // Return empty object to prevent crashes
    }
  }
}
