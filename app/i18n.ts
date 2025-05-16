import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Define supported locales
export const locales = ['en', 'cs'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (locale !== 'en' && locale !== 'cs') {
    notFound();
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale: locale
  };
});
