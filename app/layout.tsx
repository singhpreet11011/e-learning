import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "E-Learning Platform - Learn Anything, Anytime",
    template: "%s | E-Learning Platform",
  },
  description:
    "Access comprehensive courses with interactive lessons, videos, and quizzes.",
  keywords: ["e-learning", "online courses", "education"],
  openGraph: {
    title: "E-Learning Platform - Learn Anything, Anytime",
    description:
      "Access comprehensive courses with interactive lessons, videos, and quizzes.",
    siteName: "E-Learning Platform",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#3b82f6" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
        </head>
        <body className={`${inter.className} antialiased`}>
          {/* Global Clerk Header */}
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}