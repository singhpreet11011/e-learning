import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }
}

export interface CourseWithRelations {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  chapters: ChapterWithLessons[];
  lessons: LessonWithRelations[];
  _count?: {
    enrollments: number;
    chapters: number;
    lessons: number;
  };
}

export interface ChapterWithLessons {
  id: string;
  title: string;
  description: string | null;
  position: number;
  courseId: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  lessons: LessonWithRelations[];
  _count?: {
    lessons: number;
  };
}

export interface LessonWithRelations {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  position: number;
  chapterId: string | null;
  courseId: string;
  videoUrl: string | null;
  duration: number | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  attachments: Attachment[];
  questions: QuestionWithOptions[];
  lessonProgress?: LessonProgress[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  lessonId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionWithOptions {
  id: string;
  lessonId: string;
  question: string;
  imageUrl: string | null;
  videoUrl: string | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  options: Option[];
}

export interface Option {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt: Date | null;
  startedAt: Date;
  updatedAt: Date;
}

export interface EnrollmentWithCourse {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt: Date | null;
  lastAccessed: Date;
  course: CourseWithRelations;
}

export interface UserProgress {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lastAccessed: Date | null;
}

export interface QuizResult {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface TranslatedContent {
  original: string;
  primary?: string;
  secondary?: string;
}

export type SupportedLanguage = 
  | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' 
  | 'ja' | 'ko' | 'zh' | 'ar' | 'hi' | 'sv' | 'no' 
  | 'da' | 'fi' | 'nl' | 'pl' | 'tr' | 'th';

export interface LanguagePreference {
  primary?: SupportedLanguage;
  secondary?: SupportedLanguage;
}
