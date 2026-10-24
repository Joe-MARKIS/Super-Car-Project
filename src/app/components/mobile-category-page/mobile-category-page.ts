import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';
import { Vehicle } from '../../models/vehicle';
import { PriceAlertService } from '../../services/price-alert';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-mobile-category-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="bg-[#F4F4F6] min-h-screen text-zinc-900 font-sans pb-16">
      <!-- 1. Top Red Promo Banner (matching page_cat1_f0584c7c.png) -->
      <div class="bg-[#DC2626] text-white text-xs font-black py-1.5 px-3 flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-1.5 truncate">
          <span class="bg-black text-amber-300 text-[10px] px-1.5 py-0.5 rounded uppercase">PROMO</span>
          <span class="text-amber-300 font-extrabold">$300-DISCOUNT</span>
          <span class="truncate">FROM SINGAPORE & JAPAN!</span>
        </div>
        <button
          type="button"
          (click)="navigateToHome()"
          class="bg-black/60 hover:bg-black text-[10px] text-white font-bold px-2 py-0.5 rounded cursor-pointer whitespace-nowrap"
        >
          HOME
        </button>
      </div>

      <!-- 2. Mobile Main Header Bar -->
      <header class="bg-[#1A1A1A] text-white px-3 py-2 flex items-center justify-between border-b-2 border-[#DC2626] sticky top-0 z-30 shadow-md">
        <!-- Hamburger Menu Button -->
        <button
          type="button"
          (click)="isDrawerOpen.set(true)"
          class="flex flex-col items-center justify-center text-zinc-200 hover:text-white cursor-pointer px-1"
        >
          <mat-icon class="scale-100">menu</mat-icon>
          <span class="text-[9px] uppercase font-bold tracking-tight">Menu</span>
        </button>

        <!-- Brand Logo (Red, Black, White) -->
        <button (click)="navigateToHome()" class="flex items-center gap-1 font-black text-base tracking-tighter cursor-pointer border-0 bg-transparent text-white p-0">
          <span class="bg-[#DC2626] text-white px-1.5 py-0.5 rounded">AUTO</span>
          <span class="text-white">FORWARD</span>
          <mat-icon class="text-red-500 scale-75 ml-[-4px]">arrow_forward</mat-icon>
        </button>

        <!-- Right Quick Actions: Search, Login, Favorites with Badge -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="isFilterModalOpen.set(true)"
            class="flex flex-col items-center justify-center text-zinc-200 hover:text-white cursor-pointer"
          >
            <mat-icon class="scale-90">search</mat-icon>
            <span class="text-[9px] uppercase font-bold tracking-tight">Search</span>
          </button>

          <button
            type="button"
            (click)="authService.openLogin()"
            class="flex flex-col items-center justify-center text-zinc-200 hover:text-white cursor-pointer"
          >
            <mat-icon class="scale-90">person</mat-icon>
            <span class="text-[9px] uppercase font-bold tracking-tight">Login</span>
          </button>

          <button
            type="button"
            (click)="vehicleService.openFavoritesModal()"
            class="flex flex-col items-center justify-center text-zinc-200 hover:text-white relative cursor-pointer"
          >
            <div class="relative">
              <mat-icon class="scale-90 text-red-500">favorite</mat-icon>
              <span class="absolute -top-1 -right-2 bg-red-600 text-white rounded-full text-[9px] font-black w-3.5 h-3.5 flex items-center justify-center">
                {{ vehicleService.favoriteIds().length }}
              </span>
            </div>
            <span class="text-[9px] uppercase font-bold tracking-tight">Fav</span>
          </button>
        </div>
      </header>

      <!-- 3. Mobile Search Input Bar with Orange Button -->
      <div class="p-2.5 bg-white border-b border-zinc-200 shadow-2xs">
        <div class="flex items-center rounded border-2 border-[#EA580C] overflow-hidden bg-white">
          <input
            type="text"
            [(ngModel)]="searchKeyword"
            (keyup.enter)="applyKeywordSearch()"
            placeholder="Search for Used Car"
            class="flex-1 px-3 py-2 text-xs text-zinc-900 outline-none"
          />
          <button
            type="button"
            (click)="applyKeywordSearch()"
            class="bg-[#EA580C] hover:bg-[#C2410C] text-white px-3.5 py-2 flex items-center justify-center cursor-pointer transition-colors"
          >
            <mat-icon class="scale-90">search</mat-icon>
          </button>
        </div>
      </div>

      <!-- 4. Category Header & Breadcrumbs (page_cat1_f0584c7c.png) -->
      <div class="px-3 pt-2 pb-1 text-xs">
        <div class="flex items-center gap-1.5 text-zinc-600 font-bold text-[11px]">
          <button type="button" (click)="navigateToHome()" class="text-[#1D4ED8] hover:underline cursor-pointer">
            HOME
          </button>
          <span>»</span>
          <span class="text-zinc-800 uppercase tracking-tight font-black">
            {{ contextTitle() }}
          </span>
        </div>
        <div class="font-bold text-xs text-zinc-900 mt-1">
          Sale: {{ contextSubtitle() }}
        </div>
      </div>

      <!-- 5. Big FILTER Button (page_cat1_f0584c7c.png) -->
      <div class="px-3 my-2">
        <button
          type="button"
          (click)="isFilterModalOpen.set(true)"
          class="w-full bg-[#E5E7EB] hover:bg-zinc-300 text-zinc-800 font-black py-2.5 px-4 rounded-md flex items-center justify-center gap-1.5 shadow-xs text-xs tracking-wider cursor-pointer border border-zinc-300 transition-colors"
        >
          <mat-icon class="text-[#EA580C] scale-90">filter_alt</mat-icon>
          <span class="text-[#EA580C] font-black uppercase tracking-wider">
            FILTER ({{ activeFilterCount() }})
          </span>
        </button>
      </div>

      <!-- 6. Current Search Badges & Save Search Row (page_cat1_f0584c7c.png) -->
      <div class="px-3 py-2 bg-white border-y border-zinc-200 my-1 text-xs">
        <div class="flex items-center gap-1 text-[11px] font-bold text-purple-900">
          <mat-icon class="text-purple-700 text-xs scale-90">filter_list</mat-icon>
          <span>Current search:</span>
        </div>
        <div class="mt-1 flex flex-wrap gap-1.5 items-center">
          <span class="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
            <span>{{ activeSearchTag() }}</span>
            <button type="button" (click)="clearFilters()" class="hover:text-red-600 cursor-pointer text-xs">×</button>
          </span>
          @if (filterSteering() !== 'all') {
            <span class="bg-orange-50 text-orange-900 border border-orange-200 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <span>{{ filterSteering() }}</span>
              <button type="button" (click)="filterSteering.set('all')" class="hover:text-red-600 cursor-pointer text-xs">×</button>
            </span>
          }
        </div>

        <div class="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
          <button
            type="button"
            (click)="priceAlertService.openModal()"
            class="text-[#1D4ED8] hover:underline text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
          >
            <span>Get email alerts for new vehicles</span>
            <mat-icon class="text-xs scale-75">chevron_right</mat-icon>
          </button>

          <button
            type="button"
            (click)="priceAlertService.openModal()"
            class="bg-[#7E22CE] hover:bg-[#6B21A8] text-white px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <mat-icon class="text-xs scale-75">notifications</mat-icon>
            <span class="uppercase">SAVE SEARCH</span>
          </button>
        </div>
      </div>

      <!-- 7. TOTAL PRICE CALCULATOR Collapsible Bar (page_cat1_f0584c7c.png) -->
      <div class="px-3 my-2">
        <button
          type="button"
          (click)="isCalculatorOpen.set(!isCalculatorOpen())"
          class="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white py-2.5 px-3 rounded-lg font-black text-xs uppercase flex items-center justify-between shadow-sm cursor-pointer transition-colors"
        >
          <div class="flex items-center gap-1.5">
            <mat-icon class="scale-90">calculate</mat-icon>
            <span>TOTAL PRICE CALCULATOR</span>
          </div>
          <mat-icon class="scale-90">{{ isCalculatorOpen() ? 'expand_less' : 'expand_more' }}</mat-icon>
        </button>

        @if (isCalculatorOpen()) {
          <div class="bg-white p-3 border border-zinc-300 rounded-b-lg shadow-sm space-y-2 text-xs">
            <div>
              <label for="mob-calc-country" class="block font-bold text-zinc-600 text-[10px] mb-0.5">Destination Country:</label>
              <select
                id="mob-calc-country"
                [value]="lang.currentCountry()"
                (change)="onCountryChange($event)"
                class="w-full bg-zinc-50 border border-zinc-300 rounded p-1.5 text-xs font-bold"
              >
                @for (c of lang.countries; track c.code) {
                  <option [value]="c.code">{{ c.flag }} {{ c.name }} (Port: {{ c.primaryPort }})</option>
                }
              </select>
            </div>
            <div>
              <label for="mob-calc-port" class="block font-bold text-zinc-600 text-[10px] mb-0.5">Port & Shipping Method:</label>
              <select
                id="mob-calc-port"
                [value]="vehicleService.selectedPortId()"
                (change)="onPortChange($event)"
                class="w-full bg-zinc-50 border border-zinc-300 rounded p-1.5 text-xs font-bold"
              >
                @for (p of vehicleService.ports(); track p.id) {
                  <option [value]="p.id">{{ p.name }} — Base CIF: {{ lang.formatPrice(p.baseOceanFreightUsd) }} ({{ p.transitDays }}j)</option>
                }
              </select>
            </div>
          </div>
        }
      </div>

      <!-- 8. Currency & Sort By Controls (page_cat1_f0584c7c.png) -->
      <div class="px-3 py-2 grid grid-cols-2 gap-2 text-xs">
        <div>
          <label for="mob-currency-sel" class="block text-[10px] font-bold text-zinc-500 mb-0.5">Currency</label>
          <select
            id="mob-currency-sel"
            [value]="lang.currentCurrency()"
            (change)="onCurrencyChange($event)"
            class="w-full bg-white border border-zinc-300 rounded p-2 text-xs font-bold text-zinc-900 shadow-2xs"
          >
            @for (curr of lang.currencies; track curr.code) {
              <option [value]="curr.code">{{ curr.code }} ({{ curr.symbol }})</option>
            }
          </select>
        </div>

        <div>
          <label for="mob-sort-sel" class="block text-[10px] font-bold text-zinc-500 mb-0.5">Sort By</label>
          <select
            id="mob-sort-sel"
            [(ngModel)]="sortBy"
            class="w-full bg-white border border-zinc-300 rounded p-2 text-xs font-bold text-zinc-900 shadow-2xs"
          >
            <option value="discount">Recently Discounted</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="year_desc">Year: New to Old</option>
            <option value="mileage_asc">Mileage: Low to High</option>
          </select>
        </div>
      </div>

      <!-- 9. Search Results Header (page_cat1_f0584c7c.png) -->
      <div class="px-3 mt-2 mb-1">
        <div class="flex items-center justify-between pb-1 border-b-2 border-[#EA580C]">
          <h2 class="font-black text-sm text-zinc-900 tracking-tight">
            Search Results ({{ displayedVehicles().length }})
          </h2>
          <span class="text-[10px] text-zinc-500 font-bold font-mono">
            1 - {{ displayedVehicles().length }}
          </span>
        </div>
      </div>

      <!-- 10. Vertical Vehicle Cards Feed (page_cat1_f0584c7c.png & page_cat2_0816ca27.png) -->
      <div class="px-2 space-y-2.5 my-2">
        @for (veh of displayedVehicles(); track veh.id) {
          <div class="bg-white border border-zinc-300 rounded-lg overflow-hidden shadow-2xs flex flex-row">
            <!-- Left Column: Photo, Points, Ref No, Badges (approx 40% width) -->
            <div class="w-[42%] bg-zinc-100 p-2 flex flex-col justify-between shrink-0 border-r border-zinc-200">
              <div class="relative aspect-[4/3] rounded overflow-hidden bg-zinc-200">
                <!-- Points Badge -->
                <span class="absolute top-1 left-1 bg-[#1D4ED8] text-white text-[9px] font-black px-1 py-0.5 rounded flex items-center gap-0.5 z-10 shadow-xs">
                  <span class="w-3 h-3 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-[7px] font-black">P</span>
                  <span>{{ veh.pointsReward }} pts</span>
                </span>
                <img
                  [src]="veh.imageUrl"
                  [alt]="veh.model"
                  class="w-full h-full object-cover"
                  referrerpolicy="no-referrer"
                />
              </div>

              <!-- Ref No -->
              <div class="mt-1.5 text-center">
                <div class="text-[9px] font-bold text-zinc-700 truncate">Ref No. {{ veh.refNo }}</div>
                <div class="text-[8px] text-zinc-500 font-mono truncate">({{ veh.chassisCode }})</div>
              </div>

              <!-- Promotional Sticker Badges matching screenshot -->
              <div class="mt-1 space-y-0.5 text-center">
                <div class="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[8px] font-black py-0.5 rounded tracking-tighter uppercase">
                  OCTOBER SALE
                </div>
                <div class="bg-black text-white text-[8px] font-black py-0.5 rounded tracking-tighter uppercase">
                  BF STOCK
                </div>
                <div class="bg-blue-600 text-white text-[8px] font-black py-0.5 rounded tracking-tighter uppercase">
                  TODAY'S OFFER !!
                </div>
              </div>
            </div>

            <!-- Right Column: Title, Prices, Specs & Action Buttons (approx 58% width) -->
            <div class="w-[58%] p-2.5 flex flex-col justify-between">
              <div>
                <!-- Vehicle Make & Model Title -->
                <button
                  type="button"
                  (click)="openVehicleDetail(veh)"
                  class="text-left font-black text-xs text-[#1D4ED8] hover:text-[#1E40AF] hover:underline line-clamp-2 leading-tight cursor-pointer"
                >
                  {{ veh.make }} {{ veh.model }}
                </button>

                <!-- Video / Features highlight -->
                <div class="text-[9px] text-zinc-600 font-bold mt-0.5 flex items-center gap-0.5">
                  <mat-icon class="text-[11px] scale-75 text-red-600">play_circle</mat-icon>
                  <span>Check out the VIDEO !!</span>
                </div>

                <!-- Price Block -->
                <div class="mt-1.5 space-y-0.5 text-xs">
                  <div class="flex items-baseline justify-between">
                    <span class="text-zinc-600 text-[10px] font-bold">Price</span>
                    <span class="font-black text-[#16A34A] text-xs tabular-nums">{{ lang.formatPrice(veh.priceUsd) }}</span>
                  </div>
                  <div class="flex items-baseline justify-between text-[10px]">
                    <span class="text-zinc-500 font-medium">You Save</span>
                    <span class="font-bold text-red-600 tabular-nums">${{ veh.originalPriceUsd - veh.priceUsd }} ({{ veh.discountPercent }}%)</span>
                  </div>
                  <div class="flex items-baseline justify-between pt-0.5 border-t border-zinc-100">
                    <span class="text-zinc-700 text-[10px] font-bold">Total Price</span>
                    <span class="font-black text-[#16A34A] text-xs tabular-nums">{{ lang.formatPrice(veh.priceUsd + veh.estimatedShippingUsd) }}</span>
                  </div>
                  <div class="text-[9px] text-zinc-500 text-right truncate">
                    C&F {{ vehicleService.selectedPort().name.split(' ')[2] || 'Port' }} (RORO)
                  </div>
                </div>

                <!-- Specs -->
                <div class="mt-2 text-[10px] text-zinc-600 space-y-0.5 pt-1 border-t border-zinc-100">
                  <div>Year: <strong class="text-zinc-800">{{ veh.year }}</strong></div>
                  <div>Mileage: <strong class="text-zinc-800">{{ veh.mileageKm.toLocaleString() }} km</strong></div>
                </div>
              </div>

              <!-- Action Buttons Row: Favorite ♡ + Big Orange DETAIL ❯ button -->
              <div class="flex items-center gap-1.5 mt-2.5">
                <!-- Favorite Heart Button -->
                <button
                  type="button"
                  (click)="toggleFavorite(veh.id)"
                  [class.text-red-600]="isFav(veh.id)"
                  [class.text-zinc-400]="!isFav(veh.id)"
                  class="w-8 h-8 rounded border border-zinc-300 flex items-center justify-center bg-zinc-50 hover:bg-red-50 hover:text-red-600 cursor-pointer shadow-2xs shrink-0"
                  title="Ajouter aux favoris"
                >
                  <mat-icon class="scale-80">{{ isFav(veh.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
                </button>

                <!-- Big Orange DETAIL ❯ Button -->
                <button
                  type="button"
                  (click)="openVehicleDetail(veh)"
                  class="flex-1 bg-[#EA580C] hover:bg-[#C2410C] text-white font-black py-2 px-3 rounded text-xs uppercase flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors"
                >
                  <span>DETAIL</span>
                  <mat-icon class="text-xs scale-75">chevron_right</mat-icon>
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- 11. Bottom Pagination & Navigation -->
      <div class="px-3 my-4 space-y-2">
        <button
          type="button"
          (click)="scrollToTop()"
          class="w-full py-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <span>Page to Top</span>
          <mat-icon class="text-xs scale-75 text-orange-600">arrow_upward</mat-icon>
        </button>

        <button
          type="button"
          (click)="navigateToHome()"
          class="w-full py-2.5 bg-white border border-zinc-300 hover:bg-zinc-50 text-blue-700 font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
        >
          <mat-icon class="text-xs scale-75">arrow_back</mat-icon>
          <span>Back to Home</span>
        </button>
      </div>

      <!-- ============================================================== -->
      <!-- POPUP MODAL: MODIFY FILTERS (interface_filtre_6edc3bc3.png & interface_filtre_1_1175cc7a.png) -->
      <!-- ============================================================== -->
      @if (isFilterModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex flex-col justify-start">
          <div class="bg-white min-h-screen w-full flex flex-col pb-20">
            <!-- Modal Top Header Bar -->
            <div class="bg-[#1A1A1A] text-white px-3 py-2 flex items-center justify-between border-b-2 border-[#EA580C] sticky top-0 z-20">
              <button
                type="button"
                (click)="isDrawerOpen.set(true)"
                class="flex flex-col items-center justify-center text-zinc-200 hover:text-white cursor-pointer px-1"
              >
                <mat-icon class="scale-90">menu</mat-icon>
                <span class="text-[8px] uppercase font-bold">Menu</span>
              </button>

              <div class="flex items-center gap-1 font-black text-sm tracking-tighter">
                <span class="bg-[#DC2626] text-white px-1.5 py-0.5 rounded">AUTO</span>
                <span class="text-white">FORWARD</span>
                <mat-icon class="text-red-500 scale-75 ml-[-4px]">arrow_forward</mat-icon>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" (click)="isFilterModalOpen.set(false)" class="text-zinc-300 hover:text-white cursor-pointer">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>

            <!-- Form Content -->
            <div class="p-3 space-y-3">
              <!-- Title with Orange Underline (interface_filtre_6edc3bc3.png) -->
              <div class="pb-1 border-b-2 border-[#EA580C] flex items-center justify-between">
                <h3 class="font-black text-sm text-zinc-900 tracking-tight">Modify Filters</h3>
                <button type="button" (click)="clearFilters()" class="text-xs text-red-600 font-bold hover:underline cursor-pointer">
                  Reset
                </button>
              </div>

              <!-- 1. Keyword -->
              <div class="flex items-center gap-2 text-xs">
                <label for="filter-kw" class="w-20 font-bold text-zinc-800 shrink-0">Keyword</label>
                <input
                  id="filter-kw"
                  type="text"
                  [(ngModel)]="searchKeyword"
                  placeholder="Search for Used Car"
                  class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs text-zinc-900 outline-none"
                />
              </div>

              <!-- 2. Make -->
              <div class="flex items-center gap-2 text-xs">
                <label for="filter-make" class="w-20 font-bold text-zinc-800 shrink-0">Make</label>
                <select
                  id="filter-make"
                  [(ngModel)]="filterMake"
                  class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold text-zinc-900"
                >
                  <option value="">All</option>
                  @for (m of allMakes; track m) {
                    <option [value]="m">{{ m }}</option>
                  }
                </select>
              </div>

              <!-- 3. Model -->
              <div class="flex items-center gap-2 text-xs">
                <label for="filter-model" class="w-20 font-bold text-zinc-800 shrink-0">Model</label>
                <select
                  id="filter-model"
                  [(ngModel)]="filterModel"
                  class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold text-zinc-900"
                >
                  <option value="">All</option>
                  @for (mod of availableModels(); track mod) {
                    <option [value]="mod">{{ mod }}</option>
                  }
                </select>
              </div>

              <!-- 4. Model Code -->
              <div class="flex items-center gap-2 text-xs">
                <label for="filter-code" class="w-20 font-bold text-zinc-800 shrink-0">Model Code</label>
                <select
                  id="filter-code"
                  [(ngModel)]="filterModelCode"
                  class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold text-zinc-900"
                >
                  <option value="">All</option>
                  <option value="3DA-CV30A">3DA-CV30A (BMW)</option>
                  <option value="GDJ150W">GDJ150W (Prado)</option>
                  <option value="GUN125">GUN125 (Hilux)</option>
                  <option value="NHP10">NHP10 (Aqua)</option>
                </select>
              </div>

              <!-- 5. Type (Body Type) -->
              <div class="flex items-center gap-2 text-xs">
                <label for="filter-type" class="w-20 font-bold text-zinc-800 shrink-0">Type</label>
                <select
                  id="filter-type"
                  [(ngModel)]="filterType"
                  class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold text-zinc-900"
                >
                  <option value="">All</option>
                  <option value="SUV">SUV</option>
                  <option value="Berline">Berline / Sedan</option>
                  <option value="Camion">Camion / Truck</option>
                  <option value="Monospace">Monospace / Minibus</option>
                  <option value="Van">Van</option>
                  <option value="Pick up">Pick up</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
              </div>

              <!-- 6. Year Min - Max -->
              <div class="flex items-center gap-2 text-xs">
                <label for="filter-year-min" class="w-20 font-bold text-zinc-800 shrink-0">Year</label>
                <div class="flex-1 flex items-center gap-1.5">
                  <select
                    id="filter-year-min"
                    [(ngModel)]="filterMinYear"
                    class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold"
                  >
                    <option [value]="0">Min</option>
                    @for (y of yearsList; track y) {
                      <option [value]="y">{{ y }}</option>
                    }
                  </select>
                  <span class="text-zinc-500 font-bold">-</span>
                  <select
                    id="filter-year-max"
                    [(ngModel)]="filterMaxYear"
                    aria-label="Year Max"
                    class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold"
                  >
                    <option [value]="0">Max</option>
                    @for (y of yearsList; track y) {
                      <option [value]="y">{{ y }}</option>
                    }
                  </select>
                </div>
              </div>

              <!-- 7. Month Min - Max -->
              <div class="flex items-center gap-2 text-xs">
                <label for="filter-month-min" class="w-20 font-bold text-zinc-800 shrink-0">Month</label>
                <div class="flex-1 flex items-center gap-1.5">
                  <select
                    id="filter-month-min"
                    [(ngModel)]="filterMinMonth"
                    class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold"
                  >
                    <option [value]="0">Min</option>
                    <option [value]="1">Jan</option>
                    <option [value]="6">Jun</option>
                    <option [value]="12">Dec</option>
                  </select>
                  <span class="text-zinc-500 font-bold">-</span>
                  <select
                    id="filter-month-max"
                    [(ngModel)]="filterMaxMonth"
                    aria-label="Month Max"
                    class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold"
                  >
                    <option [value]="0">Max</option>
                    <option [value]="6">Jun</option>
                    <option [value]="12">Dec</option>
                  </select>
                </div>
              </div>

              <!-- 8. Price USD Min - Max -->
              <div class="flex items-center gap-2 text-xs">
                <div class="w-20 shrink-0">
                  <div class="font-bold text-zinc-800">Price</div>
                  <div class="text-[9px] text-zinc-500">USD</div>
                </div>
                <div class="flex-1 flex items-center gap-1.5">
                  <select
                    [(ngModel)]="filterMinPrice"
                    aria-label="Price Min"
                    class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold"
                  >
                    <option [value]="0">Min</option>
                    <option [value]="1000">$1,000</option>
                    <option [value]="3000">$3,000</option>
                    <option [value]="5000">$5,000</option>
                    <option [value]="10000">$10,000</option>
                    <option [value]="20000">$20,000</option>
                  </select>
                  <span class="text-zinc-500 font-bold">-</span>
                  <select
                    [(ngModel)]="filterMaxPrice"
                    aria-label="Price Max"
                    class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold"
                  >
                    <option [value]="0">Max</option>
                    <option [value]="5000">$5,000</option>
                    <option [value]="10000">$10,000</option>
                    <option [value]="20000">$20,000</option>
                    <option [value]="35000">$35,000</option>
                    <option [value]="50000">$50,000</option>
                  </select>
                </div>
              </div>

              <!-- 9. Steering -->
              <div class="flex items-center gap-2 text-xs">
                <label for="filter-steering" class="w-20 font-bold text-zinc-800 shrink-0">Steering</label>
                <select
                  id="filter-steering"
                  [(ngModel)]="filterSteering"
                  class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold text-zinc-900"
                >
                  <option value="all">Any</option>
                  <option value="Left Hand Drive">Left Hand Drive (LHD)</option>
                  <option value="Right Hand Drive">Right Hand Drive (RHD)</option>
                </select>
              </div>

              <!-- 10. Fuel -->
              <div class="flex items-center gap-2 text-xs">
                <label for="filter-fuel" class="w-20 font-bold text-zinc-800 shrink-0">Fuel</label>
                <select
                  id="filter-fuel"
                  [(ngModel)]="filterFuel"
                  class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold text-zinc-900"
                >
                  <option value="all">All</option>
                  <option value="Essence">Petrol / Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybrid</option>
                  <option value="Electrique">Electric</option>
                </select>
              </div>

              <!-- 11. Mission (Transmission) Buttons matching interface_filtre_1_1175cc7a.png -->
              <div class="flex items-center gap-2 text-xs">
                <span class="w-20 font-bold text-zinc-800 shrink-0">Mission</span>
                <div class="flex-1 grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    (click)="filterTransmission.set('any')"
                    [class.bg-[#BAE6FD]]="filterTransmission() === 'any'"
                    [class.text-zinc-900]="filterTransmission() === 'any'"
                    [class.border-[#38BDF8]]="filterTransmission() === 'any'"
                    [class.bg-white]="filterTransmission() !== 'any'"
                    class="py-2 rounded border border-zinc-300 font-bold text-xs cursor-pointer text-center"
                  >
                    Any
                  </button>
                  <button
                    type="button"
                    (click)="filterTransmission.set('Automatique')"
                    [class.bg-[#BAE6FD]]="filterTransmission() === 'Automatique'"
                    [class.text-zinc-900]="filterTransmission() === 'Automatique'"
                    [class.border-[#38BDF8]]="filterTransmission() === 'Automatique'"
                    [class.bg-white]="filterTransmission() !== 'Automatique'"
                    class="py-2 rounded border border-zinc-300 font-bold text-xs cursor-pointer text-center text-zinc-700"
                  >
                    AT
                  </button>
                  <button
                    type="button"
                    (click)="filterTransmission.set('Manuelle')"
                    [class.bg-[#BAE6FD]]="filterTransmission() === 'Manuelle'"
                    [class.text-zinc-900]="filterTransmission() === 'Manuelle'"
                    [class.border-[#38BDF8]]="filterTransmission() === 'Manuelle'"
                    [class.bg-white]="filterTransmission() !== 'Manuelle'"
                    class="py-2 rounded border border-zinc-300 font-bold text-xs cursor-pointer text-center text-zinc-700"
                  >
                    MT
                  </button>
                </div>
              </div>

              <!-- 12. Engine cc Min - Max -->
              <div class="flex items-center gap-2 text-xs">
                <div class="w-20 shrink-0">
                  <div class="font-bold text-zinc-800">Engine</div>
                  <div class="text-[9px] text-zinc-500">cc</div>
                </div>
                <div class="flex-1 flex items-center gap-1.5">
                  <select
                    [(ngModel)]="filterMinEngine"
                    aria-label="Engine Min"
                    class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold"
                  >
                    <option [value]="0">Min</option>
                    <option [value]="1000">1,000 cc</option>
                    <option [value]="1500">1,500 cc</option>
                    <option [value]="2000">2,000 cc</option>
                    <option [value]="3000">3,000 cc</option>
                  </select>
                  <span class="text-zinc-500 font-bold">-</span>
                  <select
                    [(ngModel)]="filterMaxEngine"
                    aria-label="Engine Max"
                    class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold"
                  >
                    <option [value]="0">Max</option>
                    <option [value]="2000">2,000 cc</option>
                    <option [value]="3000">3,000 cc</option>
                    <option [value]="4500">4,500 cc</option>
                  </select>
                </div>
              </div>

              <!-- 13. Mileage km Min - Max -->
              <div class="flex items-center gap-2 text-xs">
                <div class="w-20 shrink-0">
                  <div class="font-bold text-zinc-800">Mileage</div>
                  <div class="text-[9px] text-zinc-500">km</div>
                </div>
                <div class="flex-1 flex items-center gap-1.5">
                  <select
                    [(ngModel)]="filterMinMileage"
                    aria-label="Mileage Min"
                    class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold"
                  >
                    <option [value]="0">Min</option>
                    <option [value]="20000">20,000 km</option>
                    <option [value]="50000">50,000 km</option>
                    <option [value]="100000">100,000 km</option>
                  </select>
                  <span class="text-zinc-500 font-bold">-</span>
                  <select
                    [(ngModel)]="filterMaxMileage"
                    aria-label="Mileage Max"
                    class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold"
                  >
                    <option [value]="0">Max</option>
                    <option [value]="50000">50,000 km</option>
                    <option [value]="100000">100,000 km</option>
                    <option [value]="200000">200,000 km</option>
                  </select>
                </div>
              </div>

              <!-- 14. Color -->
              <div class="flex items-center gap-2 text-xs">
                <label for="filter-color" class="w-20 font-bold text-zinc-800 shrink-0">Color</label>
                <select
                  id="filter-color"
                  [(ngModel)]="filterColor"
                  class="flex-1 bg-white border border-zinc-300 rounded p-2 text-xs font-bold text-zinc-900"
                >
                  <option value="">All</option>
                  <option value="Noir">Black / Noir</option>
                  <option value="Blanc">White / Blanc</option>
                  <option value="Gris">Silver / Gris</option>
                  <option value="Bleu">Blue / Bleu</option>
                  <option value="Rouge">Red / Rouge</option>
                </select>
              </div>

              <!-- 15. Accordions: Show more options & Show accessories -->
              <div class="space-y-1.5 pt-1">
                <button
                  type="button"
                  (click)="showMoreOptions.set(!showMoreOptions())"
                  class="w-full bg-[#E5E7EB] hover:bg-zinc-300 text-[#EA580C] font-black py-2.5 px-3 rounded text-xs uppercase flex items-center justify-between cursor-pointer"
                >
                  <span>SHOW MORE OPTIONS (1)</span>
                  <mat-icon class="scale-75 text-zinc-700">{{ showMoreOptions() ? 'expand_less' : 'expand_more' }}</mat-icon>
                </button>

                @if (showMoreOptions()) {
                  <div class="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs space-y-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" [(ngModel)]="filterDiscountOnly" class="rounded text-[#EA580C]" />
                      <span class="font-bold text-zinc-800">Special Discount Only (Promotions)</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" [(ngModel)]="filterBonusPointsOnly" class="rounded text-[#EA580C]" />
                      <span class="font-bold text-zinc-800">Bonus Points Vehicles Only</span>
                    </label>
                  </div>
                }

                <button
                  type="button"
                  (click)="showAccessories.set(!showAccessories())"
                  class="w-full bg-[#E5E7EB] hover:bg-zinc-300 text-zinc-700 font-black py-2.5 px-3 rounded text-xs uppercase flex items-center justify-between cursor-pointer"
                >
                  <span>SHOW ACCESSORIES (0)</span>
                  <mat-icon class="scale-75 text-zinc-700">{{ showAccessories() ? 'expand_less' : 'expand_more' }}</mat-icon>
                </button>

                @if (showAccessories()) {
                  <div class="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs grid grid-cols-2 gap-1.5">
                    <span class="text-zinc-600 font-medium">Climatisation (A/C)</span>
                    <span class="text-zinc-600 font-medium">Toit Ouvrant (Sunroof)</span>
                    <span class="text-zinc-600 font-medium">Sellerie Cuir</span>
                    <span class="text-zinc-600 font-medium">Caméra de Recul</span>
                  </div>
                }
              </div>

              <!-- 16. Orange Search Button & Reset Filters Button -->
              <div class="space-y-2 pt-2">
                <button
                  type="button"
                  (click)="applyFiltersAndClose()"
                  class="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-black py-3 rounded text-sm uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  <mat-icon class="scale-90">search</mat-icon>
                  <span>SEARCH</span>
                </button>

                <button
                  type="button"
                  (click)="clearFilters()"
                  class="w-full bg-[#E5E7EB] hover:bg-zinc-300 text-zinc-800 font-black py-2.5 rounded text-xs uppercase cursor-pointer transition-colors"
                >
                  RESET FILTERS
                </button>
              </div>

              <!-- 17. Bottom Links -->
              <div class="text-center pt-3 pb-8 space-y-2 text-xs">
                <button type="button" (click)="scrollToTop()" class="text-zinc-700 font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer">
                  <span>Page to Top</span>
                  <span class="text-orange-600">▲</span>
                </button>
                <div>
                  <button type="button" (click)="isFilterModalOpen.set(false)" class="text-zinc-800 font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer">
                    <span class="text-orange-600">◀</span>
                    <span>Back</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Sticky Bottom Action Bar matching interface_filtre_6edc3bc3.png -->
            <div class="fixed bottom-0 inset-x-0 bg-black/90 p-2.5 flex items-center gap-2 z-30 shadow-2xl">
              <button
                type="button"
                (click)="clearFilters()"
                class="bg-[#E5E7EB] hover:bg-zinc-300 text-zinc-900 font-black px-4 py-2.5 rounded text-xs uppercase cursor-pointer"
              >
                RESET
              </button>
              <button
                type="button"
                (click)="applyFiltersAndClose()"
                class="flex-1 bg-[#EA580C] hover:bg-[#C2410C] text-white font-black py-2.5 px-3 rounded text-xs uppercase flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                <span class="text-yellow-300 font-mono font-bold">{{ displayedVehicles().length }} items match</span>
                <mat-icon class="scale-75">search</mat-icon>
                <span>SEARCH</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Burger Drawer Menu -->
      @if (isDrawerOpen()) {
        <div class="fixed inset-0 z-50 flex">
          <button
            type="button"
            (click)="isDrawerOpen.set(false)"
            aria-label="Fermer le menu"
            class="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity border-0 p-0 cursor-pointer w-full h-full"
          ></button>

          <div class="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div class="bg-[#1A1A1A] text-white p-4 border-b-2 border-red-600 flex items-center justify-between">
              <div class="flex items-center gap-1 font-black text-sm">
                <span class="bg-red-600 text-white px-1.5 py-0.5 rounded">AUTO</span>
                <span>FORWARD</span>
              </div>
              <button type="button" (click)="isDrawerOpen.set(false)" class="text-zinc-300 hover:text-white cursor-pointer">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <div class="p-4 space-y-3 text-xs font-bold text-blue-900">
              <button (click)="navigateToHome(); isDrawerOpen.set(false)" class="block w-full text-left py-2 hover:text-red-600 cursor-pointer">
                🏠 Accueil Stocklist
              </button>
              <button (click)="isFilterModalOpen.set(true); isDrawerOpen.set(false)" class="block w-full text-left py-2 text-orange-600 hover:underline cursor-pointer">
                🔍 Modifier les Filtres
              </button>
              <button (click)="vehicleService.openFavoritesModal(); isDrawerOpen.set(false)" class="block w-full text-left py-2 hover:text-red-600 cursor-pointer">
                ❤️ Mes Favoris ({{ vehicleService.favoriteIds().length }})
              </button>
              <button (click)="authService.openLogin(); isDrawerOpen.set(false)" class="block w-full text-left py-2 hover:text-red-600 cursor-pointer">
                👤 Mon Compte Client
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class MobileCategoryPageComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);
  readonly priceAlertService = inject(PriceAlertService);
  readonly authService = inject(AuthService);

  readonly isFilterModalOpen = signal<boolean>(false);
  readonly isDrawerOpen = signal<boolean>(false);
  readonly isCalculatorOpen = signal<boolean>(false);
  readonly showMoreOptions = signal<boolean>(false);
  readonly showAccessories = signal<boolean>(false);

  searchKeyword = '';
  filterMake = '';
  filterModel = '';
  filterModelCode = '';
  filterType = '';
  filterMinYear = 0;
  filterMaxYear = 0;
  filterMinMonth = 0;
  filterMaxMonth = 0;
  filterMinPrice = 0;
  filterMaxPrice = 0;
  readonly filterSteering = signal<'all' | 'Left Hand Drive' | 'Right Hand Drive'>('all');
  filterFuel = 'all';
  readonly filterTransmission = signal<'any' | 'Automatique' | 'Manuelle'>('any');
  filterMinEngine = 0;
  filterMaxEngine = 0;
  filterMinMileage = 0;
  filterMaxMileage = 0;
  filterColor = '';
  filterDiscountOnly = false;
  filterBonusPointsOnly = false;
  sortBy = 'discount';

  readonly yearsList = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010, 2008, 2005];

  readonly allMakes = [
    'TOYOTA',
    'NISSAN',
    'HONDA',
    'MAZDA',
    'MERCEDES-BENZ',
    'BMW',
    'MITSUBISHI',
    'SUZUKI',
    'SUBARU',
    'VOLKSWAGEN',
    'VOLVO',
    'MAN',
  ];

  readonly contextTitle = computed(() => {
    return this.vehicleService.selectedModelContext()?.title ?? 'Stocklist';
  });

  readonly contextSubtitle = computed(() => {
    return this.vehicleService.selectedModelContext()?.subtitle ?? 'Best Value Used Cars for Sale';
  });

  readonly activeSearchTag = computed(() => {
    const ctx = this.vehicleService.selectedModelContext();
    if (this.filterMake) return this.filterMake;
    if (this.filterType) return this.filterType;
    if (this.searchKeyword) return `"${this.searchKeyword}"`;
    return ctx?.title ?? 'Happy October Sale';
  });

  readonly availableModels = computed(() => {
    const list = this.vehicleService.vehicles();
    if (!this.filterMake) {
      return Array.from(new Set(list.map((v) => v.model))).slice(0, 20);
    }
    return Array.from(new Set(list.filter((v) => v.make === this.filterMake).map((v) => v.model)));
  });

  readonly displayedVehicles = computed(() => {
    let list = this.vehicleService.vehicles();

    // 1. Context filter from vehicleService
    const ctx = this.vehicleService.selectedModelContext();
    if (ctx) {
      if (ctx.criterionType === 'make' && ctx.make) {
        list = list.filter((v) => v.make.toUpperCase() === ctx.make!.toUpperCase());
      } else if (ctx.criterionType === 'category' && ctx.category) {
        list = list.filter((v) => v.category.toLowerCase() === ctx.category!.toLowerCase());
      } else if (ctx.criterionType === 'stock' && ctx.criterionValue) {
        list = list.filter((v) => v.stockCountry.toLowerCase().includes(ctx.criterionValue!.toLowerCase()));
      } else if (ctx.criterionType === 'discount') {
        list = list.filter((v) => (v.discountPercent ?? 0) >= 10 || v.isSpecialOffer);
      } else if (ctx.criterionType === 'special') {
        list = list.filter((v) => v.pointsReward >= 20 || v.isSpecialOffer);
      } else if (ctx.criterionType === 'recent') {
        const ids = this.vehicleService.recentlyViewedIds();
        if (ids.length > 0) {
          const map = new Map(list.map((v) => [v.id, v]));
          const recent = ids.map((id) => map.get(id)).filter((v): v is Vehicle => !!v);
          if (recent.length > 0) list = recent;
        }
      }
    }

    // 2. Local filters from pop-up modal
    if (this.searchKeyword.trim()) {
      const kw = this.searchKeyword.toLowerCase().trim();
      list = list.filter((v) => v.make.toLowerCase().includes(kw) || v.model.toLowerCase().includes(kw) || v.category.toLowerCase().includes(kw));
    }
    if (this.filterMake) {
      list = list.filter((v) => v.make === this.filterMake);
    }
    if (this.filterModel) {
      list = list.filter((v) => v.model === this.filterModel);
    }
    if (this.filterModelCode) {
      list = list.filter((v) => v.chassisCode.toLowerCase().includes(this.filterModelCode.toLowerCase()));
    }
    if (this.filterType) {
      list = list.filter((v) => v.category === this.filterType);
    }
    if (this.filterMinYear > 0) {
      list = list.filter((v) => v.year >= this.filterMinYear);
    }
    if (this.filterMaxYear > 0) {
      list = list.filter((v) => v.year <= this.filterMaxYear);
    }
    if (this.filterMinPrice > 0) {
      list = list.filter((v) => v.priceUsd >= this.filterMinPrice);
    }
    if (this.filterMaxPrice > 0) {
      list = list.filter((v) => v.priceUsd <= this.filterMaxPrice);
    }
    if (this.filterSteering() !== 'all') {
      list = list.filter((v) => v.steering === this.filterSteering());
    }
    if (this.filterFuel !== 'all') {
      list = list.filter((v) => v.fuel.toLowerCase().includes(this.filterFuel.toLowerCase()));
    }
    if (this.filterTransmission() !== 'any') {
      list = list.filter((v) => v.transmission === this.filterTransmission());
    }
    if (this.filterMinMileage > 0) {
      list = list.filter((v) => v.mileageKm >= this.filterMinMileage);
    }
    if (this.filterMaxMileage > 0) {
      list = list.filter((v) => v.mileageKm <= this.filterMaxMileage);
    }
    if (this.filterColor) {
      list = list.filter((v) => v.color.toLowerCase().includes(this.filterColor.toLowerCase()));
    }
    if (this.filterDiscountOnly) {
      list = list.filter((v) => (v.discountPercent ?? 0) >= 10);
    }
    if (this.filterBonusPointsOnly) {
      list = list.filter((v) => v.pointsReward >= 20);
    }

    // 3. Sorting
    const sorted = [...list];
    if (this.sortBy === 'price_asc') {
      sorted.sort((a, b) => a.priceUsd - b.priceUsd);
    } else if (this.sortBy === 'price_desc') {
      sorted.sort((a, b) => b.priceUsd - a.priceUsd);
    } else if (this.sortBy === 'year_desc') {
      sorted.sort((a, b) => b.year - a.year);
    } else if (this.sortBy === 'mileage_asc') {
      sorted.sort((a, b) => a.mileageKm - b.mileageKm);
    } else {
      // default: discount
      sorted.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
    }

    return sorted;
  });

  activeFilterCount(): number {
    let count = 0;
    if (this.searchKeyword) count++;
    if (this.filterMake) count++;
    if (this.filterModel) count++;
    if (this.filterType) count++;
    if (this.filterSteering() !== 'all') count++;
    if (this.filterTransmission() !== 'any') count++;
    if (this.filterFuel !== 'all') count++;
    if (this.filterMinPrice > 0 || this.filterMaxPrice > 0) count++;
    if (this.filterMinYear > 0 || this.filterMaxYear > 0) count++;
    if (this.filterDiscountOnly) count++;
    return count > 0 ? count : 1;
  }

  isFav(id: string): boolean {
    return this.vehicleService.favoriteIds().includes(id);
  }

  toggleFavorite(id: string) {
    if (this.isFav(id)) {
      this.vehicleService.removeFavorite(id);
    } else {
      this.vehicleService.favoriteIds.update((ids) => [...ids, id]);
    }
  }

  openVehicleDetail(veh: Vehicle) {
    this.vehicleService.selectVehicle(veh);
  }

  navigateToHome() {
    this.vehicleService.navigateToHome();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  applyKeywordSearch() {
    this.isFilterModalOpen.set(false);
  }

  applyFiltersAndClose() {
    this.isFilterModalOpen.set(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  clearFilters() {
    this.searchKeyword = '';
    this.filterMake = '';
    this.filterModel = '';
    this.filterModelCode = '';
    this.filterType = '';
    this.filterMinYear = 0;
    this.filterMaxYear = 0;
    this.filterMinMonth = 0;
    this.filterMaxMonth = 0;
    this.filterMinPrice = 0;
    this.filterMaxPrice = 0;
    this.filterSteering.set('all');
    this.filterFuel = 'all';
    this.filterTransmission.set('any');
    this.filterMinEngine = 0;
    this.filterMaxEngine = 0;
    this.filterMinMileage = 0;
    this.filterMaxMileage = 0;
    this.filterColor = '';
    this.filterDiscountOnly = false;
    this.filterBonusPointsOnly = false;
  }

  onCountryChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.lang.setCountry(val);
  }

  onPortChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.vehicleService.selectedPortId.set(val);
  }

  onCurrencyChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value as any;
    this.lang.setCurrency(val);
  }

  scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
