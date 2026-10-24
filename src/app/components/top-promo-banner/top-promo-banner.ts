import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { ViewModeService } from '../../services/view-mode';

@Component({
  selector: 'app-top-promo-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <!-- Top Promotional Banner (Placed above header) -->
    <div class="bg-gradient-to-r from-[#991B1B] via-[#DC2626] to-[#7F1D1D] text-white py-2 px-3 md:px-4 shadow-sm border-b border-red-800">
      <div class="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2.5 font-extrabold tracking-wide text-xs md:text-sm">
          <span class="bg-black text-amber-300 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest border border-amber-400/40">
            Promo
          </span>
          <span class="text-amber-300 font-black text-sm md:text-base">
            $300 DISCOUNT
          </span>
          <span class="text-white hidden sm:inline">
            FROM JAPAN, SINGAPORE &amp; DUBAI STOCKS!
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="viewMode.setMode('mobile')"
            class="bg-[#0284C7] hover:bg-[#0369A1] text-white px-2.5 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <mat-icon class="text-xs scale-90">smartphone</mat-icon>
            <span>Site Smartphone</span>
          </button>
          <button
            type="button"
            (click)="scrollToFilter()"
            class="bg-black hover:bg-zinc-900 text-amber-300 hover:text-white px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 border border-amber-300/30 cursor-pointer shadow-sm"
          >
            <span>{{ lang.t('shopNow') }}</span>
            <mat-icon class="text-xs scale-90">arrow_forward</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TopPromoBannerComponent {
  readonly lang = inject(LanguageService);
  readonly viewMode = inject(ViewModeService);

  scrollToFilter() {
    const el = document.getElementById('search-filter-box') || document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
