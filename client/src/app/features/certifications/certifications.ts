import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import type { Assessment, AssessmentResult, AssessmentSummary, Certificate } from '../../core/models';

@Component({
  selector: 'app-certifications',
  imports: [RouterLink, DatePipe],
  template: `
<div class="page" [class.assessment-view]="isAssessment" [class.certification-view]="!isAssessment" [class.quiz-active]="!!activeAssessment()">
  <div class="page-head"><span class="eyebrow">{{isAssessment ? 'COURSE-WISE TESTS' : 'PROOF OF EXPERTISE'}}</span><h1>{{isAssessment ? 'Assessment' : 'Certification'}}</h1><p>{{isAssessment ? 'Complete each learning series and take its course quiz.' : 'View, print and verify the expert credentials you have earned.'}}</p></div>
  @if(loading()){<div class="skeleton hero-sk"></div>}
  @else if(failed()){<div class="empty"><b>Assessment information could not be loaded</b><button class="secondary" (click)="load()">Retry</button></div>}
  @else {
    <section class="assessment-program">
      <div class="section-heading"><div><span class="eyebrow">COURSE-WISE TESTS</span><h2>Your assessments</h2></div><p>Passing score: 70%. Complete the full tutorial series to unlock each test.</p></div>
      @if(assessments().length===0){<div class="empty"><b>No certification courses started</b><p>Enroll in a certificate course to begin its learning and assessment path.</p><a class="primary" routerLink="/courses">Browse courses</a></div>}
      @else {<div class="assessment-list">@for(a of assessments();track a.course.id){
        <article class="assessment-card" [class.passed]="a.certificate">
          <h3>{{a.course.title}}</h3>
          @if(a.eligible){<button class="primary" (click)="openAssessment(a.course.id)">Start quiz</button>}
          @else {<a class="secondary" [routerLink]="['/learn',a.course.slug]">Start course</a>}
        </article>}
      </div>}
    </section>

    @if(activeAssessment(); as test){<section class="quiz-page">
      <div class="quiz-progress" aria-label="Quiz progress">@for(q of test.questions;track q.id;let i=$index){<i [class.done]="i<=questionIndex()"></i>}</div>
      <header><button class="quiz-back" [disabled]="questionIndex()===0" (click)="previousQuestion()">← Previous</button><button class="quiz-close" (click)="closeAssessment()">Close ×</button></header>
      @if(result(); as r){<div class="quiz-result assessment-result" [class.passed]="r.passed"><b>{{r.passed ? 'Assessment passed' : 'Assessment not passed'}}</b><span>Your score: {{r.score}}% · Required: {{r.passingScore}}%</span><p>{{r.passed ? 'Your expert credential has been issued.' : 'Review the complete tutorial and product video series before retaking the quiz.'}}</p><button class="primary" (click)="closeAssessment()">Finish</button></div>}
      @else {@if(test.questions[questionIndex()]; as q){<div class="quiz-question">
        <span>QUESTION {{questionIndex()+1}} / {{test.questions.length}}</span><small>{{test.title}}</small><h2>{{q.prompt}}</h2>
        <div class="quiz-options">@for(option of q.options;track option;let oi=$index){<label [class.selected]="answers()[questionIndex()]===oi"><input type="radio" [name]="q.id" [checked]="answers()[questionIndex()]===oi" (change)="answer(questionIndex(),oi)"><i></i>{{option}}</label>}</div>
        @if(questionIndex()<test.questions.length-1){<button class="primary quiz-next" [disabled]="answers()[questionIndex()]<0" (click)="nextQuestion()">Next Question <span>→</span></button>}
        @else {<button class="primary quiz-next" [disabled]="!ready() || submitting()" (click)="submit()">{{submitting() ? 'Submitting…' : 'Submit Assessment'}} <span>→</span></button>}
      </div>}}
    </section>}

    @if(certificates().length===0){<div class="empty certificate-empty"><b>No certificates earned yet</b><p>Complete a learning series and pass its assessment to earn your first credential.</p></div>}
    @else {
      <div class="cert-summary"><article><b>{{certificates().length}}</b><span>Certificates earned</span></article><article><b>{{active()}}</b><span>Active</span></article></div>
      <div class="certificate-grid">@if(selected(); as c){
        <article class="certificate" id="certificate-print"><div class="cert-border">
          <img class="cert-logo" src="troth-one-logo.png" alt="Troth One Academy">
          <span>ASSESSMENT AND CERTIFICATION</span><p>This certifies that</p><h2>{{name()}}</h2><p>has completed the learning series and passed the assessment for</p><h3>{{c.title}}</h3>
          <footer><div><b>{{c.id}}</b><small>Certificate ID</small></div><div><b>{{c.assessmentScore ?? 100}}%</b><small>Assessment score</small></div><div><b>{{c.issuedAt | date:'d MMMM y'}}</b><small>Issue date</small></div><div><b>{{c.expiresAt ? (c.expiresAt | date:'d MMMM y') : 'No expiry'}}</b><small>Valid until</small></div></footer>
        </div></article>
        <aside class="cert-actions"><span class="complete-badge">{{c.expired ? 'Expired' : '✓ Active credential'}}</span><h2>{{c.title}}</h2><p>Level: {{c.level}} · Assessment score: {{c.assessmentScore ?? 100}}%. Anyone can verify this credential using its ID.</p><button class="primary" (click)="print()">Print / save as PDF</button><a class="secondary" [routerLink]="['/verify', c.id]">Verify credential</a></aside>
      }</div>
      @if(certificates().length>1){<div class="cert-list">@for(c of certificates();track c.id){<button [class.active]="c.id===selected()?.id" (click)="selectedId.set(c.id)">{{c.title}}</button>}</div>}
    }
  }
</div>`
})
export class CertificationsPage {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly isAssessment = this.router.url.startsWith('/assessments');
  certificates = signal<Certificate[]>([]);
  assessments = signal<AssessmentSummary[]>([]);
  activeAssessment = signal<Assessment | null>(null);
  questionIndex = signal(0);
  answers = signal<number[]>([]);
  result = signal<AssessmentResult | null>(null);
  submitting = signal(false);
  selectedId = signal('');
  loading = signal(true);
  failed = signal(false);
  selected = computed(() => this.certificates().find(c => c.id === this.selectedId()) ?? this.certificates()[0]);
  active = computed(() => this.certificates().filter(c => !c.expired).length);
  ready = computed(() => !!this.activeAssessment() && this.answers().length === this.activeAssessment()!.questions.length && this.answers().every(a => a >= 0));
  name = computed(() => `${this.auth.user()?.firstName ?? ''} ${this.auth.user()?.lastName ?? ''}`.trim());

  constructor() { this.load(); }
  load() {
    this.loading.set(true); this.failed.set(false);
    this.api.assessments().subscribe({ next: a => { this.assessments.set(a.data); this.api.certificates().subscribe({ next: r => { this.certificates.set(r.data); this.loading.set(false); }, error: () => { this.failed.set(true); this.loading.set(false); } }); }, error: () => { this.failed.set(true); this.loading.set(false); } });
  }
  openAssessment(courseId: string) { this.result.set(null); this.questionIndex.set(0); this.api.assessment(courseId).subscribe(r => { this.activeAssessment.set(r.data); this.answers.set(Array(r.data.questions.length).fill(-1)); }); }
  closeAssessment() { this.activeAssessment.set(null); this.result.set(null); this.questionIndex.set(0); }
  answer(question: number, option: number) { this.answers.update(a => a.map((v, i) => i === question ? option : v)); }
  previousQuestion() { this.questionIndex.update(i => Math.max(0, i - 1)); }
  nextQuestion() { const test = this.activeAssessment(); if (test && this.answers()[this.questionIndex()] >= 0) this.questionIndex.update(i => Math.min(test.questions.length - 1, i + 1)); }
  submit() { const test = this.activeAssessment(); if (!test || !this.ready()) return; this.submitting.set(true); this.api.submitAssessment(test.courseId, this.answers()).subscribe({ next: r => { this.result.set(r.data); this.submitting.set(false); this.load(); }, error: () => this.submitting.set(false) }); }
  print() { window.print(); }
}
