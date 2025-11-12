import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { CourseGrid } from "@/components/courses/course-grid";
import { HeroSection } from "@/components/home/hero-section";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const user = await currentUser();

  // ✅ Fetch all published courses
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      _count: {
        select: { chapters: true, lessons: true, enrollments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // ✅ Fetch user enrollments if logged in
  let enrolledCourseIds: string[] = [];
  if (user?.id) {
    // Ensure user exists in DB
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: user.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : user.username,
        image: user.imageUrl,
      },
    });

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      select: { courseId: true },
    });
    enrolledCourseIds = enrollments.map((e) => e.courseId);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      {!user && <HeroSection />}

      {/* ✅ Added ID for smooth scrolling */}
      <div id="available-courses" className="container mx-auto px-4 py-8 scroll-mt-20">
        {user ? (
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.firstName || user.username}!
            </h1>
            <p className="text-muted-foreground mb-8">
              Continue learning or explore new courses
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold mb-2">Available Courses</h2>
            <p className="text-muted-foreground mb-8">
              Sign in to enroll and track your progress
            </p>
          </div>
        )}

        {/* Courses Grid */}
        <CourseGrid
          courses={courses}
          enrolledCourseIds={enrolledCourseIds}
          isAuthenticated={!!user}
        />
      </div>
    </div>
  );
}