import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { locales } from '../i18n';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // Validate locale
  if (!locales.includes(locale as any)) notFound();

  // No need to get messages anymore

  // Get messages for the current locale
  const messages = await import(`../../messages/${locale}.json`).then(module => module.default);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
