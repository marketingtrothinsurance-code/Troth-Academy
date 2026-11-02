import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Course } from '../core/models';
import { DurationPipe } from './duration.pipe';

@Component({
  selector: 'app-course-card',
  imports: [RouterLink, DurationPipe],
  template: `
<article class="course-card">
  <a class="thumb" [routerLink]="['/courses', course().slug]" [style.--course-color]="course().color" [attr.aria-label]="course().title">
    @if(course().thumbnail){<img class="course-thumb-image" [class.course-thumb-contain]="course().slug === 'swp-tutorial'" [src]="course().thumbnail" [alt]="course().title" loading="lazy" decoding="async" fetchpriority="low" draggable="false">}
    @else {<span class="mark">{{course().academy[0]}}</span><div><small>{{course().academy}} ACADEMY</small><strong>{{course().category}}</strong></div>}
    @if(course().required){<em>Required</em>}@else if(course().isNew){<em class="new">New</em>}
  </a>
  <div class="body">
    <span class="meta">{{course().academy}} · {{course().duration | duration}} · {{lessonCount()}} lessons</span>
    <a class="title" [routerLink]="['/courses', course().slug]">{{course().title}}</a>
    <small>{{course().instructor}}</small>
    @if(course().enrollmentStatus){<div class="progress" role="progressbar" [attr.aria-valuenow]="course().progress" aria-valuemin="0" aria-valuemax="100"><i [style.width.%]="course().progress"></i></div>}
    <footer>
      <b>★ {{course().rating}}</b><span>{{course().difficulty}}</span>@if(course().certificate){<span>◇ Assessment & certificate</span>}
      <button type="button" class="save" [attr.aria-pressed]="course().saved" [attr.aria-label]="course().saved ? 'Remove from saved' : 'Save course'" (click)="toggleSave.emit(course())">{{course().saved ? '♥' : '♡'}}</button>
    </footer>
    <a class="card-cta" [routerLink]="course().enrollmentStatus ? ['/learn', course().slug] : ['/courses', course().slug]">{{cta()}}</a>
  </div>
</article>`
})
export class CourseCard {
  course = input.required<Course>();
  toggleSave = output<Course>();
  lessonCount = () => this.course().sections.reduce((n, s) => n + s.lessons.length, 0);
  cta = () => { const c = this.course(); return c.enrollmentStatus === 'COMPLETED' ? 'Review Course' : c.enrollmentStatus ? 'Continue Course' : 'Start Course'; };
}
