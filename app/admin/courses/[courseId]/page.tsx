"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  GripVertical,
  Edit2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  position: number;
  isPublished: boolean;
  videoUrl: string | null;
  duration: number | null;
  chapterId?: string | null; // ✅ Added to fix !l.chapterId error
}

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  position: number;
  isPublished: boolean;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  isPublished: boolean;
  chapters: Chapter[];
  lessons: Lesson[];
}

export default function EditCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    isPublished: false,
  });

  useEffect(() => {
    fetchCourse();
  }, [params.courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${params.courseId}`);
      if (!response.ok) throw new Error("Failed to fetch course");

      const data = await response.json();
      setCourse(data);
      setFormData({
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail || "",
        isPublished: data.isPublished,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load course",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/courses/${params.courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update course");

      toast({
        title: "Success",
        description: "Course updated successfully",
      });

      fetchCourse();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${params.courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete course");

      toast({
        title: "Success",
        description: "Course deleted successfully",
      });

      router.push("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>

          <Button variant="destructive" size="sm" onClick={handleDeleteCourse}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Course
          </Button>
        </div>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="chapters">Chapters & Lessons</TabsTrigger>
            <TabsTrigger value="lessons">Direct Lessons</TabsTrigger>
          </TabsList>

          {/* Course Details */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Update the course information and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPublished: checked })
                    }
                  />
                  <Label htmlFor="published">
                    Publish Course (make it visible to students)
                  </Label>
                </div>

                <Button onClick={handleUpdateCourse} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chapters */}
          <TabsContent value="chapters">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Chapters</CardTitle>
                    <CardDescription>
                      Organize your course content into chapters
                    </CardDescription>
                  </div>
                  <Link
                    href={`/admin/courses/${params.courseId}/chapters/new`}
                  >
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Chapter
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {course.chapters.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No chapters yet. Add your first chapter to get started.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {course.chapters.map((chapter) => (
                      <div key={chapter.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <GripVertical className="h-5 w-5 mt-1 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{chapter.title}</h4>
                              {chapter.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {chapter.description}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground mt-2">
                                {chapter.lessons.length} lessons
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/courses/${params.courseId}/chapters/${chapter.id}`}
                            >
                              <Button variant="ghost" size="sm">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                chapter.isPublished
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {chapter.isPublished ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Direct Lessons */}
          <TabsContent value="lessons">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Direct Lessons</CardTitle>
                    <CardDescription>
                      Lessons that are not part of any chapter
                    </CardDescription>
                  </div>
                  <Link
                    href={`/admin/courses/${params.courseId}/lessons/new`}
                  >
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {course.lessons.filter((l) => !l.chapterId).length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No direct lessons yet. Add lessons or organize them into
                    chapters.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {course.lessons
                      .filter((l) => !l.chapterId)
                      .map((lesson) => (
                        <div key={lesson.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <GripVertical className="h-5 w-5 mt-1 text-muted-foreground" />
                              <div>
                                <h4 className="font-medium">{lesson.title}</h4>
                                {lesson.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {lesson.description}
                                  </p>
                                )}
                                {lesson.videoUrl && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    📹 Video lesson
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/courses/${params.courseId}/lessons/${lesson.id}`}
                              >
                                <Button variant="ghost" size="sm">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </Link>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  lesson.isPublished
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {lesson.isPublished ? "Published" : "Draft"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}