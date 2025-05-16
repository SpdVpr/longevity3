import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale, getMessages} from './index';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming locale is valid
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  // Ensure locale is always a string
  const safeLocale = locale || defaultLocale;

  // Get messages using the helper function
  const messages = await getMessages(safeLocale);

  return {
    locale: safeLocale,
    messages,
    timeZone: 'Europe/Prague'
  };
});
