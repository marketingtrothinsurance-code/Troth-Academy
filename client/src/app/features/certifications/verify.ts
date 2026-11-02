import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

interface Verification { valid: boolean; id: string; title: string; level: string; learnerName: string; issuedAt: string; expiresAt: string | null }

/** Public page: no login needed to confirm a Troth Academy credential. */
@Component({
  selector: 'app-verify',
  imports: [FormsModule, DatePipe],
  template: `
<main class="verify">
  <img class="verify-logo" src="troth-one-logo.png" alt="Troth One Academy">
  <h1>Verify a certificate</h1>
  <form (ngSubmit)="lookup()"><label for="cid">Certificate ID</label><input id="cid" name="cid" [(ngModel)]="id" placeholder="TA-2026-000000" autocomplete="off"><button class="primary" [disabled]="!id.trim()">Verify</button></form>
  @if(loading()){<p>Checking…</p>}
  @if(result(); as r){<div class="verify-result" [class.invalid]="!r.valid" role="status">
    <b>{{r.valid ? '✓ Valid credential' : 'This credential has expired'}}</b><h2>{{r.title}}</h2>
    <p>Awarded to <b>{{r.learnerName}}</b></p><p>Issued {{r.issuedAt | date:'d MMMM y'}}{{r.expiresAt ? ' · Expires ' + (r.expiresAt | date:'d MMMM y') : ' · No expiry'}}</p></div>}
  @if(notFound()){<div class="verify-result invalid" role="alert"><b>No certificate found</b><p>Check the ID and try again.</p></div>}
</main>`
})
export class VerifyPage {
  private api = inject(ApiService);
  private router = inject(Router);
  id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
  result = signal<Verification | null>(null);
  notFound = signal(false);
  loading = signal(false);

  constructor() { if (this.id) this.check(); }
  lookup() { this.router.navigate(['/verify', this.id.trim()]).then(() => this.check()); }
  private check() {
    const id = this.id.trim(); if (!id) return;
    this.loading.set(true); this.result.set(null); this.notFound.set(false);
    this.api.verifyCertificate(id).subscribe({ next: r => { this.result.set(r.data); this.loading.set(false); }, error: () => { this.notFound.set(true); this.loading.set(false); } });
  }
}
