import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';

@Component({
  selector: 'app-search-filter-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div id="search-filter-box" class="bg-gradient-to-b from-[#DC2626] to-[#B91C1C] rounded-lg shadow-md border border-red-700 text-white p-4">
      <!-- Title & Quick Flags -->
      <div class="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-red-500/50 gap-2">
        <div class="flex items-center gap-2 font-black text-sm md:text-base tracking-wide uppercase">
          <mat-icon class="scale-90">directions_car</mat-icon>
          <span>{{ lang.t('searchVehiclesTitle') }}</span>
        </div>

        <div class="flex items-center gap-4 text-xs font-semibold">
          <label class="flex items-center gap-1.5 cursor-pointer bg-red-950/40 px-2 py-1 rounded border border-red-400/30 hover:bg-red-950/60 transition-colors">
            <input
              type="checkbox"
              [checked]="vehicleService.filter().todaysOfferOnly"
              (change)="toggleTodaysOffer($event)"
              class="accent-amber-400 cursor-pointer"
            />
            <span class="text-amber-300 font-bold uppercase tracking-wider text-[11px]">{{ lang.t('todaysOffer') }}</span>
          </label>

          <label class="flex items-center gap-1.5 cursor-pointer bg-red-950/40 px-2 py-1 rounded border border-red-400/30 hover:bg-red-950/60 transition-colors">
            <input
              type="checkbox"
              [checked]="vehicleService.filter().primeSellerOnly"
              (change)="togglePrimeSeller($event)"
              class="accent-amber-400 cursor-pointer"
            />
            <span class="text-white font-bold text-[11px]">{{ lang.t('primeSeller') }}</span>
          </label>
        </div>
      </div>

      <!-- Grid Filters Row 1 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3 text-xs">
        <!-- Make -->
        <div>
          <label for="filter-make" class="block font-bold text-red-100 mb-1 text-[11px]">{{ lang.t('make') }}</label>
          <select
            id="filter-make"
            [value]="vehicleService.filter().make"
            (change)="onMakeChange($event)"
            class="w-full bg-white text-zinc-900 font-semibold px-2.5 py-1.5 rounded border border-red-300 outline-none text-xs"
          >
            <option value="">{{ lang.t('all') }}</option>
            @for (m of vehicleService.distinctMakes(); track m) {
              <option [value]="m">{{ m }} ({{ vehicleService.makeCounts()[m] || 0 }})</option>
            }
          </select>
        </div>

        <!-- Model -->
        <div>
          <label for="filter-model" class="block font-bold text-red-100 mb-1 text-[11px]">{{ lang.t('model') }}</label>
          <select
            id="filter-model"
            [value]="vehicleService.filter().model"
            (change)="onModelChange($event)"
            class="w-full bg-white text-zinc-900 font-semibold px-2.5 py-1.5 rounded border border-red-300 outline-none text-xs"
          >
            <option value="">{{ lang.t('all') }}</option>
            @for (mod of vehicleService.modelsForSelectedMake(); track mod) {
              <option [value]="mod">{{ mod }}</option>
            }
          </select>
        </div>

        <!-- Price Max -->
        <div>
          <label for="filter-price" class="block font-bold text-red-100 mb-1 text-[11px]">{{ lang.t('price') }} Max</label>
          <select
            id="filter-price"
            [value]="vehicleService.filter().maxPrice"
            (change)="onMaxPriceChange($event)"
            class="w-full bg-white text-zinc-900 font-semibold px-2.5 py-1.5 rounded border border-red-300 outline-none text-xs"
          >
            <option [value]="0">{{ lang.t('all') }}</option>
            <option [value]="5000">&le; 5 000 $</option>
            <option [value]="10000">&le; 10 000 $</option>
            <option [value]="15000">&le; 15 000 $</option>
            <option [value]="25000">&le; 25 000 $</option>
            <option [value]="40000">&le; 40 000 $</option>
          </select>
        </div>

        <!-- Search CTA & Live Match count -->
        <div class="flex items-end gap-2">
          <button
            (click)="triggerSubmit()"
            class="flex-1 bg-black hover:bg-zinc-900 text-white font-extrabold py-2 px-3 rounded shadow transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer border border-zinc-700"
          >
            <mat-icon class="text-sm scale-90 text-amber-400">search</mat-icon>
            <span>{{ lang.t('searchBtn') }}</span>
          </button>
        </div>
      </div>

      <!-- Grid Filters Row 2 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <!-- Body Type -->
        <div>
          <label for="filter-type" class="block font-bold text-red-100 mb-1 text-[11px]">{{ lang.t('type') }}</label>
          <select
            id="filter-type"
            [value]="vehicleService.filter().category"
            (change)="onCategoryChange($event)"
            class="w-full bg-white text-zinc-900 font-semibold px-2.5 py-1.5 rounded border border-red-300 outline-none text-xs"
          >
            <option value="">{{ lang.t('all') }}</option>
            <option value="SUV">SUV (4x4)</option>
            <option value="Pick up">Pick up</option>
            <option value="Berline">Berline (Sedan)</option>
            <option value="Camion">Camion (Truck)</option>
            <option value="Van">Van / Utilitaire</option>
            <option value="Monospace">Monospace</option>
          </select>
        </div>

        <!-- Steering (Left / Right) -->
        <div>
          <label for="filter-steering" class="block font-bold text-red-100 mb-1 text-[11px]">{{ lang.t('steering') }}</label>
          <select
            id="filter-steering"
            [value]="vehicleService.filter().steering"
            (change)="onSteeringChange($event)"
            class="w-full bg-white text-zinc-900 font-semibold px-2.5 py-1.5 rounded border border-red-300 outline-none text-xs"
          >
            <option value="all">{{ lang.t('all') }}</option>
            <option value="Left Hand Drive">{{ lang.t('leftHandDrive') }}</option>
            <option value="Right Hand Drive">{{ lang.t('rightHandDrive') }}</option>
          </select>
        </div>

        <!-- Min Year ~ Max Year -->
        <div>
          <label for="filter-min-year" class="block font-bold text-red-100 mb-1 text-[11px]">{{ lang.t('year') }} (Min ~ Max)</label>
          <div class="flex items-center gap-1">
            <select
              id="filter-min-year"
              [value]="vehicleService.filter().minYear"
              (change)="onMinYearChange($event)"
              class="w-1/2 bg-white text-zinc-900 font-semibold px-1.5 py-1.5 rounded border border-red-300 outline-none text-xs"
            >
              <option [value]="0">Min</option>
              <option [value]="2015">2015</option>
              <option [value]="2018">2018</option>
              <option [value]="2020">2020</option>
              <option [value]="2022">2022</option>
            </select>
            <span class="text-white font-bold">~</span>
            <select
              id="filter-max-year"
              aria-label="Max Year"
              [value]="vehicleService.filter().maxYear"
              (change)="onMaxYearChange($event)"
              class="w-1/2 bg-white text-zinc-900 font-semibold px-1.5 py-1.5 rounded border border-red-300 outline-none text-xs"
            >
              <option [value]="0">Max</option>
              <option [value]="2020">2020</option>
              <option [value]="2022">2022</option>
              <option [value]="2024">2024</option>
              <option [value]="2026">2026</option>
            </select>
          </div>
        </div>

        <!-- Origin Country / Reset -->
        <div class="flex items-end justify-between gap-2">
          <div class="flex-1">
            <label for="filter-origin" class="block font-bold text-red-100 mb-1 text-[11px]">{{ lang.t('stockOrigin') }}</label>
            <select
              id="filter-origin"
              [value]="vehicleService.filter().stockCountry"
              (change)="onStockCountryChange($event)"
              class="w-full bg-white text-zinc-900 font-semibold px-2 py-1.5 rounded border border-red-300 outline-none text-xs"
            >
              <option value="">{{ lang.t('all') }}</option>
              <option value="Japon">🇯🇵 Japon</option>
              <option value="Émirats arabes unis">🇦🇪 Dubaï (EAU)</option>
              <option value="Corée">🇰🇷 Corée</option>
              <option value="Singapour">🇸🇬 Singapour</option>
              <option value="Thaïlande">🇹🇭 Thaïlande</option>
            </select>
          </div>

          <button
            (click)="vehicleService.resetFilter()"
            title="Reset filters"
            class="bg-red-800/80 hover:bg-red-900 text-white p-2 rounded border border-red-400/40 cursor-pointer text-xs"
          >
            <mat-icon class="scale-75">refresh</mat-icon>
          </button>
        </div>
      </div>

      <!-- Live matched items count footer -->
      <div class="mt-3 pt-2 border-t border-red-400/30 flex items-center justify-between text-xs">
        <div class="flex items-center gap-1.5 text-amber-200 font-medium">
          <mat-icon class="text-xs scale-75">check_circle</mat-icon>
          <span>{{ lang.t('itemsMatch') }}:</span>
          <strong class="font-bold text-white text-sm tabular-nums">{{ vehicleService.filteredVehicles().length }}</strong>
        </div>

        <div class="text-[11px] text-red-100">
          Destination : <strong class="text-white">{{ lang.selectedCountry().flag }} {{ lang.selectedCountry().name }} ({{ lang.selectedCountry().primaryPort }})</strong>
        </div>
      </div>
    </div>
  `,
})
export class SearchFilterBoxComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);

  onMakeChange(e: Event) {
    this.vehicleService.setFilter({ make: (e.target as HTMLSelectElement).value, model: '' });
  }

  onModelChange(e: Event) {
    this.vehicleService.setFilter({ model: (e.target as HTMLSelectElement).value });
  }

  onMaxPriceChange(e: Event) {
    this.vehicleService.setFilter({ maxPrice: Number((e.target as HTMLSelectElement).value) });
  }

  onMinYearChange(e: Event) {
    this.vehicleService.setFilter({ minYear: Number((e.target as HTMLSelectElement).value) });
  }

  onMaxYearChange(e: Event) {
    this.vehicleService.setFilter({ maxYear: Number((e.target as HTMLSelectElement).value) });
  }

  onCategoryChange(e: Event) {
    this.vehicleService.setFilter({ category: (e.target as HTMLSelectElement).value });
  }

  onSteeringChange(e: Event) {
    this.vehicleService.setFilter({ steering: (e.target as HTMLSelectElement).value });
  }

  onStockCountryChange(e: Event) {
    this.vehicleService.setFilter({ stockCountry: (e.target as HTMLSelectElement).value });
  }

  toggleTodaysOffer(e: Event) {
    this.vehicleService.setFilter({ todaysOfferOnly: (e.target as HTMLInputElement).checked });
  }

  togglePrimeSeller(e: Event) {
    this.vehicleService.setFilter({ primeSellerOnly: (e.target as HTMLInputElement).checked });
  }

  triggerSubmit() {
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
