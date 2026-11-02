import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, of, tap, type Observable } from 'rxjs';
import type { ApiResponse, SessionUser } from './models';

interface Session { user: SessionUser; accessToken: string }
const KEY = 'troth_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private session = signal<Session | null>(this.read());

  readonly user = computed(() => this.session()?.user ?? null);
  readonly isLoggedIn = computed(() => !!this.session()?.accessToken);
  readonly roleLabel = computed(() => (this.user()?.roles[0] ?? 'learner').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

  token() { return this.session()?.accessToken ?? null; }
  can(...permissions: string[]) { const have = this.user()?.permissions ?? []; return permissions.some(p => have.includes(p)); }

  login(email: string, password: string) {
    return this.http.post<ApiResponse<Session>>('/api/v1/auth/login', { email, password }, { withCredentials: true }).pipe(tap(r => this.store(r.data)));
  }

  /** Exchanges the httpOnly refresh cookie for a new access token. Emits false if the session is gone. */
  refresh(): Observable<boolean> {
    return this.http.post<ApiResponse<Session>>('/api/v1/auth/refresh', {}, { withCredentials: true }).pipe(
      tap(r => this.store(r.data)), map(() => true), catchError(() => { this.clear(); return of(false); }));
  }

  logout() {
    this.http.post('/api/v1/auth/logout', {}, { withCredentials: true }).pipe(catchError(() => of(null))).subscribe();
    this.clear();
    this.router.navigateByUrl('/login');
  }

  expire() { this.clear(); this.router.navigateByUrl('/login'); }

  private store(session: Session) {
    this.session.set(session);
    try { localStorage.setItem(KEY, JSON.stringify(session)); } catch { /* storage unavailable: session lives in memory only */ }
  }
  private clear() {
    this.session.set(null);
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  }
  private read(): Session | null {
    try { return JSON.parse(localStorage.getItem(KEY) ?? 'null'); } catch { return null; }
  }
}
