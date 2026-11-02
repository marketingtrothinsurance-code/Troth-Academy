import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { AuthService } from './core/auth.service';
import { authGuard, permissionGuard } from './core/auth.guard';
import { DurationPipe } from './shared/duration.pipe';
import { routes } from './app.routes';

const setup = () => {
  localStorage.clear();
  TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()] });
};
const sessionOf = (permissions: string[]) => ({ user: { id: 'u', firstName: 'A', lastName: 'B', email: 'a@b.c', roles: ['learner'], permissions }, accessToken: 't' });

describe('App shell', () => {
  it('creates the root component', () => {
    setup();
    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });
});

describe('AuthService', () => {
  beforeEach(setup);

  it('stores the session on login and exposes permissions', () => {
    const auth = TestBed.inject(AuthService);
    const http = TestBed.inject(HttpTestingController);
    expect(auth.isLoggedIn()).toBe(false);
    auth.login('a@b.c', 'Passw0rd!').subscribe();
    http.expectOne('/api/v1/auth/login').flush({ success: true, message: 'ok', data: sessionOf(['course.create']) });
    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.can('course.create')).toBe(true);
    expect(auth.can('user.view')).toBe(false);
    expect(auth.token()).toBe('t');
  });

  it('clears the session when refresh fails', () => {
    localStorage.setItem('troth_session', JSON.stringify(sessionOf([])));
    const auth = TestBed.inject(AuthService);
    const http = TestBed.inject(HttpTestingController);
    expect(auth.isLoggedIn()).toBe(true);
    let result: boolean | undefined;
    auth.refresh().subscribe(v => (result = v));
    http.expectOne('/api/v1/auth/refresh').flush({ message: 'no' }, { status: 401, statusText: 'Unauthorized' });
    expect(result).toBe(false);
    expect(auth.isLoggedIn()).toBe(false);
  });
});

describe('guards', () => {
  beforeEach(setup);
  const run = (guard: () => unknown) => TestBed.runInInjectionContext(guard as () => unknown);

  it('redirects anonymous users to login', () => {
    const result = run(() => authGuard({} as never, {} as never));
    expect(TestBed.inject(Router).serializeUrl(result as never)).toBe('/login');
  });

  it('allows signed-in users', () => {
    localStorage.setItem('troth_session', JSON.stringify(sessionOf([])));
    TestBed.resetTestingModule(); TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()] });
    expect(TestBed.runInInjectionContext(() => authGuard({} as never, {} as never))).toBe(true);
  });

  it('blocks routes the user has no permission for', () => {
    localStorage.setItem('troth_session', JSON.stringify(sessionOf(['team.view'])));
    TestBed.resetTestingModule(); TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()] });
    const router = TestBed.inject(Router);
    expect(TestBed.runInInjectionContext(() => permissionGuard('team.view')({} as never, {} as never))).toBe(true);
    const denied = TestBed.runInInjectionContext(() => permissionGuard('user.view')({} as never, {} as never));
    expect(router.serializeUrl(denied as never)).toBe('/dashboard');
  });
});

describe('DurationPipe', () => {
  const pipe = new DurationPipe();
  it('formats minutes', () => {
    expect(pipe.transform(45)).toBe('45m');
    expect(pipe.transform(255)).toBe('4h 15m');
    expect(pipe.transform(undefined)).toBe('0m');
  });
});
