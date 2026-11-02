import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import type { TeamData } from '../../core/models';

/** Manager view (direct reports) or franchise-owner view (own franchise). Scope is decided by the API. */
@Component({
  selector: 'app-team',
  template: `
<div class="page">
  <div class="page-head"><span class="eyebrow">{{franchise ? 'YOUR FRANCHISE' : 'YOUR TEAM'}}</span><h1>{{franchise ? 'Franchise learning' : 'Team learning'}}</h1><p>Progress, overdue training and certifications for the people you look after.</p></div>
  @if(loading()){<div class="skeleton hero-sk"></div>}
  @else if(failed()){<div class="empty"><b>Team data could not be loaded</b><button class="secondary" (click)="load()">Retry</button></div>}
  @else if(data(); as d){
  <section class="stats"><article><div><b>{{d.totals.members}}</b><span>Team members</span></div></article><article><div><b>{{d.totals.completed}}</b><span>Courses completed</span></div></article>
    <article><div><b>{{d.totals.overdue}}</b><span>Overdue</span></div></article><article><div><b>{{d.totals.certificates}}</b><span>Certificates</span></div></article></section>
  @if(d.members.length){<div class="table-wrap"><table class="data-table"><caption class="sr-only">Team learning progress</caption>
    <thead><tr><th>Learner</th><th>Assigned</th><th>Completed</th><th>Pending</th><th>Overdue</th><th>Certificates</th><th>Avg. progress</th></tr></thead>
    <tbody>@for(m of d.members;track m.id){<tr><td><b>{{m.firstName}} {{m.lastName}}</b><small>{{m.department}} · {{m.branch}}</small></td><td>{{m.assigned}}</td><td>{{m.completed}}</td><td>{{m.pending}}</td><td [class.warn]="m.overdue>0">{{m.overdue}}</td><td>{{m.certificates}}</td><td>{{m.completionPercentage}}%</td></tr>}</tbody></table></div>}
  @else {<div class="empty"><b>No team members yet</b><p>People reporting to you will appear here.</p></div>}}
</div>`
})
export class TeamPage {
  private api = inject(ApiService);
  franchise = !inject(AuthService).can('team.view');
  data = signal<TeamData | null>(null);
  loading = signal(true);
  failed = signal(false);
  constructor() { this.load(); }
  load() {
    this.loading.set(true); this.failed.set(false);
    (this.franchise ? this.api.franchiseLearners() : this.api.team()).subscribe({ next: r => { this.data.set(r.data); this.loading.set(false); }, error: () => { this.failed.set(true); this.loading.set(false); } });
  }
}
