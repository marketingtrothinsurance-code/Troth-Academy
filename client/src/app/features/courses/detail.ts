import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { CourseDetail, Lesson } from '../../core/models';
import { CourseCard } from '../../shared/course-card';
import { DurationPipe } from '../../shared/duration.pipe';

@Component({
  selector: 'app-detail',
  imports: [RouterLink, DatePipe, DurationPipe, CourseCard],
  template: `
@if(course(); as c){
<div class="detail">
  <section class="course-hero" [class.has-course-banner]="!!c.thumbnail">
    @if(c.thumbnail){<div class="course-hero-bg" [style.background-image]="'url(&quot;' + c.thumbnail + '&quot;)'" aria-hidden="true"></div>}
    <div class="breadcrumbs"><a routerLink="/courses">Browse courses</a> / {{c.academy}} / {{c.category}}</div>
    <div class="hero-layout">
      <div>
        <span class="tag">{{c.academy}} ACADEMY</span><h1>{{c.title}}</h1><p>{{c.shortDescription}}</p>
        <div class="hero-meta"><b>★ {{c.rating}}</b><span>{{c.difficulty}}</span><span>{{c.learners.toLocaleString()}} enrolled</span><span>Updated {{c.updatedAt | date:'d MMM y'}}</span>@if(c.status!=='PUBLISHED'){<span>{{c.status}}</span>}</div>
        <div class="teacher"><i aria-hidden="true">{{c.instructor[0]}}</i><span>Created by <b>{{c.instructor}}</b></span></div>
      </div>
      <aside>
        <div class="preview" [style.--course-color]="c.color">@if(c.thumbnail){<img [src]="c.thumbnail" alt="" draggable="false">}<span>{{lessonCount()}} lessons · {{c.duration | duration}}</span></div>
        <div class="enroll">
          <strong>{{c.required ? 'Required for your role' : 'Included with Troth Academy'}}</strong>
          @if(c.enrollment){<div class="progress" role="progressbar" [attr.aria-valuenow]="c.enrollment.progress" aria-valuemin="0" aria-valuemax="100"><i [style.width.%]="c.enrollment.progress"></i></div><small>{{c.enrollment.progress}}% complete</small>}
          <button class="primary" [disabled]="busy()" (click)="start()">{{c.enrollment ? (c.enrollment.status==='COMPLETED' ? 'Review course' : 'Continue learning') : 'Start learning'}} →</button>
          <button class="secondary" [attr.aria-pressed]="c.saved" (click)="toggleSave()">{{c.saved ? '♥ Saved' : '♡ Save for later'}}</button>
          @if(error()){<div class="error" role="alert">{{error()}}</div>}
          <ul><li>{{c.duration | duration}} of learning</li><li>{{lessonCount()}} lessons</li><li>{{c.language}}</li>@if(c.certificate){<li>Assessment and Certification</li>}</ul>
        </div>
      </aside>
    </div>
  </section>
  <div class="detail-body">
    <main>
      <section><h2>About this course</h2><p>{{c.description}}</p></section>
      <section class="learn-box"><h2>What you'll learn</h2><div>@for(skill of c.skills;track skill){<span>✓ {{skill}}</span>}</div></section>
      <section>
        <div class="curriculum-head"><div><h2>Course curriculum</h2><p>{{c.sections.length}} sections · {{lessonCount()}} lessons · {{c.duration | duration}}</p></div>
          <button (click)="expanded.set(!expanded())">{{expanded() ? 'Collapse all' : 'Expand all'}}</button></div>
        <div class="curriculum">@for(section of c.sections;track section.id;let si=$index){
          <details [open]="expanded() || si===0"><summary><b>Section {{si+1}} · {{section.title}}</b><span>{{section.lessons.length}} lessons</span></summary>
            @for(lesson of section.lessons;track lesson.id;let li=$index){<div class="lesson"><i aria-hidden="true">{{done(lesson) ? '✓' : icon(lesson)}}</i><span>{{li+1}}. {{lesson.title}}</span><small>{{lesson.duration}} min</small></div>}
          </details>}</div>
      </section>
      <section><h2>Your instructor</h2><div class="instructor-card"><i aria-hidden="true">{{c.instructor[0]}}</i><div><h3>{{c.instructor}}</h3><p>Faculty · Troth Academy</p></div></div></section>
      @if(c.certificate){<section><h2>Assessment and Certification</h2><p>Complete the full tutorial series to unlock the course-wise assessment. Pass the test to earn a verifiable Troth Academy expert credential.</p></section>}
      @if(c.related.length){<section><h2>Related courses</h2><div class="course-grid">@for(r of c.related;track r.id){<app-course-card [course]="r"/>}</div></section>}
    </main>
    <aside class="course-facts"><span>THIS COURSE INCLUDES</span><p>◷ Flexible, self-paced learning</p><p>✓ Knowledge checks</p>@if(c.certificate){<p>◇ Verifiable certificate</p>}<hr><span>SKILLS YOU'LL GAIN</span><div class="skill-tags">@for(skill of c.skills;track skill){<b>{{skill}}</b>}</div></aside>
  </div>
</div>}
@else if(notFound()){<div class="page"><div class="empty"><b>Course not found</b><p>It may have been archived or is not available to you.</p><a class="primary" routerLink="/courses">Browse courses</a></div></div>}
@else {<div class="page"><div class="skeleton hero-sk"></div></div>}`
})
export class CourseDetailPage {
  private api = inject(ApiService);
  private router = inject(Router);
  course = signal<CourseDetail | null>(null);
  notFound = signal(false);
  busy = signal(false);
  error = signal('');
  expanded = signal(false);
  lessonCount = computed(() => this.course()?.sections.reduce((n, s) => n + s.lessons.length, 0) ?? 0);
  private completed = computed(() => new Set(this.course()?.lessonProgress.filter(p => p.status === 'COMPLETED').map(p => p.lessonId)));

  constructor() {
    this.api.course(inject(ActivatedRoute).snapshot.paramMap.get('slug')!).subscribe({ next: r => this.course.set(r.data), error: () => this.notFound.set(true) });
  }

  done(l: Lesson) { return this.completed().has(l.id); }
  icon(l: Lesson) { return l.type === 'video' ? '▷' : l.type === 'quiz' ? '?' : '▤'; }

  start() {
    const c = this.course(); if (!c) return;
    this.busy.set(true); this.error.set('');
    const go = () => this.router.navigate(['/learn', c.slug]);
    if (c.enrollment) { go(); return; }
    this.api.enroll(c.id).subscribe({ next: go, error: e => { this.busy.set(false); this.error.set(e.error?.message ?? 'Could not start this course'); } });
  }

  toggleSave() {
    const c = this.course(); if (!c) return;
    (c.saved ? this.api.unsave(c.id) : this.api.save(c.id)).subscribe(() => this.course.update(x => x && { ...x, saved: !c.saved }));
  }
}
