import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';

@Component({
  selector: 'app-right-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <aside class="space-y-3.5 text-xs">
      <!-- 1. Shipping Schedule Card (as in screenshot) -->
      <div class="bg-white rounded border border-blue-900/30 overflow-hidden shadow-xs group">
        <div class="bg-gradient-to-r from-[#1E3A8A] to-[#1D4ED8] text-white p-2.5 flex items-center justify-between">
          <div class="flex items-center gap-1.5 font-black text-xs uppercase tracking-tight">
            <mat-icon class="scale-90 text-sky-300">directions_boat</mat-icon>
            <span>Shipping Schedule</span>
          </div>
          <a
            href="#purchase-flow"
            class="text-[10px] font-bold text-amber-300 hover:text-white flex items-center gap-0.5"
          >
            <span>VIEW PDF &gt;&gt;</span>
          </a>
        </div>
        <div class="p-2.5 bg-gradient-to-b from-blue-50/50 to-white">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-10 h-10 rounded bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <mat-icon class="text-xl">sailing</mat-icon>
            </div>
            <div class="text-[11px] leading-tight">
              <div class="font-extrabold text-blue-950">Départs Hebdomadaires</div>
              <div class="text-zinc-600 text-[10px]">Yokohama &amp; Dubaï vers Matadi &amp; Boma</div>
            </div>
          </div>
          <div class="text-[10px] text-zinc-500 font-mono bg-white p-1.5 rounded border border-zinc-200 space-y-0.5">
            <div class="flex justify-between">
              <span>Prochain navire Ro-Ro :</span>
              <strong class="text-zinc-900">22 Oct 2026</strong>
            </div>
            <div class="flex justify-between">
              <span>Temps de transit estimé :</span>
              <strong class="text-emerald-700">32-38 jours</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Create Account Card with 6 Feature Icons (as in screenshot) -->
      <div class="bg-white rounded border border-zinc-200 overflow-hidden shadow-xs p-3">
        <div class="flex items-center gap-1.5 font-black text-xs text-zinc-900 mb-1">
          <mat-icon class="text-[#EA580C] text-sm">person_add</mat-icon>
          <span class="uppercase tracking-tight">Create account</span>
        </div>
        <p class="text-[10px] text-zinc-500 mb-2.5">
          Sign up &amp; enjoy these features
        </p>

        <!-- 6 Feature Icons in 2x3 Grid -->
        <div class="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-zinc-700 mb-3">
          <button
            type="button"
            (click)="alertFeature('Points Reward')"
            class="flex flex-col items-center hover:text-red-600 cursor-pointer p-1 rounded hover:bg-zinc-50"
          >
            <div class="w-7 h-7 rounded-full bg-amber-100 text-[#EA580C] flex items-center justify-center mb-0.5 font-bold text-xs">
              P
            </div>
            <span>Earn Points</span>
          </button>

          <button
            type="button"
            (click)="vehicleService.openFavoritesModal()"
            class="flex flex-col items-center hover:text-red-600 cursor-pointer p-1 rounded hover:bg-zinc-50"
          >
            <div class="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-0.5">
              <mat-icon class="text-xs scale-75">favorite</mat-icon>
            </div>
            <span>Favorites ({{ vehicleService.favoriteIds().length }})</span>
          </button>

          <button
            type="button"
            (click)="alertFeature('Notify Me')"
            class="flex flex-col items-center hover:text-red-600 cursor-pointer p-1 rounded hover:bg-zinc-50"
          >
            <div class="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-0.5">
              <mat-icon class="text-xs scale-75">campaign</mat-icon>
            </div>
            <span>Notify Me</span>
          </button>

          <button
            type="button"
            (click)="alertFeature('Save Search')"
            class="flex flex-col items-center hover:text-red-600 cursor-pointer p-1 rounded hover:bg-zinc-50"
          >
            <div class="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-0.5">
              <mat-icon class="text-xs scale-75">save</mat-icon>
            </div>
            <span>Save Search</span>
          </button>

          <button
            type="button"
            (click)="alertFeature('Easy Inquiry')"
            class="flex flex-col items-center hover:text-red-600 cursor-pointer p-1 rounded hover:bg-zinc-50"
          >
            <div class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-0.5">
              <mat-icon class="text-xs scale-75">mail</mat-icon>
            </div>
            <span>Easy Inquiry</span>
          </button>

          <button
            type="button"
            (click)="alertFeature('Buy Now')"
            class="flex flex-col items-center hover:text-red-600 cursor-pointer p-1 rounded hover:bg-zinc-50"
          >
            <div class="w-7 h-7 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center mb-0.5">
              <mat-icon class="text-xs scale-75">shopping_cart</mat-icon>
            </div>
            <span>Buy Now</span>
          </button>
        </div>

        <!-- Big Orange CTA Button -->
        <button
          type="button"
          (click)="createAccount()"
          class="w-full bg-[#EA580C] hover:bg-orange-700 text-white font-black py-2 rounded uppercase tracking-wider text-xs shadow-xs transition-colors cursor-pointer"
        >
          CREATE ACCOUNT
        </button>

        <!-- Cyan Point Up Campaign Banner (as in screenshot) -->
        <div class="mt-2.5 bg-gradient-to-r from-sky-400 to-cyan-500 text-black p-2 rounded text-center shadow-xs">
          <div class="text-[9px] uppercase tracking-wider font-extrabold text-blue-950">
            ▲ POINT UP CAMPAIGN ▲
          </div>
          <div class="text-[11px] font-black text-white drop-shadow-xs">
            EARN 10 POINTS ($10)
          </div>
          <div class="text-[9px] text-blue-950 font-bold">
            WHEN YOU CREATE AN ACCOUNT
          </div>
        </div>
      </div>

      <!-- 3. Over 3,000,000 Auto Parts Card (as in screenshot) -->
      <button
        type="button"
        (click)="openAutoParts()"
        class="w-full text-left bg-gradient-to-r from-black via-zinc-900 to-red-950 border border-zinc-800 rounded p-3 text-white shadow-xs cursor-pointer group"
      >
        <div class="text-[9px] font-black uppercase text-red-500 tracking-wider">
          CATALOGUE OFFICIEL
        </div>
        <div class="text-sm font-black text-amber-300 leading-tight mt-0.5">
          OVER 3,000,000 AUTO PARTS
        </div>
        <div class="text-xs font-black text-white">
          IN STOCK
        </div>
        <div class="mt-2 text-right">
          <span class="inline-block bg-[#EA580C] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
            SHOP NOW &gt;
          </span>
        </div>
      </button>

      <!-- 4. Local Services Box (BF R.D. Congo) (as in screenshot) -->
      <div class="bg-white rounded border border-emerald-600/40 overflow-hidden shadow-xs">
        <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-2 flex items-center justify-between">
          <div class="flex items-center gap-1 font-black text-[11px] uppercase tracking-tight">
            <mat-icon class="text-xs scale-75">location_on</mat-icon>
            <span>Local Services</span>
          </div>
          <span class="text-[9px] text-emerald-100 font-semibold">Getting Closer To You</span>
        </div>
        <a
          href="#local-offices"
          class="p-2.5 flex items-center justify-between bg-emerald-50/40 hover:bg-emerald-50 transition-colors cursor-pointer group"
        >
          <div class="flex items-center gap-2">
            <span class="text-base">🇨🇩</span>
            <div>
              <div class="font-black text-xs text-zinc-900 group-hover:text-emerald-700">
                BF R.D. Congo
              </div>
              <div class="text-[10px] text-zinc-500">
                Kinshasa · Lubumbashi · Matadi · Goma
              </div>
            </div>
          </div>
          <mat-icon class="text-xs scale-75 text-zinc-400 group-hover:text-emerald-700">chevron_right</mat-icon>
        </a>
      </div>

      <!-- 5. Social / Facebook Feed Preview Card (as in screenshot) -->
      <div class="bg-white rounded border border-zinc-200 overflow-hidden shadow-xs p-2.5">
        <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-100">
          <div class="flex items-center gap-1.5">
            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              f
            </div>
            <div>
              <div class="font-black text-[11px] text-zinc-900 leading-tight">BE FORWARD</div>
              <div class="text-[9px] text-zinc-500">1.4M followers</div>
            </div>
          </div>
          <button
            type="button"
            (click)="alertFeature('Follow Page')"
            class="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer hover:bg-blue-700"
          >
            Follow Page
          </button>
        </div>

        <div class="bg-zinc-50 p-2 rounded text-[10px] text-zinc-600 space-y-1">
          <div class="font-bold text-zinc-800">Dernière livraison à Matadi :</div>
          <p class="line-clamp-2">
            Félicitations à M. Jean-Claude pour la réception de son Toyota Land Cruiser Prado en parfait état !
          </p>
        </div>
      </div>

      <!-- 6. Social Links ("Veuillez nous suivre sur:" as in screenshot) -->
      <div class="bg-white rounded border border-zinc-200 p-2.5 shadow-xs">
        <div class="font-black text-[11px] text-zinc-800 uppercase tracking-tight mb-2">
          Veuillez nous suivre sur :
        </div>
        <div class="flex items-center justify-between gap-1">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
            class="w-7 h-7 rounded bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs hover:opacity-90"
          >
            f
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener"
            aria-label="X Twitter"
            class="w-7 h-7 rounded bg-black text-white flex items-center justify-center font-bold text-xs hover:opacity-90"
          >
            𝕏
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
            class="w-7 h-7 rounded bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs hover:opacity-90"
          >
            <mat-icon class="text-xs scale-75">photo_camera</mat-icon>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener"
            aria-label="YouTube"
            class="w-7 h-7 rounded bg-[#FF0000] text-white flex items-center justify-center font-bold text-xs hover:opacity-90"
          >
            <mat-icon class="text-xs scale-75">play_arrow</mat-icon>
          </a>
        </div>
      </div>

      <!-- 7. Car Arrival Progress (CAP) Card (as in screenshot) -->
      <div class="bg-gradient-to-br from-[#0284C7] to-[#0369A1] rounded text-white p-3 shadow-xs">
        <div class="flex items-center gap-1.5 font-black text-xs uppercase tracking-tight mb-1">
          <mat-icon class="scale-90 text-amber-300">verified</mat-icon>
          <span>CAR ARRIVAL PROGRESS (CAP)</span>
        </div>
        <p class="text-[10px] text-sky-100 leading-snug">
          Le suivi de votre envoi maritime est désormais bien plus facile avec le portail CAP !
        </p>
        <div class="mt-2 flex items-center justify-between">
          <span class="text-[9px] bg-black/30 px-1.5 py-0.5 rounded font-mono">
            TRACKING 24/7
          </span>
          <a
            href="#purchase-flow"
            class="text-[10px] font-black text-amber-300 hover:text-white flex items-center gap-0.5 uppercase"
          >
            <span>MORE DETAILS &gt;&gt;</span>
          </a>
        </div>
      </div>

      <!-- 8. Direct WhatsApp Assistance for RDC & Africa -->
      <div id="support-team" class="bg-slate-900 text-white rounded p-3 border border-slate-700 shadow-xs">
        <div class="flex items-center gap-1.5 mb-1.5">
          <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <mat-icon class="text-xs scale-75">chat</mat-icon>
          </div>
          <span class="font-black text-xs text-white">WhatsApp Sales RDC</span>
        </div>
        <p class="text-[10px] text-zinc-300 mb-2">
          Assistance proforma immédiate en français &amp; lingala :
        </p>
        <div class="space-y-1 text-[11px] font-mono">
          <div class="flex justify-between items-center text-emerald-400">
            <span>Emmanuel :</span>
            <a href="https://wa.me/818095877304" target="_blank" class="hover:underline font-bold">+81-80-9587-7304</a>
          </div>
          <div class="flex justify-between items-center text-emerald-400">
            <span>Nicolas_M :</span>
            <a href="https://wa.me/818077285433" target="_blank" class="hover:underline font-bold">+81-80-7728-5433</a>
          </div>
        </div>
      </div>
    </aside>
  `,
})
export class RightSidebarComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);

  alertFeature(name: string) {
    alert(
      this.lang.currentLang() === 'fr'
        ? `Fonctionnalité : ${name} activée dans votre compte.`
        : `Feature: ${name} active in your account.`
    );
  }

  createAccount() {
    alert(
      this.lang.currentLang() === 'fr'
        ? 'Bienvenue ! Vous bénéficiez de 10 points ($10) lors de la création de votre compte client AutoForward.'
        : 'Welcome! You earn 10 points ($10) upon creating your AutoForward account.'
    );
  }

  openAutoParts() {
    this.vehicleService.setFilter({ category: 'Camion' });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
