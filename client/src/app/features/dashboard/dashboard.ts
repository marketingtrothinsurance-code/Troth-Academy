import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { Course, DashboardData } from '../../core/models';
import { CourseCard } from '../../shared/course-card';
import { DurationPipe } from '../../shared/duration.pipe';
import { IconComponent } from '../../shared/icon';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CourseCard, DatePipe, UpperCasePipe, DurationPipe, IconComponent],
  template: `
<div class="page dashboard">
  @if(loading()){<div class="skeleton hero-sk"></div><div class="grid skeleton-grid"><i></i><i></i><i></i><i></i></div>}
  @else if(error()){<div class="empty"><b>We couldn't load your dashboard</b><p>Check your connection and try again.</p><button class="primary" (click)="load()">Retry</button></div>}
  @else if(data(); as d){
  <section class="welcome">
    <div><span class="eyebrow">{{today | date:'EEEE, d MMMM' | uppercase}}</span><h1>Welcome back, {{d.user.firstName}}</h1><p>Keep learning and building your expertise.</p></div>
    <div class="streak"><app-icon name="flame" [size]="26"/><div><b>{{d.stats.streak}} day streak</b><small>{{d.user.level}} · {{d.user.points.toLocaleString()}} pts</small></div></div>
  </section>
  <section class="stats" aria-label="Learning summary">
    <article><i><app-icon name="play" [size]="22"/></i><div><b>{{d.stats.inProgress}}</b><span>In progress</span></div></article>
    <article><i><app-icon name="check" [size]="22"/></i><div><b>{{d.stats.completed}}</b><span>Courses completed</span></div></article>
    <article><i><app-icon name="award" [size]="22"/></i><div><b>{{d.stats.certificates}}</b><span>Certificates earned</span></div></article>
    <article><i><app-icon name="clock" [size]="22"/></i><div><b>{{d.stats.hours}}h</b><span>Learning time</span></div></article>
  </section>
  <div class="dashboard-columns">
    <div>
      <section class="section-block">
        <div class="section-heading"><div><span class="eyebrow">PICK UP WHERE YOU LEFT OFF</span><h2>Continue learning</h2></div><a routerLink="/my-learning">View all →</a></div>
        @if(d.continueLearning.length){<div class="continue-list">@for(item of d.continueLearning.slice(0,2);track item.courseId){
          <article>
            <div class="mini-thumb" [style.--course-color]="item.course.color"><span>{{item.course.academy[0]}}</span></div>
            <div class="continue-info"><small>{{item.course.academy}} ACADEMY</small><h3>{{item.course.title}}</h3>
              <span>{{item.course.duration * (100 - item.progress) / 100 | duration}} remaining</span>
              <div class="progress" role="progressbar" [attr.aria-valuenow]="item.progress" aria-valuemin="0" aria-valuemax="100"><i [style.width.%]="item.progress"></i></div>
              <b>{{item.progress}}% complete</b></div>
            <a class="play" [routerLink]="['/learn',item.course.slug]" [attr.aria-label]="'Continue ' + item.course.title"><app-icon name="play" [size]="20"/></a>
          </article>}</div>}
        @else {<div class="empty"><b>Nothing in progress</b><p>Start a course to see it here.</p><a class="primary" routerLink="/courses">Browse courses</a></div>}
      </section>
      <section class="section-block">
        <div class="section-heading"><div><span class="eyebrow">CURATED FOR YOUR ROLE</span><h2>Recommended for you</h2></div><a routerLink="/courses">Browse all →</a></div>
        <div class="course-grid">@for(course of recommended();track course.id){<app-course-card [course]="course" (toggleSave)="toggleSave($event)"/>}</div>
      </section>
    </div>
    <aside class="right-rail">
      <section class="overview">
        <h3>Progress overview</h3>
        <div class="ring" role="img" [attr.aria-label]="ring(d) + ' percent of your started courses are complete'" [style.--pct]="ring(d)"><div><b>{{ring(d)}}%</b><small>complete</small></div></div>
        <ul class="legend"><li><i class="dot done"></i>{{d.stats.completed}} completed</li><li><i class="dot"></i>{{d.stats.inProgress}} in progress</li><li><i class="dot cert"></i>{{d.stats.certificates}} certificates</li></ul>
      </section>
    </aside>
  </div>}
</div>`
})
export class DashboardPage {
  private api = inject(ApiService);
  data = signal<DashboardData | null>(null);
  recommended = signal<Course[]>([]);
  loading = signal(true);
  error = signal(false);
  today = new Date();
  ring(d: DashboardData) { const total = d.stats.completed + d.stats.inProgress; return total ? Math.round(d.stats.completed / total * 100) : 0; }

  constructor() { this.load(); }

  load() {
    this.loading.set(true); this.error.set(false);
    this.api.dashboard().subscribe({
      next: r => { this.data.set(r.data); this.recommended.set(r.data.recommended.slice(0, 3)); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }

  toggleSave(c: Course) {
    (c.saved ? this.api.unsave(c.id) : this.api.save(c.id)).subscribe(() =>
      this.recommended.update(list => list.map(x => x.id === c.id ? { ...x, saved: !c.saved } : x)));
  }
}
