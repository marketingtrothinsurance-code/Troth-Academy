import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { Certificate, CourseDetail, Lesson, LessonProgress, Note } from '../../core/models';
import { SafeResourcePipe } from '../../shared/safe-resource.pipe';

const REPORT_EVERY_SECONDS = 5;
const SPEEDS = [1, 1.5, 2, 4];

@Component({
  selector: 'app-player',
  imports: [RouterLink, FormsModule, SafeResourcePipe],
  template: `
@if(course(); as c){ @if(lesson(); as l){
<div class="player">
  <div class="player-top">
    <a [routerLink]="['/courses', c.slug]" aria-label="Back to course">←</a>
    <div><b>{{c.title}}</b><span>{{progress()}}% complete</span></div>
    <div class="top-progress" role="progressbar" [attr.aria-valuenow]="progress()" aria-valuemin="0" aria-valuemax="100"><i [style.width.%]="progress()"></i></div>
    <button class="curr-toggle" (click)="curriculumOpen.set(!curriculumOpen())">Course content</button>
  </div>
  <div class="player-layout">
    <main>
      <div class="lesson-heading"><small>Courses / {{c.academy}} / {{c.title}}</small><h1>{{l.title}}</h1><p>{{c.instructor}} · {{c.category}}</p></div>
      @if(l.type==='video'){
        @if(l.videoId){
          <div class="video youtube-player"><iframe [src]="youtubeUrl() | safeResource" [title]="l.title + ' video'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
          <p class="hint">This sample lesson plays inside Troth Academy. After watching, use <b>Mark watched &amp; continue</b> to record your progress.</p>
        } @else if(l.videoUrl){
          <div class="video native"><video #v controls preload="metadata" [src]="l.videoUrl | safeResource" (loadedmetadata)="seek(v)" (timeupdate)="onTime(v.currentTime, v.duration)" (ended)="onTime(v.duration, v.duration)"></video></div>
        } @else {
          <div class="video">
            <div class="video-brand"><i>T</i><span>TROTH ACADEMY</span></div>
            <div class="video-copy"><small>{{c.academy}} ACADEMY</small><h1>{{l.title}}</h1><p>{{c.category}} · Lesson {{lessonIndex()+1}} · demo media</p></div>
            <button class="big-play" [attr.aria-label]="playing() ? 'Pause' : 'Play'" (click)="togglePlay()">{{playing() ? 'Ⅱ' : '▶'}}</button>
            <div class="controls">
              <span>{{format(position())}} / {{format(l.duration*60)}}</span>
              <div class="scrub" role="progressbar" [attr.aria-valuenow]="watchedPercent()" aria-valuemin="0" aria-valuemax="100"><i [style.width.%]="watchedPercent()"></i></div>
              <div><button (click)="cycleSpeed()" aria-label="Playback speed">{{speed()}}×</button></div>
            </div>
          </div>
          <p class="hint">No video file is attached to this lesson yet, so playback is simulated. The lesson completes once {{threshold}}% has been watched.</p>
        }
      } @else {
        <div class="video doc"><div class="video-copy"><small>{{l.type.toUpperCase()}}</small><h1>{{l.title}}</h1><p>{{c.category}} · {{l.duration}} min read</p></div></div>
      }
      <div class="lesson-nav">
        <button (click)="step(-1)" [disabled]="lessonIndex()===0">← Previous</button>
        <span>Lesson {{lessonIndex()+1}} of {{lessons().length}}</span>
        @if(l.type==='video' && l.videoId){<button class="primary" (click)="completeExternal()">{{isDone(l) ? 'Continue →' : 'Mark watched & continue →'}}</button>}
        @else if(l.type==='video'){<button class="primary" (click)="step(1)" [disabled]="lessonIndex()===lessons().length-1">Next →</button>}
        @else {<button class="primary" [disabled]="isDone(l) || saving()" (click)="markComplete()">{{isDone(l) ? '✓ Completed' : 'Mark as complete'}}</button>}
      </div>
      @if(c.certificate && progress()>=100){<div class="cert-banner" role="status">✓ Learning series complete. Your course assessment is now unlocked. <a routerLink="/assessments">Take assessment →</a></div>}
      @if(error()){<div class="error" role="alert">{{error()}} <button (click)="report()">Retry</button></div>}
      <div class="tabs lesson-tabs" role="tablist"><button role="tab" [class.active]="tab()==='overview'" (click)="tab.set('overview')">Tutorial</button><button role="tab" [class.active]="tab()==='notes'" (click)="tab.set('notes')">Notes ({{notes().length}})</button><button role="tab" [class.active]="tab()==='resources'" (click)="tab.set('resources')">Resources</button><button role="tab" [class.active]="tab()==='quiz'" (click)="tab.set('quiz')">Quiz</button></div>
      @if(tab()==='overview'){
        <article class="lesson-content tutorial-copy"><div><h2>About this tutorial</h2><p>{{c.shortDescription}}</p><p>{{l.type==='quiz' ? 'Practice knowledge check. The graded course assessment unlocks after the full tutorial series is complete.' : l.type==='sop' ? 'Read this operating procedure completely and mark it finished when you can apply every step.' : 'Watch the complete product video. Your genuine viewing progress is recorded automatically.'}}</p></div><aside class="player-instructor"><i>{{c.instructor[0]}}</i><div><small>ABOUT INSTRUCTOR</small><h3>{{c.instructor}}</h3><p>{{c.academy}} Academy product and domain trainer.</p></div></aside></article>
      } @else if(tab()==='notes') {
        <article class="lesson-content notes">
          <form (ngSubmit)="addNote()"><label for="note">Add a note{{l.type==='video' ? ' at ' + format(position()) : ''}}</label><textarea id="note" name="note" rows="3" maxlength="2000" [(ngModel)]="noteText" placeholder="What should you remember?"></textarea>
            <button class="primary" [disabled]="!noteText.trim()">Save note</button></form>
          @for(n of notes();track n.id){<div class="note"><p>{{n.text}}</p><small>@if(n.timestamp !== undefined){<span>{{format(n.timestamp)}} · </span>}{{n.createdAt.slice(0,10)}}</small><button (click)="removeNote(n)" aria-label="Delete note">Delete</button></div>}
          @empty {<p class="muted">No notes for this lesson yet.</p>}
        </article>
      } @else if(tab()==='resources') {
        <article class="lesson-content"><h2>Lesson resources</h2><div class="key"><b>{{c.title}} learning guide</b><p>Use the tutorial summary, product terminology and process notes while completing this lesson.</p></div></article>
      } @else {
        <article class="lesson-content"><h2>Course assessment</h2><p>Complete every tutorial and product video in this course. The graded quiz will then unlock in the Assessment tab.</p><a class="primary" routerLink="/assessments">Go to Assessment</a></article>
      }
    </main>
    <aside [class.collapsed]="!curriculumOpen()">
      <div class="curr-head"><div><span>COURSE CONTENT</span><b>{{progress()}}% complete</b></div><i><u [style.width.%]="progress()"></u></i></div>
      @for(section of c.sections;track section.id;let si=$index){
        <details open><summary><span>SECTION {{si+1}}</span><b>{{section.title}}</b></summary>
          @for(item of section.lessons;track item.id){<button class="lesson-row" [class.active]="item.id===l.id" (click)="select(item)"><i [class.done]="isDone(item)">{{isDone(item) ? '✓' : item.type==='video' ? '▷' : '▤'}}</i><span><b>{{globalIndex(item)+1}}. {{item.title}}</b><small>{{item.duration}} min · {{item.type}}</small></span></button>}
        </details>}
    </aside>
  </div>
</div>}}
@else if(failed()){<div class="page"><div class="empty"><b>This course could not be opened</b><p>It may not exist or you may not have access.</p><a class="primary" routerLink="/courses">Browse courses</a></div></div>}
@else {<div class="page"><div class="skeleton hero-sk"></div></div>}`
})
export class CoursePlayerPage implements OnDestroy {
  private api = inject(ApiService);
  readonly threshold = 80;
  readonly course = signal<CourseDetail | null>(null);
  readonly lesson = signal<Lesson | null>(null);
  readonly progress = signal(0);
  readonly failed = signal(false);
  readonly error = signal('');
  readonly saving = signal(false);
  readonly playing = signal(false);
  readonly position = signal(0);
  readonly speed = signal(1);
  readonly tab = signal<'overview' | 'notes' | 'resources' | 'quiz'>('overview');
  readonly notes = signal<Note[]>([]);
  readonly certificate = signal<Certificate | null>(null);
  readonly curriculumOpen = signal(true);
  private done = signal(new Set<string>());
  private positions = new Map<string, number>();
  private timer: ReturnType<typeof setInterval> | undefined;
  private lastReported = 0;
  noteText = '';

  readonly lessons = computed(() => this.course()?.sections.flatMap(s => s.lessons) ?? []);
  readonly lessonIndex = computed(() => this.lessons().findIndex(l => l.id === this.lesson()?.id));
  readonly watchedPercent = computed(() => { const l = this.lesson(); return l ? Math.min(100, Math.round(this.position() / (l.duration * 60) * 100)) : 0; });
  readonly youtubeUrl = computed(() => {
    const videoId = this.lesson()?.videoId ?? '';
    const playlist = this.course()?.slug === 'sales-fundamentals' ? '&list=PLNfnAKZ4ZsaoFxJvx4UZl6gYIh4fm8COG' : '';
    return `https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1${playlist}`;
  });

  constructor() {
    const slug = inject(ActivatedRoute).snapshot.paramMap.get('slug')!;
    this.api.course(slug).subscribe({
      next: r => {
        const c = r.data;
        // Opening the player enrols the learner, so progress can be recorded from the first lesson.
        const ready = () => {
          this.course.set(c);
          this.done.set(new Set(c.lessonProgress.filter(p => p.status === 'COMPLETED').map(p => p.lessonId)));
          c.lessonProgress.forEach((p: LessonProgress) => this.positions.set(p.lessonId, p.lastPosition));
          this.progress.set(c.enrollment?.progress ?? 0);
          const last = this.lessons().find(l => l.id === c.enrollment?.lastLessonId) ?? this.lessons()[0] ?? null;
          this.enter(last);
        };
        if (c.enrollment) ready(); else this.api.enroll(c.id).subscribe({ next: e => { c.enrollment = { ...e.data, course: c }; ready(); }, error: () => this.failed.set(true) });
      },
      error: () => this.failed.set(true)
    });
  }

  ngOnDestroy() { this.stopTimer(); this.report(); }

  isDone(l: Lesson) { return this.done().has(l.id); }
  globalIndex(l: Lesson) { return this.lessons().findIndex(x => x.id === l.id); }
  format(s: number) { const t = Math.max(0, Math.floor(s)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; }

  select(l: Lesson) { this.stopTimer(); this.report(); this.enter(l); }
  step(dir: number) { const next = this.lessons()[this.lessonIndex() + dir]; if (next) this.select(next); }

  private enter(l: Lesson | null) {
    this.lesson.set(l); this.playing.set(false); this.error.set('');
    this.position.set(l ? this.positions.get(l.id) ?? 0 : 0);
    this.lastReported = this.position();
    this.notes.set([]);
    const c = this.course();
    if (c && l) this.api.notes(c.id, l.id).subscribe(r => this.notes.set(r.data));
  }

  // Simulated media: only used when a lesson has no video file attached.
  togglePlay() {
    if (this.playing()) { this.stopTimer(); this.report(); return; }
    this.playing.set(true);
    this.timer = setInterval(() => { const l = this.lesson(); if (l) this.onTime(Math.min(l.duration * 60, this.position() + this.speed()), l.duration * 60); }, 1000);
  }
  cycleSpeed() { this.speed.set(SPEEDS[(SPEEDS.indexOf(this.speed()) + 1) % SPEEDS.length]!); }
  private stopTimer() { if (this.timer) clearInterval(this.timer); this.timer = undefined; this.playing.set(false); }

  seek(v: HTMLVideoElement) { v.currentTime = this.position(); }
  onTime(current: number, duration: number) {
    const l = this.lesson(); if (!l || !isFinite(duration) || duration <= 0) return;
    this.position.set(current); this.positions.set(l.id, current);
    const reachedEnd = current >= duration;
    if (current - this.lastReported >= REPORT_EVERY_SECONDS || reachedEnd || current / duration * 100 >= this.threshold && !this.isDone(l)) {
      this.report(duration);
    }
    if (reachedEnd) this.stopTimer();
  }

  /** Sends what has genuinely been watched; the server decides whether the lesson counts as complete. */
  report(durationOverride?: number, completed = false) {
    const c = this.course(), l = this.lesson();
    if (!c || !l || (this.position() <= 0 && !completed)) return;
    const duration = durationOverride ?? l.duration * 60;
    this.lastReported = this.position();
    this.saving.set(completed);
    this.api.progress(c.id, l.id, this.position(), duration, completed).subscribe({
      next: r => {
        this.saving.set(false); this.error.set('');
        this.progress.set(r.data.progress);
        if (r.data.lessonStatus === 'COMPLETED') this.done.update(s => new Set(s).add(l.id));
        if (r.data.certificate) this.certificate.set(r.data.certificate);
      },
      error: () => { this.saving.set(false); this.error.set('Progress could not be saved.'); }
    });
  }

  markComplete() { const l = this.lesson(); if (!l) return; this.position.set(l.duration * 60); this.report(undefined, true); }
  completeExternal() {
    const l = this.lesson(); if (!l) return;
    if (this.isDone(l)) { this.step(1); return; }
    this.position.set(l.duration * 60);
    this.report(undefined, true);
    if (this.lessonIndex() < this.lessons().length - 1) this.step(1);
  }

  addNote() {
    const c = this.course(), l = this.lesson(), text = this.noteText.trim();
    if (!c || !l || !text) return;
    this.api.addNote(c.id, l.id, text, l.type === 'video' ? Math.floor(this.position()) : undefined).subscribe(r => { this.notes.update(n => [r.data, ...n]); this.noteText = ''; });
  }
  removeNote(n: Note) { this.api.deleteNote(n.id).subscribe(() => this.notes.update(list => list.filter(x => x.id !== n.id))); }
}
