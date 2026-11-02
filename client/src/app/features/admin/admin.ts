import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import type { AuditEntry, CompletionRow, Course, CourseDraft, LearnerRow } from '../../core/models';

type Tab = 'courses' | 'users' | 'reports' | 'audit';
const ACADEMIES = ['Foundation', 'Insurance', 'Finance', 'Wealth', 'Sales', 'Operations', 'Troth One', 'Compliance'];

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, DatePipe],
  template: `
<div class="page admin">
  <div class="page-head"><span class="eyebrow">ACADEMY ADMINISTRATION</span><h1>Administration</h1><p>Manage courses, people, reports and the audit trail.</p></div>
  <div class="tabs learning-tabs" role="tablist">@for(t of visibleTabs();track t.id){<button role="tab" [attr.aria-selected]="tab()===t.id" [class.active]="tab()===t.id" (click)="open(t.id)">{{t.label}}</button>}</div>
  @if(notice()){<div class="notice" role="status">{{notice()}}</div>}
  @if(error()){<div class="error" role="alert">{{error()}}</div>}

  @if(tab()==='courses'){
    <section>
      <div class="section-heading"><h2>Courses</h2><button class="primary" (click)="creating.set(!creating())">{{creating() ? 'Cancel' : 'New course'}}</button></div>
      @if(creating()){
      <form class="course-form" [formGroup]="form" (ngSubmit)="save()">
        <label>Course name<input formControlName="title"></label>
        <label>Short description<input formControlName="shortDescription"></label>
        <label>Academy<select formControlName="academy">@for(a of academies;track a){<option>{{a}}</option>}</select></label>
        <label>Category<input formControlName="category"></label>
        <label>Instructor<input formControlName="instructor"></label>
        <label>Difficulty<select formControlName="difficulty"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
        <label class="check-row"><input type="checkbox" formControlName="certificate"> Issues a certificate</label>
        <label class="check-row"><input type="checkbox" formControlName="required"> Required training</label>
        <fieldset><legend>Lessons</legend>
          @for(g of lessons.controls;track g;let i=$index){<div class="lesson-edit" [formGroup]="g">
            <input formControlName="title" [attr.aria-label]="'Lesson ' + (i+1) + ' title'" placeholder="Lesson title">
            <input type="number" formControlName="duration" min="1" [attr.aria-label]="'Lesson ' + (i+1) + ' minutes'">
            <select formControlName="type" [attr.aria-label]="'Lesson ' + (i+1) + ' type'"><option value="video">Video</option><option value="text">Text</option><option value="sop">SOP</option><option value="quiz">Quiz</option></select>
            <button type="button" (click)="lessons.removeAt(i)" [disabled]="lessons.length===1" aria-label="Remove lesson">✕</button></div>}
          <button type="button" class="secondary" (click)="addLesson()">Add lesson</button></fieldset>
        <button class="primary" [disabled]="form.invalid || busy()">Save as draft</button>
      </form>}
      @if(courses().length){<div class="table-wrap"><table class="data-table"><caption class="sr-only">All courses</caption>
        <thead><tr><th>Course</th><th>Academy</th><th>Status</th><th>Lessons</th><th>Version</th><th>Actions</th></tr></thead>
        <tbody>@for(c of courses();track c.id){<tr><td><b>{{c.title}}</b><small>{{c.instructor}}</small></td><td>{{c.academy}}</td><td><span class="status" [attr.data-status]="c.status">{{c.status}}</span></td><td>{{lessonCount(c)}}</td><td>v{{c.version}}</td>
          <td class="row-actions">@if(c.status!=='PUBLISHED' && auth.can('course.publish')){<button (click)="publish(c)">Publish</button>}
            @if(c.status==='PUBLISHED' && auth.can('learning.assign')){<button (click)="assigning.set(assigning()===c.id ? '' : c.id)">Assign</button>}
            @if(c.status!=='ARCHIVED' && auth.can('course.delete')){<button (click)="archive(c)">Archive</button>}</td></tr>
          @if(assigning()===c.id){<tr><td colspan="6"><form class="assign-form" [formGroup]="assignForm" (ngSubmit)="assign(c)">
            <label>Learner<select formControlName="userId">@for(u of users();track u.id){<option [value]="u.id">{{u.firstName}} {{u.lastName}}</option>}</select></label>
            <label>Due date<input type="date" formControlName="dueDate"></label><button class="primary" [disabled]="assignForm.invalid">Assign course</button></form></td></tr>}}</tbody></table></div>}
      @else if(!loading()){<div class="empty"><b>No courses yet</b></div>}
    </section>
  }
  @if(tab()==='users'){<section><h2>Users</h2>
    <div class="table-wrap"><table class="data-table"><caption class="sr-only">Users</caption><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Assigned</th><th>Completion</th><th>Certificates</th><th>Status</th></tr></thead>
    <tbody>@for(u of users();track u.id){<tr><td><b>{{u.firstName}} {{u.lastName}}</b><small>{{u.employeeCode}}</small></td><td>{{u.email}}</td><td>{{u.roles.join(', ')}}</td><td>{{u.department}}</td><td>{{u.assigned}}</td><td>{{u.completionPercentage}}%</td><td>{{u.certificates}}</td><td>{{u.status}}</td></tr>}</tbody></table></div></section>}
  @if(tab()==='reports'){<section><div class="section-heading"><h2>Course completion</h2><button class="secondary" (click)="download()">Export CSV</button></div>
    @if(report().length){<div class="table-wrap"><table class="data-table"><caption class="sr-only">Course completion report</caption><thead><tr><th>Course</th><th>Academy</th><th>Enrolled</th><th>Completed</th><th>Completion</th></tr></thead>
    <tbody>@for(r of report();track r.courseId){<tr><td>{{r.title}}</td><td>{{r.academy}}</td><td>{{r.enrolled}}</td><td>{{r.completed}}</td><td>{{r.completionRate}}%</td></tr>}</tbody></table></div>}
    @else {<div class="empty"><b>No enrolments to report on yet</b></div>}</section>}
  @if(tab()==='audit'){<section><h2>Audit log</h2>
    @if(audit().length){<div class="table-wrap"><table class="data-table"><caption class="sr-only">Audit log</caption><thead><tr><th>When</th><th>Activity</th><th>Entity</th><th>User</th><th>IP</th></tr></thead>
    <tbody>@for(a of audit();track a.id){<tr><td>{{a.timestamp | date:'d MMM y, HH:mm'}}</td><td>{{a.activity}}</td><td>{{a.entity}}</td><td>{{a.userId}}</td><td>{{a.ip}}</td></tr>}</tbody></table></div>}
    @else {<div class="empty"><b>No activity recorded yet</b></div>}</section>}
</div>`
})
export class AdminPage {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  readonly academies = ACADEMIES;

  tab = signal<Tab>('courses');
  courses = signal<Course[]>([]);
  users = signal<LearnerRow[]>([]);
  report = signal<CompletionRow[]>([]);
  audit = signal<AuditEntry[]>([]);
  loading = signal(true);
  busy = signal(false);
  creating = signal(false);
  assigning = signal('');
  notice = signal('');
  error = signal('');

  visibleTabs = computed(() => ([
    { id: 'courses' as Tab, label: 'Courses', show: this.auth.can('course.create') },
    { id: 'users' as Tab, label: 'Users', show: this.auth.can('user.view') },
    { id: 'reports' as Tab, label: 'Reports', show: this.auth.can('report.view') },
    { id: 'audit' as Tab, label: 'Audit log', show: this.auth.can('audit.view') }
  ]).filter(t => t.show));

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]], shortDescription: ['', [Validators.required, Validators.minLength(10)]],
    academy: ['Insurance'], category: ['', Validators.required], instructor: ['', Validators.required], difficulty: ['Beginner'],
    certificate: [false], required: [false], lessons: this.fb.array([this.lessonGroup()])
  });
  assignForm = this.fb.nonNullable.group({ userId: ['', Validators.required], dueDate: [''] });
  get lessons() { return this.form.controls.lessons as unknown as FormArray<FormGroup>; }

  constructor() { const first = this.visibleTabs()[0]; if (first) this.open(first.id); }

  private lessonGroup() { return this.fb.nonNullable.group({ title: ['', Validators.required], duration: [10, [Validators.required, Validators.min(1)]], type: ['video'] }); }
  addLesson() { this.lessons.push(this.lessonGroup()); }
  lessonCount(c: Course) { return c.sections.reduce((n, s) => n + s.lessons.length, 0); }

  open(tab: Tab) {
    this.tab.set(tab); this.notice.set(''); this.error.set(''); this.loading.set(true);
    const done = () => this.loading.set(false);
    const fail = () => { this.error.set('Could not load this section.'); this.loading.set(false); };
    if (tab === 'courses') {
      this.api.adminCourses().subscribe({ next: r => { this.courses.set(r.data.items); done(); }, error: fail });
      if (this.auth.can('user.view')) this.loadUsers();
    }
    if (tab === 'users') this.api.users({ limit: 50 }).subscribe({ next: r => { this.users.set(r.data.items); done(); }, error: fail });
    if (tab === 'reports') this.api.completionReport().subscribe({ next: r => { this.report.set(r.data); done(); }, error: fail });
    if (tab === 'audit') this.api.auditLogs().subscribe({ next: r => { this.audit.set(r.data.items); done(); }, error: fail });
  }
  private loadUsers() { this.api.users({ limit: 50 }).subscribe({ next: r => this.users.set(r.data.items), error: () => this.users.set([]) }); }

  save() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const draft: CourseDraft = {
      title: v.title, shortDescription: v.shortDescription, description: v.shortDescription, academy: v.academy, category: v.category, instructor: v.instructor,
      difficulty: v.difficulty, certificate: v.certificate, required: v.required,
      sections: [{ title: 'Lessons', lessons: (v.lessons as { title: string; duration: number; type: 'video' | 'text' | 'quiz' | 'sop' }[]) }]
    };
    this.busy.set(true);
    this.api.createCourse(draft).subscribe({
      next: () => { this.busy.set(false); this.creating.set(false); this.notice.set('Course saved as draft.'); this.form.reset({ academy: 'Insurance', difficulty: 'Beginner', certificate: false, required: false }); this.open('courses'); },
      error: e => { this.busy.set(false); this.error.set(e.error?.message ?? 'Could not save the course.'); }
    });
  }
  publish(c: Course) { this.act(this.api.publishCourse(c.id), 'Course published.'); }
  archive(c: Course) { this.act(this.api.archiveCourse(c.id), 'Course archived.'); }
  assign(c: Course) {
    const v = this.assignForm.getRawValue();
    this.act(this.api.assign(c.id, [v.userId], v.dueDate), 'Course assigned.', () => this.assigning.set(''));
  }
  private act(call: import('rxjs').Observable<unknown>, message: string, after?: () => void) {
    this.error.set(''); this.notice.set('');
    call.subscribe({ next: () => { this.notice.set(message); after?.(); this.open('courses'); }, error: e => this.error.set(e.error?.message ?? 'That action failed.') });
  }

  download() {
    this.api.completionCsv().subscribe(csv => {
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = document.createElement('a'); a.href = url; a.download = 'course-completion.csv'; a.click(); URL.revokeObjectURL(url);
    });
  }
}
