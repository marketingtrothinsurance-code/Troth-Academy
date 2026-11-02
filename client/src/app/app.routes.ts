import { Routes } from '@angular/router';
import { authGuard, guestGuard, permissionGuard } from './core/auth.guard';

// Feature routes are lazy-loaded to keep the learner shell fast.
export const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [guestGuard], loadComponent: () => import('./features/landing/landing').then(m => m.LandingPage) },
  { path: 'login', loadComponent: () => import('./features/login/login').then(m => m.LoginPage) },
  { path: 'verify', loadComponent: () => import('./features/certifications/verify').then(m => m.VerifyPage) },
  { path: 'verify/:id', loadComponent: () => import('./features/certifications/verify').then(m => m.VerifyPage) },
  {
    path: '', canActivate: [authGuard], loadComponent: () => import('./layouts/learner-layout').then(m => m.LearnerLayout),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardPage) },
      { path: 'mandatory-courses', loadComponent: () => import('./features/courses/browse').then(m => m.BrowsePage) },
      { path: 'courses', loadComponent: () => import('./features/courses/browse').then(m => m.BrowsePage) },
      { path: 'courses/:slug', loadComponent: () => import('./features/courses/detail').then(m => m.CourseDetailPage) },
      { path: 'learn/:slug', loadComponent: () => import('./features/courses/player').then(m => m.CoursePlayerPage) },
      { path: 'my-learning', loadComponent: () => import('./features/my-learning/my-learning').then(m => m.MyLearningPage) },
      { path: 'academies', loadComponent: () => import('./features/academies/academies').then(m => m.AcademiesPage) },
      { path: 'assessments', loadComponent: () => import('./features/certifications/certifications').then(m => m.CertificationsPage) },
      { path: 'certifications', loadComponent: () => import('./features/certifications/certifications').then(m => m.CertificationsPage) },
      { path: 'team', canActivate: [permissionGuard('team.view', 'franchise.view')], loadComponent: () => import('./features/team/team').then(m => m.TeamPage) },
      { path: 'admin', canActivate: [permissionGuard('course.create', 'user.view')], loadComponent: () => import('./features/admin/admin').then(m => m.AdminPage) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
