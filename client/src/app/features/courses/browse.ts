import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ApiService } from '../../core/api.service';
import type { Course } from '../../core/models';
import { CourseCard } from '../../shared/course-card';

interface Filters {
  search: string; academy: string; difficulty: string; duration: string; language: string; certificate: boolean;
  required: string; completion: string; sort: string; page: number;
}
const DEFAULTS: Filters = { search: '', academy: '', difficulty: '', duration: '', language: '', certificate: false, required: '', completion: '', sort: 'recommended', page: 1 };

@Component({
  selector: 'app-browse',
  imports: [FormsModule, CourseCard],
  template: `
<div class="page browse">
  <div class="page-head"><span class="eyebrow">{{mandatory ? 'REQUIRED FOR YOUR ROLE' : 'DISCOVER YOUR NEXT SKILL'}}</span><h1>{{mandatory ? 'Mandatory lesson' : 'Browse courses'}}</h1><p>{{mandatory ? 'Complete the required learning assigned to your role.' : 'Explore expert-led learning designed for every stage of your Troth journey.'}}</p></div>
  @if(!mandatory){
    <div class="browse-tools">
      <div class="search-box"><span aria-hidden="true">⌕</span><input [ngModel]="f().search" (ngModelChange)="typed($event)" aria-label="Search courses" placeholder="Search by course, lesson, skill or instructor"></div>
      <select [ngModel]="f().sort" (ngModelChange)="set({sort:$event})" aria-label="Sort courses">
        <option value="recommended">Recommended</option><option value="popular">Most popular</option><option value="newest">Newest</option>
        <option value="az">A–Z</option><option value="shortest">Shortest</option><option value="longest">Longest</option>
      </select>
    </div>
    <div class="chips">@for(a of academyOptions;track a){<button [class.active]="f().academy===a" (click)="set({academy:a})">{{a||'All courses'}}</button>}</div>
  }
  <div class="browse-layout">
    <section class="results">
      <div class="result-count"><span><b>{{total()}}</b> courses available</span></div>
      @if(loading()){<div class="course-grid">@for(i of [1,2,3,4,5,6];track i){<div class="skeleton card-sk"></div>}</div>}
      @else if(failed()){<div class="empty"><b>Courses could not be loaded</b><p>Please check your connection.</p><button class="secondary" (click)="load()">Retry</button></div>}
      @else if(courses().length){<div class="course-grid">@for(c of courses();track c.id){<app-course-card [course]="c" (toggleSave)="toggleSave($event)"/>}</div>
      }
      @else {<div class="empty"><b>No courses found</b><p>Try removing a filter or searching for a different skill.</p><button class="secondary" (click)="clear()">Clear filters</button></div>}
    </section>
  </div>
</div>`
})
export class BrowsePage {
  private api = inject(ApiService);
  courses = signal<Course[]>([]);
  total = signal(0);
  loading = signal(true);
  failed = signal(false);
  f = signal<Filters>({ ...DEFAULTS });
  academyOptions = ['', 'Foundation', 'Insurance', 'Finance', 'Wealth', 'Sales', 'Operations', 'Troth One', 'Compliance'];
  private terms = new Subject<string>();
  readonly mandatory: boolean;

  constructor() {
    const route = inject(ActivatedRoute);
    this.mandatory = route.routeConfig?.path === 'mandatory-courses';
    route.queryParamMap.subscribe(q => { this.f.set({ ...DEFAULTS, required: this.mandatory ? 'true' : '', search: q.get('search') ?? '', academy: q.get('academy') ?? '' }); this.load(); });
    this.terms.pipe(debounceTime(300), distinctUntilChanged()).subscribe(search => this.set({ search }));
  }

  typed(v: string) { this.terms.next(v); }
  set(patch: Partial<Filters>) { this.f.update(f => ({ ...f, ...patch, page: 1 })); this.load(); }
  clear() { this.f.set({ ...DEFAULTS, required: this.mandatory ? 'true' : '' }); this.load(); }

  load() {
    const f = this.f();
    this.loading.set(true); this.failed.set(false);
    this.api.courses({ ...f, certificate: f.certificate ? 'true' : '', limit: 500 }).subscribe({
      next: r => { this.courses.set(r.data.items); this.total.set(r.data.pagination.total); this.loading.set(false); },
      error: () => { this.failed.set(true); this.loading.set(false); }
    });
  }

  toggleSave(c: Course) {
    (c.saved ? this.api.unsave(c.id) : this.api.save(c.id)).subscribe(() => this.courses.update(list => list.map(x => x.id === c.id ? { ...x, saved: !c.saved } : x)));
  }
}
