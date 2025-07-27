import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './components/Header';
import Footer from './components/Footer';
import PreviewBanner from './components/PreviewBanner';
import { Providers } from './providers';
// Import environment variables
import './env';
// Import Strapi configuration (must be after env import)
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Longevity Grow - Science-backed strategies for longevity and healthy aging",
  description: "Discover evidence-based approaches to extend your healthspan and lifespan with the latest longevity research, nutrition, fitness, mental health, and supplement guidance.",
  keywords: "longevity, healthy aging, nutrition, fitness, mental health, supplements, anti-aging, healthspan, lifespan, wellness",
  authors: [{ name: "Longevity Grow" }],
  creator: "Longevity Grow",
  publisher: "Longevity Grow",
  robots: "index, follow",
  openGraph: {
    title: "Longevity Grow - Science-backed strategies for longevity",
    description: "Discover evidence-based approaches to extend your healthspan and lifespan with the latest longevity research and practical tips.",
    url: "https://www.longevitygrow.com",
    siteName: "Longevity Grow",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Longevity Grow - Science-backed strategies for longevity",
    description: "Discover evidence-based approaches to extend your healthspan and lifespan with the latest longevity research and practical tips.",
    creator: "@longevitygrow",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Preview mode is disabled for now
  const isPreview = false;

  return (
    <html lang="en">
      <head>
        {/* Load the override script before any other JavaScript */}
        <script src="/override-api-url.js" />

        <Script id="strapi-config" strategy="beforeInteractive">
          {`
            // Set Strapi API URL and token from environment variables
            window.STRAPI_API_URL = '${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://special-acoustics-b9adb26838.strapiapp.com'}';
            window.STRAPI_API_TOKEN = '${process.env.STRAPI_API_TOKEN || ''}';

            // Log the configuration
            console.log('STRAPI CONFIG - API_URL:', window.STRAPI_API_URL);
            console.log('STRAPI CONFIG - API_TOKEN exists:', !!window.STRAPI_API_TOKEN);
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <PreviewBanner isPreview={isPreview} />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
