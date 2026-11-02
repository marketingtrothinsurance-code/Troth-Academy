import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

const DEMO_ACCOUNTS = [
  { label: 'Learner', email: 'saurabh@troth.in' }, { label: 'Super admin', email: 'admin@troth.in' }, { label: 'Academy admin', email: 'academy@troth.in' },
  { label: 'Trainer', email: 'trainer@troth.in' }, { label: 'Manager', email: 'manager@troth.in' }, { label: 'Franchise owner', email: 'franchise.owner@troth.in' }
];

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
<main class="login">
  <section class="login-story">
    <div class="login-logo"><img src="troth-one-academy-login.jpeg" alt="Troth One Academy — Learn, Earn, Fun"></div>
    <div class="story-copy"><h1>Build expertise.<br>Grow with confidence.</h1></div>
  </section>
  <section class="login-panel">
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <span class="eyebrow">WELCOME BACK</span><h2>Continue your learning journey</h2><p>Sign in with your Troth Academy account.</p>
      <label>Email address<input type="email" formControlName="email" autocomplete="username" [attr.aria-invalid]="invalid('email')">
        @if(invalid('email')){<small class="field-error">Enter a valid email address.</small>}</label>
      <label>Password<input type="password" formControlName="password" autocomplete="current-password" [attr.aria-invalid]="invalid('password')">
        @if(invalid('password')){<small class="field-error">Password must be at least 8 characters.</small>}</label>
      @if(error()){<div class="error" role="alert">{{error()}}</div>}
      <button class="primary" [disabled]="loading()">{{loading() ? 'Signing in…' : 'Sign in to Academy'}} →</button>
      <div class="demo"><b>Demo accounts</b><span>Password for all: Troth&#64;123</span>
        @for(a of demo;track a.email){<button type="button" class="link" (click)="form.controls.email.setValue(a.email)">{{a.label}} · {{a.email}}</button>}</div>
    </form>
  </section>
</main>`
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly demo = DEMO_ACCOUNTS;
  loading = signal(false);
  error = signal('');
  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] })
  });

  constructor() { if (this.auth.isLoggedIn()) this.router.navigateByUrl('/dashboard'); }

  invalid(name: 'email' | 'password') { const c = this.form.controls[name]; return c.invalid && (c.touched || c.dirty); }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading.set(true); this.error.set('');
    this.auth.login(this.form.controls.email.value, this.form.controls.password.value).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: e => { this.loading.set(false); this.error.set(e.error?.message ?? 'Unable to sign in. Please try again.'); }
    });
  }
}
