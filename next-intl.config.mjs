/** @type {import('next-intl').NextIntlConfig} */
const config = {
  defaultLocale: 'en',
  locales: ['en'],
  localeDetection: false,
  messages: async () => {
    try {
      // First try to load from en.json
      return (await import('./messages/en.json')).default;
    } catch (error) {
      try {
        // If that fails, try to load from en/index.json
        return (await import('./messages/en/index.json')).default;
      } catch (innerError) {
        console.error('Failed to load messages:', innerError);
        return {};
      }
    }
  }
};

export default config;
