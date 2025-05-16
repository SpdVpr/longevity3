import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './components/Header';
import Footer from './components/Footer';
import PreviewBanner from './components/PreviewBanner';
import { Providers } from './providers';

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
