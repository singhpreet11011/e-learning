import { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  const user = await currentUser();

  // Check if user is signed in
  if (!user?.id) {
    redirect("/sign-in");
  }

  // Check if user is admin from publicMetadata
  const isAdmin = user.publicMetadata?.isAdmin === true;

  console.log("User ID:", user.id); // This should log: user_35NYbXdRpkBIHP8U0LBy971d45S
  console.log("Public Metadata:", user.publicMetadata);
  console.log("Is Admin:", isAdmin);

  if (!isAdmin) {
    // You can create a custom unauthorized page or redirect to home
    redirect("/");
  }

  // Ensure user exists in database
  await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.emailAddresses[0]?.emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
      image: user.imageUrl,
      isAdmin: isAdmin, // Sync admin status with database
    },
    create: {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
      image: user.imageUrl,
      isAdmin: isAdmin, // Set admin status from Clerk
    },
  });

  // Rest of your admin page code...
  const courses = await prisma.course.findMany({
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage courses, chapters, and lessons
            </p>
          </div>
          <Link href="/admin/courses/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Courses
              </h3>
              <p className="text-3xl font-bold mt-2">{courses.length}</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Enrollments
              </h3>
              <p className="text-3xl font-bold mt-2">
                {courses.reduce((acc, course) => acc + course._count.enrollments, 0)}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Lessons
              </h3>
              <p className="text-3xl font-bold mt-2">
                {courses.reduce((acc, course) => acc + course._count.lessons, 0)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Courses</h2>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course._count.chapters} chapters • {course._count.lessons} lessons •{" "}
                        {course._count.enrollments} students
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          course.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No courses created yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}