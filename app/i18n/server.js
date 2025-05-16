import {getRequestConfig} from 'next-intl/server';
import {getMessages} from './index';

export default getRequestConfig(async ({locale}) => {
  // Always use English
  const safeLocale = 'en';

  // Get messages using the helper function
  const messages = await getMessages(safeLocale);

  return {
    locale: safeLocale,
    messages,
    timeZone: 'Europe/Prague'
  };
});
