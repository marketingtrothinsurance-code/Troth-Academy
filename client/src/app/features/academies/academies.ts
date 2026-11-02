import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { AcademySummary } from '../../core/models';

const META: Record<string, { label: string; description: string; icon: string; color: string }> = {
  Foundation: { label: 'START HERE', description: 'Vision, mission, businesses and how the Troth ecosystem fits together.', icon: '◆', color: '#0b2240' },
  Insurance: { label: 'TROTH SCHOOL OF', description: 'Build product expertise across motor, health, life, commercial and claims.', icon: '✦', color: '#215a78' },
  Finance: { label: 'TROTH SCHOOL OF', description: 'Master lending products, eligibility and responsible customer recommendations.', icon: '₹', color: '#175cd3' },
  Wealth: { label: 'TROTH SCHOOL OF', description: 'Mutual funds, planning, risk profiling and product suitability.', icon: '◈', color: '#6941c6' },
  Sales: { label: 'EXCELLENCE IN', description: 'Connect, understand needs, recommend confidently and close with integrity.', icon: '↗', color: '#b54708' },
  Operations: { label: 'PROCESS & SERVICE', description: 'SOPs, checklists and workflows for consistent customer outcomes.', icon: '⚙', color: '#027a48' },
  'Troth One': { label: 'FRANCHISE SUCCESS', description: 'From franchise starter to operator, sales professional and business leader.', icon: 'T', color: '#0b4a6f' },
  Compliance: { label: 'TRUST & GOVERNANCE', description: 'Ethics, regulation, privacy and responsible conduct.', icon: '✓', color: '#475467' }
};

@Component({
  selector: 'app-academies',
  imports: [RouterLink],
  template: `
<div class="page">
  <div class="page-head"><span class="eyebrow">STRUCTURED EXPERTISE</span><h1>Learning academies</h1><p>Choose a school and build role-ready capability step by step.</p></div>
  @if(loading()){<div class="skeleton hero-sk"></div>}
  @else if(failed()){<div class="empty"><b>Academies could not be loaded</b><button class="secondary" (click)="load()">Retry</button></div>}
  @else {<div class="academy-grid">@for(a of academies();track a.name){
    <a routerLink="/courses" [queryParams]="{academy:a.name}" [style.--accent]="meta(a.name).color"><i aria-hidden="true">{{meta(a.name).icon}}</i><span>{{meta(a.name).label}}</span><h2>{{a.name}}</h2><p>{{meta(a.name).description}}</p>
      <b>{{a.count ? 'Explore ' + a.count + (a.count===1 ? ' course' : ' courses') + ' →' : 'Courses coming soon'}}</b></a>}</div>}
</div>`
})
export class AcademiesPage {
  private api = inject(ApiService);
  academies = signal<AcademySummary[]>([]);
  loading = signal(true);
  failed = signal(false);
  constructor() { this.load(); }
  meta(name: string) { return META[name] ?? { label: '', description: '', icon: '•', color: '#0b2240' }; }
  load() {
    this.loading.set(true); this.failed.set(false);
    this.api.academies().subscribe({ next: r => { this.academies.set(r.data); this.loading.set(false); }, error: () => { this.failed.set(true); this.loading.set(false); } });
  }
}
