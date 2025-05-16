import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Define locales and default locale
  const locales = ['en', 'cs'];
  const defaultLocale = 'en';

  // Validate that the incoming locale is valid
  if (!locales.includes(locale)) {
    locale = defaultLocale;
  }

  // Ensure locale is always a string
  const safeLocale = locale || defaultLocale;

  try {
    // Load index messages
    const indexMessages = await import(`./messages/${safeLocale}/index.json`);
    
    // Try to load research messages
    try {
      const researchMessages = await import(`./messages/${safeLocale}/research.json`);
      // Merge all messages
      return {
        locale: safeLocale,
        messages: { ...indexMessages.default, research: researchMessages.default },
        timeZone: 'Europe/Prague'
      };
    } catch (error) {
      // Fallback to English if research messages for the locale are not found
      if (safeLocale !== defaultLocale) {
        try {
          const researchMessages = await import(`./messages/${defaultLocale}/research.json`);
          return {
            locale: safeLocale,
            messages: { ...indexMessages.default, research: researchMessages.default },
            timeZone: 'Europe/Prague'
          };
        } catch (innerError) {
          console.error('Could not load research messages:', innerError);
          return {
            locale: safeLocale,
            messages: { ...indexMessages.default },
            timeZone: 'Europe/Prague'
          };
        }
      } else {
        return {
          locale: safeLocale,
          messages: { ...indexMessages.default },
          timeZone: 'Europe/Prague'
        };
      }
    }
  } catch (error) {
    // Fallback to English if messages for the locale are not found
    const indexMessages = await import(`./messages/${defaultLocale}/index.json`);
    try {
      const researchMessages = await import(`./messages/${defaultLocale}/research.json`);
      return {
        locale: safeLocale,
        messages: { ...indexMessages.default, research: researchMessages.default },
        timeZone: 'Europe/Prague'
      };
    } catch (innerError) {
      console.error('Could not load English research messages:', innerError);
      return {
        locale: safeLocale,
        messages: { ...indexMessages.default },
        timeZone: 'Europe/Prague'
      };
    }
  }
});
