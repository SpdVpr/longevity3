import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from './i18n-config';

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../../messages/${locale}/index.json`)).default,
    locale: locale as string
  };
});