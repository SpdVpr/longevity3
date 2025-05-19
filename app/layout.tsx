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
        <Script id="strapi-config" strategy="beforeInteractive">
          {`
            // HARDCODED Strapi API URL and token to ensure they're always correct
            window.STRAPI_API_URL = 'https://special-acoustics-b9adb26838.strapiapp.com';
            window.STRAPI_API_TOKEN = '20096e270ae3b90065ca95970e34cda9ef7f3de056a0d9adb2edae62f158651bc218a1234832b338b1251291099daf1049d60d759f1935c2e2371f20f2cee68a6909567ade4b3f1c7be51f8effb548e7511570359ec3c6cbd33e83c6bac8e8c9f2eda66441986eb27f15897ccda1564dcd335552da089dff40317b9950c23477';

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
