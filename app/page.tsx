import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { CourseGrid } from "@/components/courses/course-grid";
import { HeroSection } from "@/components/home/hero-section";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Fetch published courses
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      _count: {
        select: {
          chapters: true,
          lessons: true,
          enrollments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch user's enrollments if logged in
  let enrolledCourseIds: string[] = [];
  if (session?.user?.id) {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        courseId: true,
      },
    });
    enrolledCourseIds = enrollments.map((e) => e.courseId);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />
      
      {!session && <HeroSection />}
      
      <div className="container mx-auto px-4 py-8">
        {session ? (
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session.user.name}!
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

        <CourseGrid 
          courses={courses} 
          enrolledCourseIds={enrolledCourseIds}
          isAuthenticated={!!session}
        />
      </div>
    </div>
  );
}
