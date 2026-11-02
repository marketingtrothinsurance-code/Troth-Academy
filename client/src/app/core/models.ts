export type LessonType = 'video' | 'text' | 'quiz' | 'sop';
export interface Lesson { id: string; title: string; duration: number; type: LessonType; videoId?: string; videoUrl?: string }
export interface Section { id: string; title: string; lessons: Lesson[] }
export type CourseStatus = 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface Course {
  id: string; slug: string; title: string; shortDescription: string; description: string;
  academy: string; category: string; instructor: string; difficulty: string; language: string;
  duration: number; rating: number; learners: number; certificate: boolean; required?: boolean; isNew?: boolean;
  color: string; thumbnail?: string; skills: string[]; sections: Section[]; updatedAt: string; status: CourseStatus; version: number;
  progress?: number; enrollmentStatus?: 'IN_PROGRESS' | 'COMPLETED' | null; saved?: boolean;
}
export interface LessonProgress { lessonId: string; status: 'IN_PROGRESS' | 'COMPLETED'; lastPosition: number; completionPercentage: number }
export interface Enrollment {
  userId: string; courseId: string; progress: number; lastLessonId: string; status: 'IN_PROGRESS' | 'COMPLETED';
  enrollmentType: string; enrolledAt: string; updatedAt: string; dueDate?: string; course: Course; saved?: boolean;
}
export interface CourseDetail extends Course { enrollment: Enrollment | null; lessonProgress: LessonProgress[]; related: Course[] }

export interface Certificate {
  id: string; userId: string; courseId: string; title: string; level: string; issuedAt: string; expiresAt?: string;
  assessmentScore?: number; learnerName?: string; expired?: boolean;
}
export interface AssessmentSummary {
  course: { id: string; slug: string; title: string; academy: string; difficulty: string };
  learningProgress: number; eligible: boolean; passingScore: number;
  latestAttempt: { score: number; passed: boolean; attemptedAt: string } | null; certificate: Certificate | null;
}
export interface Assessment {
  courseId: string; title: string; passingScore: number; eligible: boolean;
  questions: { id: string; prompt: string; options: string[] }[];
}
export interface AssessmentResult { score: number; passed: boolean; passingScore: number; certificate: Certificate | null }
export interface Note { id: string; lessonId: string; courseId: string; text: string; timestamp?: number; createdAt: string }
export interface AppNotification { id: string; title: string; body: string; read: boolean; createdAt: string }

export interface SessionUser { id: string; firstName: string; lastName: string; email: string; roles: string[]; permissions: string[] }
export interface ApiResponse<T> { success: boolean; message: string; data: T }
export interface Page<T> { items: T[]; pagination: { page: number; limit: number; total: number; pages: number } }

export interface DashboardData {
  user: { id: string; firstName: string; lastName: string; level: string; points: number };
  stats: { inProgress: number; completed: number; certificates: number; hours: number; streak: number };
  continueLearning: Enrollment[];
  requiredTraining: { courseId: string; slug: string; title: string; dueDate: string | null; progress: number }[];
  recommended: Course[];
  certificates: Certificate[];
}
export interface AcademySummary { name: string; count: number; categories: string[] }
export interface LearnerRow {
  id: string; firstName: string; lastName: string; email: string; employeeCode: string; roles: string[]; department: string; branch: string;
  status: string; assigned: number; completed: number; pending: number; overdue: number; certificates: number; completionPercentage: number;
}
export interface TeamData { members: LearnerRow[]; totals: { members: number; assigned: number; completed: number; overdue: number; certificates: number } }
export interface AuditEntry { id: string; userId: string; activity: string; entity: string; entityId?: string; timestamp: string; ip?: string }
export interface CompletionRow { courseId: string; title: string; academy: string; enrolled: number; completed: number; completionRate: number }
export interface CourseDraft {
  title: string; shortDescription: string; description: string; academy: string; category: string; instructor: string; difficulty: string;
  certificate: boolean; required: boolean; sections: { title: string; lessons: { title: string; duration: number; type: LessonType }[] }[];
}
