import { NextIntlClientProvider } from 'next-intl';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

// Initialize fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Import components
import Header from '../components/Header';
import Footer from '../components/Footer';
import PreviewBanner from '../components/PreviewBanner';
import { Providers } from '../providers';
import { locales, defaultLocale, getMessages } from '../i18n';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params: { locale } }) {
  return {
    title: 'Longevity Hub',
    description: 'Science-backed strategies for longevity and healthspan',
  };
}

export default async function LocaleLayout({ children, params: { locale } }) {
  // Validate that the incoming locale is valid
  const isValidLocale = locales.some(l => l === locale);
  const validLocale = isValidLocale ? locale : defaultLocale;

  // Load messages using the helper function
  const messages = await getMessages(validLocale);

  // Preview mode is disabled for now
  const isPreview = false;

  return (
    <html lang={validLocale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <NextIntlClientProvider locale={validLocale} messages={messages}>
            <PreviewBanner isPreview={isPreview} />
            <Header />
            <main>{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
