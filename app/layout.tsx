import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "E-Learning Platform - Learn Anything, Anytime",
    template: "%s | E-Learning Platform"
  },
  description: "Access comprehensive courses with interactive lessons, videos, and quizzes. Learn at your own pace with automatic translations in multiple languages.",
  keywords: ["e-learning", "online courses", "education", "learning platform", "video lessons", "interactive quizzes"],
  authors: [{ name: "E-Learning Platform" }],
  creator: "E-Learning Platform",
  publisher: "E-Learning Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    title: "E-Learning Platform - Learn Anything, Anytime",
    description: "Access comprehensive courses with interactive lessons, videos, and quizzes.",
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    siteName: "E-Learning Platform",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Learning Platform",
    description: "Access comprehensive courses with interactive lessons, videos, and quizzes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
