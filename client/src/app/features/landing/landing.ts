import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ApiResponse } from '../../core/models';
import { DurationPipe } from '../../shared/duration.pipe';
import { IconComponent } from '../../shared/icon';

interface Featured { id: string; slug: string; title: string; shortDescription: string; academy: string; category: string; instructor: string; difficulty: string; duration: number; certificate: boolean; required: boolean; lessons: number }
interface Overview { totals: { courses: number; academies: number; lessons: number }; featured: Featured[] }

/** Public front door. Numbers and courses come from the API, not from copy written into the page. */
@Component({
  selector: 'app-landing',
  imports: [RouterLink, IconComponent, DurationPipe],
  template: `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-nav">
  <div class="site-nav-inner">
    <a routerLink="/" class="site-logo" aria-label="Troth One Academy home"><img src="troth-one-logo.png" alt="Troth One"><span>Academy</span></a>
    <button class="nav-toggle" type="button" [attr.aria-expanded]="menu()" aria-controls="site-links" aria-label="Toggle menu" (click)="menu.set(!menu())"><app-icon name="menu" [size]="24"/></button>
    <nav id="site-links" aria-label="Main" [class.open]="menu()">
      <a routerLink="/" fragment="courses" (click)="menu.set(false)">Courses</a>
      <a routerLink="/" fragment="resources" (click)="menu.set(false)">Resources</a>
      <a routerLink="/" fragment="about" (click)="menu.set(false)">About</a>
      <a routerLink="/" fragment="contact" (click)="menu.set(false)">Contact</a>
      <a routerLink="/login" class="btn btn-solid">Sign in</a>
    </nav>
  </div>
</header>

<main id="main" class="site">
  <section class="hero">
    <div class="hero-copy">
      <span class="hero-eyebrow">Troth One Academy</span>
      <h1>Learn. Practice. Certify. <em>Grow.</em></h1>
      <p>One learning destination for every Troth employee, franchise partner and channel partner. Structured courses, real assessments and certificates you can verify.</p>
      <div class="hero-cta">
        <a routerLink="/login" class="btn btn-solid btn-lg">Start learning <app-icon name="arrow" [size]="18"/></a>
        <a routerLink="/" fragment="courses" class="btn btn-ghost btn-lg">Explore courses</a>
      </div>
      @if(overview(); as o){<dl class="hero-stats"><div><dt>Courses</dt><dd>{{o.totals.courses}}</dd></div><div><dt>Academies</dt><dd>{{o.totals.academies}}</dd></div><div><dt>Lessons</dt><dd>{{o.totals.lessons}}</dd></div></dl>}
    </div>
    <div class="hero-panel" aria-hidden="true">
      <div class="journey">
        @for(step of steps;track step.label;let i=$index){<div class="journey-step"><span class="journey-icon"><app-icon [name]="step.icon" [size]="22"/></span><b>{{step.label}}</b><small>{{step.text}}</small></div>}
      </div>
    </div>
  </section>

  <section id="courses" class="block">
    <div class="block-head"><span class="eyebrow">Course catalogue</span><h2>Popular across Troth</h2><p>A selection from the catalogue. Sign in to see everything assigned to your role.</p></div>
    @if(loading()){<div class="feature-grid">@for(i of [1,2,3];track i){<div class="skeleton card-sk"></div>}</div>}
    @else if(failed()){<div class="empty"><b>Courses could not be loaded</b><button class="secondary" (click)="load()">Try again</button></div>}
    @else {<div class="feature-grid">@for(c of overview()?.featured;track c.id){
      <a class="feature-card" routerLink="/login" [attr.aria-label]="c.title + ', sign in to view'">
        <div class="feature-thumb"><span class="chip">{{c.academy}}</span>@if(c.required){<span class="chip chip-solid">Required</span>}<app-icon name="book" [size]="44"/></div>
        <div class="feature-body"><small>{{c.category}} · {{c.difficulty}}</small><h3>{{c.title}}</h3>
          <div class="feature-meta"><span><app-icon name="clock" [size]="15"/> {{c.duration | duration}}</span><span><app-icon name="play" [size]="15"/> {{c.lessons}} lessons</span>@if(c.certificate){<span><app-icon name="award" [size]="15"/> Assessment & certificate</span>}</div></div>
      </a>}</div>}
  </section>

  <section id="resources" class="block alt">
    <div class="block-head"><span class="eyebrow">Resources</span><h2>Everything a learner needs, in one place</h2></div>
    <div class="tile-grid">@for(t of resources;track t.title){<article class="tile"><span class="tile-icon"><app-icon [name]="t.icon" [size]="24"/></span><h3>{{t.title}}</h3><p>{{t.text}}</p></article>}</div>
  </section>

  <section id="about" class="block about">
    <div><span class="eyebrow">About</span><h2>Built for Troth's people and partners</h2></div>
    <div><p>Troth Academy brings onboarding, product knowledge, sales skills, operations and compliance training together for Troth Group employees, Troth One franchise partners, relationship managers, agents and channel partners.</p>
      <p>Progress is recorded from what learners actually complete, so managers and franchise owners can trust the numbers they see.</p></div>
  </section>

  <section id="contact" class="block contact">
    <div class="contact-card"><h2>Need help getting started?</h2><p>Ask your Academy administrator or your manager to set up your account, or sign in if you already have one.</p>
      <a routerLink="/login" class="btn btn-solid btn-lg">Sign in to Academy</a></div>
  </section>
</main>

<footer class="site-footer"><img src="troth-one-logo.png" alt="Troth One"><small>Learn. Practice. Certify. Grow.</small></footer>`
})
export class LandingPage {
  private http = inject(HttpClient);
  overview = signal<Overview | null>(null);
  loading = signal(true);
  failed = signal(false);
  menu = signal(false);

  steps = [
    { label: 'Learn', icon: 'book', text: 'Structured video and SOP courses' },
    { label: 'Practice', icon: 'target', text: 'Knowledge checks after each topic' },
    { label: 'Assess & certify', icon: 'award', text: 'Course tests and verifiable certificates' },
    { label: 'Grow', icon: 'trend', text: 'Track progress and levels' }
  ];
  resources = [
    { icon: 'layers', title: 'Product academies', text: 'Insurance, finance, wealth and research schools, each with its own learning tracks.' },
    { icon: 'file', title: 'SOPs and checklists', text: 'Operations courses pair video with step-by-step procedures you can follow on the job.' },
    { icon: 'award', title: 'Assessment and Certification', text: 'Complete the course, pass its assessment, and earn a certificate with an ID anyone can verify.' },
    { icon: 'users', title: 'Team visibility', text: 'Managers and franchise owners see completion for their own people only.' },
    { icon: 'shield', title: 'Compliance ready', text: 'Required training carries due dates, and an audit log records key actions.' },
    { icon: 'trend', title: 'Progress you can trust', text: 'Lessons count as complete only after they have really been watched or read.' }
  ];

  constructor() { this.load(); }
  load() {
    this.loading.set(true); this.failed.set(false);
    this.http.get<ApiResponse<Overview>>('/api/v1/public/overview').subscribe({
      next: r => { this.overview.set(r.data); this.loading.set(false); },
      error: () => { this.failed.set(true); this.loading.set(false); }
    });
  }
}
