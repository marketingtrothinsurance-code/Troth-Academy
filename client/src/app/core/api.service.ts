import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type {
  AcademySummary, ApiResponse, AppNotification, Assessment, AssessmentResult, AssessmentSummary, AuditEntry, Certificate, CompletionRow, Course, CourseDetail, CourseDraft,
  DashboardData, Enrollment, LearnerRow, Note, Page, TeamData
} from './models';

const BASE = '/api/v1';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  private params(filters: Record<string, string | number | undefined>) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params = params.set(k, String(v)); });
    return params;
  }

  dashboard() { return this.http.get<ApiResponse<DashboardData>>(`${BASE}/dashboard`); }
  academies() { return this.http.get<ApiResponse<AcademySummary[]>>(`${BASE}/academies`); }
  courses(filters: Record<string, string | number | undefined> = {}) {
    return this.http.get<ApiResponse<Page<Course>>>(`${BASE}/courses`, { params: this.params(filters) });
  }
  course(slug: string) { return this.http.get<ApiResponse<CourseDetail>>(`${BASE}/courses/${slug}`); }
  learning() { return this.http.get<ApiResponse<Enrollment[]>>(`${BASE}/users/me/learning`); }
  enroll(courseId: string) { return this.http.post<ApiResponse<Enrollment>>(`${BASE}/courses/${courseId}/enroll`, {}); }
  progress(courseId: string, lessonId: string, watchedSeconds: number, durationSeconds: number, completed = false) {
    return this.http.post<ApiResponse<Enrollment & { lessonStatus: string; lessonCompletion: number; certificate: Certificate | null }>>(
      `${BASE}/lessons/${lessonId}/progress`, { courseId, watchedSeconds, durationSeconds, completed });
  }
  save(courseId: string) { return this.http.put<ApiResponse<{ saved: boolean }>>(`${BASE}/bookmarks/${courseId}`, {}); }
  unsave(courseId: string) { return this.http.delete<ApiResponse<{ saved: boolean }>>(`${BASE}/bookmarks/${courseId}`); }
  saved() { return this.http.get<ApiResponse<Course[]>>(`${BASE}/bookmarks`); }
  notes(courseId: string, lessonId: string) { return this.http.get<ApiResponse<Note[]>>(`${BASE}/courses/${courseId}/notes`, { params: { lessonId } }); }
  addNote(courseId: string, lessonId: string, text: string, timestamp?: number) {
    return this.http.post<ApiResponse<Note>>(`${BASE}/courses/${courseId}/notes`, { lessonId, text, timestamp });
  }
  deleteNote(id: string) { return this.http.delete<ApiResponse<null>>(`${BASE}/notes/${id}`); }
  certificates() { return this.http.get<ApiResponse<Certificate[]>>(`${BASE}/users/me/certificates`); }
  assessments() { return this.http.get<ApiResponse<AssessmentSummary[]>>(`${BASE}/assessments`); }
  assessment(courseId: string) { return this.http.get<ApiResponse<Assessment>>(`${BASE}/courses/${courseId}/assessment`); }
  submitAssessment(courseId: string, answers: number[]) { return this.http.post<ApiResponse<AssessmentResult>>(`${BASE}/courses/${courseId}/assessment/submit`, { answers }); }
  verifyCertificate(id: string) {
    return this.http.get<ApiResponse<{ valid: boolean; id: string; title: string; level: string; learnerName: string; issuedAt: string; expiresAt: string | null }>>(`${BASE}/certificates/${id}/verify`);
  }
  notifications() { return this.http.get<ApiResponse<AppNotification[]>>(`${BASE}/notifications`); }
  markRead(id: string) { return this.http.post<ApiResponse<AppNotification>>(`${BASE}/notifications/${id}/read`, {}); }

  team() { return this.http.get<ApiResponse<TeamData>>(`${BASE}/team`); }
  franchiseLearners() { return this.http.get<ApiResponse<TeamData>>(`${BASE}/franchise/learners`); }
  users(filters: Record<string, string | number | undefined> = {}) { return this.http.get<ApiResponse<Page<LearnerRow>>>(`${BASE}/users`, { params: this.params(filters) }); }
  completionReport() { return this.http.get<ApiResponse<CompletionRow[]>>(`${BASE}/reports/course-completion`); }
  completionCsv() { return this.http.get(`${BASE}/reports/course-completion`, { params: { format: 'csv' }, responseType: 'text' }); }
  auditLogs(page = 1) { return this.http.get<ApiResponse<Page<AuditEntry>>>(`${BASE}/audit-logs`, { params: this.params({ page }) }); }
  adminCourses(status?: string) { return this.http.get<ApiResponse<Page<Course>>>(`${BASE}/courses`, { params: this.params({ status, limit: 50, sort: 'newest' }) }); }
  createCourse(draft: CourseDraft) { return this.http.post<ApiResponse<Course>>(`${BASE}/courses`, draft); }
  publishCourse(id: string) { return this.http.post<ApiResponse<Course>>(`${BASE}/courses/${id}/publish`, {}); }
  archiveCourse(id: string) { return this.http.delete<ApiResponse<Course>>(`${BASE}/courses/${id}`); }
  assign(courseId: string, userIds: string[], dueDate?: string) {
    return this.http.post<ApiResponse<{ assigned: number; skipped: number }>>(`${BASE}/assignments`, { courseId, userIds, dueDate: dueDate || undefined });
  }
}
