import { Component, computed, input } from '@angular/core';

const PATHS: Record<string, string> = {
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  play: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M10 8l6 4-6 4z',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  layers: 'M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  award: 'M12 1a7 7 0 1 0 0 14a7 7 0 1 0 0-14 M8.2 13.9 7 23l5-3 5 3-1.2-9.1',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M23 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8',
  sliders: 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.7 21a2 2 0 0 1-3.4 0',
  search: 'M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16 M21 21l-4.3-4.3',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z',
  clock: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M12 6v6l4 2',
  check: 'M20 6 9 17l-5-5',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  flame: 'M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  menu: 'M3 12h18 M3 6h18 M3 18h18',
  arrow: 'M5 12h14 M12 5l7 7-7 7',
  chevron: 'M15 18l-6-6 6-6',
  target: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M12 6a6 6 0 1 0 0 12a6 6 0 1 0 0-12 M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6',
  trend: 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6'
};

/** Flat, single-weight outline icons. Decorative by default; pass a label when the icon stands alone. */
@Component({
  selector: 'app-icon',
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
    [attr.width]="size()" [attr.height]="size()" [attr.aria-hidden]="label() ? null : 'true'" [attr.role]="label() ? 'img' : null" [attr.aria-label]="label() || null"><path [attr.d]="d()"/></svg>`,
  styles: [':host{display:inline-flex;line-height:0;flex:none}']
})
export class IconComponent {
  name = input.required<string>();
  size = input(20);
  label = input('');
  d = computed(() => PATHS[this.name()] ?? '');
}
