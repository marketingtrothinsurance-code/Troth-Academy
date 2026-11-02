import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ApiService } from '../core/api.service';
import type { AppNotification } from '../core/models';
import { IconComponent } from '../shared/icon';

interface NavItem { label: string; path: string; icon: string; permissions?: string[] }

@Component({
  selector: 'app-learner-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, IconComponent],
  template: `
<div class="shell" [class.collapsed]="collapsed()">
  <header>
    <button class="hamb" aria-label="Open navigation" (click)="mobile.set(!mobile())"><app-icon name="menu" [size]="22"/></button>
    <a routerLink="/dashboard" class="brand" aria-label="Troth One Academy dashboard"><img class="brand-logo" src="troth-one-logo.png" alt="Troth One"><span class="brand-sub">Academy</span></a>
    <form (ngSubmit)="search()" role="search"><app-icon name="search" [size]="18"/>
      <input [(ngModel)]="query" name="q" aria-label="Search courses" placeholder="Search courses, lessons and skills"></form>
    <div class="actions">
      <div class="notif-wrap">
        <button class="bell" aria-label="Notifications" [attr.aria-expanded]="notifOpen()" (click)="toggleNotifications()"><app-icon name="bell" [size]="20"/>@if(unread()){<i></i>}</button>
        @if(notifOpen()){<div class="notif-panel" role="menu">
          <b>Notifications</b>
          @for(n of notifications();track n.id){<button role="menuitem" [class.unread]="!n.read" (click)="read(n)"><strong>{{n.title}}</strong><span>{{n.body}}</span></button>}
          @empty {<p>You're all caught up.</p>}
        </div>}
      </div>
      <span class="avatar" aria-hidden="true">{{initials()}}</span>
      <div><b>{{auth.user()?.firstName}} {{auth.user()?.lastName}}</b><small>{{auth.roleLabel()}}</small></div>
    </div>
  </header>
  <aside [class.open]="mobile()">
    <div class="side-head"><span>LEARNING</span><button aria-label="Collapse sidebar" (click)="collapsed.set(!collapsed())"><app-icon name="chevron" [size]="18"/></button></div>
    <nav aria-label="Primary">@for(item of visibleNav();track item.label){<a [routerLink]="item.path" routerLinkActive="active" (click)="mobile.set(false)"><app-icon [name]="item.icon" [size]="19"/><span>{{item.label}}</span></a>}</nav>
    <label>EXPLORE ACADEMIES</label>
    <nav aria-label="Academies">@for(item of academies;track item.label){<a routerLink="/courses" [queryParams]="{academy:item.label}" (click)="mobile.set(false)"><app-icon [name]="item.icon" [size]="19"/><span>{{item.label}}</span></a>}</nav>
    <div class="side-bottom"><button (click)="auth.logout()"><app-icon name="logout" [size]="19"/> <span>Sign out</span></button></div>
  </aside>
  @if(mobile()){<button class="scrim" aria-label="Close navigation" (click)="mobile.set(false)"></button>}
  <main><router-outlet/></main>
</div>`
})
export class LearnerLayout {
  readonly auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);

  collapsed = signal(false);
  mobile = signal(false);
  notifOpen = signal(false);
  notifications = signal<AppNotification[]>([]);
  unread = computed(() => this.notifications().some(n => !n.read));
  query = '';

  private nav: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'home' },
    { label: 'My Learning', path: '/my-learning', icon: 'play' },
    { label: 'Mandatory Lesson', path: '/mandatory-courses', icon: 'book' },
    { label: 'Browse Courses', path: '/courses', icon: 'grid' },
    { label: 'Academies', path: '/academies', icon: 'layers' },
    { label: 'Assessment', path: '/assessments', icon: 'target' },
    { label: 'Certification', path: '/certifications', icon: 'award' },
    { label: 'My Team', path: '/team', icon: 'users', permissions: ['team.view', 'franchise.view'] },
    { label: 'Administration', path: '/admin', icon: 'sliders', permissions: ['course.create', 'user.view'] }
  ];
  visibleNav = computed(() => this.nav.filter(i => !i.permissions || this.auth.can(...i.permissions)));
  academies = [{ label: 'Insurance', icon: 'shield' }, { label: 'Finance', icon: 'trend' }, { label: 'Sales', icon: 'target' }, { label: 'Operations', icon: 'file' }, { label: 'Troth One', icon: 'layers' }];
  initials = computed(() => `${this.auth.user()?.firstName?.[0] ?? ''}${this.auth.user()?.lastName?.[0] ?? ''}`);

  constructor() { this.api.notifications().subscribe({ next: r => this.notifications.set(r.data), error: () => this.notifications.set([]) }); }

  toggleNotifications() { this.notifOpen.set(!this.notifOpen()); }
  read(n: AppNotification) {
    this.api.markRead(n.id).subscribe(() => this.notifications.update(list => list.map(x => x.id === n.id ? { ...x, read: true } : x)));
  }
  search() { this.router.navigate(['/courses'], { queryParams: { search: this.query || null } }); }
}
