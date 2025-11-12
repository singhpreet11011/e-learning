"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { BookOpen, Globe, Users } from "lucide-react";

export function HeroSection() {
  // ✅ Scroll handler for "Browse Courses"
  const handleScrollToCourses = () => {
    const section = document.getElementById("available-courses");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Learn Without Language Barriers
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Access world-class education in your preferred language. Our platform automatically
            translates course content to over 20 languages, making learning accessible to everyone.
          </p>

          {/* ✅ Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {/* Opens Clerk modal */}
            <SignInButton mode="modal">
              <Button size="lg">Get Started</Button>
            </SignInButton>

            {/* ✅ Scrolls to Available Courses section */}
            <Button variant="outline" size="lg" onClick={handleScrollToCourses}>
              Browse Courses
            </Button>
          </div>
        </div>

        {/* ✅ Features section */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-primary">
              <Globe className="h-12 w-12" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Multi-Language Support</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Learn in your native language with automatic translation to 20+ languages
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-primary">
              <BookOpen className="h-12 w-12" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Interactive Learning</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Engage with video lessons, quizzes, and track your progress
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-primary">
              <Users className="h-12 w-12" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Learn Together</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Join a global community of learners and share knowledge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}