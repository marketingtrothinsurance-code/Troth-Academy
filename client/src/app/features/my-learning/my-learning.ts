import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import type { Certificate, Course, Enrollment } from '../../core/models';

type Tab = 'In Progress' | 'Assigned' | 'Saved' | 'Completed' | 'Assessment and Certification';

@Component({
  selector: 'app-my-learning',
  imports: [RouterLink, FormsModule, DatePipe],
  template: `
<div class="page learning-page">
  <div class="page-head"><span class="eyebrow">YOUR LEARNING SPACE</span><h1>My learning</h1><p>Everything you're learning, all in one place.</p></div>
  <div class="tabs learning-tabs" role="tablist">@for(t of tabs;track t){<button role="tab" [attr.aria-selected]="tab()===t" [class.active]="tab()===t" (click)="tab.set(t)">{{t}} <span>{{count(t)}}</span></button>}</div>
  @if(loading()){<div class="skeleton hero-sk"></div>}
  @else if(failed()){<div class="empty"><b>Your learning could not be loaded</b><button class="secondary" (click)="load()">Retry</button></div>}
  @else {
  @if(tab()!=='Assessment and Certification' && tab()!=='Saved'){
    <div class="learning-toolbar"><div><span aria-hidden="true">⌕</span> <input [ngModel]="term()" (ngModelChange)="term.set($event)" aria-label="Search your learning" placeholder="Search your learning"></div></div>
  }
  @if(tab()==='Assessment and Certification'){
    @if(certificates().length){<div class="learning-list">@for(c of certificates();track c.id){<article><div class="learning-info"><small>{{c.level}}</small><h2>{{c.title}}</h2><p>Issued {{c.issuedAt | date:'d MMM y'}} · ID {{c.id}}</p></div><div class="learning-action"><a class="secondary" [routerLink]="['/certifications']">View assessment & certificate</a></div></article>}</div>}
    @else {<div class="empty"><b>No certificates yet</b><p>Complete every course lesson and pass its assessment to earn your first credential.</p><a class="primary" routerLink="/courses">Browse courses</a></div>}
  } @else if(tab()==='Saved'){
    @if(saved().length){<div class="learning-list">@for(c of saved();track c.id){<article><div class="mini-thumb" [style.--course-color]="c.color"><span>{{c.academy[0]}}</span></div><div class="learning-info"><small>{{c.academy}} · {{c.category}}</small><h2>{{c.title}}</h2></div><div class="learning-action"><a class="primary" [routerLink]="['/courses',c.slug]">Start later →</a><button (click)="unsave(c)">Remove</button></div></article>}</div>}
    @else {<div class="empty"><b>No saved courses</b><p>Tap the heart on any course to save it for later.</p><a class="primary" routerLink="/courses">Browse courses</a></div>}
  } @else {
    @if(filtered().length){<div class="learning-list">@for(item of filtered();track item.courseId){
      <article>
        <div class="mini-thumb" [style.--course-color]="item.course.color"><span>{{item.course.academy[0]}}</span><small>{{item.course.academy}}</small></div>
        <div class="learning-info"><small>{{item.course.academy}} · {{item.course.category}}</small><h2>{{item.course.title}}</h2>
          <div class="progress" role="progressbar" [attr.aria-valuenow]="item.progress" aria-valuemin="0" aria-valuemax="100"><i [style.width.%]="item.progress"></i></div>
          <div class="progress-label"><b>{{item.progress}}% complete</b><span>{{item.status==='COMPLETED' ? 'Completed' : item.dueDate ? 'Due ' + (item.dueDate | date:'d MMM y') : 'Last accessed ' + (item.updatedAt | date:'d MMM')}}</span></div></div>
        <div class="learning-action">@if(item.status==='COMPLETED'){<span class="complete-badge">✓ Completed</span><a class="secondary" [routerLink]="['/courses',item.course.slug]">View course</a>}@else{<a class="primary" [routerLink]="['/learn',item.course.slug]">Continue →</a>}</div>
      </article>}</div>}
    @else {<div class="empty"><b>Nothing here yet</b><p>Courses matching this view will appear here.</p><a class="primary" routerLink="/courses">Browse courses</a></div>}
  }}
</div>`
})
export class MyLearningPage {
  private api = inject(ApiService);
  items = signal<Enrollment[]>([]);
  saved = signal<Course[]>([]);
  certificates = signal<Certificate[]>([]);
  loading = signal(true);
  failed = signal(false);
  tab = signal<Tab>('In Progress');
  term = signal('');
  tabs: Tab[] = ['In Progress', 'Assigned', 'Saved', 'Completed', 'Assessment and Certification'];

  private inProgress = computed(() => this.items().filter(i => i.status === 'IN_PROGRESS'));
  // "Assigned" are courses someone else put on the learner's plate; self-enrolled courses are just in progress.
  private assigned = computed(() => this.inProgress().filter(i => i.enrollmentType !== 'SELF'));
  private completed = computed(() => this.items().filter(i => i.status === 'COMPLETED'));
  filtered = computed(() => {
    const list = this.tab() === 'Completed' ? this.completed() : this.tab() === 'Assigned' ? this.assigned() : this.inProgress();
    const t = this.term().trim().toLowerCase();
    return t ? list.filter(i => `${i.course.title} ${i.course.category} ${i.course.instructor}`.toLowerCase().includes(t)) : list;
  });

  constructor() { this.load(); }

  load() {
    this.loading.set(true); this.failed.set(false);
    forkJoin({ learning: this.api.learning(), saved: this.api.saved(), certs: this.api.certificates() }).subscribe({
      next: r => { this.items.set(r.learning.data); this.saved.set(r.saved.data); this.certificates.set(r.certs.data); this.loading.set(false); },
      error: () => { this.failed.set(true); this.loading.set(false); }
    });
  }

  count(t: Tab) {
    return { 'In Progress': this.inProgress().length, Assigned: this.assigned().length, Saved: this.saved().length, Completed: this.completed().length, 'Assessment and Certification': this.certificates().length }[t];
  }
  unsave(c: Course) { this.api.unsave(c.id).subscribe(() => this.saved.update(l => l.filter(x => x.id !== c.id))); }
}
