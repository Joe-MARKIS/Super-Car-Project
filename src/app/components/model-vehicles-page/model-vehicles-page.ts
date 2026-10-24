import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';
import { SidebarComponent } from '../sidebar/sidebar';
import { QuotationMatrixComponent } from '../quotation-matrix/quotation-matrix';

export type SubColumnViewMode = 'split' | 'stock' | 'quotation';

@Component({
  selector: 'app-model-vehicles-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, SidebarComponent, QuotationMatrixComponent],
  template: `
    <main class="max-w-[1720px] mx-auto px-2 sm:px-4 py-3">
      <!-- Breadcrumb & Back Bar -->
      <nav class="flex flex-wrap items-center justify-between gap-2 mb-3 bg-[#1A1A1A] text-white px-3 py-2 rounded border border-zinc-800 text-xs shadow-xs">
        <div class="flex items-center gap-2 truncate">
          <button
            type="button"
            (click)="vehicleService.navigateToHome()"
            class="text-zinc-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <mat-icon class="text-sm scale-90 text-red-500">home</mat-icon>
            <span>Accueil</span>
          </button>
          <span class="text-zinc-600">/</span>
          <span class="text-zinc-400">Modèles & Sélections</span>
          <span class="text-zinc-600">/</span>
          <span class="text-red-400 font-extrabold truncate">{{ context().title }}</span>
        </div>

        <button
          type="button"
          (click)="vehicleService.navigateToHome()"
          class="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
        >
          <mat-icon class="text-sm scale-90">arrow_back</mat-icon>
          <span>{{ lang.t('backToHome') }}</span>
        </button>
      </nav>

      <!-- Mobile Quick Access to Left Column Elements (in Burger / Drawer) -->
      <div class="lg:hidden mb-3">
        <button
          type="button"
          (click)="isMobileFiltersOpen.set(true)"
          class="w-full bg-[#1A1A1A] hover:bg-black text-white px-3.5 py-2.5 rounded-lg border-2 border-red-600 flex items-center justify-between shadow-md cursor-pointer text-xs font-black transition-all"
        >
          <div class="flex items-center gap-2">
            <mat-icon class="text-red-500 text-base">menu</mat-icon>
            <span>Filtres & Marques (Colonne Gauche)</span>
          </div>
          <div class="flex items-center gap-1.5 text-zinc-300 text-[11px]">
            @if (vehicleService.hasActiveFilters()) {
              <span class="bg-red-600 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">Actifs</span>
            }
            <mat-icon class="text-sm text-red-500">tune</mat-icon>
          </div>
        </button>
      </div>

      <!-- Slide-over Drawer for Mobile Left Column Filters -->
      @if (isMobileFiltersOpen()) {
        <div class="fixed inset-0 z-50 flex lg:hidden">
          <!-- Backdrop -->
          <button
            type="button"
            (click)="isMobileFiltersOpen.set(false)"
            aria-label="Fermer les filtres"
            class="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity border-0 p-0 cursor-pointer w-full h-full"
          ></button>

          <!-- Drawer Content -->
          <div class="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div class="bg-[#1A1A1A] text-white p-3.5 border-b-2 border-red-600 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-2 font-black text-xs uppercase tracking-tight">
                <mat-icon class="text-red-500 text-base">filter_list</mat-icon>
                <span>Filtres & Marques (Colonne Gauche)</span>
              </div>
              <button
                type="button"
                (click)="isMobileFiltersOpen.set(false)"
                class="text-zinc-400 hover:text-white cursor-pointer"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <div class="p-3 overflow-y-auto flex-1">
              <app-sidebar />
            </div>

            <div class="p-3 bg-zinc-100 border-t border-zinc-200 shrink-0">
              <button
                type="button"
                (click)="isMobileFiltersOpen.set(false)"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-2.5 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <mat-icon class="text-sm">check</mat-icon>
                <span>Appliquer les filtres ({{ vehicleService.filteredVehicles().length }})</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Main Layout: Column 1 (Sidebar - Hidden on Small Screens, accessible via burger) + Column 2 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        <!-- ================================================================ -->
        <!-- COLONNE 1 (GAUCHE) : Sidebar (Desktop only, mobile in burger)    -->
        <!-- ================================================================ -->
        <aside class="hidden lg:block lg:col-span-3 xl:col-span-2 space-y-3.5">
          <app-sidebar />
        </aside>

        <!-- ================================================================ -->
        <!-- COLONNE 2 (DROITE) : DIVISÉE EN 2 SOUS-COLONNES                 -->
        <!-- Sous-colonne 1: Liste de stock                                   -->
        <!-- Sous-colonne 2: Tableau de cotation (3 sous-sous colonnes)       -->
        <!-- ================================================================ -->
        <section class="lg:col-span-9 xl:col-span-10 min-w-0 space-y-4">
          <!-- ============================================================== -->
          <!-- Search & Filter Box + Origin Selector (from uploaded badjij.png) -->
          <!-- ============================================================== -->
            <!-- 1. Top Breadcrumb & Status Bar -->
            <div class="bg-white rounded border border-zinc-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
              <div class="flex items-center gap-1.5 font-bold text-zinc-800">
                <button
                  type="button"
                  (click)="vehicleService.navigateToHome()"
                  class="hover:text-red-600 cursor-pointer flex items-center gap-1 text-zinc-600 transition-colors"
                >
                  <mat-icon class="text-xs scale-75 text-red-600">home</mat-icon>
                  <span>{{ lang.t('home') || 'ACCUEIL' }}</span>
                </button>
                <span class="text-zinc-400 font-normal">»</span>
                <span class="text-zinc-700 uppercase">{{ lang.t('stockListTab') }}</span>
                <span class="text-zinc-400 font-normal">»</span>
                <span class="text-red-600 uppercase font-black">{{ context().title }}</span>
              </div>

              <div class="flex items-center gap-2">
                <span class="bg-[#1A1A1A] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide border-b border-red-600">
                  {{ context().badge || 'STOCK VÉRIFIÉ' }}
                </span>
                <span class="text-zinc-500 text-xs">
                  <strong class="font-bold text-zinc-950 font-mono">{{ vehiclesList().length }}</strong> {{ lang.t('unitsAvailable') }}
                </span>
              </div>
            </div>

            <!-- 2. Main Search & Filter Box (Crisp Red, White, Black Palette) -->
            <div class="bg-white rounded-lg border-2 border-red-600 shadow-sm overflow-hidden text-xs text-zinc-900">
              <!-- Top Header Strip -->
              <div class="bg-[#1A1A1A] text-white px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 bg-red-600 rounded-xs"></span>
                  <span class="font-black text-xs uppercase tracking-wide">
                    {{ lang.t('searchVehiclesTitle') }} — {{ context().title }}
                  </span>
                </div>
                <div class="text-[11px] text-zinc-300 flex items-center gap-1">
                  <span>{{ lang.t('itemsMatch') }}:</span>
                  <strong class="text-red-400 font-mono font-bold">{{ vehiclesList().length }}</strong>
                </div>
              </div>

              <!-- Filter Fields in Clean Card -->
              <div class="p-3 sm:p-4 space-y-3">
                <!-- Row 1: Marque, Modèle, Carburant, Transmission -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <!-- Marque -->
                  <div>
                    <label for="filter-make-sel" class="block font-bold text-zinc-700 text-[10px] uppercase mb-1">{{ lang.t('make') }}</label>
                    <select
                      id="filter-make-sel"
                      [value]="vehicleService.filter().make"
                      (change)="onFilterMakeChange($event)"
                      class="w-full bg-zinc-50 hover:bg-white text-zinc-900 font-semibold px-2.5 py-1.5 rounded border border-zinc-300 outline-none text-xs focus:border-red-600 cursor-pointer transition-colors"
                    >
                      <option value="">{{ lang.t('all') }} ({{ lang.t('make') }})</option>
                      @for (m of vehicleService.distinctMakes(); track m) {
                        <option [value]="m">{{ m }}</option>
                      }
                    </select>
                  </div>

                  <!-- Modèle -->
                  <div>
                    <label for="filter-model-sel" class="block font-bold text-zinc-700 text-[10px] uppercase mb-1">{{ lang.t('model') }}</label>
                    <select
                      id="filter-model-sel"
                      [value]="vehicleService.filter().model"
                      (change)="onFilterModelChange($event)"
                      class="w-full bg-zinc-50 hover:bg-white text-zinc-900 font-semibold px-2.5 py-1.5 rounded border border-zinc-300 outline-none text-xs focus:border-red-600 cursor-pointer transition-colors"
                    >
                      <option value="">{{ lang.t('all') }} ({{ lang.t('model') }})</option>
                      @for (mod of vehicleService.modelsForSelectedMake(); track mod) {
                        <option [value]="mod">{{ mod }}</option>
                      }
                    </select>
                  </div>

                  <!-- Carburant -->
                  <div>
                    <label for="filter-fuel-sel" class="block font-bold text-zinc-700 text-[10px] uppercase mb-1">{{ lang.t('fuelType') }}</label>
                    <select
                      id="filter-fuel-sel"
                      [value]="vehicleService.filter().fuelType || ''"
                      (change)="onFilterFuelChange($event)"
                      class="w-full bg-zinc-50 hover:bg-white text-zinc-900 font-semibold px-2.5 py-1.5 rounded border border-zinc-300 outline-none text-xs focus:border-red-600 cursor-pointer transition-colors"
                    >
                      <option value="">{{ lang.t('all') }}</option>
                      <option value="Essence">Essence</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybride">Hybride</option>
                      <option value="Électrique">Électrique</option>
                    </select>
                  </div>

                  <!-- Transmission -->
                  <div>
                    <label for="filter-trans-sel" class="block font-bold text-zinc-700 text-[10px] uppercase mb-1">{{ lang.t('transmission') }}</label>
                    <select
                      id="filter-trans-sel"
                      [value]="vehicleService.filter().transmission || ''"
                      (change)="onTransmissionChange($event)"
                      class="w-full bg-zinc-50 hover:bg-white text-zinc-900 font-semibold px-2.5 py-1.5 rounded border border-zinc-300 outline-none text-xs focus:border-red-600 cursor-pointer transition-colors"
                    >
                      <option value="">{{ lang.t('all') }}</option>
                      <option value="Automatique">Automatique</option>
                      <option value="Manuelle">Manuelle</option>
                    </select>
                  </div>
                </div>

                <!-- Row 2: Prix min ~ max, Année min ~ max, Volant, Carrosserie -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <!-- Prix min ~ Prix max -->
                  <div>
                    <span class="block font-bold text-zinc-700 text-[10px] uppercase mb-1">{{ lang.t('price') }} (USD)</span>
                    <div class="flex items-center gap-1">
                      <select
                        aria-label="Min Price"
                        [value]="vehicleService.filter().minPrice || 0"
                        (change)="onMinPriceChange($event)"
                        class="w-1/2 bg-zinc-50 hover:bg-white text-zinc-900 font-semibold px-2 py-1.5 rounded border border-zinc-300 outline-none text-xs focus:border-red-600 cursor-pointer"
                      >
                        <option [value]="0">Min</option>
                        <option [value]="2000">$2,000</option>
                        <option [value]="5000">$5,000</option>
                        <option [value]="10000">$10,000</option>
                        <option [value]="15000">$15,000</option>
                        <option [value]="25000">$25,000</option>
                      </select>
                      <span class="text-zinc-400 font-bold">~</span>
                      <select
                        aria-label="Max Price"
                        [value]="vehicleService.filter().maxPrice || 0"
                        (change)="onMaxPriceChange($event)"
                        class="w-1/2 bg-zinc-50 hover:bg-white text-zinc-900 font-semibold px-2 py-1.5 rounded border border-zinc-300 outline-none text-xs focus:border-red-600 cursor-pointer"
                      >
                        <option [value]="0">Max</option>
                        <option [value]="5000">$5,000</option>
                        <option [value]="10000">$10,000</option>
                        <option [value]="15000">$15,000</option>
                        <option [value]="25000">$25,000</option>
                        <option [value]="40000">$40,000</option>
                        <option [value]="80000">$80,000</option>
                      </select>
                    </div>
                  </div>

                  <!-- Année min ~ max -->
                  <div>
                    <span class="block font-bold text-zinc-700 text-[10px] uppercase mb-1">{{ lang.t('year') }}</span>
                    <div class="flex items-center gap-1">
                      <select
                        aria-label="Min Year"
                        [value]="vehicleService.filter().minYear || 0"
                        (change)="onMinYearChange($event)"
                        class="w-1/2 bg-zinc-50 hover:bg-white text-zinc-900 font-semibold px-2 py-1.5 rounded border border-zinc-300 outline-none text-xs focus:border-red-600 cursor-pointer"
                      >
                        <option [value]="0">Min</option>
                        @for (y of yearsList; track y) {
                          <option [value]="y">{{ y }}</option>
                        }
                      </select>
                      <span class="text-zinc-400 font-bold">~</span>
                      <select
                        aria-label="Max Year"
                        [value]="vehicleService.filter().maxYear || 0"
                        (change)="onMaxYearChange($event)"
                        class="w-1/2 bg-zinc-50 hover:bg-white text-zinc-900 font-semibold px-2 py-1.5 rounded border border-zinc-300 outline-none text-xs focus:border-red-600 cursor-pointer"
                      >
                        <option [value]="0">Max</option>
                        @for (y of yearsList; track y) {
                          <option [value]="y">{{ y }}</option>
                        }
                      </select>
                    </div>
                  </div>

                  <!-- Volant -->
                  <div>
                    <label for="filter-steering-sel" class="block font-bold text-zinc-700 text-[10px] uppercase mb-1">{{ lang.t('steering') }}</label>
                    <select
                      id="filter-steering-sel"
                      [value]="vehicleService.filter().steering || 'all'"
                      (change)="onSteeringChange($event)"
                      class="w-full bg-zinc-50 hover:bg-white text-zinc-900 font-semibold px-2.5 py-1.5 rounded border border-zinc-300 outline-none text-xs focus:border-red-600 cursor-pointer"
                    >
                      <option value="all">{{ lang.t('all') }}</option>
                      <option value="Left Hand Drive">{{ lang.t('leftHandDrive') }} (LHD)</option>
                      <option value="Right Hand Drive">{{ lang.t('rightHandDrive') }} (RHD)</option>
                    </select>
                  </div>

                  <!-- Type de carrosserie -->
                  <div>
                    <label for="filter-category-sel" class="block font-bold text-zinc-700 text-[10px] uppercase mb-1">{{ lang.t('category') }}</label>
                    <select
                      id="filter-category-sel"
                      [value]="vehicleService.filter().category || ''"
                      (change)="onCategoryChange($event)"
                      class="w-full bg-zinc-50 hover:bg-white text-zinc-900 font-semibold px-2.5 py-1.5 rounded border border-zinc-300 outline-none text-xs focus:border-red-600 cursor-pointer"
                    >
                      <option value="">{{ lang.t('all') }}</option>
                      <option value="SUV">SUV</option>
                      <option value="Berline">Berline</option>
                      <option value="Pick-up">Pick-up</option>
                      <option value="Camion">Camion</option>
                      <option value="Van">Van / Minivan</option>
                      <option value="Coupé">Coupé</option>
                    </select>
                  </div>
                </div>

              <!-- Row 4: Authentic Checkbox Badges (7 columns as in badjij.png) -->
              <div class="pt-2.5 pb-2 border-t border-amber-200/80 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-[10px]">
                <!-- Col 1 -->
                <div class="space-y-1.5">
                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" [checked]="vehicleService.filter().bonusPointsOnly" (change)="toggleFilterBonusPoints($event)" class="rounded-xs text-amber-500 focus:ring-0 cursor-pointer" />
                    <span class="inline-flex items-center gap-0.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-black text-[9px] px-1 py-0.2 rounded-xs shadow-xs">
                      <span class="w-2.5 h-2.5 bg-blue-700 rounded-full inline-flex items-center justify-center text-[7px] font-black">P</span>
                      <span>Earn Points</span>
                    </span>
                  </label>

                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" [checked]="vehicleService.filter().primeSellerOnly" (change)="toggleFilterPrimeSeller($event)" class="rounded-xs text-blue-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-white text-[#0B3A82] border border-blue-400 font-extrabold italic text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      prime <span class="not-italic font-normal text-zinc-600">seller</span>
                    </span>
                  </label>

                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-red-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-white text-zinc-900 border border-zinc-300 font-black text-[9px] px-1 py-0.2 rounded-xs shadow-xs">
                      <span class="font-extrabold text-black">BF</span> <span class="text-red-600 font-black">eXclusive</span>
                    </span>
                  </label>
                </div>

                <!-- Col 2 -->
                <div class="space-y-1.5">
                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-amber-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-zinc-900 border border-amber-500 font-black text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      Premium Class
                    </span>
                  </label>

                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-amber-700 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-[#D4AF37] text-black font-black text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs tracking-tight">
                      DELUXE CARS
                    </span>
                  </label>

                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-orange-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      TIME SALE
                    </span>
                  </label>
                </div>

                <!-- Col 3 -->
                <div class="space-y-1.5">
                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-orange-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-white text-orange-600 border border-orange-500 font-black italic text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      OCTOBER SALE
                    </span>
                  </label>

                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-pink-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-white text-pink-600 border border-pink-300 font-bold text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      3RD PARTY <span class="text-zinc-600 font-normal">seller</span>
                    </span>
                  </label>

                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-red-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-red-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      $300 DISCOUNT
                    </span>
                  </label>
                </div>

                <!-- Col 4 -->
                <div class="space-y-1.5">
                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-red-800 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-red-900 text-white font-black italic text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      COMMERCIAL <span class="text-red-200">STOCK</span>
                    </span>
                  </label>

                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-black focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-black text-white font-black italic text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      BF STOCK
                    </span>
                  </label>

                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-blue-700 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-blue-700 text-white font-black italic text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      SALVAGE
                    </span>
                  </label>
                </div>

                <!-- Col 5 -->
                <div class="space-y-1.5">
                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" [checked]="vehicleService.filter().discountOnly" (change)="toggleFilterDiscount($event)" class="rounded-xs text-red-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-red-600 text-white font-black italic text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      Special DISCOUNT
                    </span>
                  </label>

                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-emerald-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-white text-emerald-700 border border-emerald-400 font-bold text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      GCC CARS
                    </span>
                  </label>
                </div>

                <!-- Col 6 -->
                <div class="space-y-1.5">
                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-amber-500 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-black text-yellow-300 font-black text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      NEARLY NEW
                    </span>
                  </label>

                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" [checked]="vehicleService.filter().todaysOfferOnly" (change)="toggleFilterTodaysOffer($event)" class="rounded-xs text-blue-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-[#1B62B8] text-white font-black italic text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      TODAY'S OFFER !!
                    </span>
                  </label>
                </div>

                <!-- Col 7 -->
                <div class="space-y-1.5">
                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-purple-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-purple-900 text-white font-black text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      MODIFIED CARS
                    </span>
                  </label>

                  <label class="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" class="rounded-xs text-red-600 focus:ring-0 cursor-pointer" />
                    <span class="inline-block bg-gradient-to-r from-amber-500 to-red-600 text-white font-black italic text-[9px] px-1.5 py-0.2 rounded-xs shadow-xs">
                      SELLING FAST!
                    </span>
                  </label>
                </div>
              </div>

              <!-- Row 5: Action Row: Count, Orange Search Button, Reset Link -->
              <div class="pt-2.5 mt-2 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                <!-- Total count matches criteria -->
                <div class="text-zinc-900 text-xs sm:text-sm font-bold">
                  <strong class="text-base sm:text-lg font-black text-zinc-950 font-mono">500,411</strong>
                  <span class="ml-1 text-zinc-800">éléments correspondent aux critères</span>
                </div>

                <!-- Search CTA & Reset -->
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    (click)="onSearchClick()"
                    class="bg-[#E65C00] hover:bg-[#D45300] text-white font-black px-6 py-2.5 rounded text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-colors active:scale-98"
                  >
                    <mat-icon class="text-base scale-90">search</mat-icon>
                    <span>RECHERCHE</span>
                  </button>

                  <div class="text-xs text-zinc-600">
                    <span>ou </span>
                    <button
                      type="button"
                      (click)="onResetFilter()"
                      class="text-[#1848B0] hover:underline font-bold cursor-pointer uppercase"
                    >
                      RÉINITIALISATION
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Shipping Country Origin Filter Bar & Sort Controls (Directly below search box) -->
            <div class="bg-white rounded p-3 border border-zinc-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <!-- Left: Country Pills -->
              <div class="space-y-1.5">
                <div class="text-zinc-700 font-bold text-[11px]">
                  Voir les véhicules <strong>d'expédition à partir de:</strong>
                </div>
                <div class="flex flex-wrap items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    (click)="selectOriginCountry('')"
                    [class.bg-[#1860C8]]="!selectedCountryOrigin()"
                    [class.text-white]="!selectedCountryOrigin()"
                    [class.bg-white]="selectedCountryOrigin()"
                    [class.text-zinc-700]="selectedCountryOrigin()"
                    [class.border-blue-600]="!selectedCountryOrigin()"
                    [class.border-zinc-300]="selectedCountryOrigin()"
                    class="px-2.5 py-1 rounded-sm font-bold cursor-pointer transition-colors border shadow-2xs"
                  >
                    Tout
                  </button>

                  @for (c of originCountries; track c.name) {
                    <button
                      type="button"
                      (click)="selectOriginCountry(c.name)"
                      [class.bg-[#1860C8]]="selectedCountryOrigin() === c.name"
                      [class.text-white]="selectedCountryOrigin() === c.name"
                      [class.bg-white]="selectedCountryOrigin() !== c.name"
                      [class.text-zinc-800]="selectedCountryOrigin() !== c.name"
                      [class.border-blue-600]="selectedCountryOrigin() === c.name"
                      [class.border-zinc-300]="selectedCountryOrigin() !== c.name"
                      class="px-2 py-1 rounded-sm font-semibold flex items-center gap-1 cursor-pointer transition-colors border shadow-2xs"
                    >
                      <span>{{ c.flag }}</span>
                      <span>{{ c.name }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Right: Items per page & Sort by dropdowns -->
              <div class="flex flex-wrap items-center gap-3 text-xs ml-auto">
                <!-- Items per page -->
                <div class="flex items-center gap-1.5">
                  <label for="items-per-page" class="text-zinc-600 font-bold text-[11px] whitespace-nowrap">Items per page:</label>
                  <select
                    id="items-per-page"
                    class="bg-white text-zinc-800 font-semibold px-2 py-1 rounded border border-zinc-300 outline-none text-xs shadow-2xs cursor-pointer"
                  >
                    <option value="25">25</option>
                    <option value="50" selected>50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <!-- Trier par -->
                <div class="flex items-center gap-1.5">
                  <label for="sort-by" class="text-zinc-600 font-bold text-[11px] whitespace-nowrap">Trier par:</label>
                  <select
                    id="sort-by"
                    [value]="sortOrder()"
                    (change)="onSortOrderChange($event)"
                    class="bg-white text-zinc-900 font-semibold px-2.5 py-1 rounded border border-zinc-300 outline-none text-xs shadow-2xs cursor-pointer"
                  >
                    <option value="price_asc">Nouveaux arrivages</option>
                    <option value="price_asc">Prix: Moins cher</option>
                    <option value="price_desc">Prix: Plus cher</option>
                    <option value="year_desc">Année récente</option>
                    <option value="mileage_asc">Kilométrage faible</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- SUB-COLUMNS CONTROLLER: 1. Liste de Stock vs 2. Tableau Cotation -->
          <!-- ============================================================== -->
          <!-- ============================================================== -->
          <!-- SUB-COLUMNS CONTROLLER: 1. Liste de Stock vs 2. Tableau Cotation -->
          <!-- (Authentic tab bar matching user images in red/black/white palette) -->
          <!-- ============================================================== -->
          <div class="bg-white border-b-2 border-red-600 rounded-t-lg pt-2 px-2 sm:px-3 shadow-xs flex flex-wrap items-end justify-between gap-2">
            <!-- Navigation Tabs for the 2 Sub-columns (Liste de stock & Tableau de cotation) -->
            <div class="flex flex-wrap items-end gap-1.5 -mb-[2px]">
              <!-- Tab 1: 1. Liste de stock -->
              <button
                type="button"
                (click)="toggleTab('stock')"
                [class.bg-red-600]="subColumnView() === 'stock' || subColumnView() === 'split'"
                [class.text-white]="subColumnView() === 'stock' || subColumnView() === 'split'"
                [class.border-red-600]="subColumnView() === 'stock' || subColumnView() === 'split'"
                [class.shadow-xs]="subColumnView() === 'stock' || subColumnView() === 'split'"
                [class.bg-zinc-100]="subColumnView() === 'quotation'"
                [class.text-zinc-700]="subColumnView() === 'quotation'"
                [class.hover:bg-zinc-200]="subColumnView() === 'quotation'"
                [class.border-zinc-300]="subColumnView() === 'quotation'"
                class="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-t-md font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all border border-b-0"
              >
                <mat-icon class="text-sm scale-90">directions_car</mat-icon>
                <span>{{ lang.t('stockListTab') }}</span>
                <span
                  [class.bg-white]="subColumnView() === 'stock' || subColumnView() === 'split'"
                  [class.text-red-600]="subColumnView() === 'stock' || subColumnView() === 'split'"
                  [class.bg-red-600]="subColumnView() === 'quotation'"
                  [class.text-white]="subColumnView() === 'quotation'"
                  class="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full"
                >
                  {{ vehiclesList().length }}
                </span>
              </button>

              <!-- Tab 2: 2. Tableau de cotation -->
              <button
                type="button"
                (click)="toggleTab('quotation')"
                [class.bg-red-600]="subColumnView() === 'quotation' || subColumnView() === 'split'"
                [class.text-white]="subColumnView() === 'quotation' || subColumnView() === 'split'"
                [class.border-red-600]="subColumnView() === 'quotation' || subColumnView() === 'split'"
                [class.shadow-xs]="subColumnView() === 'quotation' || subColumnView() === 'split'"
                [class.bg-zinc-100]="subColumnView() === 'stock'"
                [class.text-zinc-700]="subColumnView() === 'stock'"
                [class.hover:bg-zinc-200]="subColumnView() === 'stock'"
                [class.border-zinc-300]="subColumnView() === 'stock'"
                class="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-t-md font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all border border-b-0"
              >
                <mat-icon class="text-sm scale-90">analytics</mat-icon>
                <span>{{ lang.t('quotationTableTab') }}</span>
                <span
                  [class.bg-white]="subColumnView() === 'quotation' || subColumnView() === 'split'"
                  [class.text-red-600]="subColumnView() === 'quotation' || subColumnView() === 'split'"
                  [class.bg-zinc-900]="subColumnView() === 'stock'"
                  [class.text-zinc-200]="subColumnView() === 'stock'"
                  class="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full"
                >
                  500,466
                </span>
              </button>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- 2 SOUS-COLONNES CONTAINER                                      -->
          <!-- ============================================================== -->
          <div
            [class.grid]="subColumnView() === 'split'"
            [class.grid-cols-1]="subColumnView() === 'split'"
            [class.xl:grid-cols-12]="subColumnView() === 'split'"
            [class.gap-4]="subColumnView() === 'split'"
            class="items-start"
          >
            <!-- ============================================================ -->
            <!-- SOUS-COLONNE 1 : LISTE DE STOCK                              -->
            <!-- Contient les éléments de la colonne actuelle                -->
            <!-- ============================================================ -->
            @if (subColumnView() === 'stock' || subColumnView() === 'split') {
              <div
                id="stock-list-container"
                [class.xl:col-span-6]="subColumnView() === 'split'"
                class="space-y-4"
              >
                <!-- Sub-column 1 Header -->
                <div class="bg-[#1A1A1A] text-white p-2.5 rounded-t-lg border-b-2 border-red-600 flex items-center justify-between shadow-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 bg-red-600 rounded-xs"></span>
                    <h2 class="text-xs sm:text-sm font-black uppercase tracking-tight text-white flex items-center gap-1.5">
                      <mat-icon class="text-red-500 text-sm">inventory_2</mat-icon>
                      <span>{{ lang.t('stockListTab') }}</span>
                    </h2>
                  </div>
                  <span class="bg-red-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    {{ vehiclesList().length }} {{ lang.t('unitsAvailable') }}
                  </span>
                </div>

                <!-- Filter & View Controls -->
                <div class="bg-white rounded border border-zinc-200 p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span class="text-zinc-600 font-bold text-[11px]">Trier:</span>
                  <div class="flex flex-wrap items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      (click)="sortOrder.set('price_asc')"
                      [class.bg-red-600]="sortOrder() === 'price_asc'"
                      [class.text-white]="sortOrder() === 'price_asc'"
                      [class.bg-zinc-100]="sortOrder() !== 'price_asc'"
                      class="px-2 py-1 rounded font-bold cursor-pointer transition-colors"
                    >
                      Prix ↑
                    </button>
                    <button
                      type="button"
                      (click)="sortOrder.set('price_desc')"
                      [class.bg-red-600]="sortOrder() === 'price_desc'"
                      [class.text-white]="sortOrder() === 'price_desc'"
                      [class.bg-zinc-100]="sortOrder() !== 'price_desc'"
                      class="px-2 py-1 rounded font-bold cursor-pointer transition-colors"
                    >
                      Prix ↓
                    </button>
                    <button
                      type="button"
                      (click)="sortOrder.set('year_desc')"
                      [class.bg-red-600]="sortOrder() === 'year_desc'"
                      [class.text-white]="sortOrder() === 'year_desc'"
                      [class.bg-zinc-100]="sortOrder() !== 'year_desc'"
                      class="px-2 py-1 rounded font-bold cursor-pointer transition-colors"
                    >
                      Année
                    </button>
                    <button
                      type="button"
                      (click)="sortOrder.set('mileage_asc')"
                      [class.bg-red-600]="sortOrder() === 'mileage_asc'"
                      [class.text-white]="sortOrder() === 'mileage_asc'"
                      [class.bg-zinc-100]="sortOrder() !== 'mileage_asc'"
                      class="px-2 py-1 rounded font-bold cursor-pointer transition-colors"
                    >
                      Km ↑
                    </button>
                  </div>
                </div>

                <!-- VEHICLE LIST / CARDS (Prominently displaying user photos & details) -->
                <div class="space-y-3.5">
                  @for (veh of sortedVehicles(); track veh.id) {
                    <article class="bg-white rounded-lg border border-zinc-200 hover:border-red-600 transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col sm:flex-row group">
                      <!-- Vehicle Image Container with Badges -->
                      <button
                        type="button"
                        class="relative sm:w-2/5 shrink-0 bg-zinc-950 overflow-hidden min-h-[190px] cursor-pointer text-left p-0 border-0"
                        (click)="vehicleService.selectVehicle(veh)"
                      >
                        <img
                          [src]="veh.imageUrl"
                          [alt]="veh.make + ' ' + veh.model"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <!-- Top Image Tags -->
                        <div class="absolute top-2 left-2 flex flex-col gap-1 z-10">
                          <span class="bg-black/85 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border border-white/20">
                            REF: {{ veh.refNo }}
                          </span>
                          @if (veh.discountPercent) {
                            <span class="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                              -{{ veh.discountPercent }}% REMISE
                            </span>
                          }
                        </div>

                        <!-- Origin & Inspection Badge -->
                        <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] text-white z-10">
                          <span class="bg-zinc-900/90 backdrop-blur-xs px-1.5 py-0.5 rounded flex items-center gap-1 border border-zinc-700">
                            <span>{{ veh.originFlag }}</span>
                            <span>{{ veh.stockCountry }}</span>
                          </span>
                          <span class="bg-emerald-600/90 text-white font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <mat-icon class="text-[9px] scale-75">verified</mat-icon>
                            <span>Grade 4.5/5</span>
                          </span>
                        </div>
                      </button>

                      <!-- Vehicle Details & Specs -->
                      <div class="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <!-- Header with Title & Favorite Button -->
                          <div class="flex items-start justify-between gap-1.5">
                            <div>
                              <div class="flex items-center gap-1 text-[11px] text-zinc-500 font-mono mb-0.5">
                                <span class="font-bold text-red-600">{{ veh.make }}</span>
                                <span>•</span>
                                <span>{{ veh.category }}</span>
                              </div>
                              <button
                                type="button"
                                (click)="vehicleService.selectVehicle(veh)"
                                class="text-sm font-black text-zinc-900 group-hover:text-red-600 transition-colors cursor-pointer leading-snug text-left p-0 border-0 bg-transparent block"
                              >
                                {{ veh.year }} {{ veh.make }} {{ veh.model }}
                              </button>
                            </div>

                            <button
                              type="button"
                              (click)="vehicleService.toggleFavorite(veh.id); $event.stopPropagation()"
                              [class.text-red-600]="vehicleService.isFavorite(veh.id)"
                              [class.text-zinc-300]="!vehicleService.isFavorite(veh.id)"
                              class="p-1 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
                              title="Ajouter aux favoris"
                            >
                              <mat-icon class="scale-90">favorite</mat-icon>
                            </button>
                          </div>

                          <!-- Key Technical Specs Grid -->
                          <div class="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-zinc-100 text-[11px]">
                            <div class="flex items-center gap-1 text-zinc-700">
                              <mat-icon class="text-[10px] scale-75 text-zinc-400">calendar_today</mat-icon>
                              <span>Année: <strong>{{ veh.year }}</strong></span>
                            </div>
                            <div class="flex items-center gap-1 text-zinc-700">
                              <mat-icon class="text-[10px] scale-75 text-zinc-400">speed</mat-icon>
                              <span>Km: <strong>{{ veh.mileageKm.toLocaleString() }} km</strong></span>
                            </div>
                            <div class="flex items-center gap-1 text-zinc-700">
                              <mat-icon class="text-[10px] scale-75 text-zinc-400">settings</mat-icon>
                              <span>Moteur: <strong>{{ veh.engineCc }} cc</strong></span>
                            </div>
                            <div class="flex items-center gap-1 text-zinc-700">
                              <mat-icon class="text-[10px] scale-75 text-zinc-400">swap_calls</mat-icon>
                              <span>Boîte: <strong>{{ veh.transmission }}</strong></span>
                            </div>
                          </div>
                        </div>

                        <!-- Pricing & Actions Row -->
                        <div class="mt-3 pt-2.5 border-t border-zinc-200 flex flex-wrap items-end justify-between gap-2 bg-zinc-50 -mx-3.5 -mb-3.5 p-2.5">
                          <div>
                            <div class="text-[9px] text-zinc-500 uppercase font-bold">Prix FOB Export</div>
                            <div class="flex items-baseline gap-1.5">
                              <span class="text-base sm:text-lg font-black text-red-600 font-mono tracking-tight">
                                \${{ veh.priceUsd.toLocaleString() }}
                              </span>
                              <span class="text-[10px] text-zinc-600 font-bold">
                                ≈ {{ lang.formatPrice(veh.priceUsd) }}
                              </span>
                            </div>
                          </div>

                          <!-- Buttons -->
                          <div class="flex items-center gap-1.5">
                            <button
                              type="button"
                              (click)="vehicleService.selectVehicle(veh)"
                              class="bg-zinc-900 hover:bg-black text-white font-bold px-2.5 py-1.5 rounded text-[11px] transition-colors flex items-center gap-0.5 cursor-pointer"
                            >
                              <mat-icon class="text-xs scale-75">info</mat-icon>
                              <span>Détails</span>
                            </button>

                            <button
                              type="button"
                              (click)="vehicleService.openQuoteModal(veh)"
                              class="bg-red-600 hover:bg-red-700 text-white font-black px-3 py-1.5 rounded text-[11px] transition-colors flex items-center gap-0.5 cursor-pointer shadow-xs uppercase tracking-wider"
                            >
                              <mat-icon class="text-xs scale-75">request_quote</mat-icon>
                              <span>Devis</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  }
                </div>

                <!-- Technical Specs & Guide for Chosen Model -->
                <div class="bg-white rounded-lg border border-zinc-200 p-3.5 shadow-xs">
                  <div class="flex items-center gap-2 pb-2 mb-2.5 border-b border-zinc-200">
                    <span class="w-2.5 h-2.5 bg-red-600 rounded-xs"></span>
                    <h3 class="text-xs font-black text-zinc-900 uppercase tracking-tight">
                      {{ lang.t('specificationsTitle') }} & Guide d'importation
                    </h3>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div class="bg-zinc-50 p-2.5 rounded border border-zinc-200">
                      <div class="flex items-center gap-1 font-bold text-zinc-900 mb-0.5">
                        <mat-icon class="text-xs scale-75 text-red-600">local_gas_station</mat-icon>
                        <span class="text-[11px]">{{ lang.t('fuelEconomyRating') }}</span>
                      </div>
                      <p class="text-zinc-600 leading-tight text-[10px]">
                        Consommation 8.5L à 11L / 100 km. Moteur robuste compatible tout carburant.
                      </p>
                    </div>

                    <div class="bg-zinc-50 p-2.5 rounded border border-zinc-200">
                      <div class="flex items-center gap-1 font-bold text-zinc-900 mb-0.5">
                        <mat-icon class="text-xs scale-75 text-red-600">build</mat-icon>
                        <span class="text-[11px]">{{ lang.t('partsAvailability') }}</span>
                      </div>
                      <p class="text-zinc-600 leading-tight text-[10px]">
                        Pièces de rechange abondantes à Kinshasa, Lubumbashi et Dar es Salaam.
                      </p>
                    </div>

                    <div class="bg-zinc-50 p-2.5 rounded border border-zinc-200">
                      <div class="flex items-center gap-1 font-bold text-zinc-900 mb-0.5">
                        <mat-icon class="text-xs scale-75 text-red-600">trending_up</mat-icon>
                        <span class="text-[11px]">{{ lang.t('resaleValueScore') }}</span>
                      </div>
                      <p class="text-zinc-600 leading-tight text-[10px]">
                        Cote locale 9.4/10. Véhicule recherché avec très faible décote.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Custom Auction Order Box -->
                <div class="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white rounded-lg border border-zinc-700 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div class="space-y-0.5 text-center sm:text-left">
                    <span class="bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded tracking-wider">
                      Enchères Tokyo
                    </span>
                    <h4 class="text-xs sm:text-sm font-black">
                      {{ lang.t('customSearchOrder') }}
                    </h4>
                    <p class="text-[10px] text-zinc-300">
                      {{ lang.t('orderFromAuctions') }} (USS Tokyo, TAA, CAA).
                    </p>
                  </div>

                  <button
                    type="button"
                    (click)="openDirectContact()"
                    class="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2 rounded text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-md transition-all shrink-0"
                  >
                    <mat-icon class="text-xs scale-75">support_agent</mat-icon>
                    <span>Contacter Conseiller</span>
                  </button>
                </div>
              </div>
            }

            <!-- ============================================================ -->
            <!-- SOUS-COLONNE 2 : TABLEAU DE COTATION                        -->
            <!-- Avec 3 sous-sous colonnes :                                  -->
            <!-- prix * annee, prix * kilometrage, annee * kilometrage        -->
            <!-- ============================================================ -->
            @if (subColumnView() === 'quotation' || subColumnView() === 'split') {
              <div
                id="quotation-matrix-container"
                [class.xl:col-span-6]="subColumnView() === 'split'"
                class="space-y-3"
              >
                <!-- Render the Quotation Matrix Component with the 3 Sub-sub columns -->
                <app-quotation-matrix />
              </div>
            }
          </div>
        </section>
      </div>
    </main>
  `,
})
export class ModelVehiclesPageComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);

  readonly subColumnView = signal<SubColumnViewMode>('split');
  readonly sortOrder = signal<'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc'>('price_asc');
  readonly isMobileFiltersOpen = signal<boolean>(false);

  readonly context = computed(() => {
    return (
      this.vehicleService.selectedModelContext() || {
        title: 'Véhicules Disponibles',
        subtitle: 'Sélection certifiée prête pour expédition',
        criterionType: 'make',
        badge: 'CERTIFIÉ EXPORT',
        icon: 'directions_car',
      }
    );
  });

  readonly vehiclesList = computed(() => {
    return this.vehicleService.modelPageVehicles();
  });

  readonly sortedVehicles = computed(() => {
    const list = [...this.vehiclesList()];
    const order = this.sortOrder();

    return list.sort((a, b) => {
      switch (order) {
        case 'price_asc':
          return a.priceUsd - b.priceUsd;
        case 'price_desc':
          return b.priceUsd - a.priceUsd;
        case 'year_desc':
          return b.year - a.year;
        case 'mileage_asc':
          return a.mileageKm - b.mileageKm;
        default:
          return 0;
      }
    });
  });

  readonly yearsList = Array.from({ length: 30 }, (_, i) => 2026 - i);
  readonly showMoreOptions = signal<boolean>(false);
  readonly selectedCountryOrigin = signal<string>('');
  readonly originCountries = [
    { name: 'Japon', flag: '🇯🇵' },
    { name: 'Dubaï (EAU)', flag: '🇦🇪' },
    { name: 'Corée', flag: '🇰🇷' },
    { name: 'Singapour', flag: '🇸🇬' },
    { name: 'Thaïlande', flag: '🇹🇭' },
  ];

  onFilterMakeChange(e: Event) {
    this.vehicleService.setFilter({ make: (e.target as HTMLSelectElement).value, model: '' });
  }

  onFilterModelChange(e: Event) {
    this.vehicleService.setFilter({ model: (e.target as HTMLSelectElement).value });
  }

  onFilterFuelChange(e: Event) {
    this.vehicleService.setFilter({ fuelType: (e.target as HTMLSelectElement).value });
  }

  onTransmissionChange(e: Event) {
    this.vehicleService.setFilter({ transmission: (e.target as HTMLSelectElement).value });
  }

  onMinPriceChange(e: Event) {
    this.vehicleService.setFilter({ minPrice: Number((e.target as HTMLSelectElement).value) });
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

  onMaxMileageChange(e: Event) {
    this.vehicleService.setFilter({ maxMileage: Number((e.target as HTMLSelectElement).value) });
  }

  onSteeringChange(e: Event) {
    this.vehicleService.setFilter({ steering: (e.target as HTMLSelectElement).value });
  }

  onCategoryChange(e: Event) {
    this.vehicleService.setFilter({ category: (e.target as HTMLSelectElement).value });
  }

  toggleFilterBonusPoints(e: Event) {
    this.vehicleService.setFilter({ bonusPointsOnly: (e.target as HTMLInputElement).checked });
  }

  toggleFilterPrimeSeller(e: Event) {
    this.vehicleService.setFilter({ primeSellerOnly: (e.target as HTMLInputElement).checked });
  }

  toggleFilterDiscount(e: Event) {
    this.vehicleService.setFilter({ discountOnly: (e.target as HTMLInputElement).checked });
  }

  toggleFilterTodaysOffer(e: Event) {
    this.vehicleService.setFilter({ todaysOfferOnly: (e.target as HTMLInputElement).checked });
  }

  onSearchClick() {
    // Triggers update
  }

  onResetFilter() {
    this.vehicleService.resetFilter();
    this.selectedCountryOrigin.set('');
  }

  selectOriginCountry(country: string) {
    this.selectedCountryOrigin.set(country);
    this.vehicleService.setFilter({ stockCountry: country });
  }

  onSortOrderChange(e: Event) {
    this.sortOrder.set((e.target as HTMLSelectElement).value as 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc');
  }

  toggleTab(tab: 'stock' | 'quotation') {
    if (this.subColumnView() === 'split') {
      this.subColumnView.set(tab);
    } else if (this.subColumnView() === tab) {
      this.subColumnView.set('split');
    } else {
      this.subColumnView.set(tab);
    }
  }

  openDirectContact() {
    const v = this.vehiclesList()[0];
    if (v) {
      this.vehicleService.openQuoteModal(v);
    }
  }
}
