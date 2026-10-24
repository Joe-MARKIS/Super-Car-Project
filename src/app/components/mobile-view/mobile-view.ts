import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService, CurrencyCode } from '../../services/language';
import { VehicleService } from '../../services/vehicle';
import { LanguageCode } from '../../i18n/translations';
import { Vehicle } from '../../models/vehicle';
import { ViewModeService } from '../../services/view-mode';
import { AuthService } from '../../services/auth';
import { PriceAlertService } from '../../services/price-alert';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-mobile-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, MatIconModule, SidebarComponent],
  template: `
    <div class="bg-[#F4F4F6] min-h-screen text-zinc-900 font-sans pb-0">
      <!-- 1. Top Red Promo Banner -->
      <div class="bg-[#DC2626] text-white text-xs font-black py-1.5 px-3 flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-1.5 truncate">
          <span class="bg-black text-amber-300 text-[10px] px-1.5 py-0.5 rounded uppercase">PROMO</span>
          <span class="text-amber-300 font-extrabold">$300-DISCOUNT</span>
          <span class="truncate">FROM SINGAPORE & JAPAN!</span>
        </div>
        <button
          type="button"
          (click)="switchToPcSite()"
          class="bg-black/60 hover:bg-black text-[10px] text-white font-bold px-2 py-0.5 rounded cursor-pointer whitespace-nowrap"
        >
          PC SITE
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
          <span class="text-[9px] uppercase font-bold tracking-tight">{{ lang.t('mobileMenu') }}</span>
        </button>

        <!-- Brand Logo -->
        <a href="/" class="flex items-center gap-1 font-black text-base tracking-tighter">
          <span class="bg-[#DC2626] text-white px-1.5 py-0.5 rounded">AUTO</span>
          <span class="text-white">FORWARD</span>
          <mat-icon class="text-red-500 scale-75 ml-[-4px]">arrow_forward</mat-icon>
        </a>

        <!-- Right Quick Actions: Search, Login, Favorites with Badge -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="scrollToSearch()"
            class="flex flex-col items-center justify-center text-zinc-200 hover:text-white cursor-pointer"
          >
            <mat-icon class="scale-90">search</mat-icon>
            <span class="text-[9px] uppercase font-bold tracking-tight">Search</span>
          </button>

          <!-- Login / Admin Account -->
          @if (authService.isAdmin()) {
            <button
              type="button"
              (click)="authService.openAdminPanel()"
              class="flex flex-col items-center justify-center text-amber-400 hover:text-white cursor-pointer"
              title="Console Propriétaire Indépendant"
            >
              <mat-icon class="scale-90 text-red-500">admin_panel_settings</mat-icon>
              <span class="text-[9px] uppercase font-black tracking-tight text-red-400">Admin</span>
            </button>
          } @else if (authService.currentUser()) {
            <button
              type="button"
              (click)="openLoginPrompt()"
              class="flex flex-col items-center justify-center text-amber-300 hover:text-white cursor-pointer"
              title="Mon Espace Client"
            >
              <mat-icon class="scale-90 text-amber-400">account_circle</mat-icon>
              <span class="text-[9px] uppercase font-bold tracking-tight">Compte</span>
            </button>
          } @else {
            <button
              type="button"
              (click)="openLoginPrompt()"
              class="flex flex-col items-center justify-center text-zinc-200 hover:text-white cursor-pointer"
            >
              <mat-icon class="scale-90">person</mat-icon>
              <span class="text-[9px] uppercase font-bold tracking-tight">Login</span>
            </button>
          }

          <!-- Favorites with count badge -->
          <button
            type="button"
            (click)="filterFavorites()"
            class="flex flex-col items-center justify-center text-zinc-200 hover:text-white relative cursor-pointer"
          >
            <div class="relative">
              <mat-icon class="scale-90 text-red-500">favorite</mat-icon>
              <span class="absolute -top-1 -right-2 bg-red-600 text-white rounded-full text-[9px] font-black w-3.5 h-3.5 flex items-center justify-center">
                {{ vehicleService.favoriteIds().length }}
              </span>
            </div>
            <span class="text-[9px] uppercase font-bold tracking-tight">{{ lang.t('favorites') }}</span>
          </button>
        </div>
      </header>

      <!-- 3. Mobile Search Input Bar -->
      <div id="mobile-search-bar" class="p-2.5 bg-white border-b border-zinc-200 shadow-2xs">
        <div class="flex items-center rounded border-2 border-[#DC2626] overflow-hidden bg-white">
          <input
            type="text"
            [placeholder]="lang.t('searchPlaceholder')"
            [value]="searchKeyword()"
            (input)="onSearchInput($event)"
            (keyup.enter)="triggerMobileSearch()"
            class="flex-1 px-3 py-2 text-xs text-zinc-900 outline-none"
          />
          <button
            type="button"
            (click)="triggerMobileSearch()"
            class="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-3.5 py-2 flex items-center justify-center cursor-pointer"
          >
            <mat-icon class="scale-90">search</mat-icon>
          </button>
        </div>

        <!-- 3-Icon Quick Category Row -->
        <div class="grid grid-cols-3 gap-1.5 mt-2 text-center text-[11px] font-bold">
          <button
            type="button"
            (click)="setQuickCategory('')"
            class="bg-zinc-50 hover:bg-red-50 text-zinc-800 hover:text-red-600 p-1.5 rounded border border-zinc-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <mat-icon class="text-sm scale-75 text-red-600">directions_car</mat-icon>
            <span>{{ lang.t('usedVehicles') }}</span>
          </button>

          <button
            type="button"
            (click)="setQuickCategory('Camion')"
            class="bg-zinc-50 hover:bg-red-50 text-zinc-800 hover:text-red-600 p-1.5 rounded border border-zinc-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <mat-icon class="text-sm scale-75 text-zinc-600">build</mat-icon>
            <span>{{ lang.t('autoParts') }}</span>
          </button>

          <button
            type="button"
            (click)="setQuickCategory('SUV')"
            class="bg-zinc-50 hover:bg-red-50 text-zinc-800 hover:text-red-600 p-1.5 rounded border border-zinc-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <mat-icon class="text-sm scale-75 text-zinc-600">car_crash</mat-icon>
            <span>{{ lang.t('salvageCars') }}</span>
          </button>
        </div>
      </div>

      <!-- 4. Potential Shipping Delays Alert -->
      <div class="bg-[#FFFBEB] border-b border-[#FDE68A] p-2.5 text-xs text-[#92400E]">
        <div class="flex items-center justify-between font-bold text-[#B91C1C]">
          <div class="flex items-center gap-1">
            <mat-icon class="text-xs scale-75">warning</mat-icon>
            <span>{{ lang.t('shippingNoticeTitle') }}</span>
          </div>
          <button
            type="button"
            (click)="isDelaysExpanded.set(!isDelaysExpanded())"
            class="cursor-pointer text-zinc-700"
          >
            <mat-icon class="text-xs scale-75">{{ isDelaysExpanded() ? 'expand_less' : 'expand_more' }}</mat-icon>
          </button>
        </div>
        <div class="text-[10px] text-zinc-500 mt-0.5">{{ lang.t('shippingNoticeDate') }}</div>

        @if (isDelaysExpanded()) {
          <p class="mt-1 text-[11px] text-zinc-700 leading-normal">
            {{ lang.t('shippingNoticeText') }}
          </p>
        }

        <div class="mt-1 text-[11px] font-semibold text-zinc-800 flex items-center gap-1">
          <mat-icon class="text-xs scale-75 text-red-600">headset_mic</mat-icon>
          <span>{{ lang.t('salesInquiries') }}</span>
          <a href="#contact-sales" class="text-blue-700 font-bold underline">{{ lang.t('contactUs') }}</a>
        </div>
      </div>

      <!-- IN-APP ALERT TOAST -->
      @if (featureNotification()) {
        <div class="bg-zinc-900 text-white p-2.5 mx-3 mt-2 rounded-lg flex items-center justify-between text-xs font-bold shadow-lg animate-fade-in">
          <div class="flex items-center gap-1.5">
            <mat-icon class="text-emerald-400 text-sm">check_circle</mat-icon>
            <span>{{ featureNotification() }}</span>
          </div>
          <button type="button" (click)="featureNotification.set('')" class="text-zinc-400 hover:text-white cursor-pointer">
            <mat-icon class="scale-75">close</mat-icon>
          </button>
        </div>
      }

      <!-- ============================================================== -->
      <!-- SECTION a. View Vehicles Shipping from -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-1.5">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-black text-xs uppercase tracking-tight text-zinc-900 border-b-2 border-red-600 pb-0.5 inline-block">
            {{ lang.t('viewVehiclesShippingFrom') }}
          </h3>
          <button
            type="button"
            (click)="setShippingCountry('')"
            class="text-[11px] font-bold text-blue-700 hover:underline flex items-center"
          >
            {{ lang.t('seeAll') }}
          </button>
        </div>

        <!-- Upper Tabs: New Arrivals | 3rd Party Seller -->
        <div class="grid grid-cols-2 gap-2 mb-2">
          <button
            type="button"
            (click)="setTab('new_arrivals')"
            [class.bg-[#DC2626]]="vehicleService.filter().activeTab === 'new_arrivals'"
            [class.text-white]="vehicleService.filter().activeTab === 'new_arrivals'"
            [class.bg-blue-50]="vehicleService.filter().activeTab !== 'new_arrivals'"
            [class.text-blue-900]="vehicleService.filter().activeTab !== 'new_arrivals'"
            class="py-2 px-2 rounded border border-blue-200 font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <span class="bg-blue-600 text-white text-[9px] px-1 rounded uppercase font-bold">NEW</span>
            <span>{{ lang.t('newArrivals') }}</span>
          </button>

          <button
            type="button"
            (click)="setTab('certified')"
            [class.bg-[#DC2626]]="vehicleService.filter().activeTab === 'certified'"
            [class.text-white]="vehicleService.filter().activeTab === 'certified'"
            [class.bg-blue-50]="vehicleService.filter().activeTab !== 'certified'"
            [class.text-blue-900]="vehicleService.filter().activeTab !== 'certified'"
            class="py-2 px-2 rounded border border-blue-200 font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <mat-icon class="text-xs scale-75">verified</mat-icon>
            <span>{{ lang.t('thirdPartySeller') }}</span>
          </button>
        </div>

        <!-- Country Buttons 4-column touch grid -->
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-1.5 text-xs font-bold">
          @for (c of shippingCountries; track c.name) {
            <button
              type="button"
              (click)="setShippingCountry(c.name)"
              [class.bg-red-600]="vehicleService.filter().stockCountry === c.name"
              [class.text-white]="vehicleService.filter().stockCountry === c.name"
              [class.bg-white]="vehicleService.filter().stockCountry !== c.name"
              [class.text-zinc-800]="vehicleService.filter().stockCountry !== c.name"
              class="border border-zinc-200 rounded p-1.5 flex items-center justify-center gap-1 text-[11px] cursor-pointer shadow-2xs hover:border-red-400"
            >
              <span>{{ c.flag }}</span>
              <span class="truncate">{{ c.name }}</span>
            </button>
          }
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION b. Recently checked -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-200">
          <div class="flex items-center gap-1.5 font-black text-xs uppercase tracking-tight text-zinc-900">
            <mat-icon class="text-blue-600 scale-75">history</mat-icon>
            <span>{{ lang.t('recentlyChecked') }}</span>
          </div>
          <button type="button" (click)="scrollToCatalog()" class="text-[11px] font-bold text-blue-700">
            {{ lang.t('seeAll') }}
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2">
          @for (veh of recentlyCheckedList(); track veh.id) {
            <button
              type="button"
              (click)="openVehicle(veh)"
              class="w-full text-left bg-white border border-zinc-200 rounded overflow-hidden flex flex-col justify-between shadow-2xs cursor-pointer group p-0"
            >
              <div class="relative aspect-[4/3] bg-zinc-100 overflow-hidden w-full">
                <span class="absolute top-1 left-1 bg-zinc-900/80 text-white text-[9px] font-bold px-1 rounded z-10">
                  {{ veh.year }}
                </span>
                <img [src]="veh.imageUrl" [alt]="veh.model" class="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerpolicy="no-referrer" />
              </div>
              <div class="p-1.5 text-left w-full">
                <div class="text-[10px] font-extrabold text-blue-900 truncate">{{ veh.make }} {{ veh.model }}</div>
                <div class="text-xs font-black text-red-600 tabular-nums">{{ lang.formatPrice(veh.priceUsd) }}</div>
                <div class="text-[9px] text-zinc-500 font-semibold">{{ veh.mileageKm.toLocaleString() }} km</div>
              </div>
            </button>
          }
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION c. Vehicles with Points Reward -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-200">
          <div class="flex items-center gap-1.5 font-black text-xs uppercase tracking-tight text-zinc-900">
            <mat-icon class="text-amber-500 scale-75">card_giftcard</mat-icon>
            <span>{{ lang.t('vehiclesWithPointsReward') }}</span>
          </div>
          <button type="button" (click)="scrollToCatalog()" class="text-[11px] font-bold text-blue-700">
            {{ lang.t('seeAll') }}
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2">
          @for (veh of vehicleService.specialRewardVehicles().slice(0, 3); track veh.id) {
            <button
              type="button"
              (click)="openVehicle(veh)"
              class="w-full text-left bg-white border border-zinc-200 rounded overflow-hidden flex flex-col justify-between shadow-2xs cursor-pointer group p-0"
            >
              <div class="relative aspect-[4/3] bg-zinc-100 overflow-hidden w-full">
                <span class="absolute top-1 left-1 bg-amber-400 text-black text-[9px] font-black px-1 rounded flex items-center gap-0.5 z-10 shadow-xs">
                  🎁 {{ veh.pointsReward * 5 }} pts
                </span>
                <img [src]="veh.imageUrl" [alt]="veh.model" class="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerpolicy="no-referrer" />
              </div>
              <div class="p-1.5 text-left w-full">
                <div class="text-[10px] font-extrabold text-blue-900 truncate">{{ veh.make }} {{ veh.model }}</div>
                <div class="text-xs font-black text-red-600 tabular-nums">{{ lang.formatPrice(veh.priceUsd) }}</div>
                @if (veh.discountPercent) {
                  <div class="text-[9px] text-zinc-500 font-semibold">Save {{ veh.discountPercent }}% off</div>
                }
              </div>
            </button>
          }
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION c (bis). Clearance -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-200">
          <div class="flex items-center gap-1.5 font-black text-xs uppercase tracking-tight text-red-600">
            <mat-icon class="text-red-600 scale-75">local_fire_department</mat-icon>
            <span>{{ lang.t('clearanceTitle') }}</span>
          </div>
          <button type="button" (click)="scrollToCatalog()" class="text-[11px] font-bold text-blue-700">
            {{ lang.t('seeAll') }}
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2">
          @for (veh of vehicleService.clearanceDealsVehicles().slice(0, 3); track veh.id) {
            <button
              type="button"
              (click)="openVehicle(veh)"
              class="w-full text-left bg-white border border-zinc-200 rounded overflow-hidden flex flex-col justify-between shadow-2xs cursor-pointer group p-0"
            >
              <div class="relative aspect-[4/3] bg-zinc-100 overflow-hidden w-full">
                @if (veh.discountPercent) {
                  <span class="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-black px-1 rounded z-10 shadow-xs">
                    -{{ veh.discountPercent }}%
                  </span>
                }
                <img [src]="veh.imageUrl" [alt]="veh.model" class="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerpolicy="no-referrer" />
              </div>
              <div class="p-1.5 text-left w-full">
                <div class="text-[10px] font-extrabold text-blue-900 truncate">{{ veh.make }} {{ veh.model }}</div>
                <div class="text-xs font-black text-red-600 tabular-nums">{{ lang.formatPrice(veh.priceUsd) }}</div>
                <div class="text-[9px] text-emerald-700 font-bold">Prix FOB Direct</div>
              </div>
            </button>
          }
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION d. Shop By Make -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="flex items-center justify-between pb-1.5 mb-2 border-b-2 border-zinc-800">
          <h3 class="font-black text-xs uppercase tracking-tight text-zinc-900">
            {{ lang.t('shopByMake') }}
          </h3>
          <button type="button" (click)="toggleAllMakes()" class="text-[11px] font-bold text-blue-700 hover:underline">
            {{ showAllMakes() ? lang.t('showLess') : lang.t('seeMore') }}
          </button>
        </div>

        <div class="grid grid-cols-4 gap-1.5 text-center">
          @for (brand of displayedBrands(); track brand.name) {
            <button
              type="button"
              (click)="filterByBrand(brand.name)"
              [class.border-red-600]="vehicleService.filter().make === brand.name"
              [class.bg-red-50]="vehicleService.filter().make === brand.name"
              class="border border-zinc-200 rounded p-2 flex flex-col items-center justify-center hover:border-red-500 hover:bg-zinc-50 transition-colors cursor-pointer shadow-2xs"
            >
              <span class="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-black text-xs text-zinc-800 border border-zinc-300">
                {{ brand.name.slice(0, 2) }}
              </span>
              <span class="text-[10px] font-black uppercase text-zinc-800 mt-1 truncate w-full">
                {{ brand.name }}
              </span>
            </button>
          }
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION e. Shop by Type -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="pb-1.5 mb-2 border-b-2 border-zinc-800">
          <h3 class="font-black text-xs uppercase tracking-tight text-zinc-900">
            {{ lang.t('shopByType') }}
          </h3>
        </div>

        <div class="grid grid-cols-4 gap-1.5 text-center">
          @for (type of bodyTypes; track type.name) {
            <button
              type="button"
              (click)="filterByType(type.name)"
              [class.border-red-600]="vehicleService.filter().category === type.name"
              [class.bg-red-50]="vehicleService.filter().category === type.name"
              class="border border-zinc-200 rounded p-2 flex flex-col items-center justify-center hover:border-red-500 hover:bg-zinc-50 transition-colors cursor-pointer shadow-2xs"
            >
              <mat-icon class="text-zinc-600 scale-90">{{ type.icon }}</mat-icon>
              <span class="text-[10px] font-bold text-zinc-800 mt-0.5 truncate w-full">
                {{ type.name }}
              </span>
            </button>
          }
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION f. Shop by Category -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="pb-1.5 mb-2 border-b-2 border-zinc-800">
          <h3 class="font-black text-xs uppercase tracking-tight text-zinc-900">
            {{ lang.t('shopByCategory') }}
          </h3>
        </div>

        <div class="grid grid-cols-4 gap-1.5 text-center">
          <button
            type="button"
            (click)="vehicleService.setFilter({ steering: 'Left Hand Drive' })"
            class="border border-zinc-200 rounded p-2 flex flex-col items-center justify-center hover:border-red-500 hover:bg-zinc-50 cursor-pointer shadow-2xs"
          >
            <mat-icon class="text-red-600 scale-90">pan_tool</mat-icon>
            <span class="text-[10px] font-bold text-zinc-800 mt-0.5 leading-tight">LHD</span>
          </button>

          <button
            type="button"
            (click)="vehicleService.setFilter({ keyword: 'Hybride' })"
            class="border border-zinc-200 rounded p-2 flex flex-col items-center justify-center hover:border-red-500 hover:bg-zinc-50 cursor-pointer shadow-2xs"
          >
            <mat-icon class="text-emerald-600 scale-90">eco</mat-icon>
            <span class="text-[10px] font-bold text-zinc-800 mt-0.5">Hybrid</span>
          </button>

          <button
            type="button"
            (click)="vehicleService.setFilter({ keyword: 'Diesel' })"
            class="border border-zinc-200 rounded p-2 flex flex-col items-center justify-center hover:border-red-500 hover:bg-zinc-50 cursor-pointer shadow-2xs"
          >
            <mat-icon class="text-zinc-700 scale-90">local_gas_station</mat-icon>
            <span class="text-[10px] font-bold text-zinc-800 mt-0.5">Diesel</span>
          </button>

          <button
            type="button"
            (click)="vehicleService.setFilter({ keyword: 'Manuelle' })"
            class="border border-zinc-200 rounded p-2 flex flex-col items-center justify-center hover:border-red-500 hover:bg-zinc-50 cursor-pointer shadow-2xs"
          >
            <mat-icon class="text-zinc-700 scale-90">tune</mat-icon>
            <span class="text-[10px] font-bold text-zinc-800 mt-0.5">Manual</span>
          </button>

          <button
            type="button"
            (click)="vehicleService.setFilter({ maxPrice: 2000 })"
            class="border border-zinc-200 rounded p-2 flex flex-col items-center justify-center hover:border-red-500 hover:bg-zinc-50 cursor-pointer shadow-2xs"
          >
            <mat-icon class="text-amber-600 scale-90">attach_money</mat-icon>
            <span class="text-[10px] font-bold text-zinc-800 mt-0.5">&lt; $2,000</span>
          </button>

          <button
            type="button"
            (click)="vehicleService.setFilter({ driveType: '4WD' })"
            class="border border-zinc-200 rounded p-2 flex flex-col items-center justify-center hover:border-red-500 hover:bg-zinc-50 cursor-pointer shadow-2xs"
          >
            <mat-icon class="text-blue-600 scale-90">terrain</mat-icon>
            <span class="text-[10px] font-bold text-zinc-800 mt-0.5">4WD / 4x4</span>
          </button>

          <button
            type="button"
            (click)="vehicleService.setFilter({ keyword: 'Electrique' })"
            class="border border-zinc-200 rounded p-2 flex flex-col items-center justify-center hover:border-red-500 hover:bg-zinc-50 cursor-pointer shadow-2xs"
          >
            <mat-icon class="text-teal-600 scale-90">bolt</mat-icon>
            <span class="text-[10px] font-bold text-zinc-800 mt-0.5">Electric</span>
          </button>

          <button
            type="button"
            (click)="vehicleService.setFilter({ category: 'Camion' })"
            class="border border-zinc-200 rounded p-2 flex flex-col items-center justify-center hover:border-red-500 hover:bg-zinc-50 cursor-pointer shadow-2xs"
          >
            <mat-icon class="text-purple-600 scale-90">local_shipping</mat-icon>
            <span class="text-[10px] font-bold text-zinc-800 mt-0.5">Commercial</span>
          </button>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION g. Shop by Stock Location -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="pb-1.5 mb-2 border-b-2 border-zinc-800 flex items-center justify-between">
          <h3 class="font-black text-xs uppercase tracking-tight text-zinc-900">
            {{ lang.t('shopByStockLocation') }}
          </h3>
          <span class="text-[10px] text-zinc-500 font-bold">8 Hubs</span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          @for (loc of stockLocations; track loc.country) {
            <button
              type="button"
              (click)="setShippingCountry(loc.country)"
              [class.border-red-600]="vehicleService.filter().stockCountry === loc.country"
              [class.bg-red-50]="vehicleService.filter().stockCountry === loc.country"
              class="border border-zinc-200 rounded-lg p-2.5 flex items-center gap-2 hover:border-red-500 hover:bg-zinc-50 transition-colors cursor-pointer text-left shadow-2xs"
            >
              <span class="text-xl shrink-0">{{ loc.flag }}</span>
              <div class="truncate">
                <div class="font-extrabold text-xs text-zinc-900 truncate">{{ loc.name }}</div>
                <div class="text-[10px] text-red-600 font-bold">{{ loc.units }} {{ lang.t('unitsInStock') }}</div>
              </div>
            </button>
          }
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION h. Popular Keywords in "Le pays selectionner par le user" -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="flex items-center justify-between pb-1.5 mb-2 border-b-2 border-red-600">
          <h3 class="font-black text-xs uppercase tracking-tight text-zinc-900">
            {{ lang.t('popularKeywordsTitle') }} {{ lang.selectedCountry().name }}
          </h3>
          <span class="text-[10px] text-zinc-400 font-bold uppercase">{{ lang.selectedCountry().flag }} {{ lang.selectedCountry().code }}</span>
        </div>

        <div class="flex flex-wrap gap-1.5">
          @for (kw of popularKeywords; track kw) {
            <button
              type="button"
              (click)="searchByKeyword(kw)"
              class="border border-red-300 text-zinc-900 bg-red-50/50 hover:bg-red-600 hover:text-white px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer"
            >
              {{ kw }}
            </button>
          }
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION i. Top Sellers in "Le pays selectionner par le user" -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="flex items-center justify-between pb-1.5 mb-2 border-b-2 border-red-600">
          <h3 class="font-black text-xs uppercase tracking-tight text-zinc-900">
            {{ lang.t('topSellersTitle') }} {{ lang.selectedCountry().name }}
          </h3>
          <span class="text-[10px] text-red-600 font-bold">1 - 9</span>
        </div>

        <div class="grid grid-cols-3 gap-2">
          @for (veh of vehicleService.topDrcVehicles(); track veh.id; let idx = $index) {
            <button
              type="button"
              (click)="openVehicle(veh)"
              class="w-full text-left border border-zinc-200 rounded overflow-hidden flex flex-col justify-between shadow-2xs cursor-pointer group bg-white p-0"
            >
              <div class="relative aspect-[4/3] bg-zinc-100 overflow-hidden w-full">
                <span class="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">
                  {{ idx + 1 }}
                </span>
                <img [src]="veh.imageUrl" [alt]="veh.model" class="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerpolicy="no-referrer" />
              </div>
              <div class="p-1.5 text-left w-full">
                <div class="text-[10px] font-extrabold text-zinc-900 truncate">{{ veh.make }}</div>
                <div class="text-[10px] text-zinc-700 font-bold truncate">{{ veh.model }}</div>
                <div class="text-[11px] font-black text-red-600 mt-0.5 tabular-nums">{{ lang.formatPrice(veh.priceUsd) }}</div>
              </div>
            </button>
          }
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION j. Popular Left Hand Drive Models in Selected Country -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="flex items-center justify-between pb-1.5 mb-2 border-b-2 border-red-600">
          <h3 class="font-black text-xs uppercase tracking-tight text-zinc-900">
            {{ lang.t('popularLhdTitle') }} {{ lang.selectedCountry().name }}
          </h3>
          <span class="text-[10px] text-red-600 font-bold">LHD</span>
        </div>

        <div class="grid grid-cols-3 gap-2">
          @for (veh of vehicleService.popularLhdVehicles(); track veh.id; let idx = $index) {
            <button
              type="button"
              (click)="openVehicle(veh)"
              class="w-full text-left border border-zinc-200 rounded overflow-hidden flex flex-col justify-between shadow-2xs cursor-pointer group bg-white p-0"
            >
              <div class="relative aspect-[4/3] bg-zinc-100 overflow-hidden w-full">
                <span class="absolute top-1 left-1 bg-[#EA580C] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">
                  {{ idx + 1 }}
                </span>
                <img [src]="veh.imageUrl" [alt]="veh.model" class="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerpolicy="no-referrer" />
              </div>
              <div class="p-1.5 text-left w-full">
                <div class="text-[10px] font-extrabold text-blue-900 truncate">{{ veh.make }}</div>
                <div class="text-[10px] text-zinc-700 font-bold truncate">{{ veh.model }}</div>
                <div class="text-[11px] font-black text-red-600 mt-0.5 tabular-nums">{{ lang.formatPrice(veh.priceUsd) }}</div>
              </div>
            </button>
          }
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION k. Choose Your Delivery Options -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="pb-1.5 mb-2 border-b-2 border-red-600">
          <h3 class="font-black text-xs uppercase tracking-tight text-zinc-900">
            {{ lang.t('chooseDeliveryOptions') }}
          </h3>
        </div>

        <div class="mb-3">
          <label for="mob-final-country" class="block text-[11px] font-bold text-zinc-600 mb-1">
            {{ lang.t('chooseFinalCountry') }}
          </label>
          <select
            id="mob-final-country"
            [value]="lang.currentCountry()"
            (change)="onCountrySelect($event)"
            class="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-xs font-bold text-zinc-900 outline-none"
          >
            @for (c of lang.countries; track c.code) {
              <option [value]="c.code">{{ c.flag }} {{ c.name }} (Port: {{ c.primaryPort }})</option>
            }
          </select>

          <a href="#drc-services" class="mt-2 text-[11px] font-bold text-blue-700 flex items-center gap-1 hover:underline">
            <span>{{ lang.selectedCountry().flag }} {{ lang.t('ourLocalServicesIn') }} {{ lang.selectedCountry().name }}</span>
            <mat-icon class="text-xs scale-75">arrow_forward</mat-icon>
          </a>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION l. Purchase Flow (en carrousel pour que ca convienne) -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <div class="flex items-center justify-between pb-1.5 mb-2 border-b-2 border-red-600">
          <h4 class="font-black text-xs uppercase text-zinc-900">
            {{ lang.t('purchaseFlowTitle') }}
          </h4>
          <span class="text-[10px] text-zinc-500 font-bold font-mono">
            {{ currentFlowStep() + 1 }} / {{ purchaseSteps.length }}
          </span>
        </div>

        <!-- Carousel Slide Card -->
        <div class="relative overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 p-3.5 shadow-2xs">
          <!-- Active Step details -->
          @let activeStep = purchaseSteps[currentFlowStep()];
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br {{ activeStep.color }} text-white flex items-center justify-center shrink-0 shadow-sm">
              <mat-icon class="scale-90">{{ activeStep.icon }}</mat-icon>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide font-mono">
                  {{ activeStep.badge }}
                </span>
                <h5 class="font-black text-xs uppercase text-zinc-900 truncate">
                  {{ activeStep.title }}
                </h5>
              </div>
              <p class="text-[11px] text-zinc-700 font-medium mt-1 leading-relaxed">
                {{ activeStep.desc }}
              </p>
              <div class="text-[10px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                <mat-icon class="text-xs scale-75">verified</mat-icon>
                <span>{{ activeStep.subtext }}</span>
              </div>
            </div>
          </div>

          <!-- Carousel Controls: Prev & Next Buttons -->
          <div class="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-200">
            <button
              type="button"
              (click)="prevFlowStep()"
              class="bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 rounded-full px-2.5 py-1 text-[11px] font-bold flex items-center gap-0.5 cursor-pointer shadow-2xs"
            >
              <mat-icon class="text-xs scale-75">chevron_left</mat-icon>
              <span>Prev</span>
            </button>

            <!-- Step Dots -->
            <div class="flex items-center gap-1.5">
              @for (st of purchaseSteps; track st.step; let idx = $index) {
                <button
                  type="button"
                  (click)="setFlowStep(idx)"
                  [class.w-4]="currentFlowStep() === idx"
                  [class.bg-red-600]="currentFlowStep() === idx"
                  [class.w-2]="currentFlowStep() !== idx"
                  [class.bg-zinc-300]="currentFlowStep() !== idx"
                  class="h-2 rounded-full transition-all cursor-pointer border-0 p-0"
                  [title]="'Étape ' + (idx + 1)"
                ></button>
              }
            </div>

            <button
              type="button"
              (click)="nextFlowStep()"
              class="bg-red-600 hover:bg-red-700 text-white rounded-full px-2.5 py-1 text-[11px] font-bold flex items-center gap-0.5 cursor-pointer shadow-2xs"
            >
              <span>Next</span>
              <mat-icon class="text-xs scale-75">chevron_right</mat-icon>
            </button>
          </div>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION m. CTA to login comme dans l'image que je t'ai envoyer (CTA_c23b4b44.jpeg) -->
      <!-- ============================================================== -->
      <section class="bg-white p-3.5 border-y border-zinc-200 my-2">
        <!-- Title matching Image CTA -->
        <h3 class="font-black text-center text-zinc-900 text-sm mb-2.5 tracking-tight">
          {{ lang.t('loginUsefulFeatures') }}
        </h3>

        <!-- Cyan Points Campaign Banner matching Image CTA -->
        <div class="bg-[#38BDF8] text-white p-2 rounded flex items-center justify-between shadow-2xs">
          <!-- Left: Big P circle logo -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-[#0284C7] text-white flex items-center justify-center font-black text-lg border-2 border-white/60">
              P
            </div>
            <div class="leading-tight">
              <div class="text-[10px] font-black uppercase text-zinc-900 tracking-wider">
                {{ lang.t('pointUpCampaign') }}
              </div>
              <div class="text-sm font-black text-yellow-300 drop-shadow-xs">
                {{ lang.t('earn10Points') }}
              </div>
            </div>
          </div>

          <!-- Right: When you create an account pill -->
          <div class="bg-black text-white text-[9px] font-black px-2 py-1 rounded text-center uppercase tracking-tight shrink-0">
            {{ lang.t('whenYouCreateAccount') }}
          </div>
        </div>

        <!-- 4 Quick Actions Row with distinct colored icons matching Image CTA -->
        <div class="grid grid-cols-4 gap-1 text-center my-3.5 text-zinc-800">
          <button type="button" (click)="filterFavorites()" class="flex flex-col items-center cursor-pointer group">
            <mat-icon class="text-[#EF4444] scale-95 group-hover:scale-110 transition-transform">favorite</mat-icon>
            <span class="text-[11px] font-semibold text-zinc-700 mt-1">{{ lang.t('favorites') }}</span>
          </button>
          <button type="button" (click)="openFeatureAlert(lang.t('notifyMe'))" class="flex flex-col items-center cursor-pointer group">
            <mat-icon class="text-[#0284C7] scale-95 group-hover:scale-110 transition-transform">campaign</mat-icon>
            <span class="text-[11px] font-semibold text-zinc-700 mt-1">{{ lang.t('notifyMe') }}</span>
          </button>
          <button type="button" (click)="openFeatureAlert(lang.t('saveSearch'))" class="flex flex-col items-center cursor-pointer group">
            <mat-icon class="text-[#A855F7] scale-95 group-hover:scale-110 transition-transform">notifications</mat-icon>
            <span class="text-[11px] font-semibold text-zinc-700 mt-1">{{ lang.t('saveSearch') }}</span>
          </button>
          <button type="button" (click)="openFeatureAlert(lang.t('easyInquiry'))" class="flex flex-col items-center cursor-pointer group">
            <mat-icon class="text-[#F97316] scale-95 group-hover:scale-110 transition-transform">mail</mat-icon>
            <span class="text-[11px] font-semibold text-zinc-700 mt-1">{{ lang.t('easyInquiry') }}</span>
          </button>
        </div>

        <!-- Big Solid Orange LOGIN Button matching Image CTA -->
        <button
          type="button"
          (click)="openLoginPrompt()"
          class="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-black py-3 rounded text-sm uppercase tracking-wider shadow-sm cursor-pointer transition-colors"
        >
          {{ lang.t('loginBtn') }}
        </button>

        <!-- Bottom right: Create an account ▶ link matching Image CTA -->
        <div class="text-right mt-2">
          <button
            type="button"
            (click)="authService.openRegister()"
            class="text-[#1D4ED8] hover:text-[#1E40AF] font-bold text-xs inline-flex items-center gap-0.5 cursor-pointer hover:underline"
          >
            <span>{{ lang.t('createAnAccount') }}</span>
            <span class="text-[10px]">▶</span>
          </button>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION n. Assistance in Buying Used Cars -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <h3 class="font-black text-xs uppercase tracking-tight text-zinc-900 mb-2 border-b-2 border-zinc-800 pb-1">
          {{ lang.t('assistanceBuying') }}
        </h3>

        <div class="space-y-1.5 text-xs text-blue-700 font-bold mb-3">
          <a href="#car-wiki" class="flex items-center gap-1 hover:underline">
            <span>{{ lang.t('carWikiArchives') }}</span>
            <mat-icon class="text-xs scale-75">chevron_right</mat-icon>
          </a>
          <a href="#car-compare" class="flex items-center gap-1 hover:underline">
            <span>{{ lang.t('carCompareArchives') }}</span>
            <mat-icon class="text-xs scale-75">chevron_right</mat-icon>
          </a>
        </div>

        <div class="text-[11px] font-bold text-zinc-500 mb-1">
          {{ lang.t('popularJapaneseUsedCars') }}
        </div>
        <div class="flex flex-wrap gap-2 text-xs text-blue-700 font-semibold mb-1">
          <button type="button" (click)="searchByKeyword('RAV4')" class="hover:underline cursor-pointer">TOYOTA RAV4</button>
          <span>·</span>
          <button type="button" (click)="searchByKeyword('Harrier')" class="hover:underline cursor-pointer">TOYOTA HARRIER</button>
          <span>·</span>
          <button type="button" (click)="searchByKeyword('Vitz')" class="hover:underline cursor-pointer">TOYOTA VITZ</button>
          <span>·</span>
          <button type="button" (click)="searchByKeyword('Noah')" class="hover:underline cursor-pointer">TOYOTA NOAH</button>
          <span>·</span>
          <button type="button" (click)="searchByKeyword('Hiace')" class="hover:underline cursor-pointer">TOYOTA HIACE VAN</button>
          <span>·</span>
          <button type="button" (click)="searchByKeyword('Prado')" class="hover:underline cursor-pointer">LAND CRUISER PRADO</button>
        </div>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION o. FAQ (avec boutons: View more questions and answers et To The top) -->
      <!-- ============================================================== -->
      <section class="bg-white p-3 border-y border-zinc-200 my-2">
        <h3 class="font-black text-xs uppercase tracking-tight text-zinc-900 mb-2 border-b-2 border-zinc-800 pb-1">
          {{ lang.t('faqTitle') }}
        </h3>

        <!-- FAQ Accordion -->
        <div class="space-y-1.5 text-xs">
          @for (faq of displayedFaqList(); track faq.id) {
            <div class="border border-zinc-200 rounded p-2">
              <button
                type="button"
                (click)="toggleMobileFaq(faq.id)"
                class="w-full text-left font-bold text-zinc-800 flex items-center justify-between cursor-pointer"
              >
                <span>► {{ faq.question }}</span>
                <mat-icon class="text-xs scale-75">{{ openMobileFaq() === faq.id ? 'expand_less' : 'expand_more' }}</mat-icon>
              </button>
              @if (openMobileFaq() === faq.id) {
                <p class="mt-1 text-[11px] text-zinc-600 leading-normal pt-1 border-t border-zinc-100">
                  {{ faq.answer }}
                </p>
              }
            </div>
          }
        </div>

        <!-- Button 1: View more questions and answers -->
        <button
          type="button"
          (click)="showAllFaq.set(!showAllFaq())"
          class="mt-3 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs rounded flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <span>{{ lang.t('viewMoreQuestions') }}</span>
          <mat-icon class="text-xs scale-75">{{ showAllFaq() ? 'expand_less' : 'expand_more' }}</mat-icon>
        </button>

        <!-- Button 2: To The top / Page to Top -->
        <button
          type="button"
          (click)="scrollToTop()"
          class="mt-2 w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <span>{{ lang.t('toTheTop') }}</span>
          <mat-icon class="text-xs scale-75 text-red-600">arrow_upward</mat-icon>
        </button>
      </section>

      <!-- ============================================================== -->
      <!-- SECTION p. Elements from Image 2 & Image 1 + PC Site Button -->
      <!-- ============================================================== -->
      <section class="bg-white border-y border-zinc-200 my-2 divide-y divide-zinc-200">
        <!-- Image 2 Items -->
        @for (item of infoMenuItemsPart1; track item.id) {
          <a
            [href]="item.url"
            class="block py-2.5 px-3.5 text-xs font-bold text-[#1D4ED8] hover:text-[#1E40AF] hover:bg-blue-50/40 transition-colors"
          >
            {{ lang.t(item.labelKey) }}
          </a>
        }

        <!-- Image 1 Items -->
        @for (item of infoMenuItemsPart2; track item.id) {
          @if (item.isPcSite) {
            <button
              type="button"
              (click)="switchToPcSite()"
              class="w-full text-left py-2.5 px-3.5 text-xs font-bold text-[#1D4ED8] hover:text-[#1E40AF] hover:bg-blue-50/40 transition-colors cursor-pointer"
            >
              {{ lang.t(item.labelKey) }}
            </button>
          } @else {
            <a
              [href]="item.url"
              class="block py-2.5 px-3.5 text-xs font-bold text-[#1D4ED8] hover:text-[#1E40AF] hover:bg-blue-50/40 transition-colors"
            >
              {{ lang.t(item.labelKey) }}
            </a>
          }
        }

        <!-- Collapsible Advantages with BE FORWARD ∨ -->
        <div class="px-3.5 py-2.5">
          <button
            type="button"
            (click)="isAdvantagesOpen.set(!isAdvantagesOpen())"
            class="w-full text-left text-xs font-bold text-[#1D4ED8] flex items-center justify-between cursor-pointer"
          >
            <span>{{ lang.t('advantagesWithBf') }}</span>
            <mat-icon class="text-xs scale-75">{{ isAdvantagesOpen() ? 'expand_less' : 'expand_more' }}</mat-icon>
          </button>
          @if (isAdvantagesOpen()) {
            <div class="mt-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-600 space-y-1.5">
              <div class="flex items-center gap-1.5 font-semibold text-zinc-800">
                <mat-icon class="text-emerald-600 text-xs">check_circle</mat-icon>
                <span>Plus de 2 500 000 véhicules exportés dans le monde entier</span>
              </div>
              <div class="flex items-center gap-1.5 font-semibold text-zinc-800">
                <mat-icon class="text-emerald-600 text-xs">check_circle</mat-icon>
                <span>Inspection pré-embarquement rigoureuse à 100%</span>
              </div>
              <div class="flex items-center gap-1.5 font-semibold text-zinc-800">
                <mat-icon class="text-emerald-600 text-xs">check_circle</mat-icon>
                <span>Suivi maritime en direct et envoi express DHL des documents originaux</span>
              </div>
              <div class="flex items-center gap-1.5 font-semibold text-zinc-800">
                <mat-icon class="text-emerald-600 text-xs">check_circle</mat-icon>
                <span>Bureaux et correspondants locaux à Kinshasa, Lubumbashi et Dar es Salaam</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Big Button: GO TO PC SITE (Image 1 style) -->
      <div class="p-3 bg-[#E2E8F0] border-t border-zinc-300">
        <button
          type="button"
          (click)="switchToPcSite()"
          class="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white py-3 rounded-lg font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <mat-icon class="scale-90">computer</mat-icon>
          <span>{{ lang.t('goToPcSiteBtn') }}</span>
        </button>
      </div>

      <!-- ============================================================== -->
      <!-- FOOTER (Requirement 1: elements constituent le footer et ne flottent pas en bas) -->
      <!-- ============================================================== -->
      <footer class="bg-[#121212] border-t-2 border-[#DC2626] text-white pt-4 pb-6 px-3">
        <!-- Static Quick Support Buttons (WhatsApp Pill + Chatter Bubble) - NOT floating -->
        <div class="flex items-center justify-center gap-3 mb-4">
          <!-- Green WhatsApp Pill -->
          <a
            href="https://wa.me/818095877304"
            target="_blank"
            rel="noopener"
            class="bg-[#22C55E] hover:bg-emerald-600 text-white rounded-full px-4 py-2 shadow-md flex items-center gap-2 font-black text-xs transition-transform active:scale-95"
          >
            <mat-icon class="scale-90 text-white">chat</mat-icon>
            <span class="leading-none text-[11px]">{{ lang.t('contactUsOnWhatsApp') }}</span>
          </a>

          <!-- Chatter Bubble -->
          <button
            type="button"
            (click)="openSupportChat()"
            class="bg-white text-zinc-900 border-2 border-zinc-300 rounded-full px-4 py-2 shadow-md flex items-center gap-1.5 font-extrabold text-xs cursor-pointer hover:border-red-600"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span class="uppercase tracking-tight text-[11px]">{{ lang.t('chatter') }}</span>
            <mat-icon class="text-blue-600 scale-75">forum</mat-icon>
          </button>
        </div>

        <!-- WhatsApp Export Sales Team -->
        <div class="bg-[#1E293B] text-white p-3 rounded-lg border border-slate-700 mb-4 text-left">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <mat-icon class="scale-75">chat</mat-icon>
            </div>
            <div>
              <div class="font-black text-xs text-white">{{ lang.t('whatsAppTeamTitle') }}</div>
              <div class="text-[10px] text-emerald-400">Mon - Fri 9:00 - 18:00 (JST)</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-700">
            <div>
              <div class="text-zinc-400 text-[10px] font-sans">Emmanuel:</div>
              <a href="https://wa.me/818095877304" target="_blank" class="text-emerald-400 hover:underline font-bold text-[11px]">+81-80-9587-7304</a>
            </div>
            <div>
              <div class="text-zinc-400 text-[10px] font-sans">Nicolas_M:</div>
              <a href="https://wa.me/818077285433" target="_blank" class="text-emerald-400 hover:underline font-bold text-[11px]">+81-80-7728-5433</a>
            </div>
            <div>
              <div class="text-zinc-400 text-[10px] font-sans">Jean:</div>
              <a href="https://wa.me/817083254316" target="_blank" class="text-emerald-400 hover:underline font-bold text-[11px]">+81-70-8325-4316</a>
            </div>
            <div>
              <div class="text-zinc-400 text-[10px] font-sans">Saya:</div>
              <a href="https://wa.me/817093574710" target="_blank" class="text-emerald-400 hover:underline font-bold text-[11px]">+81-70-9357-4710</a>
            </div>
          </div>
        </div>

        <!-- Newsletter -->
        <div class="bg-[#242424] text-white p-3 rounded-lg border border-zinc-800 mb-4 text-left">
          <h3 class="font-black text-xs uppercase mb-1">{{ lang.t('newsletterTitle') }}</h3>
          <p class="text-[11px] text-zinc-400 mb-2">{{ lang.t('newsletterDesc') }}</p>
          <div class="flex items-center gap-1.5">
            <input
              type="email"
              [(ngModel)]="mobileEmail"
              placeholder="Email Address"
              class="flex-1 bg-white text-zinc-900 rounded p-2 text-xs outline-none"
            />
            <button
              type="button"
              (click)="subscribeMobileNewsletter()"
              class="bg-[#EA580C] hover:bg-orange-700 text-white font-bold px-3 py-2 rounded text-xs cursor-pointer shrink-0"
            >
              {{ lang.t('subscribeBtn') }}
            </button>
          </div>
          @if (newsletterSuccess()) {
            <div class="mt-2 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <mat-icon class="text-xs scale-75">check_circle</mat-icon>
              <span>Inscription réussie !</span>
            </div>
          }
        </div>

        <!-- Corporate Information -->
        <div class="text-zinc-400 text-[11px] space-y-2 text-center pt-2 border-t border-zinc-800">
          <div class="flex items-center justify-center gap-1 font-black text-sm text-white">
            <span class="bg-red-600 px-1.5 py-0.5 rounded text-white">AUTO</span>
            <span class="text-white">FORWARD</span>
          </div>
          <div>Phone: +81 42 440 3440 / +243 81 440 3440 | Email: top&#64;autoforward.com</div>
          <div>Address: 1-32-2 Kojimacho, Chofu City, Tokyo 182-0026 Japan</div>
          <div class="text-[10px] text-zinc-500 italic">
            Please note that this site does not offer sales for domestic customers in Japan.
          </div>
          <div class="bg-[#EA580C] text-white py-1.5 px-3 rounded font-black text-[10px] uppercase tracking-wider mt-3 inline-block">
            © 2026 AUTOFORWARD CO.,LTD.
          </div>
        </div>
      </footer>

      <!-- Slide-Over Mobile Drawer Menu -->
      @if (isDrawerOpen()) {
        <div class="fixed inset-0 z-50 flex">
          <!-- Backdrop -->
          <button
            type="button"
            (click)="isDrawerOpen.set(false)"
            aria-label="Fermer le menu"
            class="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity border-0 p-0 cursor-pointer w-full h-full"
          ></button>

          <!-- Drawer Content -->
          <div class="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <!-- Drawer Header -->
            <div class="bg-[#1A1A1A] text-white p-4 border-b-2 border-red-600 flex items-center justify-between">
              <div class="flex items-center gap-1 font-black text-sm">
                <span class="bg-red-600 text-white px-1.5 py-0.5 rounded">AUTO</span>
                <span>FORWARD</span>
              </div>
              <button
                type="button"
                (click)="isDrawerOpen.set(false)"
                class="text-zinc-300 hover:text-white cursor-pointer"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <!-- User / Admin Quick Account Banner in Drawer -->
            @if (authService.isAdmin()) {
              <div class="bg-gradient-to-r from-black via-zinc-900 to-black p-3.5 border-b border-red-600/40 text-white space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 font-black text-xs text-red-400">
                    <mat-icon class="text-sm scale-90">admin_panel_settings</mat-icon>
                    <span>PROPRIÉTAIRE INDÉPENDANT</span>
                  </div>
                  <span class="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded font-mono font-bold">Actif</span>
                </div>
                <div class="text-[11px] text-zinc-300">
                  Accès complet à la gestion du catalogue, devis RDC et tarifs.
                </div>
                <button
                  type="button"
                  (click)="isDrawerOpen.set(false); authService.openAdminPanel()"
                  class="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md uppercase tracking-wider"
                >
                  <mat-icon class="text-xs">dashboard_customize</mat-icon>
                  <span>Ouvrir Console Admin</span>
                </button>
              </div>
            } @else if (authService.currentUser(); as user) {
              <div class="bg-zinc-100 p-3 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <div class="font-bold text-xs text-zinc-900 flex items-center gap-1">
                    <mat-icon class="text-xs text-amber-500 scale-75">stars</mat-icon>
                    <span>{{ user.fullName }}</span>
                  </div>
                  <div class="text-[10px] text-zinc-500 font-medium">
                    Points : <strong class="text-red-600">{{ user.loyaltyPoints }} pts</strong> ({{ user.memberTier }})
                  </div>
                </div>
                <button
                  type="button"
                  (click)="isDrawerOpen.set(false); authService.openLogin()"
                  class="bg-white border border-zinc-300 text-zinc-800 font-bold text-xs px-2.5 py-1 rounded shadow-2xs hover:bg-zinc-50 cursor-pointer"
                >
                  Mon Espace
                </button>
              </div>
            } @else {
              <div class="bg-zinc-100 p-2.5 border-b border-zinc-200 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  (click)="isDrawerOpen.set(false); authService.openLogin()"
                  class="bg-white border border-zinc-300 text-zinc-800 font-bold text-xs py-1.5 px-2 rounded text-center cursor-pointer shadow-2xs"
                >
                  Connexion
                </button>
                <button
                  type="button"
                  (click)="isDrawerOpen.set(false); authService.openRegister()"
                  class="bg-red-600 text-white font-bold text-xs py-1.5 px-2 rounded text-center cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                >
                  <span>Inscription</span>
                  <span class="bg-amber-400 text-zinc-900 text-[9px] px-1 rounded font-black">+10$</span>
                </button>
              </div>
            }

            <!-- Language and Currency Selection in Drawer -->
            <div class="p-3 bg-zinc-50 border-b border-zinc-200 text-xs space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-zinc-600">{{ lang.t('languageLabel') }}:</span>
                <select
                  [value]="lang.currentLang()"
                  (change)="onDrawerLanguageChange($event)"
                  class="bg-white border border-zinc-300 rounded px-2 py-1 font-bold text-xs"
                >
                  @for (l of lang.languages; track l.code) {
                    <option [value]="l.code">{{ l.flag }} {{ l.name }}</option>
                  }
                </select>
              </div>

              <div class="flex items-center justify-between">
                <span class="font-bold text-zinc-600">{{ lang.t('currencyLabel') }}:</span>
                <select
                  [value]="lang.currentCurrency()"
                  (change)="onDrawerCurrencyChange($event)"
                  class="bg-white border border-zinc-300 rounded px-2 py-1 font-bold text-xs text-red-600"
                >
                  @for (curr of lang.currencies; track curr.code) {
                    <option [value]="curr.code">{{ curr.code }} ({{ curr.symbol }})</option>
                  }
                </select>
              </div>
            </div>

            <!-- Sidebar / Left Column Filters inside Burger Menu -->
            <div class="p-3 bg-zinc-50 border-b border-zinc-200">
              <div class="text-[11px] font-black uppercase text-zinc-800 mb-2 flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <mat-icon class="text-xs text-red-600">filter_list</mat-icon>
                  <span>Filtres & Marques (Colonne Gauche)</span>
                </div>
                @if (vehicleService.hasActiveFilters()) {
                  <button
                    type="button"
                    (click)="vehicleService.resetFilter()"
                    class="text-[10px] text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    Effacer
                  </button>
                }
              </div>
              <app-sidebar />

              <!-- Apply Filters Button in Drawer -->
              <div class="mt-3 pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  (click)="isDrawerOpen.set(false)"
                  class="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white py-2.5 px-3 rounded font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <mat-icon class="text-sm">check</mat-icon>
                  <span>Appliquer & Voir ({{ vehicleService.filteredVehicles().length }} véhicules)</span>
                </button>
              </div>
            </div>

            <!-- Navigation Links List in Drawer -->
            <div class="p-3 space-y-0.5 text-xs text-blue-900 font-bold divide-y divide-zinc-100">
              @if (authService.isAdmin()) {
                <button
                  type="button"
                  (click)="isDrawerOpen.set(false); authService.openAdminPanel()"
                  class="w-full text-left py-2.5 text-red-600 font-black flex items-center justify-between cursor-pointer"
                >
                  <span>🛡️ Console Propriétaire Indépendant</span>
                  <mat-icon class="scale-75">shield</mat-icon>
                </button>
              }
              <!-- Price Drop Alert in Drawer -->
              <button
                type="button"
                (click)="isDrawerOpen.set(false); priceAlertService.openModal()"
                class="w-full text-left py-2.5 text-[#EA580C] font-black flex items-center justify-between cursor-pointer"
              >
                <div class="flex items-center gap-1.5">
                  <mat-icon class="scale-90 text-amber-500">notifications_active</mat-icon>
                  <span>Alertes Baisse de Prix (Email & WhatsApp)</span>
                </div>
                <span class="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {{ priceAlertService.alerts().length }}
                </span>
              </button>
              <a href="#how-to-buy" (click)="isDrawerOpen.set(false)" class="block py-2.5 hover:text-red-600">How to buy</a>
              <a href="#how-to-pay" (click)="isDrawerOpen.set(false)" class="block py-2.5 hover:text-red-600">How to Pay</a>
              <a href="#faq" (click)="isDrawerOpen.set(false)" class="block py-2.5 hover:text-red-600">FAQs</a>
              <a href="#contact-sales" (click)="isDrawerOpen.set(false)" class="block py-2.5 hover:text-red-600">Inquiry & Customer Support</a>
              <a href="#bf-warranty" (click)="isDrawerOpen.set(false)" class="block py-2.5 hover:text-red-600">BF Warranty & Inspection</a>
              <a href="#arrival-progress" (click)="isDrawerOpen.set(false)" class="block py-2.5 hover:text-red-600">Car Arrival Progress</a>
              <a href="#bf-points" (click)="isDrawerOpen.set(false)" class="block py-2.5 hover:text-red-600">What is BF Points?</a>
              <a href="#drc-office" (click)="isDrawerOpen.set(false)" class="block py-2.5 hover:text-red-600 text-red-600 font-black">🇨🇩 Bureau R.D. Congo (Kinshasa & Lubumbashi)</a>
              <a href="#customer-reviews" (click)="isDrawerOpen.set(false)" class="block py-2.5 hover:text-red-600">Customer Reviews</a>
              <button
                type="button"
                (click)="switchToPcSite()"
                class="w-full text-left py-2.5 text-blue-600 font-black flex items-center justify-between cursor-pointer"
              >
                <span>🖥️ PC Site Version</span>
                <mat-icon class="scale-75">launch</mat-icon>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class MobileViewComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);
  readonly authService = inject(AuthService);
  readonly priceAlertService = inject(PriceAlertService);
  readonly viewModeService = inject(ViewModeService);

  readonly isDrawerOpen = signal<boolean>(false);
  readonly isDelaysExpanded = signal<boolean>(false);
  readonly showAllMakes = signal<boolean>(false);
  readonly showAllFaq = signal<boolean>(false);
  readonly isAdvantagesOpen = signal<boolean>(false);
  readonly searchKeyword = signal<string>('');
  readonly openMobileFaq = signal<string>('q1');
  readonly currentFlowStep = signal<number>(0);
  readonly newsletterSuccess = signal<boolean>(false);
  readonly featureNotification = signal<string>('');

  mobileEmail = '';

  readonly shippingCountries = [
    { name: 'Japon', flag: '🇯🇵' },
    { name: 'Singapour', flag: '🇸🇬' },
    { name: 'Royaume-Uni', flag: '🇬🇧' },
    { name: 'Émirats arabes unis', flag: '🇦🇪' },
    { name: 'Thaïlande', flag: '🇹🇭' },
    { name: 'Corée', flag: '🇰🇷' },
    { name: 'Belgique', flag: '🇧🇪' },
    { name: 'Afrique du Sud', flag: '🇿🇦' },
  ];

  readonly stockLocations = [
    { name: 'Japon', flag: '🇯🇵', units: '52,430+', country: 'Japon' },
    { name: 'Corée', flag: '🇰🇷', units: '14,120+', country: 'Corée' },
    { name: 'Singapour', flag: '🇸🇬', units: '3,800+', country: 'Singapour' },
    { name: 'Thaïlande', flag: '🇹🇭', units: '2,950+', country: 'Thaïlande' },
    { name: 'Émirats arabes unis', flag: '🇦🇪', units: '4,680+', country: 'Émirats arabes unis' },
    { name: 'Royaume-Uni', flag: '🇬🇧', units: '1,250+', country: 'Royaume-Uni' },
    { name: 'États-Unis', flag: '🇺🇸', units: '980+', country: 'États-Unis' },
    { name: 'Afrique du Sud', flag: '🇿🇦', units: '620+', country: 'Afrique du Sud' },
  ];

  readonly allBrands = [
    { name: 'TOYOTA' },
    { name: 'NISSAN' },
    { name: 'HONDA' },
    { name: 'MITSUBISHI' },
    { name: 'MAZDA' },
    { name: 'MERCEDES-BENZ' },
    { name: 'BMW' },
    { name: 'SUZUKI' },
    { name: 'SUBARU' },
    { name: 'VOLKSWAGEN' },
    { name: 'AUDI' },
    { name: 'DAIHATSU' },
  ];

  readonly bodyTypes = [
    { name: 'Berline', icon: 'directions_car' },
    { name: 'Hatchback', icon: 'directions_car' },
    { name: 'SUV', icon: 'directions_car' },
    { name: 'Monospace', icon: 'minor_crash' },
    { name: 'Van', icon: 'airport_shuttle' },
    { name: 'Camion', icon: 'local_shipping' },
    { name: 'Pick up', icon: 'rv_hookup' },
    { name: 'Coupé', icon: 'sports_motorsports' },
  ];

  readonly popularKeywords = [
    'Land Cruiser',
    'Toyota Noah',
    'Toyota Rav4',
    'Mitsubishi Canter',
    'Toyota Carina',
    'Toyota Ist',
    'BMW Series',
    'Hilux Surf',
    'Toyota Harrier',
    'Range Rover',
  ];

  readonly purchaseSteps = [
    {
      step: 1,
      badge: 'STEP 1',
      title: 'GET A PRICE QUOTE',
      desc: 'Select your vehicle, choose your destination port, and get an immediate official CIF proforma invoice.',
      subtext: 'Instant CIF quotation & proforma invoice',
      icon: 'request_quote',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      step: 2,
      badge: 'STEP 2',
      title: 'PAYMENT & SHIPMENT',
      desc: 'Pay securely via international SWIFT bank transfer, Visa, MasterCard or PayPal to lock your booking.',
      subtext: 'Zero-risk verified banking & invoice confirmation',
      icon: 'payments',
      color: 'from-emerald-600 to-teal-700',
    },
    {
      step: 3,
      badge: 'STEP 3',
      title: 'MARITIME SHIPPING',
      desc: 'Thorough export inspection, vessel departure on Ro-Ro or Container, live tracking and DHL delivery of Bill of Lading.',
      subtext: 'Ro-Ro & Container options with DHL original BL documents',
      icon: 'directions_boat',
      color: 'from-amber-600 to-orange-700',
    },
    {
      step: 4,
      badge: 'STEP 4',
      title: 'PORT CUSTOMS & DELIVERY',
      desc: 'Smooth customs clearance at your port (Matadi, Boma, Dar es Salaam, Mombasa) and carrier delivery to your city.',
      subtext: 'Port clearance assistance & direct city transport',
      icon: 'local_shipping',
      color: 'from-rose-600 to-red-700',
    },
  ];

  readonly faqItems = [
    {
      id: 'q1',
      question: 'How can I buy a car from Japan?',
      answer: 'Select your vehicle, request a proforma invoice, complete bank transfer, and we handle maritime shipping to Matadi, Boma, Dar es Salaam or Mombasa.',
    },
    {
      id: 'q2',
      question: 'How do I pay for my car?',
      answer: 'We accept international SWIFT wire transfer to our corporate account in Tokyo, plus credit cards (Visa/Mastercard) and PayPal for deposits.',
    },
    {
      id: 'q3',
      question: 'What are BF Points?',
      answer: 'Reward points earned on each car purchase (1 point = $1 discount on future orders or shipping costs).',
    },
    {
      id: 'q4',
      question: 'What are the shipping delivery times?',
      answer: 'Average transit time from Japan to Matadi or Dar es Salaam is 30 to 45 days. From UAE (Dubai), transit is 18 to 25 days.',
    },
    {
      id: 'q5',
      question: 'Can I order Left Hand Drive (LHD) vehicles?',
      answer: 'Yes! We maintain an extensive stock of over 45,000 Left Hand Drive (LHD) vehicles from Korea, Dubai, and USA, fully compliant with DRC and African road regulations.',
    },
    {
      id: 'q6',
      question: 'Is maritime cargo insurance included?',
      answer: 'Comprehensive all-risk marine insurance covers fire, theft, vessel total loss, and transit damages. You can select it directly on your proforma invoice.',
    },
  ];

  readonly infoMenuItemsPart1 = [
    { id: 'live-auction-jp', labelKey: 'liveAuctionJapan', defaultLabel: 'Learn more about Live Auction (Japan)', url: '#live-auction-jp' },
    { id: 'live-auction-kr', labelKey: 'liveAuctionKorea', defaultLabel: 'Learn more about Live Auction (Korea)', url: '#live-auction-kr' },
    { id: 'how-to-buy', labelKey: 'howToBuy', defaultLabel: 'How to buy', url: '#how-to-buy' },
    { id: 'how-to-pay', labelKey: 'howToPay', defaultLabel: 'How to Pay', url: '#how-to-pay' },
    { id: 'faqs', labelKey: 'faqs', defaultLabel: 'FAQs', url: '#faq' },
    { id: 'inquiry', labelKey: 'inquiry', defaultLabel: 'Inquiry', url: '#inquiry' },
    { id: 'what-is-my-account', labelKey: 'whatIsMyAccount', defaultLabel: 'What is My Account?', url: '#my-account' },
    { id: 'bf-warranty', labelKey: 'bfWarranty', defaultLabel: 'BF Warranty', url: '#bf-warranty' },
    { id: 'what-is-buy-now', labelKey: 'whatIsBuyNow', defaultLabel: 'What is "Buy Now"?', url: '#buy-now' },
    { id: 'what-is-bf-supporters', labelKey: 'whatIsBfSupporters', defaultLabel: 'What is BE FORWARD SUPPORTERS?', url: '#supporters' },
    { id: 'why-choose-bf', labelKey: 'whyChooseBf', defaultLabel: 'Why Choose BF?', url: '#why-choose' },
    { id: 'car-arrival-progress', labelKey: 'carArrivalProgress', defaultLabel: 'Car Arrival Progress', url: '#arrival-progress' },
    { id: 'what-is-bf-points', labelKey: 'whatIsBfPoints', defaultLabel: 'What is BF Points?', url: '#bf-points' },
    { id: 'shipping-schedule', labelKey: 'shippingSchedule', defaultLabel: 'Shipping Schedule', url: '#shipping-schedule' },
    { id: 'shipping-agents', labelKey: 'shippingAgents', defaultLabel: 'Shipping Agents', url: '#shipping-agents' },
    { id: 'doc-processing-centers', labelKey: 'documentProcessingCenters', defaultLabel: 'Document Processing Centers', url: '#doc-centers' },
    { id: 'car-carrier-delivery', labelKey: 'carCarrierDelivery', defaultLabel: 'Car Carrier Delivery', url: '#carrier-delivery' },
    { id: 'about-bf', labelKey: 'aboutBf', defaultLabel: 'About BE FORWARD', url: '#about' },
  ];

  readonly infoMenuItemsPart2 = [
    { id: 'customer-reviews', labelKey: 'customerReviews', defaultLabel: 'Customer Reviews', url: '#reviews', isPcSite: false },
    { id: 'blog', labelKey: 'blog', defaultLabel: 'Blog', url: '#blog', isPcSite: false },
    { id: 'jdm-showcase', labelKey: 'jdmShowcase', defaultLabel: 'JDM Showcase', url: '#jdm', isPcSite: false },
    { id: 'homes-properties', labelKey: 'homesProperties', defaultLabel: 'Homes: Properties for Sale and Rent', url: '#homes', isPcSite: false },
    { id: 'pc-site', labelKey: 'pcSite', defaultLabel: 'PC Site', url: '', isPcSite: true },
    { id: 'terms-conditions', labelKey: 'termsConditions', defaultLabel: 'Terms & Conditions', url: '#terms', isPcSite: false },
    { id: 'privacy-policy', labelKey: 'privacyPolicy', defaultLabel: 'Privacy Policy', url: '#privacy', isPcSite: false },
    { id: 'cookie-preference', labelKey: 'cookiePreference', defaultLabel: 'Cookie Preference', url: '#cookies', isPcSite: false },
    { id: 'disclaimer', labelKey: 'disclaimer', defaultLabel: 'Disclaimer', url: '#disclaimer', isPcSite: false },
  ];

  readonly recentlyCheckedList = computed(() => {
    const viewed = this.vehicleService.recentlyViewedVehicles();
    if (viewed.length >= 3) return viewed.slice(0, 3);
    const fallbacks = this.vehicleService.vehicles().slice(0, 3);
    return [...viewed, ...fallbacks.filter((f) => !viewed.some((v) => v.id === f.id))].slice(0, 3);
  });

  displayedBrands() {
    return this.showAllMakes() ? this.allBrands : this.allBrands.slice(0, 8);
  }

  displayedFaqList() {
    return this.showAllFaq() ? this.faqItems : this.faqItems.slice(0, 3);
  }

  toggleAllMakes() {
    this.showAllMakes.set(!this.showAllMakes());
  }

  prevFlowStep() {
    this.currentFlowStep.update((curr) => (curr > 0 ? curr - 1 : this.purchaseSteps.length - 1));
  }

  nextFlowStep() {
    this.currentFlowStep.update((curr) => (curr < this.purchaseSteps.length - 1 ? curr + 1 : 0));
  }

  setFlowStep(idx: number) {
    this.currentFlowStep.set(idx);
  }

  onSearchInput(e: Event) {
    this.searchKeyword.set((e.target as HTMLInputElement).value);
  }

  triggerMobileSearch() {
    this.vehicleService.setFilter({ keyword: this.searchKeyword() });
    this.scrollToCatalog();
  }

  setQuickCategory(cat: string) {
    this.vehicleService.setFilter({ category: cat });
    this.scrollToCatalog();
  }

  filterByBrand(brand: string) {
    const curr = this.vehicleService.filter().make;
    this.vehicleService.setFilter({ make: curr === brand ? '' : brand });
    this.scrollToCatalog();
  }

  filterByType(type: string) {
    const curr = this.vehicleService.filter().category;
    this.vehicleService.setFilter({ category: curr === type ? '' : type });
    this.scrollToCatalog();
  }

  setShippingCountry(country: string) {
    this.vehicleService.setFilter({ stockCountry: country });
    this.scrollToCatalog();
  }

  setTab(tab: 'new_arrivals' | 'certified') {
    this.vehicleService.setFilter({ activeTab: tab });
    this.scrollToCatalog();
  }

  searchByKeyword(kw: string) {
    this.vehicleService.setFilter({ keyword: kw });
    this.scrollToCatalog();
  }

  openVehicle(veh: Vehicle) {
    this.vehicleService.selectVehicle(veh);
  }

  filterFavorites() {
    this.vehicleService.openFavoritesModal();
  }

  openLoginPrompt() {
    this.authService.openLogin();
  }

  openFeatureAlert(feature: string) {
    this.featureNotification.set(`${feature} est activé.`);
    setTimeout(() => {
      this.featureNotification.set('');
    }, 3000);
  }

  onCountrySelect(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.lang.setCountry(val);
  }

  onDrawerLanguageChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value as LanguageCode;
    this.lang.setLanguage(val);
  }

  onDrawerCurrencyChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value as CurrencyCode;
    this.lang.setCurrency(val);
  }

  toggleMobileFaq(id: string) {
    this.openMobileFaq.update((curr) => (curr === id ? '' : id));
  }

  subscribeMobileNewsletter() {
    if (!this.mobileEmail || !this.mobileEmail.includes('@')) {
      this.featureNotification.set('Veuillez entrer une adresse e-mail valide.');
      return;
    }
    this.newsletterSuccess.set(true);
    this.featureNotification.set(`Votre adresse ${this.mobileEmail} est inscrite.`);
    this.mobileEmail = '';
    setTimeout(() => {
      this.newsletterSuccess.set(false);
      this.featureNotification.set('');
    }, 4000);
  }

  openSupportChat() {
    const chatBtn = document.querySelector('app-support-chat button') as HTMLButtonElement;
    if (chatBtn) {
      chatBtn.click();
    } else {
      this.openLoginPrompt();
    }
  }

  scrollToSearch() {
    const el = document.getElementById('mobile-search-bar');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToCatalog() {
    const el = document.getElementById('mobile-search-bar');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  switchToPcSite() {
    this.viewModeService.setMode('pc');
  }
}
