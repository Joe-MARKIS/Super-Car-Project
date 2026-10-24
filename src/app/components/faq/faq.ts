import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';

interface FaqItem {
  id: string;
  qKey: string;
  aKey: string;
}

@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <section id="faq" class="my-8 bg-white rounded-lg border border-zinc-200 p-6 shadow-xs">
      <div class="flex items-center justify-between pb-3 mb-6 border-b-2 border-red-600">
        <div class="flex items-center gap-2">
          <mat-icon class="text-red-600">help_outline</mat-icon>
          <h2 class="text-base md:text-lg font-black text-zinc-900 uppercase tracking-tight">
            {{ lang.t('faqTitle') }}
          </h2>
        </div>
      </div>

      <!-- FAQ Accordion -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (item of faqList; track item.id) {
          <div class="border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50/50">
            <button
              (click)="toggle(item.id)"
              class="w-full text-left p-3.5 flex items-start justify-between gap-3 font-bold text-xs md:text-sm text-zinc-900 hover:text-red-600 hover:bg-zinc-100/60 transition-colors cursor-pointer"
            >
              <span>{{ lang.t(item.qKey) }}</span>
              <mat-icon class="text-zinc-400 scale-90 shrink-0 transition-transform" [class.rotate-180]="openId() === item.id">
                expand_more
              </mat-icon>
            </button>

            @if (openId() === item.id) {
              <div class="px-3.5 pb-3.5 pt-1 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 bg-white">
                <p>{{ lang.t(item.aKey) }}</p>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class FaqComponent {
  readonly lang = inject(LanguageService);
  readonly openId = signal<string>('faq1');

  readonly faqList: FaqItem[] = [
    { id: 'faq1', qKey: 'faq1Q', aKey: 'faq1A' },
    { id: 'faq2', qKey: 'faq2Q', aKey: 'faq2A' },
    { id: 'faq3', qKey: 'faq3Q', aKey: 'faq3A' },
    { id: 'faq4', qKey: 'faq4Q', aKey: 'faq4A' },
  ];

  toggle(id: string) {
    this.openId.update((current) => (current === id ? '' : id));
  }
}
