"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users } from "lucide-react";
import { CourseWithRelations } from "@/types";

interface CourseGridProps {
  courses: CourseWithRelations[];
  enrolledCourseIds: string[];
  isAuthenticated: boolean;
}

export function CourseGrid({ courses, enrolledCourseIds, isAuthenticated }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No courses available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back later for new courses
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        
        return (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              {course.thumbnail && (
                <div className="relative aspect-video rounded-md overflow-hidden mb-4">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {course.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course._count?.lessons || 0} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course._count?.enrollments || 0} students</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              {isEnrolled ? (
                <Link href={`/courses/${course.id}`} className="w-full">
                  <Button className="w-full" variant="default">
                    Continue Learning
                  </Button>
                </Link>
              ) : (
                <Link href={isAuthenticated ? `/courses/${course.id}` : "/auth/signin"} className="w-full">
                  <Button className="w-full" variant="outline">
                    {isAuthenticated ? "View Course" : "Sign in to Enroll"}
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
