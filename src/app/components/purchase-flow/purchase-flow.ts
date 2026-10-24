import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-purchase-flow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <section id="purchase-flow" class="my-6 bg-white rounded-lg border border-zinc-200 p-5 shadow-xs">
      <!-- Section Header -->
      <div class="flex flex-wrap items-center justify-between pb-3 mb-5 border-b-2 border-red-600 gap-2">
        <div class="flex items-center gap-2">
          <mat-icon class="text-red-600">local_shipping</mat-icon>
          <h2 class="text-base md:text-lg font-black text-zinc-900 uppercase tracking-tight">
            {{ lang.t('purchaseFlowTitle') }}
          </h2>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="text-zinc-500 font-semibold hidden sm:inline">
            Livraison sécurisée vers <strong>{{ lang.selectedCountry().name }}</strong>
          </span>
          <a
            href="#faq"
            class="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{{ lang.t('howToBuyLink') }}</span>
            <mat-icon class="text-xs scale-75">arrow_forward</mat-icon>
          </a>
        </div>
      </div>

      <!-- 4-step Pipeline with Red/Black/White Theme -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <!-- Step 1 -->
        <div class="border border-zinc-200 rounded-lg p-3.5 bg-zinc-50 hover:border-red-600 hover:bg-white transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2.5">
              <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs">
                1
              </div>
              <span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">STEP 1</span>
            </div>
            <h3 class="font-black text-xs md:text-sm text-zinc-900 mb-1">
              {{ lang.t('step1Title') }}
            </h3>
            <p class="text-xs text-zinc-600 leading-relaxed">
              {{ lang.t('step1Desc') }}
            </p>
          </div>
          <div class="mt-3 pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px] text-red-600 font-bold">
            <span>Devis instantané CIF</span>
            <mat-icon class="text-xs scale-75">request_quote</mat-icon>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="border border-zinc-200 rounded-lg p-3.5 bg-zinc-50 hover:border-red-600 hover:bg-white transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2.5">
              <div class="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-xs">
                2
              </div>
              <span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">STEP 2</span>
            </div>
            <h3 class="font-black text-xs md:text-sm text-zinc-900 mb-1">
              {{ lang.t('step2Title') }}
            </h3>
            <p class="text-xs text-zinc-600 leading-relaxed">
              {{ lang.t('step2Desc') }}
            </p>
          </div>
          <div class="mt-3 pt-2 border-t border-zinc-200/60 flex items-center gap-1.5 text-[10px] font-mono text-zinc-700">
            <span class="bg-white border border-zinc-300 px-1 rounded">SWIFT</span>
            <span class="bg-white border border-zinc-300 px-1 rounded">VISA</span>
            <span class="bg-white border border-zinc-300 px-1 rounded">PayPal</span>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="border border-zinc-200 rounded-lg p-3.5 bg-zinc-50 hover:border-red-600 hover:bg-white transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2.5">
              <div class="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-xs">
                3
              </div>
              <span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">STEP 3</span>
            </div>
            <h3 class="font-black text-xs md:text-sm text-zinc-900 mb-1">
              {{ lang.t('step3Title') }}
            </h3>
            <p class="text-xs text-zinc-600 leading-relaxed">
              {{ lang.t('step3Desc') }}
            </p>
          </div>
          <div class="mt-3 pt-2 border-t border-zinc-200/60 flex items-center gap-1 text-[11px] text-zinc-900 font-bold">
            <mat-icon class="text-xs text-red-600 scale-75">gps_fixed</mat-icon>
            <span>Suivi Maritime en direct</span>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="border border-zinc-200 rounded-lg p-3.5 bg-zinc-50 hover:border-red-600 hover:bg-white transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2.5">
              <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs">
                4
              </div>
              <span class="text-[10px] font-black tracking-widest text-zinc-400 uppercase">STEP 4</span>
            </div>
            <h3 class="font-black text-xs md:text-sm text-zinc-900 mb-1">
              {{ lang.t('step4Title') }}
            </h3>
            <p class="text-xs text-zinc-600 leading-relaxed">
              {{ lang.t('step4Desc') }}
            </p>
          </div>
          <div class="mt-3 pt-2 border-t border-zinc-200/60 flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <mat-icon class="text-xs scale-75">verified</mat-icon>
            <span>Remise des clés & Bill of Lading</span>
          </div>
        </div>
      </div>

      <!-- Real Vehicle Inspection & Shipping Gallery Banner (Using User-Provided Images) -->
      <div class="bg-zinc-900 rounded-lg p-3 text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-zinc-800">
        <div class="flex items-center gap-3">
          <div class="flex -space-x-4 overflow-hidden py-1">
            <img
              src="/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg"
              alt="Inspection Land Cruiser Prado"
              referrerpolicy="no-referrer"
              class="inline-block h-12 w-16 object-cover rounded border-2 border-red-600"
            />
            <img
              src="/assets/images/car_toyota_hilux_pickup_1791895943609.jpg"
              alt="Inspection Hilux Pickup"
              referrerpolicy="no-referrer"
              class="inline-block h-12 w-16 object-cover rounded border-2 border-white"
            />
            <img
              src="/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg"
              alt="Inspection Canter Truck"
              referrerpolicy="no-referrer"
              class="inline-block h-12 w-16 object-cover rounded border-2 border-white"
            />
          </div>
          <div>
            <h4 class="font-extrabold text-xs md:text-sm text-white flex items-center gap-1.5">
              <mat-icon class="text-red-500 text-sm">fact_check</mat-icon>
              <span>100% Véhicules Inspectés au Japon & Dubaï avant Expédition</span>
            </h4>
            <p class="text-[11px] text-zinc-300">
              Certificats de conformité, photos réelles HD et rapport d'état mécanique remis avant le départ du navire.
            </p>
          </div>
        </div>

        <a
          href="#catalog-grid"
          class="shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>Commander en toute sécurité</span>
          <mat-icon class="text-xs scale-75">arrow_forward</mat-icon>
        </a>
      </div>
    </section>
  `,
})
export class PurchaseFlowComponent {
  readonly lang = inject(LanguageService);
}
