import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { ViewModeService } from '../../services/view-mode';

@Component({
  selector: 'app-special-announces',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <!-- Special Announces (Emergency & Port Notices placed below header) -->
    <div class="border-b border-zinc-200">
      <!-- Emergency / Port Notice (body 1 special announces) -->
      <div class="bg-[#FFFBEB] border-b border-[#FDE68A] text-[#92400E] text-xs">
        <!-- Selector 1: Port notice bar -->
        <div
          role="button"
          tabindex="0"
          (click)="toggleNotice()"
          (keydown.enter)="toggleNotice()"
          (keydown.space)="toggleNotice($event)"
          aria-expanded="{{ isNoticeExpanded() }}"
          class="max-w-[1600px] mx-auto px-3 md:px-4 py-2 flex items-start justify-between gap-4 cursor-pointer select-none transition-colors duration-150 hover:bg-[#FEF3C7] active:bg-[#FDE68A]/60 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 font-bold text-[#B91C1C]">
              <mat-icon class="text-sm scale-90">warning</mat-icon>
              <span>{{ lang.t('shippingNoticeTitle') }}</span>
              <span class="text-slate-500 font-normal hidden sm:inline">- {{ lang.t('shippingNoticeDate') }}</span>
              <button
                type="button"
                (click)="toggleNotice($event)"
                class="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center font-medium"
              >
                <mat-icon class="text-sm scale-75">{{ isNoticeExpanded() ? 'expand_less' : 'expand_more' }}</mat-icon>
                <span>{{ isNoticeExpanded() ? 'Masquer' : 'Détails' }}</span>
              </button>
            </div>
            @if (isNoticeExpanded()) {
              <div class="mt-2 pt-2 border-t border-amber-300/60 text-slate-700 leading-relaxed max-w-4xl text-[11px] md:text-xs">
                <p>{{ lang.t('shippingNoticeText') }}</p>
                <div class="mt-2 flex flex-wrap items-center gap-3 text-slate-800 text-[11px]">
                  <div class="font-semibold flex items-center gap-1">
                    <mat-icon class="text-xs scale-75 text-red-600">headset_mic</mat-icon>
                    <span>{{ lang.t('salesInquiries') }}</span>
                    <a
                      href="#support-team"
                      (click)="$event.stopPropagation()"
                      class="text-red-700 underline ml-1 hover:text-red-900 font-bold"
                    >
                      {{ lang.t('contactUs') }}
                    </a>
                  </div>
                  <span class="text-slate-300 hidden sm:inline">|</span>
                  <div class="flex items-center gap-1 text-amber-900 font-medium">
                    <mat-icon class="text-xs scale-75 text-amber-700">security</mat-icon>
                    <span>Assistance directe dédouanement Boma / Matadi &amp; Dar es Salaam</span>
                  </div>
                </div>
              </div>
            }
          </div>
          <div class="text-slate-400 self-center">
            <mat-icon class="text-base transition-transform duration-200" [class.rotate-180]="isNoticeExpanded()">
              keyboard_arrow_down
            </mat-icon>
          </div>
        </div>

        <!-- Selector 2: Anti-fraud Sub-ticker -->
        <div
          role="button"
          tabindex="0"
          (click)="toggleNotice()"
          (keydown.enter)="toggleNotice()"
          (keydown.space)="toggleNotice($event)"
          aria-expanded="{{ isNoticeExpanded() }}"
          class="bg-[#FEF2F2] border-t border-[#FEE2E2] px-3 md:px-4 py-1.5 text-[11px] text-[#B91C1C] flex items-center justify-between gap-2 font-medium cursor-pointer select-none transition-colors duration-150 hover:bg-red-100/90 active:bg-red-200/70 focus:outline-none focus:ring-1 focus:ring-red-400/50"
        >
          <div class="flex items-center gap-2 mx-auto">
            <mat-icon class="text-xs scale-75">gpp_maybe</mat-icon>
            <span>{{ lang.t('fakeNotice') }}</span>
          </div>
          <span class="text-[10px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded border border-red-300 flex items-center gap-0.5 shrink-0 hover:bg-red-200 transition-colors">
            <mat-icon class="text-xs scale-75">{{ isNoticeExpanded() ? 'expand_less' : 'expand_more' }}</mat-icon>
            <span>{{ isNoticeExpanded() ? 'Masquer' : 'Détails' }}</span>
          </span>
        </div>
      </div>
    </div>
  `,
})
export class SpecialAnnouncesComponent {
  readonly lang = inject(LanguageService);
  readonly viewMode = inject(ViewModeService);
  readonly isNoticeExpanded = signal<boolean>(false);

  toggleNotice(event?: Event) {
    if (event) {
      event.stopPropagation();
      if (event instanceof KeyboardEvent && event.key === ' ') {
        event.preventDefault();
      }
    }
    this.isNoticeExpanded.set(!this.isNoticeExpanded());
  }

  scrollToFilter() {
    const el = document.getElementById('search-filter-box') || document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
