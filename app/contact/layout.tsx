import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Longevity Grow | Get in Touch",
  description: "Contact our team of longevity experts. Get answers to your questions about healthy aging, nutrition, fitness, and longevity science.",
  keywords: "contact longevity grow, longevity experts, healthy aging questions, longevity consultation",
  authors: [{ name: "Longevity Grow" }],
  creator: "Longevity Grow",
  publisher: "Longevity Grow",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.longevitygrow.com/contact",
  },
  openGraph: {
    title: "Contact Longevity Grow | Get in Touch",
    description: "Contact our team of longevity experts. Get answers to your questions about healthy aging.",
    url: "https://www.longevitygrow.com/contact",
    siteName: "Longevity Grow",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Longevity Grow | Get in Touch",
    description: "Contact our team of longevity experts. Get answers to your questions about healthy aging.",
    creator: "@longevitygrow",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
