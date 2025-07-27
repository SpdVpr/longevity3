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
  title: "Longevity Hub - Science-backed strategies for longevity",
  description: "Discover evidence-based approaches to extend your healthspan and lifespan with the latest longevity research and practical tips.",
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
