import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService, CurrencyCode } from '../../services/language';
import { VehicleService } from '../../services/vehicle';
import { LanguageCode } from '../../i18n/translations';
import { ViewModeService } from '../../services/view-mode';
import { AuthService } from '../../services/auth';
import { PriceAlertService } from '../../services/price-alert';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, SidebarComponent],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    <!-- Main Black & Red Navigation Header (header.png) -->
    <!-- 1. Dark Sub-Header (Live Telemetry & Global Controls) -->
    <div class="bg-[#121212] text-[#D1D5DB] text-xs border-b border-zinc-800">
      <div class="max-w-[1440px] mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-3">
        <!-- Live Market Info -->
        <div class="flex items-center flex-wrap gap-4 text-[11px] text-zinc-300">
          <span class="font-bold text-white tracking-tight">AUTOFOWARD: {{ lang.t('usedCarsForSale') }}</span>
          <span class="hidden md:inline text-zinc-500">|</span>
          <span class="hidden md:inline">{{ lang.t('carsInStock') }}: <strong class="text-white font-mono">502,865</strong></span>
          <span class="hidden lg:inline text-zinc-500">|</span>
          <span class="hidden lg:inline">{{ lang.t('carsAddedToday') }}: <strong class="text-amber-400 font-mono">8,780</strong></span>
          <span class="hidden xl:inline text-zinc-500">|</span>
          <span class="hidden xl:inline flex items-center gap-1">
            <mat-icon class="text-xs scale-75 text-zinc-400">schedule</mat-icon>
            <span>{{ lang.t('japanTime') }}: {{ japanTime() }}</span>
          </span>
        </div>

        <!-- Language, Country, Currency Controls (CSS Selectors 1, 2, 3) -->
        <div class="flex items-center gap-3 text-xs">
          <!-- 1. Destination Country (div:nth-of-type(1)) -->
          <div
            role="button"
            tabindex="0"
            class="relative flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700 transition-colors cursor-pointer group select-none"
            (click)="toggleMenu('country', $event)"
            (keydown.enter)="toggleMenu('country', $event)"
            (mouseenter)="onElementMouseEnter('country')"
            (mouseleave)="onElementMouseLeave()"
          >
            <span class="text-zinc-400 text-[10px]">{{ lang.t('countryLabel') }}:</span>
            <div class="flex items-center gap-1 text-white font-semibold text-xs">
              <span>{{ lang.selectedCountry().flag }}</span>
              <span class="hidden sm:inline">{{ lang.selectedCountry().name }}</span>
              <mat-icon
                class="text-xs scale-75 text-zinc-400 transition-transform duration-200"
                [class.rotate-180]="activeHoverMenu() === 'country'"
              >
                expand_more
              </mat-icon>
            </div>

            <!-- Dropdown Menu: Country -->
            @if (activeHoverMenu() === 'country') {
              <div
                class="nav-dropdown absolute left-0 top-full mt-1.5 w-64 bg-[#18181b] border border-zinc-700 rounded-xl shadow-2xl p-2.5 z-50 text-white animate-fadeIn"
              >
                <div class="text-[11px] font-bold text-zinc-400 px-2 py-1 border-b border-zinc-800 flex items-center justify-between">
                  <span>{{ lang.t('countryLabel') }} (Port d'arrivée)</span>
                  <span class="text-[10px] text-amber-400">RDC & Afrique</span>
                </div>
                <div class="max-h-60 overflow-y-auto mt-1 space-y-0.5">
                  @for (c of lang.countries; track c.code) {
                    <button
                      type="button"
                      (click)="selectCountry(c.code)"
                      class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 transition-colors flex items-center justify-between text-xs cursor-pointer"
                      [class.bg-zinc-800]="lang.currentCountry() === c.code"
                      [class.text-amber-400]="lang.currentCountry() === c.code"
                    >
                      <span class="flex items-center gap-2">
                        <span class="text-base">{{ c.flag }}</span>
                        <span class="font-medium">{{ c.name }}</span>
                      </span>
                      <span class="text-[10px] text-zinc-400 font-mono">{{ c.primaryPort }}</span>
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          <!-- 2. Currency Selector (div:nth-of-type(2)) -->
          <div
            role="button"
            tabindex="0"
            class="relative flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700 transition-colors cursor-pointer group select-none"
            (click)="toggleMenu('currency', $event)"
            (keydown.enter)="toggleMenu('currency', $event)"
            (mouseenter)="onElementMouseEnter('currency')"
            (mouseleave)="onElementMouseLeave()"
          >
            <span class="text-zinc-400 text-[10px]">{{ lang.t('currencyLabel') }}:</span>
            <div class="flex items-center gap-1 text-amber-400 font-bold text-xs">
              <span>{{ lang.currentCurrency() }}</span>
              <span class="text-zinc-400 font-normal">({{ lang.selectedCurrencyConfig().symbol }})</span>
              <mat-icon
                class="text-xs scale-75 text-zinc-400 transition-transform duration-200"
                [class.rotate-180]="activeHoverMenu() === 'currency'"
              >
                expand_more
              </mat-icon>
            </div>

            <!-- Dropdown Menu: Currency -->
            @if (activeHoverMenu() === 'currency') {
              <div
                class="nav-dropdown absolute left-0 top-full mt-1.5 w-56 bg-[#18181b] border border-zinc-700 rounded-xl shadow-2xl p-2.5 z-50 text-white animate-fadeIn"
              >
                <div class="text-[11px] font-bold text-zinc-400 px-2 py-1 border-b border-zinc-800 flex items-center justify-between">
                  <span>{{ lang.t('currencyLabel') }}</span>
                  <span class="text-[10px] text-amber-400">Taux direct</span>
                </div>
                <div class="mt-1 space-y-0.5">
                  @for (curr of lang.currencies; track curr.code) {
                    <button
                      type="button"
                      (click)="selectCurrency(curr.code)"
                      class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 transition-colors flex items-center justify-between text-xs cursor-pointer"
                      [class.bg-zinc-800]="lang.currentCurrency() === curr.code"
                      [class.text-amber-400]="lang.currentCurrency() === curr.code"
                    >
                      <span class="font-bold">{{ curr.code }} ({{ curr.symbol }})</span>
                      <span class="text-[10px] text-zinc-400">{{ curr.name }}</span>
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          <!-- 3. Multilingual Language Selector (div:nth-of-type(3)) -->
          <div
            role="button"
            tabindex="0"
            class="relative flex items-center gap-1.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white px-2.5 py-1 rounded transition-colors cursor-pointer border border-red-500 shadow-xs group select-none"
            (click)="toggleMenu('language', $event)"
            (keydown.enter)="toggleMenu('language', $event)"
            (mouseenter)="onElementMouseEnter('language')"
            (mouseleave)="onElementMouseLeave()"
          >
            <mat-icon class="text-xs scale-75">translate</mat-icon>
            <span class="text-white font-bold text-xs uppercase">{{ lang.currentLang() }}</span>
            <mat-icon
              class="text-xs scale-75 text-white/80 transition-transform duration-200"
              [class.rotate-180]="activeHoverMenu() === 'language'"
            >
              expand_more
            </mat-icon>

            <!-- Dropdown Menu: Language -->
            @if (activeHoverMenu() === 'language') {
              <div
                class="nav-dropdown absolute right-0 top-full mt-1.5 w-48 bg-[#18181b] border border-zinc-700 rounded-xl shadow-2xl p-2.5 z-50 text-white animate-fadeIn"
              >
                <div class="text-[11px] font-bold text-zinc-400 px-2 py-1 border-b border-zinc-800">
                  <span>{{ lang.t('languageLabel') }}</span>
                </div>
                <div class="mt-1 space-y-0.5">
                  @for (l of lang.languages; track l.code) {
                    <button
                      type="button"
                      (click)="selectLanguage(l.code)"
                      class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 transition-colors flex items-center gap-2 text-xs cursor-pointer"
                      [class.bg-zinc-800]="lang.currentLang() === l.code"
                      [class.text-red-400]="lang.currentLang() === l.code"
                    >
                      <span class="text-base">{{ l.flag }}</span>
                      <span class="font-medium">{{ l.name }}</span>
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Main Black & Red Navigation Bar -->
    <header class="bg-[#1A1A1A] text-white shadow-md border-b-2 border-[#DC2626]">
      <div class="max-w-[1440px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <!-- Small screens Burger Button for Left Column Elements -->
          <button
            type="button"
            (click)="isHeaderBurgerOpen.set(true)"
            class="lg:hidden flex items-center justify-center p-2 rounded bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 cursor-pointer border border-zinc-700"
            title="Menu & Filtres (Colonne Gauche)"
          >
            <mat-icon>menu</mat-icon>
          </button>

          <!-- Logo / Wordmark in Red, Black, White -->
          <a
            href="/"
            (click)="vehicleService.navigateToHome(); $event.preventDefault()"
            class="flex items-center gap-2 group cursor-pointer"
          >
            <div class="bg-[#DC2626] text-white font-black text-xl px-2.5 py-1 rounded tracking-tighter flex items-center shadow-md group-hover:bg-red-700 transition-colors">
              <span>AUTO</span>
              <span class="text-amber-300 ml-0.5">FORWARD</span>
              <mat-icon class="scale-90 ml-0.5 font-bold">arrow_forward</mat-icon>
            </div>
          </a>
        </div>

        <!-- Universal Search Input Bar (Signature Japanese Export Portal Style) -->
        <div class="flex-1 max-w-2xl min-w-[260px]">
          <div class="flex items-center rounded overflow-hidden shadow-inner border-2 border-[#DC2626] bg-white">
            <div class="bg-zinc-100 px-3 py-2 text-zinc-700 text-xs font-semibold border-r border-zinc-300 hidden sm:flex items-center gap-1 shrink-0">
              <span>{{ lang.t('byKeyword') }}</span>
              <mat-icon class="text-xs scale-75">arrow_drop_down</mat-icon>
            </div>
            <input
              type="text"
              [placeholder]="lang.t('searchPlaceholder')"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              (keyup.enter)="triggerSearch()"
              class="flex-1 px-3 py-2 text-zinc-900 text-sm outline-none placeholder:text-zinc-400"
            />
            <button
              (click)="triggerSearch()"
              class="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-5 py-2 text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <mat-icon class="text-base">search</mat-icon>
              <span class="hidden sm:inline">{{ lang.t('searchBtn') }}</span>
            </button>
          </div>
        </div>

        <!-- Header Actions: Favorites, Admin & Auth -->
        <div class="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
          <!-- Favorites -->
          <a
            href="#favorites"
            (click)="openFavoritesModal($event)"
            class="flex items-center gap-1.5 text-zinc-200 hover:text-white transition-all cursor-pointer bg-zinc-800/80 hover:bg-zinc-800 px-2.5 py-1.5 rounded border border-zinc-700/60 shadow-xs"
          >
            <div class="relative flex items-center justify-center">
              <mat-icon class="text-red-500 scale-105">favorite</mat-icon>
              @if (vehicleService.favoriteIds().length > 0) {
                <span class="absolute -top-1.5 -right-2 bg-red-600 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-black shadow-xs">
                  {{ vehicleService.favoriteIds().length }}
                </span>
              }
            </div>
            <span class="hidden md:inline font-bold">{{ lang.t('favorites') }}</span>
          </a>

          <!-- Price Drop Alerts Shortcut -->
          <button
            type="button"
            (click)="priceAlertService.openModal()"
            class="flex items-center gap-1.5 text-zinc-200 hover:text-white transition-all cursor-pointer bg-zinc-800/80 hover:bg-zinc-800 px-2.5 py-1.5 rounded border border-zinc-700/60 shadow-xs"
            title="Alerte Baisse de Prix"
          >
            <div class="relative flex items-center justify-center">
              <mat-icon class="text-amber-400 scale-100">notifications_active</mat-icon>
              @if (priceAlertService.alerts().length > 0) {
                <span class="absolute -top-1.5 -right-2 bg-red-600 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-black shadow-xs">
                  {{ priceAlertService.alerts().length }}
                </span>
              }
            </div>
            <span class="hidden lg:inline font-bold">Alertes Prix</span>
          </button>

          <!-- Admin / Platform Owner Console Button (When Admin is Logged In) -->
          @if (authService.isAdmin()) {
            <button
              type="button"
              (click)="authService.openAdminPanel()"
              class="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-2.5 py-1.5 rounded font-black text-xs shadow-md transition-all cursor-pointer border border-amber-300/80"
              title="Console Propriétaire Indépendant"
            >
              <mat-icon class="text-sm scale-90 text-amber-300">admin_panel_settings</mat-icon>
              <span class="hidden sm:inline">Admin Propriétaire</span>
              <span class="sm:hidden">Admin</span>
            </button>
          }

          <!-- Account Sign In Button (Targeted Element: leads to Login Form) -->
          <button
            type="button"
            (click)="openLoginModal()"
            class="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded border border-zinc-700 transition-colors cursor-pointer shadow-xs"
            [title]="authService.currentUser() ? 'Mon Espace' : 'Se connecter'"
          >
            <mat-icon class="text-sm scale-90 text-red-500">
              {{ authService.currentUser() ? 'account_circle' : 'login' }}
            </mat-icon>
            @if (authService.currentUser(); as user) {
              <span class="font-bold text-amber-300 max-w-[95px] truncate">{{ user.fullName }}</span>
            } @else {
              <span class="font-bold">{{ lang.t('loginOnly') }}</span>
            }
          </button>

          <!-- Inscription (Register) Button: leads to registration form -->
          @if (!authService.currentUser()) {
            <button
              type="button"
              (click)="openRegisterModal()"
              class="hidden sm:flex items-center gap-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-2.5 py-1.5 rounded transition-colors cursor-pointer shadow-xs font-bold"
              title="Créer un compte AutoForward"
            >
              <mat-icon class="text-sm scale-90">person_add</mat-icon>
              <span>{{ lang.t('registerOnly') }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Slide-Over Drawer for Mobile Header (Left Column filters & nav) -->
      @if (isHeaderBurgerOpen()) {
        <div class="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            (click)="isHeaderBurgerOpen.set(false)"
            aria-label="Fermer le menu"
            class="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity border-0 p-0 cursor-pointer w-full h-full"
          ></button>

          <div class="relative w-4/5 max-w-sm bg-white text-zinc-900 h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div class="bg-[#1A1A1A] text-white p-4 border-b-2 border-red-600 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-1 font-black text-sm">
                <span class="bg-red-600 text-white px-1.5 py-0.5 rounded">AUTO</span>
                <span>FORWARD</span>
              </div>
              <button
                type="button"
                (click)="isHeaderBurgerOpen.set(false)"
                class="text-zinc-300 hover:text-white cursor-pointer"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>

            @if (authService.isAdmin()) {
              <div class="bg-zinc-900 text-white p-3 border-b border-zinc-800 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-amber-400 text-sm">admin_panel_settings</mat-icon>
                  <span class="text-xs font-black">Propriétaire Connecté</span>
                </div>
                <button
                  type="button"
                  (click)="isHeaderBurgerOpen.set(false); authService.openAdminPanel()"
                  class="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-2 py-1 rounded cursor-pointer"
                >
                  Console Admin
                </button>
              </div>
            }

            <div class="p-3 bg-zinc-50 border-b border-zinc-200">
              <div class="text-[11px] font-black uppercase text-zinc-800 mb-2 flex items-center gap-1.5">
                <mat-icon class="text-xs text-red-600">filter_list</mat-icon>
                <span>Filtres & Sélection (Colonne Gauche)</span>
              </div>
              <app-sidebar />
            </div>

            <div class="p-3 bg-zinc-100 border-t border-zinc-200 shrink-0">
              <button
                type="button"
                (click)="isHeaderBurgerOpen.set(false)"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-2.5 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <mat-icon class="text-sm">check</mat-icon>
                <span>Voir les Véhicules ({{ vehicleService.filteredVehicles().length }})</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Secondary Categorized Navigation Bar -->
      <div class="bg-[#242424] text-xs text-zinc-300 border-t border-zinc-800 relative z-30">
        <div class="max-w-[1440px] mx-auto px-4 py-1.5 flex items-center justify-between gap-6 whitespace-nowrap overflow-visible relative">
          <!-- Left Elements: Used Vehicles, Auto Parts, Salvage Cars -->
          <div class="flex items-center gap-6">
            <!-- 1. Used Vehicles (button:nth-of-type(1)) -->
            <button
              type="button"
              (click)="onUsedVehiclesClick($event)"
              (mouseenter)="onElementMouseEnter('used-vehicles')"
              (mouseleave)="onElementMouseLeave()"
              class="relative group flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer font-bold text-amber-400 py-1 select-none"
            >
              <mat-icon class="text-sm scale-90">directions_car</mat-icon>
              <span>{{ lang.t('usedVehicles') }}</span>
              <mat-icon
                class="text-[13px] w-3 h-3 text-amber-400/80 transition-transform duration-200"
                [class.rotate-180]="activeHoverMenu() === 'used-vehicles'"
              >
                expand_more
              </mat-icon>

              <!-- Hover Menu: Used Vehicles -->
              <div
                class="nav-dropdown absolute left-0 top-full pt-2 z-50 text-left whitespace-normal cursor-default font-normal pointer-events-auto min-w-[620px] animate-fadeIn"
                [class.hidden]="activeHoverMenu() !== 'used-vehicles'"
                [class.block]="activeHoverMenu() === 'used-vehicles'"
              >
                <div class="bg-[#18181b] border border-zinc-700 rounded-xl shadow-2xl p-4 text-zinc-200 text-xs backdrop-blur-md ring-1 ring-black/50">
                  <!-- Header -->
                  <div class="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                        <mat-icon class="text-base scale-90">car_rental</mat-icon>
                      </div>
                      <div>
                        <div class="font-bold text-sm text-white">Catalogue Véhicules d'Occasion Japon</div>
                        <div class="text-[11px] text-zinc-400">+15,000 véhicules vérifiés JEVIC • Prêts pour Boma, Matadi & Dar es Salaam</div>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      Stock direct
                    </span>
                  </div>

                  <!-- 3 Columns -->
                  <div class="grid grid-cols-3 gap-4">
                    <!-- Col 1: Carrosseries -->
                    <div>
                      <div class="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1">
                        <mat-icon class="text-[13px] w-3 h-3">tune</mat-icon>
                        <span>Carrosseries</span>
                      </div>
                      <div class="space-y-1">
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByBody('SUV')"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>SUV & 4x4 Tout-Terrain</span>
                          <span class="text-[10px] text-zinc-400 font-mono">1,840+</span>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByBody('Berline')"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>Berlines & Compactes</span>
                          <span class="text-[10px] text-zinc-400 font-mono">920+</span>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByBody('Camion')"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>Pickups & Utilitaires</span>
                          <span class="text-[10px] text-zinc-400 font-mono">650+</span>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByBody('Van')"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>Minibus & Vans (7-15 pl.)</span>
                          <span class="text-[10px] text-zinc-400 font-mono">430+</span>
                        </div>
                      </div>
                    </div>

                    <!-- Col 2: Marques -->
                    <div>
                      <div class="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1">
                        <mat-icon class="text-[13px] w-3 h-3">stars</mat-icon>
                        <span>Marques Réputées</span>
                      </div>
                      <div class="space-y-1">
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByMake('Toyota')"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span class="font-medium text-amber-200">Toyota (Hilux, Prado)</span>
                          <span class="text-[10px] text-amber-400/90 font-bold">Top RDC</span>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByMake('Nissan')"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>Nissan (X-Trail, Patrol)</span>
                          <span class="text-[10px] text-zinc-400 font-mono">740+</span>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByMake('Mitsubishi')"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>Mitsubishi (Pajero, Canter)</span>
                          <span class="text-[10px] text-zinc-400 font-mono">510+</span>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByMake('Honda')"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>Honda (CR-V, Vezel)</span>
                          <span class="text-[10px] text-zinc-400 font-mono">380+</span>
                        </div>
                      </div>
                    </div>

                    <!-- Col 3: Budgets CIF -->
                    <div>
                      <div class="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1">
                        <mat-icon class="text-[13px] w-3 h-3">payments</mat-icon>
                        <span>Budgets CIF RDC</span>
                      </div>
                      <div class="space-y-1">
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByPrice(0, 5000)"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>Moins de $5,000</span>
                          <span class="text-[10px] text-emerald-400 font-medium">Économique</span>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByPrice(5000, 10000)"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>$5,000 - $10,000</span>
                          <span class="text-[10px] text-amber-400 font-medium">Populaire</span>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByPrice(10000, 20000)"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>$10,000 - $20,000</span>
                          <span class="text-[10px] text-zinc-400">Grand Confort</span>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByPrice(20000, 100000)"
                          class="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>Plus de $20,000</span>
                          <span class="text-[10px] text-purple-400 font-medium">Luxe & VIP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div class="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <div class="text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <mat-icon class="text-xs text-amber-400 scale-90">verified</mat-icon>
                      <span>Inspection JEVIC, odomètre certifié & B/L original inclus</span>
                    </div>
                    <div
                      role="button"
                      tabindex="0"
                      (click)="setCategoryFilter('')"
                      class="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir tout le stock</span>
                      <mat-icon class="text-xs scale-90">arrow_forward</mat-icon>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            <!-- 2. Auto Parts & Trucks (button:nth-of-type(2)) -->
            <button
              type="button"
              (click)="onAutoPartsClick($event)"
              (mouseenter)="onElementMouseEnter('auto-parts')"
              (mouseleave)="onElementMouseLeave()"
              class="relative group flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1 select-none"
            >
              <mat-icon class="text-sm scale-90 text-zinc-400 group-hover:text-amber-400">local_shipping</mat-icon>
              <span>{{ lang.t('autoParts') }}</span>
              <mat-icon
                class="text-[13px] w-3 h-3 text-zinc-500 transition-transform duration-200"
                [class.rotate-180]="activeHoverMenu() === 'auto-parts'"
              >
                expand_more
              </mat-icon>

              <!-- Hover Menu: Auto Parts & Trucks -->
              <div
                class="nav-dropdown absolute left-0 top-full pt-2 z-50 text-left whitespace-normal cursor-default font-normal pointer-events-auto min-w-[540px] animate-fadeIn"
                [class.hidden]="activeHoverMenu() !== 'auto-parts'"
                [class.block]="activeHoverMenu() === 'auto-parts'"
              >
                <div class="bg-[#18181b] border border-zinc-700 rounded-xl shadow-2xl p-4 text-zinc-200 text-xs backdrop-blur-md ring-1 ring-black/50">
                  <!-- Header -->
                  <div class="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                        <mat-icon class="text-base scale-90">build</mat-icon>
                      </div>
                      <div>
                        <div class="font-bold text-sm text-white">Pièces Détachées d'Origine & Utilitaires</div>
                        <div class="text-[11px] text-zinc-400">Composants mécaniques certifiés OEM & Camions légers / lourds Japon</div>
                      </div>
                    </div>
                  </div>

                  <!-- 2 Columns -->
                  <div class="grid grid-cols-2 gap-4">
                    <!-- Camions -->
                    <div class="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
                      <div class="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1">
                        <mat-icon class="text-[13px] w-3 h-3">fire_truck</mat-icon>
                        <span>Camions & Poids Lourds</span>
                      </div>
                      <div class="space-y-1.5">
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByKeyword('Canter')"
                          class="p-1.5 rounded hover:bg-zinc-800 cursor-pointer transition-colors block"
                        >
                          <div class="font-semibold text-white">Mitsubishi Fuso Canter</div>
                          <div class="text-[10px] text-zinc-400">Bennes, plateaux & frigorifiques 2T à 4T</div>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByKeyword('Elf')"
                          class="p-1.5 rounded hover:bg-zinc-800 cursor-pointer transition-colors block"
                        >
                          <div class="font-semibold text-white">Isuzu Elf & Forward</div>
                          <div class="text-[10px] text-zinc-400">Moteurs diesel 4HF1, 4HG1 très fiables</div>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByKeyword('Dyna')"
                          class="p-1.5 rounded hover:bg-zinc-800 cursor-pointer transition-colors block"
                        >
                          <div class="font-semibold text-white">Toyota Dyna & Hino Dutro</div>
                          <div class="text-[10px] text-zinc-400">Idéal pour transport urbain & commercial</div>
                        </div>
                      </div>
                    </div>

                    <!-- Organes OEM -->
                    <div class="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
                      <div class="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1">
                        <mat-icon class="text-[13px] w-3 h-3">settings</mat-icon>
                        <span>Organes & Pièces OEM</span>
                      </div>
                      <div class="space-y-1.5">
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByKeyword('Moteur')"
                          class="p-1.5 rounded hover:bg-zinc-800 cursor-pointer transition-colors block"
                        >
                          <div class="font-semibold text-white">Moteurs complets reconditionnés</div>
                          <div class="text-[10px] text-zinc-400">1HZ, 1KD, 2KD, TD27 testés sur banc</div>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByKeyword('Boîte')"
                          class="p-1.5 rounded hover:bg-zinc-800 cursor-pointer transition-colors block"
                        >
                          <div class="font-semibold text-white">Boîtes de vitesses 4x4 & Ponts</div>
                          <div class="text-[10px] text-zinc-400">Transmissions manuelles & différentiels renforcés</div>
                        </div>
                        <div
                          role="button"
                          tabindex="0"
                          (click)="filterByKeyword('Suspension')"
                          class="p-1.5 rounded hover:bg-zinc-800 cursor-pointer transition-colors block"
                        >
                          <div class="font-semibold text-white">Kits suspension tout-terrain</div>
                          <div class="text-[10px] text-zinc-400">Amortisseurs & lames spéciales pistes africaines</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div class="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <span class="text-[11px] text-zinc-400">Expédition par conteneur groupé vers Kinshasa & Lubumbashi</span>
                    <div
                      role="button"
                      tabindex="0"
                      (click)="setCategoryFilter('Camion')"
                      class="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir les camions en stock</span>
                      <mat-icon class="text-xs scale-90">arrow_forward</mat-icon>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            <!-- 3. Salvage Cars (button:nth-of-type(3)) -->
            <button
              type="button"
              (click)="onSalvageClick($event)"
              (mouseenter)="onElementMouseEnter('salvage-cars')"
              (mouseleave)="onElementMouseLeave()"
              class="relative group flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1 select-none"
            >
              <mat-icon class="text-sm scale-90 text-zinc-400 group-hover:text-red-400">car_crash</mat-icon>
              <span>{{ lang.t('salvageCars') }}</span>
              <mat-icon
                class="text-[13px] w-3 h-3 text-zinc-500 transition-transform duration-200"
                [class.rotate-180]="activeHoverMenu() === 'salvage-cars'"
              >
                expand_more
              </mat-icon>

              <!-- Hover Menu: Salvage Cars -->
              <div
                class="nav-dropdown absolute left-0 top-full pt-2 z-50 text-left whitespace-normal cursor-default font-normal pointer-events-auto min-w-[500px] animate-fadeIn"
                [class.hidden]="activeHoverMenu() !== 'salvage-cars'"
                [class.block]="activeHoverMenu() === 'salvage-cars'"
              >
                <div class="bg-[#18181b] border border-zinc-700 rounded-xl shadow-2xl p-4 text-zinc-200 text-xs backdrop-blur-md ring-1 ring-black/50">
                  <!-- Header -->
                  <div class="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                        <mat-icon class="text-base scale-90">local_offer</mat-icon>
                      </div>
                      <div>
                        <div class="font-bold text-sm text-white">Véhicules Accidentés & Bonnes Affaires</div>
                        <div class="text-[11px] text-zinc-400">Économisez de 30% à 60% avec des réparations légères</div>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800/60">
                      Jusqu'à -60%
                    </span>
                  </div>

                  <!-- Details -->
                  <div class="space-y-2">
                    <div
                      role="button"
                      tabindex="0"
                      (click)="filterByPrice(0, 4500)"
                      class="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors flex items-start gap-3"
                    >
                      <mat-icon class="text-amber-400 mt-0.5 text-base">minor_crash</mat-icon>
                      <div class="flex-1">
                        <div class="font-bold text-white flex items-center justify-between">
                          <span>Légers chocs carrosserie (Run & Drive)</span>
                          <span class="text-emerald-400 font-mono text-[11px]">Dès $2,200</span>
                        </div>
                        <div class="text-[11px] text-zinc-400 mt-0.5">
                          Moteur et châssis intacts. Uniquement tôle ou pare-choc à retoucher localement à Kinshasa.
                        </div>
                      </div>
                    </div>

                    <div
                      role="button"
                      tabindex="0"
                      (click)="filterByKeyword('Accidenté')"
                      class="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors flex items-start gap-3"
                    >
                      <mat-icon class="text-blue-400 mt-0.5 text-base">photo_camera</mat-icon>
                      <div class="flex-1">
                        <div class="font-bold text-white flex items-center justify-between">
                          <span>Rapport HD Transparent (40+ Photos)</span>
                          <span class="text-amber-400 font-mono text-[11px]">100% transparent</span>
                        </div>
                        <div class="text-[11px] text-zinc-400 mt-0.5">
                          Chaque impact est photographié au Japon en haute définition. Zéro surprise à l'arrivée au port.
                        </div>
                      </div>
                    </div>

                    <div
                      role="button"
                      tabindex="0"
                      (click)="filterByKeyword('Assurance')"
                      class="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors flex items-start gap-3"
                    >
                      <mat-icon class="text-purple-400 mt-0.5 text-base">receipt_long</mat-icon>
                      <div class="flex-1">
                        <div class="font-bold text-white flex items-center justify-between">
                          <span>Dédouanement à tarif réduit en RDC</span>
                          <span class="text-purple-400 font-mono text-[11px]">Droits allégés</span>
                        </div>
                        <div class="text-[11px] text-zinc-400 mt-0.5">
                          La valeur CIF d'achat réduite entraîne une taxation douanière proportionnellement avantageuse.
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div class="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <span class="text-[11px] text-zinc-400">Assistance mécanique locale disponible</span>
                    <div
                      role="button"
                      tabindex="0"
                      (click)="filterByPrice(0, 5000)"
                      class="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir les offres à petits prix</span>
                      <mat-icon class="text-xs scale-90">arrow_forward</mat-icon>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <!-- Right Elements: Local Service, Reviews, Help -->
          <div class="flex items-center gap-5 text-zinc-400 text-[11px]">
            <!-- 4. Local Service (a:nth-of-type(1)) -->
            <a
              href="#purchase-flow"
              (click)="onLocalServiceClick($event)"
              (mouseenter)="onElementMouseEnter('local-service')"
              (mouseleave)="onElementMouseLeave()"
              class="relative group hover:text-white transition-colors flex items-center gap-1 py-1 select-none"
            >
              <mat-icon class="text-xs scale-75 text-red-400">store</mat-icon>
              <span>{{ lang.t('localService') }}</span>
              <mat-icon
                class="text-[13px] w-3 h-3 text-zinc-500 transition-transform duration-200"
                [class.rotate-180]="activeHoverMenu() === 'local-service'"
              >
                expand_more
              </mat-icon>

              <!-- Hover Menu: Bureau Local RDC -->
              <div
                class="nav-dropdown absolute right-0 top-full pt-2 z-50 text-left whitespace-normal cursor-default font-normal pointer-events-auto min-w-[500px] animate-fadeIn"
                [class.hidden]="activeHoverMenu() !== 'local-service'"
                [class.block]="activeHoverMenu() === 'local-service'"
              >
                <div class="bg-[#18181b] border border-zinc-700 rounded-xl shadow-2xl p-4 text-zinc-200 text-xs backdrop-blur-md ring-1 ring-black/50">
                  <!-- Header -->
                  <div class="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                        <mat-icon class="text-base scale-90">domain</mat-icon>
                      </div>
                      <div>
                        <div class="font-bold text-sm text-white">Présence Locale & Accompagnement RDC</div>
                        <div class="text-[11px] text-zinc-400">Bureaux officiels à Kinshasa & Lubumbashi pour sécuriser votre commande</div>
                      </div>
                    </div>
                  </div>

                  <!-- Offices -->
                  <div class="grid grid-cols-2 gap-3 mb-3">
                    <div class="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800">
                      <div class="flex items-center gap-1.5 font-bold text-white mb-1">
                        <mat-icon class="text-xs text-red-400 scale-90">location_on</mat-icon>
                        <span>Kinshasa (Gombe)</span>
                      </div>
                      <div class="text-[11px] text-zinc-400 space-y-1">
                        <p>Bd du 30 Juin, Résidence Futur Tower</p>
                        <p class="text-zinc-200 font-mono font-medium">Tél / WhatsApp : +243 81 234 5678</p>
                        <p class="text-emerald-400 text-[10px]">Lun - Sam : 08h30 - 17h00</p>
                      </div>
                    </div>

                    <div class="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800">
                      <div class="flex items-center gap-1.5 font-bold text-white mb-1">
                        <mat-icon class="text-xs text-red-400 scale-90">location_on</mat-icon>
                        <span>Lubumbashi (Centre)</span>
                      </div>
                      <div class="text-[11px] text-zinc-400 space-y-1">
                        <p>Avenue Kilela Balanda, Centre d'Affaires</p>
                        <p class="text-zinc-200 font-mono font-medium">Tél / WhatsApp : +243 99 876 5432</p>
                        <p class="text-emerald-400 text-[10px]">Corridor transit Dar es Salaam</p>
                      </div>
                    </div>
                  </div>

                  <!-- Local Highlights -->
                  <div class="bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/60 space-y-1.5 text-[11px]">
                    <div class="flex items-center gap-2 text-zinc-300">
                      <mat-icon class="text-xs text-emerald-400 scale-75">check_circle</mat-icon>
                      <span>Paiement sécurisé par banque locale (Equity BCDC, Rawbank)</span>
                    </div>
                    <div class="flex items-center gap-2 text-zinc-300">
                      <mat-icon class="text-xs text-emerald-400 scale-75">check_circle</mat-icon>
                      <span>Remise en main propre des documents originaux DHL (B/L, Certificat JEVIC)</span>
                    </div>
                    <div class="flex items-center gap-2 text-zinc-300">
                      <mat-icon class="text-xs text-emerald-400 scale-75">check_circle</mat-icon>
                      <span>Assistance dédouanement aux ports de Boma, Matadi & Kasumbalesa</span>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div class="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <span class="text-[10px] text-zinc-400">Passez nous rendre visite sans rendez-vous</span>
                    <a
                      href="#purchase-flow"
                      class="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                    >
                      <span>Découvrir le parcours d'achat</span>
                      <mat-icon class="text-xs scale-90">arrow_forward</mat-icon>
                    </a>
                  </div>
                </div>
              </div>
            </a>

            <!-- 5. Reviews (a:nth-of-type(2)) -->
            <a
              href="#reviews"
              (click)="onReviewsClick($event)"
              (mouseenter)="onElementMouseEnter('reviews')"
              (mouseleave)="onElementMouseLeave()"
              class="relative group hover:text-white transition-colors flex items-center gap-1 py-1 select-none"
            >
              <mat-icon class="text-xs scale-75 text-amber-400">stars</mat-icon>
              <span>{{ lang.t('reviewsNav') }}</span>
              <mat-icon
                class="text-[13px] w-3 h-3 text-zinc-500 transition-transform duration-200"
                [class.rotate-180]="activeHoverMenu() === 'reviews'"
              >
                expand_more
              </mat-icon>

              <!-- Hover Menu: Reviews -->
              <div
                class="nav-dropdown absolute right-0 top-full pt-2 z-50 text-left whitespace-normal cursor-default font-normal pointer-events-auto min-w-[460px] animate-fadeIn"
                [class.hidden]="activeHoverMenu() !== 'reviews'"
                [class.block]="activeHoverMenu() === 'reviews'"
              >
                <div class="bg-[#18181b] border border-zinc-700 rounded-xl shadow-2xl p-4 text-zinc-200 text-xs backdrop-blur-md ring-1 ring-black/50">
                  <!-- Header -->
                  <div class="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                        <span class="text-sm font-black">4.9</span>
                      </div>
                      <div>
                        <div class="font-bold text-sm text-white flex items-center gap-1">
                          <span>Avis Clients Vérifiés en RDC</span>
                          <span class="text-amber-400 text-xs font-bold">★★★★★</span>
                        </div>
                        <div class="text-[11px] text-zinc-400">Plus de 1,240 véhicules livrés avec succès</div>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800/60">
                      99.4% satisfaction
                    </span>
                  </div>

                  <!-- Testimonials -->
                  <div class="space-y-2 mb-3">
                    <div class="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
                      <div class="flex items-center justify-between text-[11px] mb-1">
                        <span class="font-bold text-white">Jean-Paul M. (Kinshasa)</span>
                        <span class="text-amber-400 text-[10px]">★★★★★ • Prado TX</span>
                      </div>
                      <p class="text-zinc-300 text-[11px] leading-relaxed">
                        "Récupéré à Boma en 32 jours. Kilométrage certifié, climatisation parfaite pour Kinshasa. Merci au bureau de la Gombe !"
                      </p>
                    </div>

                    <div class="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
                      <div class="flex items-center justify-between text-[11px] mb-1">
                        <span class="font-bold text-white">Patrick K. (Lubumbashi)</span>
                        <span class="text-amber-400 text-[10px]">★★★★★ • Mitsubishi Canter</span>
                      </div>
                      <p class="text-zinc-300 text-[11px] leading-relaxed">
                        "Arrivé via Dar es Salaam puis Kasumbalesa. Documents DHL reçus avant le navire. Très grande rigueur professionnelle."
                      </p>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div class="pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <span class="text-[10px] text-zinc-400">Photos réelles de livraison disponibles</span>
                    <a
                      href="#reviews"
                      class="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                    >
                      <span>Voir tous les avis clients</span>
                      <mat-icon class="text-xs scale-90">arrow_forward</mat-icon>
                    </a>
                  </div>
                </div>
              </div>
            </a>

            <!-- 6. Help & FAQ (a:nth-of-type(3)) -->
            <a
              href="#faq"
              (click)="onHelpClick($event)"
              (mouseenter)="onElementMouseEnter('help-guide')"
              (mouseleave)="onElementMouseLeave()"
              class="relative group hover:text-white transition-colors flex items-center gap-1 py-1 select-none"
            >
              <mat-icon class="text-xs scale-75 text-zinc-400 group-hover:text-amber-400">help</mat-icon>
              <span>{{ lang.t('helpNav') }}</span>
              <mat-icon
                class="text-[13px] w-3 h-3 text-zinc-500 transition-transform duration-200"
                [class.rotate-180]="activeHoverMenu() === 'help-guide'"
              >
                expand_more
              </mat-icon>

              <!-- Hover Menu: Help & FAQ -->
              <div
                class="nav-dropdown absolute right-0 top-full pt-2 z-50 text-left whitespace-normal cursor-default font-normal pointer-events-auto min-w-[480px] animate-fadeIn"
                [class.hidden]="activeHoverMenu() !== 'help-guide'"
                [class.block]="activeHoverMenu() === 'help-guide'"
              >
                <div class="bg-[#18181b] border border-zinc-700 rounded-xl shadow-2xl p-4 text-zinc-200 text-xs backdrop-blur-md ring-1 ring-black/50">
                  <!-- Header -->
                  <div class="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        <mat-icon class="text-base scale-90">menu_book</mat-icon>
                      </div>
                      <div>
                        <div class="font-bold text-sm text-white">Guide d'Importation & Assistance RDC</div>
                        <div class="text-[11px] text-zinc-400">Tout savoir pour commander et dédouaner votre voiture sans tracas</div>
                      </div>
                    </div>
                  </div>

                  <!-- 4 Steps -->
                  <div class="space-y-1.5 mb-3">
                    <div class="flex items-start gap-2.5 p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                      <span class="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                      <div>
                        <div class="font-semibold text-white">Choix & Devis CIF Boma / Matadi</div>
                        <div class="text-[10px] text-zinc-400">Prix transparent : véhicule + fret maritime + assurance tous risques</div>
                      </div>
                    </div>

                    <div class="flex items-start gap-2.5 p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                      <span class="w-5 h-5 rounded-full bg-amber-600/30 text-amber-400 font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                      <div>
                        <div class="font-semibold text-white">Paiement & Facture Proforma</div>
                        <div class="text-[10px] text-zinc-400">Paiement bancaire ou dépôt sécurisé en USD à notre bureau de Kinshasa</div>
                      </div>
                    </div>

                    <div class="flex items-start gap-2.5 p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                      <span class="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                      <div>
                        <div class="font-semibold text-white">Traversée Maritime (25-35 jours)</div>
                        <div class="text-[10px] text-zinc-400">Suivi GPS du cargo en temps réel et envoi des originaux B/L par DHL</div>
                      </div>
                    </div>

                    <div class="flex items-start gap-2.5 p-2 rounded bg-zinc-900/60 border border-zinc-800/60">
                      <span class="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0">4</span>
                      <div>
                        <div class="font-semibold text-white">Dédouanement & Retrait des Clés</div>
                        <div class="text-[10px] text-zinc-400">Assistance dédouanement avec nos transitaires agréés en RDC</div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div class="pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <span class="text-[10px] text-zinc-400">Besoin d'aide immédiate ?</span>
                    <a
                      href="#faq"
                      class="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                    >
                      <span>Consulter toutes les questions (FAQ)</span>
                      <mat-icon class="text-xs scale-90">arrow_forward</mat-icon>
                    </a>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private readonly destroyRef = inject(DestroyRef);
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);
  readonly viewModeService = inject(ViewModeService);
  readonly authService = inject(AuthService);
  readonly priceAlertService = inject(PriceAlertService);

  readonly isNoticeExpanded = signal<boolean>(false);
  readonly searchQuery = signal<string>('');
  readonly isHeaderBurgerOpen = signal<boolean>(false);

  readonly activeHoverMenu = signal<string | null>(null);
  readonly hoveringElement = signal<string | null>(null);
  readonly japanTime = signal<string>('');
  private hoverTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.updateJapanTime();
    if (typeof window !== 'undefined') {
      const timer = setInterval(() => {
        this.updateJapanTime();
      }, 1000);
      this.destroyRef.onDestroy(() => clearInterval(timer));
    }
  }

  private updateJapanTime() {
    try {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      this.japanTime.set(formatter.format(new Date()) + ' JST');
    } catch {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const jstDate = new Date(utc + 3600000 * 9);
      const h = String(jstDate.getHours()).padStart(2, '0');
      const m = String(jstDate.getMinutes()).padStart(2, '0');
      const s = String(jstDate.getSeconds()).padStart(2, '0');
      this.japanTime.set(`${h}:${m}:${s} JST`);
    }
  }

  onElementMouseEnter(menuId: string) {
    this.hoveringElement.set(menuId);
    this.clearHoverTimer();
    // 300ms delay before opening the hover menu
    this.hoverTimer = setTimeout(() => {
      this.activeHoverMenu.set(menuId);
    }, 300);
  }

  onElementMouseLeave() {
    this.clearHoverTimer();
    this.hoveringElement.set(null);
    this.activeHoverMenu.set(null);
  }

  private clearHoverTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  toggleMenu(menuId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.clearHoverTimer();
    if (this.activeHoverMenu() === menuId) {
      this.activeHoverMenu.set(null);
      this.hoveringElement.set(null);
    } else {
      this.activeHoverMenu.set(menuId);
      this.hoveringElement.set(menuId);
    }
  }

  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Don't close if clicking inside a dropdown
    if (target.closest('.nav-dropdown')) {
      return;
    }
    this.activeHoverMenu.set(null);
    this.hoveringElement.set(null);
    this.clearHoverTimer();
  }

  selectCountry(code: string) {
    this.lang.setCountry(code);
    this.activeHoverMenu.set(null);
    this.hoveringElement.set(null);
  }

  selectCurrency(code: CurrencyCode) {
    this.lang.setCurrency(code);
    this.activeHoverMenu.set(null);
    this.hoveringElement.set(null);
  }

  selectLanguage(code: LanguageCode) {
    this.lang.setLanguage(code);
    this.activeHoverMenu.set(null);
    this.hoveringElement.set(null);
  }

  switchToMobileSite() {
    this.viewModeService.setMode('mobile');
  }

  onCountryChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.lang.setCountry(val);
  }

  onCurrencyChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value as CurrencyCode;
    this.lang.setCurrency(val);
  }

  onLanguageChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value as LanguageCode;
    this.lang.setLanguage(val);
  }

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  triggerSearch() {
    this.vehicleService.setFilter({ keyword: this.searchQuery() });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  setCategoryFilter(cat: string) {
    this.vehicleService.setFilter({ category: cat });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  filterByBody(category: string) {
    this.vehicleService.setFilter({ category, make: '', minPrice: 0, maxPrice: 0, keyword: '' });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  filterByMake(make: string) {
    this.vehicleService.setFilter({ make, category: '', minPrice: 0, maxPrice: 0, keyword: '' });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  filterByPrice(minPrice: number, maxPrice: number) {
    this.vehicleService.setFilter({ minPrice, maxPrice, category: '', make: '', keyword: '' });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  filterByKeyword(keyword: string) {
    this.vehicleService.setFilter({ keyword, category: '', make: '' });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  openFavoritesModal(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    this.vehicleService.openFavoritesModal();
  }

  openLoginModal() {
    this.authService.openLogin();
  }

  openRegisterModal() {
    this.authService.openRegister();
  }

  onUsedVehiclesClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.nav-dropdown')) {
      return;
    }
    this.toggleMenu('used-vehicles', event);
  }

  onAutoPartsClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.nav-dropdown')) {
      return;
    }
    this.toggleMenu('auto-parts', event);
  }

  onSalvageClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.nav-dropdown')) {
      return;
    }
    this.toggleMenu('salvage-cars', event);
  }

  onLocalServiceClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.nav-dropdown')) {
      return;
    }
    event.preventDefault();
    this.toggleMenu('local-service', event);
  }

  onReviewsClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.nav-dropdown')) {
      return;
    }
    event.preventDefault();
    this.toggleMenu('reviews', event);
  }

  onHelpClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.nav-dropdown')) {
      return;
    }
    event.preventDefault();
    this.toggleMenu('help-guide', event);
  }

  scrollToFilter() {
    const el = document.getElementById('search-filter-box');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
