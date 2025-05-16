import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  try {
    // Load index messages
    const indexMessages = await import(`../../messages/${locale}/index.json`);
    
    // Try to load research messages
    try {
      const researchMessages = await import(`../../messages/${locale}/research.json`);
      // Merge all messages
      return {
        locale,
        messages: { ...indexMessages.default, research: researchMessages.default },
        timeZone: 'Europe/Prague'
      };
    } catch (error) {
      // Fallback to English if research messages for the locale are not found
      if (locale !== routing.defaultLocale) {
        try {
          const researchMessages = await import(`../../messages/${routing.defaultLocale}/research.json`);
          return {
            locale,
            messages: { ...indexMessages.default, research: researchMessages.default },
            timeZone: 'Europe/Prague'
          };
        } catch (innerError) {
          console.error('Could not load research messages:', innerError);
          return {
            locale,
            messages: { ...indexMessages.default },
            timeZone: 'Europe/Prague'
          };
        }
      } else {
        return {
          locale,
          messages: { ...indexMessages.default },
          timeZone: 'Europe/Prague'
        };
      }
    }
  } catch (error) {
    // Fallback to English if messages for the locale are not found
    const indexMessages = await import(`../../messages/${routing.defaultLocale}/index.json`);
    try {
      const researchMessages = await import(`../../messages/${routing.defaultLocale}/research.json`);
      return {
        locale,
        messages: { ...indexMessages.default, research: researchMessages.default },
        timeZone: 'Europe/Prague'
      };
    } catch (innerError) {
      console.error('Could not load English research messages:', innerError);
      return {
        locale,
        messages: { ...indexMessages.default },
        timeZone: 'Europe/Prague'
      };
    }
  }
});
