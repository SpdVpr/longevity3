import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
// Can be imported from a shared config
export const locales = ['en', 'cs'];
export const defaultLocale = 'en';
 
export function getLocale(pathname: string) {
  const segments = pathname.split('/');
  const locale = segments[1];
  
  if (!locales.includes(locale as any)) {
    return defaultLocale;
  }
  
  return locale;
}

export function checkLocale(locale: string) {
  if (!locales.includes(locale as any)) {
    notFound();
  }
}

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming locale is valid
  if (!locales.includes(locale as any)) {
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
