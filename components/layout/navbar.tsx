"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";
import { BookOpen, GraduationCap, LayoutDashboard } from "lucide-react";
import { useEffect } from "react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();

  // Check admin from Clerk metadata
  const isAdmin = user?.publicMetadata?.isAdmin === true;

  // ✅ Smooth scroll helper
  const scrollToCourses = () => {
    const section = document.getElementById("available-courses");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ✅ If redirected from another page with hash, scroll after load
  useEffect(() => {
    if (window.location.hash === "#available-courses") {
      setTimeout(() => scrollToCourses(), 300);
    }
  }, [pathname]);

  // ✅ Click handler for "Courses" button
  const handleCoursesClick = () => {
    if (pathname === "/") {
      scrollToCourses();
    } else {
      router.push("/#available-courses");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">E-Learning</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* ✅ Fixed "Courses" scroll logic */}
              <Button variant="ghost" size="sm" onClick={handleCoursesClick}>
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </Button>

              {isSignedIn && (
                <Link href="/my-courses">
                  <Button variant="ghost" size="sm">My Learning</Button>
                </Link>
              )}

              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <LanguageSelector />

            {!isLoaded ? (
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            ) : isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}