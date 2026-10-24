import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { VehicleService } from '../../services/vehicle';
import { LanguageService } from '../../services/language';
import { ViewModeService } from '../../services/view-mode';
import { AuthService } from '../../services/auth';
import { PriceAlertService } from '../../services/price-alert';
import { Vehicle } from '../../models/vehicle';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-mobile-vehicle-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, SidebarComponent],
  template: `
    @if (vehicleService.selectedVehicle(); as v) {
      <div #topContainer class="bg-[#F4F4F6] min-h-screen text-zinc-900 font-sans pb-24 relative select-none">
        <!-- ============================================================== -->
        <!-- 1. TOP PROMO BANNER ($300-DISCOUNT SINGAPORE & JAPAN) (IMG_4060) -->
        <!-- ============================================================== -->
        <div class="bg-gradient-to-r from-[#991B1B] via-[#DC2626] to-[#7F1D1D] text-white text-xs font-black py-1.5 px-3 flex items-center justify-between shadow-xs">
          <div class="flex items-center gap-1.5 truncate">
            <span class="bg-black text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">PROMO</span>
            <span class="text-amber-300 font-extrabold tracking-tight">$300-DISCOUNT</span>
            <span class="truncate text-[11px] text-white/95">FROM SINGAPORE & JAPAN!</span>
          </div>
          <button
            type="button"
            (click)="switchToPcSite()"
            class="bg-black/70 hover:bg-black text-[10px] text-white font-bold px-2 py-0.5 rounded cursor-pointer whitespace-nowrap border border-white/20"
          >
            PC SITE
          </button>
        </div>

        <!-- ============================================================== -->
        <!-- 2. MOBILE MAIN HEADER BAR (IMG_4060)                           -->
        <!-- ============================================================== -->
        <header class="bg-[#1A1A1A] text-white px-3 py-2 flex items-center justify-between border-b-2 border-red-600 sticky top-0 z-30 shadow-md">
          <!-- Hamburger Menu Button -->
          <button
            type="button"
            (click)="isDrawerOpen.set(true)"
            class="flex flex-col items-center justify-center text-zinc-200 hover:text-white cursor-pointer px-1"
            title="Menu"
          >
            <mat-icon class="scale-100">menu</mat-icon>
            <span class="text-[9px] uppercase font-bold tracking-tight">Menu</span>
          </button>

          <!-- Brand Logo (Red, Black, White with Orange Arrow) -->
          <button
            type="button"
            (click)="goBackToCatalog()"
            class="flex items-center gap-1 font-black text-base tracking-tighter cursor-pointer"
          >
            <span class="bg-red-600 text-white px-1.5 py-0.5 rounded text-xs font-black">AUTO</span>
            <span class="text-white text-sm">FORWARD</span>
            <span class="text-amber-400 font-black text-xs">➤</span>
          </button>

          <!-- Right Quick Actions: Search, Login, Favorites with Badge -->
          <div class="flex items-center gap-2.5">
            <!-- Search / Filter shortcut -->
            <button
              type="button"
              (click)="isDrawerOpen.set(true)"
              class="flex flex-col items-center justify-center text-zinc-200 hover:text-white cursor-pointer"
              title="Rechercher"
            >
              <mat-icon class="scale-90">search</mat-icon>
              <span class="text-[9px] font-bold">Search</span>
            </button>

            <!-- Login / Account button -->
            <button
              type="button"
              (click)="authService.openLogin()"
              class="flex flex-col items-center justify-center text-zinc-200 hover:text-white cursor-pointer"
              title="Mon Compte"
            >
              <mat-icon class="scale-90 text-red-500">
                {{ authService.currentUser() ? 'account_circle' : 'person' }}
              </mat-icon>
              <span class="text-[9px] font-bold truncate max-w-[45px]">
                {{ authService.currentUser() ? authService.currentUser()?.fullName?.split(' ')?.[0] : 'Login' }}
              </span>
            </button>

            <!-- Favorites button with count -->
            <button
              type="button"
              (click)="vehicleService.openFavoritesModal()"
              class="flex flex-col items-center justify-center text-zinc-200 hover:text-white cursor-pointer relative"
              title="Favoris"
            >
              <div class="relative">
                <mat-icon class="scale-90 text-red-500">favorite</mat-icon>
                @if (vehicleService.favoriteIds().length > 0) {
                  <span class="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                    {{ vehicleService.favoriteIds().length }}
                  </span>
                }
              </div>
              <span class="text-[9px] font-bold">Favorites</span>
            </button>
          </div>
        </header>

        <!-- ============================================================== -->
        <!-- 3. BREADCRUMBS TRAIL (IMG_4060)                                -->
        <!-- ============================================================== -->
        <nav class="bg-white px-3 py-2 border-b border-zinc-200 text-[11px] text-zinc-600 font-semibold overflow-x-auto whitespace-nowrap flex items-center gap-1">
          <button type="button" (click)="goBackToCatalog()" class="text-blue-700 hover:underline cursor-pointer">
            HOME
          </button>
          <span class="text-zinc-400">»</span>
          <button type="button" (click)="filterByMake(v.make)" class="text-blue-700 hover:underline uppercase cursor-pointer">
            {{ v.make }}
          </button>
          <span class="text-zinc-400">»</span>
          <span class="text-zinc-500">{{ v.category }}</span>
          <span class="text-zinc-400">»</span>
          <span class="text-blue-700 font-bold">{{ v.model }}</span>
          <span class="text-zinc-400">»</span>
          <span class="text-zinc-500">{{ v.year }}</span>
          <span class="text-zinc-400">»</span>
          <span class="text-zinc-700 font-mono">{{ v.refNo }}</span>
        </nav>

        <!-- ============================================================== -->
        <!-- 4. VEHICLE TITLE & 3RD PARTY SELLER TAG (IMG_4060)             -->
        <!-- ============================================================== -->
        <div class="bg-white px-3.5 pt-3 pb-2 border-b border-zinc-100">
          <h1 class="text-lg font-black text-zinc-950 leading-tight tracking-tight uppercase">
            {{ v.year }} {{ v.make }}
          </h1>
          <p class="text-xs font-bold text-zinc-800 leading-snug mt-0.5">
            {{ v.model }} {{ v.versionClass || 'V220dA' }} {{ v.chassisCode }} {{ v.refNo }}
          </p>

          <div class="mt-1 flex items-center justify-between">
            <span class="text-[11px] font-black text-[#E11D48] tracking-tight">
              3RD PARTY seller
            </span>
            <span class="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-mono font-bold">
              Stock: {{ v.stockCountry }} ({{ v.locationCity }})
            </span>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- 5. MAIN VEHICLE IMAGE CAROUSEL (IMG_4060)                      -->
        <!-- ============================================================== -->
        <div class="relative bg-zinc-900 overflow-hidden aspect-[4/3] select-none" id="photo-gallery-top">
          <!-- Active Photo -->
          <img
            [src]="currentActiveImage()"
            [alt]="v.make + ' ' + v.model"
            class="w-full h-full object-cover transition-all duration-300"
            referrerpolicy="no-referrer"
          />

          <!-- Previous (<) Arrow -->
          <button
            type="button"
            (click)="prevImage()"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-transform active:scale-90 z-10"
            aria-label="Photo précédente"
          >
            <mat-icon class="scale-110">chevron_left</mat-icon>
          </button>

          <!-- Next (>) Arrow -->
          <button
            type="button"
            (click)="nextImage()"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-transform active:scale-90 z-10"
            aria-label="Photo suivante"
          >
            <mat-icon class="scale-110">chevron_right</mat-icon>
          </button>

          <!-- Bottom Left Overlay: 1 / 30 Counter -->
          <div class="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded shadow-md z-10">
            {{ currentImageIndex() + 1 }} / {{ allImages().length }}
          </div>

          <!-- Bottom Center/Right Watermark (ROUND MOTOR / AUTO FORWARD Ref#) -->
          <div class="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 z-10">
            <span class="text-red-400 font-black">ROUND MOTOR</span>
            <span class="text-zinc-300">Ref#:{{ v.refNo }}</span>
          </div>
        </div>

        <!-- 6. Thumbnails Row with Navigation Arrows (IMG_4060) -->
        <div class="bg-zinc-100 px-2 py-2 border-b border-zinc-200 flex items-center gap-1.5 overflow-x-auto select-none">
          <button
            type="button"
            (click)="prevImage()"
            class="shrink-0 w-6 h-12 bg-zinc-300 hover:bg-zinc-400 text-zinc-800 rounded flex items-center justify-center cursor-pointer"
          >
            <mat-icon class="text-xs">chevron_left</mat-icon>
          </button>

          <div class="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-thin">
            @for (img of allImages(); track $index) {
              <button
                type="button"
                (click)="currentImageIndex.set($index)"
                class="shrink-0 w-16 h-12 rounded overflow-hidden border-2 cursor-pointer transition-all"
                [class.border-red-600]="currentImageIndex() === $index"
                [class.border-zinc-300]="currentImageIndex() !== $index"
              >
                <img [src]="img" class="w-full h-full object-cover" alt="Thumb" referrerpolicy="no-referrer" />
              </button>
            }
          </div>

          <button
            type="button"
            (click)="nextImage()"
            class="shrink-0 w-6 h-12 bg-zinc-300 hover:bg-zinc-400 text-zinc-800 rounded flex items-center justify-center cursor-pointer"
          >
            <mat-icon class="text-xs">chevron_right</mat-icon>
          </button>
        </div>

        <!-- 7. Social Share Buttons Bar (IMG_4060) -->
        <div class="bg-white px-3 py-2 border-b border-zinc-200 flex items-center justify-center gap-2">
          <!-- Facebook Share -->
          <button
            type="button"
            (click)="shareFacebook()"
            class="bg-[#1877F2] hover:bg-blue-700 text-white text-[11px] font-bold py-1 px-3 rounded flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <span class="font-black text-xs">f</span>
            <span>Share</span>
          </button>

          <!-- Viber / Purple Share -->
          <button
            type="button"
            (click)="shareGeneric()"
            class="bg-[#7360F2] hover:bg-purple-700 text-white text-[11px] font-bold py-1 px-3 rounded flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <mat-icon class="text-xs scale-75">chat</mat-icon>
            <span>Share</span>
          </button>

          <!-- WhatsApp Share -->
          <button
            type="button"
            (click)="shareWhatsApp()"
            class="bg-[#22C55E] hover:bg-emerald-600 text-white text-[11px] font-bold py-1 px-3 rounded flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <mat-icon class="text-xs scale-75">chat</mat-icon>
            <span>Share</span>
          </button>
        </div>

        <!-- ============================================================== -->
        <!-- 8. PRICING & SHIPPING SECTION (IMG_4061)                       -->
        <!-- ============================================================== -->
        <div class="bg-white p-4 border-b border-zinc-200 space-y-3">
          <div class="flex items-start justify-between">
            <span class="text-[11px] font-black text-[#E11D48] tracking-tight">
              3RD PARTY seller
            </span>

            <!-- Favorite Button Top Right (IMG_4061) -->
            <button
              type="button"
              (click)="toggleFavorite()"
              class="w-8 h-8 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
              [title]="isFav() ? 'Retirer des favoris' : 'Ajouter aux favoris'"
            >
              <mat-icon class="text-base" [class.text-red-600]="isFav()" [class.text-zinc-400]="!isFav()">
                {{ isFav() ? 'favorite' : 'favorite_border' }}
              </mat-icon>
            </button>
          </div>

          <!-- Price breakdown table -->
          <div class="space-y-1.5 text-xs">
            <!-- Original Price -->
            <div class="flex items-baseline justify-between text-zinc-600">
              <span class="font-bold">Original Price</span>
              <span class="line-through text-zinc-400 tabular-nums">
                {{ lang.formatPrice(originalPriceUsd()) }}
              </span>
            </div>

            <!-- Vehicle Price (Green) -->
            <div class="flex items-baseline justify-between">
              <span class="font-black text-zinc-900 text-sm">Price</span>
              <div class="text-right">
                <div class="text-xl font-black text-[#16A34A] tabular-nums leading-tight">
                  {{ lang.formatPrice(v.priceUsd) }}
                </div>
                <div class="text-[11px] font-bold text-[#16A34A] tabular-nums">
                  (CDF {{ formatCdf(v.priceUsd) }})
                </div>
              </div>
            </div>

            <!-- You Save -->
            <div class="flex items-baseline justify-between text-[#DC2626] font-bold">
              <span>You Save</span>
              <span class="tabular-nums">
                {{ lang.formatPrice(savingsUsd()) }} ({{ savingsPercent() }}%)
              </span>
            </div>

            <!-- Total CIF Price -->
            <div class="pt-2 border-t border-zinc-200 flex items-baseline justify-between">
              <div>
                <span class="font-black text-zinc-900 text-sm block">Total Price</span>
                <span class="text-[10px] text-zinc-500 font-semibold block">
                  C&F {{ currentPortName() }} ({{ shippingMethod().toUpperCase() }})
                </span>
              </div>
              <div class="text-right">
                <div class="text-xl font-black text-[#16A34A] tabular-nums leading-tight">
                  {{ lang.formatPrice(calculatedTotalCif()) }}
                </div>
                <div class="text-[10px] font-bold text-zinc-600 tabular-nums">
                  (Approx. Exchange Price: CDF {{ formatCdf(calculatedTotalCif()) }})
                </div>
              </div>
            </div>
          </div>

          <!-- Port Destination Selector & Maritime Insurance Toggle -->
          <div class="space-y-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-zinc-700">Port d'arrivée :</span>
              <select
                [value]="selectedPortId()"
                (change)="onPortChange($event)"
                class="bg-white border border-zinc-300 font-bold text-xs rounded px-2 py-1 text-zinc-900"
              >
                @for (port of vehicleService.ports(); track port.id) {
                  <option [value]="port.id">{{ port.name }} (+{{ lang.formatPrice(port.baseOceanFreightUsd) }})</option>
                }
              </select>
            </div>

            <!-- Maritime Insurance & Pre-Shipment Inspection (+$120) Toggle -->
            <div class="pt-2 border-t border-zinc-200 flex items-center justify-between">
              <label for="mvd-insurance-check" class="flex items-center gap-2 cursor-pointer font-bold text-zinc-800">
                <input
                  id="mvd-insurance-check"
                  type="checkbox"
                  [checked]="includeInsurance()"
                  (change)="toggleInsurance($event)"
                  class="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                />
                <span>Assurance maritime & Inspection (+120$)</span>
              </label>
              <span class="font-mono font-bold text-xs" [class.text-emerald-600]="includeInsurance()" [class.text-zinc-400]="!includeInsurance()">
                {{ includeInsurance() ? '+120$' : 'Exclus (0$)' }}
              </span>
            </div>
          </div>

          <!-- Red payment currency note (IMG_4061) -->
          <p class="text-[11px] text-[#DC2626] leading-tight font-medium">
            In case of payment by PayPal or Card, we accept payment in CDF. Request the quote in CDF to our sales if you are willing to pay in CDF.
          </p>

          <!-- Reward Points Blue Banner (IMG_4061) -->
          <div class="bg-[#1E40AF] text-white p-2.5 rounded-md flex items-center gap-2 text-xs font-bold shadow-xs">
            <div class="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-black text-[11px]">
              P
            </div>
            <div>
              <span>Earn 20pts ($20) by purchasing this vehicle</span>
              <span class="text-amber-300 text-[10px] block font-normal">Limited Time Offer</span>
            </div>
          </div>

          <!-- Scroll to photos shortcut button (IMG_4065) -->
          <div class="text-center pt-1">
            <button
              type="button"
              (click)="scrollToPhotos()"
              class="text-blue-700 font-bold text-xs inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <mat-icon class="text-sm scale-90">photo_library</mat-icon>
              <span>Scroll to photos</span>
            </button>
          </div>

          <!-- Shipping Method Tabs: RORO vs CONTAINER (IMG_4061) -->
          <div class="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              (click)="shippingMethod.set('roro')"
              class="py-2 px-3 rounded font-black text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
              [class.bg-[#2563EB]]="shippingMethod() === 'roro'"
              [class.text-white]="shippingMethod() === 'roro'"
              [class.bg-zinc-200]="shippingMethod() !== 'roro'"
              [class.text-zinc-700]="shippingMethod() !== 'roro'"
            >
              RORO
            </button>
            <button
              type="button"
              (click)="shippingMethod.set('container')"
              class="py-2 px-3 rounded font-black text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
              [class.bg-[#2563EB]]="shippingMethod() === 'container'"
              [class.text-white]="shippingMethod() === 'container'"
              [class.bg-zinc-200]="shippingMethod() !== 'container'"
              [class.text-zinc-700]="shippingMethod() !== 'container'"
            >
              CONTAINER
            </button>
          </div>

          <!-- Two Main CTAs: GET A PRICE QUOTE & BUY NOW (IMG_4061) -->
          <div class="space-y-2 pt-1">
            <!-- GET A PRICE QUOTE (Orange Button) -->
            <button
              type="button"
              (click)="openQuoteModal()"
              class="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white py-3 px-4 rounded-md font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-[0.99]"
            >
              <mat-icon class="scale-90">email</mat-icon>
              <span>GET A PRICE QUOTE</span>
            </button>

            <!-- BUY NOW (Yellow/Amber Button) -->
            <button
              type="button"
              (click)="buyNow()"
              class="w-full bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 py-3 px-4 rounded-md font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-[0.99]"
            >
              <mat-icon class="scale-90 text-zinc-950">shopping_cart</mat-icon>
              <span>BUY NOW</span>
            </button>
          </div>

          <!-- Notice RDC Clearing & DGDA (IMG_4061) -->
          <div class="text-[11px] text-[#DC2626] font-medium leading-relaxed space-y-1 pt-1">
            <p>
              <strong class="font-bold">Notice:</strong> Le prix à Matadi + Clearing, Kinshasa, Kimpese, Kisantu et Kikwit comprend le dégagement à Matadi! Seuls les frais de la DGDA (dédouanement) - Assurance - Immatriculation - OCC ne sont pas inclus. Pour tout détail, contactez <span class="font-bold underline">top&#64;autoforward.cd</span>
            </p>
          </div>

          <!-- DISCOUNT ALERT / PRICE DROP FEATURE (IMG_4061 & IMG_4062) -->
          <div class="text-center pt-2 pb-1 border-t border-zinc-100">
            <button
              type="button"
              (click)="openPriceDropAlertModal()"
              class="inline-flex items-center gap-1.5 text-blue-700 hover:text-red-600 font-extrabold text-xs cursor-pointer group"
            >
              <mat-icon class="text-blue-600 group-hover:text-red-600 scale-90">favorite_border</mat-icon>
              <span class="underline">Discount Alert</span>
            </button>
            <p class="text-[11px] text-zinc-500 font-medium">
              Receive email when this vehicle is discounted
            </p>
          </div>

          <!-- Additional taxes disclaimers (IMG_4062) -->
          <div class="text-[10px] text-[#DC2626] font-medium leading-snug space-y-1">
            <p>Le prix total ne comprend pas la TVA et autres taxes locales.</p>
            <p>
              Le clearing n'inclut pas la DGDA (le Bulletin de Liquidation), la Fiche OCC, ni la TVA Avis : Inspection obligatoire des véhicules électriques en provenance de Corée Tous les véhicules électriques exportés par RORO doivent subir une inspection spécifique d'un coût de 200 $ avant leur expédition, conformément à la réglementation des compagnies maritimes.
            </p>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- PROFORMA INVOICE & CONSIGNEE INFO FORM (Matching Large Screen) -->
        <!-- ============================================================== -->
        <div id="proforma-section" class="bg-white p-4 border-b border-zinc-200 mt-2 space-y-3">
          <div class="border-b-2 border-red-600 pb-1.5 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <mat-icon class="text-red-600 scale-90">receipt_long</mat-icon>
              <h3 class="text-xs font-black uppercase text-zinc-900 tracking-tight">
                Destinataire & Facture Proforma RDC
              </h3>
            </div>
            <span class="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded uppercase">
              Réservation 48h
            </span>
          </div>

          <form [formGroup]="consigneeForm" class="space-y-2.5 text-xs">
            <div>
              <label for="mvd-name" class="block font-bold text-zinc-700 mb-0.5 text-[11px]">Nom complet du destinataire</label>
              <input
                id="mvd-name"
                type="text"
                formControlName="name"
                placeholder="ex: Jean-Marc Kabeya"
                class="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-900 font-medium text-xs focus:bg-white focus:border-red-600 outline-hidden"
              />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label for="mvd-phone" class="block font-bold text-zinc-700 mb-0.5 text-[11px]">Téléphone / WhatsApp</label>
                <input
                  id="mvd-phone"
                  type="text"
                  formControlName="phone"
                  placeholder="+243 81 234 5678"
                  class="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-900 font-medium text-xs focus:bg-white focus:border-red-600 outline-hidden"
                />
              </div>

              <div>
                <label for="mvd-city" class="block font-bold text-zinc-700 mb-0.5 text-[11px]">Ville en RDC</label>
                <input
                  id="mvd-city"
                  type="text"
                  formControlName="city"
                  placeholder="Kinshasa, Lubumbashi..."
                  class="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-900 font-medium text-xs focus:bg-white focus:border-red-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label for="mvd-email" class="block font-bold text-zinc-700 mb-0.5 text-[11px]">Adresse email</label>
              <input
                id="mvd-email"
                type="email"
                formControlName="email"
                placeholder="client@autoforward.com"
                class="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-900 font-medium text-xs focus:bg-white focus:border-red-600 outline-hidden"
              />
            </div>

            <div class="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                (click)="generateProformaInvoice(v)"
                class="bg-white hover:bg-zinc-100 text-zinc-900 border-2 border-zinc-900 py-2.5 px-2 rounded text-[11px] font-black uppercase tracking-tight flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95"
              >
                <mat-icon class="scale-75">print</mat-icon>
                <span>Télécharger Proforma</span>
              </button>

              <button
                type="button"
                (click)="confirmBooking(v)"
                class="bg-[#DC2626] hover:bg-[#B91C1C] text-white py-2.5 px-2 rounded text-[11px] font-black uppercase tracking-tight flex items-center justify-center gap-1 cursor-pointer shadow-md active:scale-95"
              >
                <mat-icon class="scale-75">check_circle</mat-icon>
                <span>Confirmer Réservation</span>
              </button>
            </div>
          </form>
        </div>

        <!-- ============================================================== -->
        <!-- 9. SPECS TECHNICAL SPECIFICATIONS TABLE (IMG_4062 & IMG_4063)   -->
        <!-- ============================================================== -->
        <div class="bg-white p-4 border-b border-zinc-200 mt-2">
          <!-- Section Title with Orange underline -->
          <div class="border-b-2 border-[#EA580C] pb-1 mb-2">
            <h2 class="text-sm font-black text-zinc-900 tracking-tight">Specs</h2>
          </div>

          <div class="border border-zinc-200 rounded-sm overflow-hidden text-xs">
            <table class="w-full border-collapse">
              <tbody>
                <tr class="border-b border-zinc-200">
                  <td class="w-2/5 p-2 font-bold text-zinc-800 bg-zinc-50">Ref No</td>
                  <td class="w-3/5 p-2 font-mono font-semibold text-zinc-900">{{ v.refNo }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Chassis #</td>
                  <td class="p-2 font-mono font-semibold text-zinc-900">{{ v.chassisCode }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Model Code</td>
                  <td class="p-2 font-semibold text-blue-700">
                    <span>{{ v.modelCode || '3DA-447813N' }}</span>
                    <span class="block text-[10px] text-blue-600 underline">Find parts for this model code ↗</span>
                  </td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Version / Class</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.versionClass || 'V220dA' }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Engine Code</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.engineCode || '-' }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Sub Ref No</td>
                  <td class="p-2 font-mono font-semibold text-zinc-900">{{ v.subRefNo || 'ACN2607040498' }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Mileage</td>
                  <td class="p-2 font-semibold text-zinc-900 tabular-nums">{{ v.mileageKm.toLocaleString() }}km</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Engine Size</td>
                  <td class="p-2 font-semibold text-zinc-900 tabular-nums">
                    {{ v.engineCc ? v.engineCc.toLocaleString() + 'cc' : '2,000cc' }}
                  </td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Registration Year *</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.year }} / {{ v.registrationMonth || '9' }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Manufacture Year **</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.year }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Ext. Color</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.color || 'White' }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Wheel Drive</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.driveType === '4WD' ? '4wheel drive' : '2wheel drive' }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Transmission</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.transmission }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Location</td>
                  <td class="p-2 font-semibold text-zinc-900 uppercase">{{ v.locationCity || 'OSAKA' }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Steering</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.steering === 'Left Hand Drive' ? 'Left' : 'Right' }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Fuel</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.fuel }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Seats</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.seats }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Doors</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.doors }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Dimension</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.dimensions || '5.15x1.93x1.93m' }}</td>
                </tr>
                <tr class="border-b border-zinc-200">
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">M3</td>
                  <td class="p-2 font-semibold text-zinc-900">{{ v.m3 || '19.183' }}</td>
                </tr>
                <tr>
                  <td class="p-2 font-bold text-zinc-800 bg-zinc-50">Weight</td>
                  <td class="p-2 font-semibold text-zinc-900 tabular-nums">
                    {{ v.weightKg ? v.weightKg.toLocaleString() + 'kg' : '2,540kg' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Specs Yellow Asterisk Box (IMG_4063) -->
          <div class="bg-[#FFFBEB] border border-[#FDE68A] p-2.5 rounded-sm mt-3 text-[10px] text-zinc-700 leading-relaxed space-y-1">
            <p>* [Registration Year/month] is a registration date in Stock Country.</p>
            <p>* Chassis No. is provided by the 3rd Party Supplier. The chassis number might be a temporary number so the chassis number can be changed before shipment. In that case, the accurate chassis number will be updated on official documents. AUTO FORWARD has not checked nor verified the authenticity of the information.</p>
            <p>* All accessories, devices, and equipment that do not usually equipped in passenger vehicles will be removed.</p>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- 10. FEATURES MATRIX GRID (IMG_4064)                            -->
        <!-- ============================================================== -->
        <div class="bg-white p-4 border-b border-zinc-200 mt-2">
          <!-- Section Title with Orange underline -->
          <div class="border-b-2 border-[#EA580C] pb-1 mb-2">
            <h2 class="text-sm font-black text-zinc-900 tracking-tight">Features</h2>
          </div>

          <!-- 4-Column Feature Grid: Highlighted in Amber if present, grey if not -->
          <div class="grid grid-cols-4 gap-1 text-[10px] text-center">
            @for (item of allFeatureList; track item.name) {
              <div
                class="py-2 px-1 border rounded-xs font-semibold leading-tight flex items-center justify-center min-h-[36px]"
                [class.bg-[#FEF08A]]="isFeatureActive(item.name)"
                [class.border-[#FACC15]]="isFeatureActive(item.name)"
                [class.text-zinc-950]="isFeatureActive(item.name)"
                [class.font-bold]="isFeatureActive(item.name)"
                [class.bg-zinc-50]="!isFeatureActive(item.name)"
                [class.border-zinc-200]="!isFeatureActive(item.name)"
                [class.text-zinc-400]="!isFeatureActive(item.name)"
              >
                {{ item.name }}
              </div>
            }
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- 11. AVAILABLE PAYMENT METHODS (IMG_4064)                       -->
        <!-- ============================================================== -->
        <div class="bg-white p-4 border-b border-zinc-200 mt-2 text-center space-y-3">
          <h3 class="text-xs font-black text-zinc-900 uppercase tracking-tight">
            Available Payment Methods :
          </h3>

          <div class="flex items-center justify-center gap-4 text-xs font-bold text-zinc-800">
            <!-- Bank Wire Transfer -->
            <div class="flex flex-col items-center">
              <span class="font-black text-sm tracking-tighter">BANK</span>
              <span class="text-[9px] text-zinc-500 uppercase tracking-wider font-extrabold">TRANSFER</span>
              <span class="text-[10px] text-zinc-600">Bank/Wire Transfer</span>
            </div>

            <!-- Credit Cards -->
            <div class="flex flex-col items-center">
              <div class="flex items-center gap-1">
                <span class="bg-blue-800 text-white font-black italic px-1 rounded text-[10px]">VISA</span>
                <span class="bg-red-600 text-amber-300 font-black px-1 rounded text-[10px]">MC</span>
                <span class="bg-blue-600 text-white font-bold px-1 rounded text-[9px]">AMEX</span>
              </div>
              <span class="text-[10px] text-zinc-600 mt-1">Credit / Debit card</span>
            </div>

            <!-- PayPal -->
            <div class="flex flex-col items-center">
              <div class="flex items-center gap-0.5 font-black text-blue-700 italic text-sm">
                <span>Pay</span><span class="text-blue-500">Pal</span>
              </div>
              <span class="text-[10px] text-zinc-600">Pay with PayPal</span>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- 12. SIMILAR AND RELATED VEHICLES (IMG_4066)                    -->
        <!-- ============================================================== -->
        <div class="bg-white p-4 border-b border-zinc-200 mt-2">
          <!-- Section Title with Orange underline -->
          <div class="border-b-2 border-[#EA580C] pb-1 mb-3">
            <h2 class="text-sm font-black text-zinc-900 tracking-tight">
              Similar and Related Vehicles
            </h2>
          </div>

          <!-- 3-Column Grid of Related Vehicles (IMG_4066) -->
          <div class="grid grid-cols-3 gap-2">
            @for (rel of relatedVehicles(); track rel.id) {
              <div
                role="button"
                tabindex="0"
                (click)="switchVehicle(rel)"
                (keydown.enter)="switchVehicle(rel)"
                class="group bg-white rounded border border-zinc-200 hover:border-red-600 overflow-hidden cursor-pointer flex flex-col justify-between shadow-2xs"
              >
                <div class="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
                  <!-- Points Badge (IMG_4066) -->
                  <div class="absolute top-1 left-1 bg-[#1E40AF] text-white text-[8px] font-bold px-1 py-0.2 rounded flex items-center gap-0.5 z-10">
                    <span class="bg-[#EA580C] text-white font-black px-0.5 rounded-full">P</span>
                    <span>20 pts</span>
                  </div>

                  <img
                    [src]="rel.imageUrl"
                    [alt]="rel.make + ' ' + rel.model"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerpolicy="no-referrer"
                  />
                </div>

                <div class="p-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 class="text-[10px] font-bold text-blue-800 line-clamp-2 leading-tight uppercase">
                      {{ rel.make }} {{ rel.model }}
                    </h4>
                  </div>

                  <div class="mt-1 pt-1 border-t border-zinc-100 text-[10px]">
                    <div class="font-bold text-zinc-600">
                      Price <span class="font-black text-[#16A34A]">{{ lang.formatPrice(rel.priceUsd) }}</span>
                    </div>
                    <div class="text-[9px] text-[#DC2626] font-semibold">
                      Save {{ rel.discountPercent || 5 }}% off
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- 13. CUSTOMER REVIEWS SECTION (IMG_4068 & IMG_4069)             -->
        <!-- ============================================================== -->
        <div class="bg-white p-4 border-b border-zinc-200 mt-2 space-y-3">
          <div class="border-b border-zinc-200 pb-2 flex items-baseline justify-between">
            <div>
              <h3 class="text-sm font-black text-blue-900 uppercase">
                {{ v.make }} {{ v.model }}
              </h3>
              <div class="flex items-center gap-1 text-xs text-amber-500 mt-0.5">
                <span>★★★★★</span>
                <span class="font-bold text-zinc-800 text-[11px]">3 Reviews</span>
              </div>
            </div>
            <span class="text-[10px] text-zinc-500 font-bold">Reviews by <strong class="text-blue-900">yotpo.</strong></span>
          </div>

          <!-- Review 1: John Bwalya (Zambia) -->
          <div class="border-b border-zinc-100 pb-3 space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-zinc-900">An excellent purchase experience. Good</h4>
              <span class="text-base">🇿🇲</span>
            </div>
            <div class="text-amber-500 text-[11px]">★★★★☆</div>
            <div class="text-[10px] text-zinc-500 font-medium">
              by <strong class="text-zinc-800">John Bwalya (Zambia)</strong> on 18/Aug/2026
              <span class="text-[#EA580C] font-bold ml-1">Verified Buyer</span>
            </div>
            <p class="text-zinc-700 leading-relaxed text-[11px]">
              An excellent purchase experience. Good communication and prompt updates from purchase to delivery. Though a few paint chips, the car is in perfect condition and drives well. Satisfied with the purchase.
            </p>
            <div class="flex items-center gap-4 text-[10px] text-zinc-500 pt-1">
              <button type="button" (click)="likeReview(1)" class="flex items-center gap-1 text-blue-700 hover:underline cursor-pointer">
                <span>👍 Like ({{ review1Likes() }})</span>
              </button>
            </div>
          </div>

          <!-- Review 2: Allen Mufakose (Zimbabwe) -->
          <div class="border-b border-zinc-100 pb-3 space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-zinc-900">Be Forward is the Best Japanese Car Importer</h4>
              <span class="text-base">🇿🇼</span>
            </div>
            <div class="text-amber-500 text-[11px]">★★★★★</div>
            <div class="text-[10px] text-zinc-500 font-medium">
              by <strong class="text-zinc-800">Allen Mufakose (Zimbabwe)</strong> on 20/Nov/2025
              <span class="text-[#EA580C] font-bold ml-1">Verified Buyer</span>
            </div>
            <p class="text-zinc-700 leading-relaxed text-[11px]">
              AutoForward is the Best Japanese Car Importer for Africa. Engine sound clean, suspension perfect for potholes, proforma and clearing completed fast.
            </p>
            <div class="flex items-center gap-4 text-[10px] text-zinc-500 pt-1">
              <button type="button" (click)="likeReview(2)" class="flex items-center gap-1 text-blue-700 hover:underline cursor-pointer">
                <span>👍 Like ({{ review2Likes() }})</span>
              </button>
            </div>
          </div>

          <!-- Review 3: PETER (Kenya / RDC) with photo (IMG_4069) -->
          <div class="space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-zinc-900">{{ v.make }} {{ v.model }}, Client Export</h4>
              <span class="text-base">🇨🇩</span>
            </div>
            <div class="text-amber-500 text-[11px]">★★★★★</div>
            <div class="text-[10px] text-zinc-500 font-medium">
              by <strong class="text-zinc-800">PETER (Client Kinshasa)</strong> on 20/Jul/2026
              <span class="text-[#EA580C] font-bold ml-1">Verified Buyer</span>
            </div>

            <div class="my-2 rounded overflow-hidden max-h-48 bg-zinc-100 border border-zinc-200">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80"
                alt="Client Delivered Vehicle"
                class="w-full h-44 object-cover"
                referrerpolicy="no-referrer"
              />
            </div>

            <p class="text-zinc-700 leading-relaxed text-[11px]">
              Hello, I received the vehicle in good condition at Matadi port, Thanks AutoForward for this Great machine.
            </p>
            <div class="flex items-center gap-4 text-[10px] text-zinc-500 pt-1">
              <button type="button" (click)="likeReview(3)" class="flex items-center gap-1 text-blue-700 hover:underline cursor-pointer">
                <span>👍 Like ({{ review3Likes() }})</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- 14. ABOUT THIS VEHICLE & ABOUT CATEGORY (IMG_4070)             -->
        <!-- ============================================================== -->
        <div class="bg-white p-4 border-b border-zinc-200 mt-2 space-y-3 text-xs leading-relaxed">
          <div>
            <h3 class="font-black text-zinc-900 text-xs uppercase mb-1">
              About this {{ v.year }} {{ v.make }} {{ v.model }} (Price:{{ lang.formatPrice(v.priceUsd) }})
            </h3>
            <p class="text-zinc-600 text-[11px]">
              This {{ v.year }} {{ v.model }} has {{ v.doors }} doors and {{ v.transmission.toLowerCase() }} transmission, along with a {{ v.engineCc ? v.engineCc.toLocaleString() + 'cc' : '2,000cc' }} {{ v.fuel.toLowerCase() }} engine. It includes {{ v.seats }} seats, has a mileage of {{ v.mileageKm.toLocaleString() }}km, and was certified for African export.
            </p>
          </div>

          <div class="pt-2 border-t border-zinc-100">
            <h4 class="font-black text-zinc-900 text-xs mb-1">
              About {{ v.category }}
            </h4>
            <p class="text-zinc-600 text-[11px]">
              A {{ v.category }}, or MPV (multi-purpose vehicle), is ideal for transporting passengers and luggage with maximum comfort. Fitted with durable suspension, spacious cabin, air conditioning, and high ground clearance suitable for city and inter-city travels across DR Congo and neighboring corridors.
            </p>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- 15. PAGE TO TOP ▲ (IMG_4071)                                   -->
        <!-- ============================================================== -->
        <div class="text-center py-3">
          <button
            type="button"
            (click)="scrollToTop()"
            class="text-xs font-bold text-zinc-700 hover:text-red-600 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Page to Top</span>
            <span class="text-red-600 font-black">▲</span>
          </button>
        </div>

        <!-- ============================================================== -->
        <!-- 16. AUTO PARTS BANNER (IMG_4071)                               -->
        <!-- ============================================================== -->
        <div class="px-3 pb-3">
          <div class="bg-gradient-to-r from-blue-900 via-indigo-950 to-purple-900 rounded-lg p-3.5 text-white flex items-center justify-between shadow-md">
            <div>
              <div class="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">
                Pièces détachées d'origine
              </div>
              <div class="text-sm font-black tracking-tight leading-tight">
                OVER 3,000,000 AUTO PARTS IN STOCK
              </div>
            </div>
            <a
              href="#auto-parts"
              class="bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black text-[10px] uppercase px-2.5 py-1.5 rounded whitespace-nowrap shadow-xs"
            >
              SHOP NOW »
            </a>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- 17. GO TO PC SITE BUTTON (IMG_4071)                            -->
        <!-- ============================================================== -->
        <div class="px-4 py-2">
          <button
            type="button"
            (click)="switchToPcSite()"
            class="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-extrabold text-xs py-2.5 px-3 rounded flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <mat-icon class="scale-90">computer</mat-icon>
            <span>GO TO PC SITE</span>
          </button>
        </div>

        <!-- ============================================================== -->
        <!-- 18. NEWSLETTER SUBSCRIPTION (IMG_4071)                         -->
        <!-- ============================================================== -->
        <div class="bg-[#27272A] text-white p-4 mx-3 my-2 rounded-lg space-y-2">
          <h4 class="text-xs font-black">Subscribe to our newsletter</h4>
          <p class="text-[11px] text-zinc-300">
            Receive latest offers and special coupons
          </p>
          <div class="flex gap-2">
            <input
              type="email"
              [value]="newsletterEmail()"
              (input)="onNewsletterEmailInput($event)"
              placeholder="Email Address"
              class="flex-1 bg-white text-zinc-900 text-xs px-3 py-2 rounded focus:outline-hidden"
            />
            <button
              type="button"
              (click)="subscribeNewsletter()"
              class="bg-[#EA580C] hover:bg-amber-600 text-white font-black text-xs px-3 py-2 rounded cursor-pointer whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
          <p class="text-[9px] text-zinc-400">
            By clicking "Subscribe", you agree to the <span class="underline">Privacy Policy</span>.
          </p>
        </div>

        <!-- ============================================================== -->
        <!-- 19. WHATSAPP AGENTS & FOOTER (IMG_4072 & IMG_4073)             -->
        <!-- ============================================================== -->
        <div class="bg-[#18181B] text-zinc-300 p-4 mx-3 my-2 rounded-lg space-y-3 text-xs">
          <!-- WhatsApp Contact Box -->
          <div class="bg-[#27272A] p-3 rounded border border-zinc-700 space-y-2">
            <div class="flex items-center gap-2 text-white font-black">
              <span class="text-emerald-400 text-base">🟢</span>
              <span class="text-sm">WhatsApp Support</span>
              <span class="text-[10px] text-zinc-400 font-normal">Text Only (9:00 - 18:00 JST)</span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-zinc-700">
              <div>
                <strong class="text-white block font-bold">Emmanuel</strong>
                <a href="https://wa.me/818095877304" target="_blank" rel="noopener" class="text-emerald-400 hover:underline">
                  +81-80-9587-7304
                </a>
              </div>
              <div>
                <strong class="text-white block font-bold">Nicolas_M</strong>
                <a href="https://wa.me/818077285433" target="_blank" rel="noopener" class="text-emerald-400 hover:underline">
                  +81-80-7728-5433
                </a>
              </div>
              <div>
                <strong class="text-white block font-bold">Jean</strong>
                <a href="https://wa.me/817083254316" target="_blank" rel="noopener" class="text-emerald-400 hover:underline">
                  +81-70-8325-4316
                </a>
              </div>
              <div>
                <strong class="text-white block font-bold">Saya</strong>
                <a href="https://wa.me/817093574710" target="_blank" rel="noopener" class="text-emerald-400 hover:underline">
                  +81-70-9357-4710
                </a>
              </div>
            </div>
          </div>

          <!-- Company Details -->
          <div class="space-y-1 text-[11px] text-zinc-400 pt-1">
            <div class="flex items-center gap-1 font-black text-sm text-white">
              <span class="bg-red-600 text-white px-1.5 py-0.5 rounded text-xs">AUTO</span>
              <span>FORWARD</span>
              <span class="text-amber-400 text-xs">➤</span>
            </div>
            <div>Phone: <strong class="text-zinc-200">+81 42 440 3440</strong></div>
            <div>Email: <strong class="text-zinc-200">top&#64;autoforward.cd</strong></div>
            <div>Address: 1-32-2 Kojimacho, Chofu City, Tokyo 182-0026 Japan</div>
            <div class="pt-2 text-[10px] text-zinc-500 border-t border-zinc-800">
              © 2026 AUTO FORWARD CO., LTD. All Rights Reserved.
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- 20. FLOATING DUAL MOBILE CTAs (WHATSAPP + CHATTER) (IMG_4060)   -->
        <!-- ============================================================== -->
        <div class="fixed bottom-14 right-3 z-40 flex flex-col items-end gap-2 pointer-events-auto">
          <!-- Green WhatsApp Pill -->
          <a
            href="https://wa.me/818095877304"
            target="_blank"
            rel="noopener"
            class="bg-[#22C55E] hover:bg-emerald-600 text-white rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5 font-black text-xs transition-transform active:scale-95 border-2 border-white"
          >
            <mat-icon class="scale-90 text-white">chat</mat-icon>
            <span class="leading-none text-[11px]">Contact us on WhatsApp</span>
          </a>

          <!-- Chatter Bubble -->
          <button
            type="button"
            (click)="openSupportChat()"
            class="bg-white text-zinc-900 border-2 border-zinc-300 rounded-full px-3 py-1 shadow-lg flex items-center gap-1 font-extrabold text-xs cursor-pointer hover:border-red-600"
          >
            <span class="w-2 h-2 rounded-full bg-blue-600"></span>
            <span class="uppercase tracking-tight text-[11px]">CHATTER</span>
            <mat-icon class="text-blue-600 scale-75">forum</mat-icon>
          </button>
        </div>

        <!-- ============================================================== -->
        <!-- 21. FIXED STICKY BOTTOM ACTION BAR (IMG_4063 - IMG_4073)       -->
        <!-- ============================================================== -->
        <div class="fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A1A] border-t-2 border-[#EA580C] p-2 shadow-2xl flex items-center gap-2">
          <button
            type="button"
            (click)="goBackToCatalog()"
            class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-2.5 rounded text-xs font-bold flex items-center justify-center cursor-pointer shrink-0"
            title="Retour au stock"
          >
            <mat-icon class="scale-90">arrow_back</mat-icon>
          </button>

          <button
            type="button"
            (click)="openQuoteModal()"
            class="flex-1 bg-[#EA580C] hover:bg-[#C2410C] text-white py-2.5 px-4 rounded font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-[0.99]"
          >
            <mat-icon class="scale-90">email</mat-icon>
            <span>GET A PRICE QUOTE</span>
          </button>
        </div>

        <!-- ============================================================== -->
        <!-- 22. BURGER DRAWER MENU (WITH LEFT COLUMN FILTERS)              -->
        <!-- ============================================================== -->
        @if (isDrawerOpen()) {
          <div class="fixed inset-0 z-50 flex">
            <!-- Backdrop -->
            <button
              type="button"
              (click)="isDrawerOpen.set(false)"
              aria-label="Fermer le menu"
              class="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity border-0 p-0 cursor-pointer w-full h-full"
            ></button>

            <!-- Drawer Content -->
            <div class="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
              <!-- Drawer Header -->
              <div class="bg-[#1A1A1A] text-white p-3.5 border-b-2 border-red-600 flex items-center justify-between shrink-0">
                <div class="flex items-center gap-1 font-black text-sm">
                  <span class="bg-red-600 text-white px-1.5 py-0.5 rounded">AUTO</span>
                  <span>FORWARD</span>
                </div>
                <button
                  type="button"
                  (click)="isDrawerOpen.set(false)"
                  class="text-zinc-400 hover:text-white cursor-pointer"
                >
                  <mat-icon>close</mat-icon>
                </button>
              </div>

              <!-- Admin Console / User Profile in Drawer -->
              @if (authService.isAdmin()) {
                <div class="bg-gradient-to-r from-black via-zinc-900 to-black p-3.5 border-b border-red-600/40 text-white space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 font-black text-xs text-red-400">
                      <mat-icon class="text-sm scale-90">admin_panel_settings</mat-icon>
                      <span>PROPRIÉTAIRE INDÉPENDANT</span>
                    </div>
                    <span class="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded font-mono font-bold">Actif</span>
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
                      Points : <strong class="text-red-600">{{ user.loyaltyPoints }} pts</strong>
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
              }

              <!-- Sidebar Left Column Filters inside Mobile Drawer -->
              <div class="p-3 bg-zinc-50 border-b border-zinc-200 flex-1 overflow-y-auto">
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
              </div>

              <!-- Drawer Footer -->
              <div class="p-3 bg-zinc-100 border-t border-zinc-200 shrink-0">
                <button
                  type="button"
                  (click)="isDrawerOpen.set(false); goBackToCatalog()"
                  class="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-2.5 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <mat-icon class="text-sm">directions_car</mat-icon>
                  <span>Voir Catalogue ({{ vehicleService.filteredVehicles().length }})</span>
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class MobileVehicleDetailComponent {
  readonly vehicleService = inject(VehicleService);
  readonly lang = inject(LanguageService);
  readonly viewMode = inject(ViewModeService);
  readonly authService = inject(AuthService);
  readonly priceAlertService = inject(PriceAlertService);

  readonly topContainer = viewChild<ElementRef>('topContainer');

  readonly currentImageIndex = signal<number>(0);
  readonly isDrawerOpen = signal<boolean>(false);
  readonly selectedPortId = signal<string>('matadi');
  readonly shippingMethod = signal<'roro' | 'container'>('roro');
  readonly includeInsurance = signal<boolean>(true);

  readonly consigneeForm = new FormGroup({
    name: new FormControl('Client AutoForward', { nonNullable: true }),
    phone: new FormControl('+243 81 000 0000', { nonNullable: true }),
    email: new FormControl('client@autoforward.com', { nonNullable: true }),
    city: new FormControl('Kinshasa / Lubumbashi', { nonNullable: true }),
  });

  readonly review1Likes = signal<number>(0);
  readonly review2Likes = signal<number>(0);
  readonly review3Likes = signal<number>(81);

  readonly newsletterEmail = signal<string>('');

  // 4-column Features matrix as shown in IMG_4064
  readonly allFeatureList = [
    { name: 'CD Player' },
    { name: 'Sun Roof' },
    { name: 'Leather Seat' },
    { name: 'Alloy Wheels' },
    { name: 'Power Steering' },
    { name: 'Power Window' },
    { name: 'A/C' },
    { name: 'ABS' },
    { name: 'Airbag' },
    { name: 'Radio' },
    { name: 'CD Changer' },
    { name: 'DVD' },
    { name: 'TV' },
    { name: 'Power Seat' },
    { name: 'Back Tire' },
    { name: 'Grill Guard' },
    { name: 'Rear Spoiler' },
    { name: 'Central Locking' },
    { name: 'Jack' },
    { name: 'Spare Tire' },
    { name: 'Wheel Spanner' },
    { name: 'Fog Lights' },
    { name: 'Back Camera' },
    { name: 'Push Start' },
    { name: 'Keyless Entry' },
    { name: 'ESC' },
    { name: '360 Degree Camera' },
    { name: 'Body Kit' },
    { name: 'Side Airbag' },
    { name: 'Power Mirror' },
    { name: 'Side Skirts' },
    { name: 'Front Lip Spoiler' },
    { name: 'Navigation' },
    { name: 'Turbo' },
    { name: 'Power Slide Door' },
  ];

  readonly allImages = computed(() => {
    const v = this.vehicleService.selectedVehicle();
    if (!v) return [];
    const list: string[] = [v.imageUrl];
    if (v.galleryImages && v.galleryImages.length > 0) {
      for (const g of v.galleryImages) {
        if (!list.includes(g)) {
          list.push(g);
        }
      }
    }
    // Pad gallery up to 30 images for rich realistic carousel matching the "1 / 30" in IMG_4060
    const demoAngles = [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    ];
    let idx = 0;
    while (list.length < 30) {
      list.push(demoAngles[idx % demoAngles.length]);
      idx++;
    }
    return list;
  });

  readonly currentActiveImage = computed(() => {
    const images = this.allImages();
    const idx = this.currentImageIndex();
    return images[idx] || images[0] || '';
  });

  readonly relatedVehicles = computed(() => {
    const current = this.vehicleService.selectedVehicle();
    const all = this.vehicleService.vehicles();
    if (!current) return all.slice(0, 9);
    // Prefer same make or category
    const sameMake = all.filter((veh) => veh.id !== current.id && veh.make.toLowerCase() === current.make.toLowerCase());
    if (sameMake.length >= 6) return sameMake.slice(0, 9);
    const others = all.filter((veh) => veh.id !== current.id && !sameMake.includes(veh));
    return [...sameMake, ...others].slice(0, 9);
  });

  prevImage() {
    const total = this.allImages().length;
    if (total === 0) return;
    this.currentImageIndex.update((curr) => (curr > 0 ? curr - 1 : total - 1));
  }

  nextImage() {
    const total = this.allImages().length;
    if (total === 0) return;
    this.currentImageIndex.update((curr) => (curr < total - 1 ? curr + 1 : 0));
  }

  originalPriceUsd(): number {
    const v = this.vehicleService.selectedVehicle();
    if (!v) return 0;
    return v.originalPriceUsd || Math.round(v.priceUsd * 1.05);
  }

  savingsUsd(): number {
    const orig = this.originalPriceUsd();
    const v = this.vehicleService.selectedVehicle();
    if (!v) return 0;
    return Math.max(0, orig - v.priceUsd);
  }

  savingsPercent(): number {
    const orig = this.originalPriceUsd();
    const save = this.savingsUsd();
    if (orig <= 0) return 4;
    return Math.round((save / orig) * 100) || 4;
  }

  currentPortName(): string {
    const p = this.vehicleService.ports().find((port) => port.id === this.selectedPortId());
    return p ? p.name : 'Port de Matadi';
  }

  toggleInsurance(e: Event) {
    this.includeInsurance.set((e.target as HTMLInputElement).checked);
  }

  currentOceanFreight(): number {
    const p = this.vehicleService.ports().find((port) => port.id === this.selectedPortId());
    const base = p ? p.baseOceanFreightUsd : 1450;
    return this.shippingMethod() === 'container' ? base + 450 : base;
  }

  calculatedTotalCif(): number {
    const v = this.vehicleService.selectedVehicle();
    if (!v) return 0;
    const freight = this.currentOceanFreight();
    const insurance = this.includeInsurance() ? 120 : 0;
    return v.priceUsd + freight + insurance;
  }

  formatCdf(priceUsd: number): string {
    const cdfRate = 2500; // Exchange rate USD -> CDF
    const totalCdf = Math.round(priceUsd * cdfRate);
    return totalCdf.toLocaleString('fr-FR');
  }

  onPortChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.selectedPortId.set(val);
  }

  isFav(): boolean {
    const v = this.vehicleService.selectedVehicle();
    return v ? this.vehicleService.isFavorite(v.id) : false;
  }

  toggleFavorite() {
    const v = this.vehicleService.selectedVehicle();
    if (v) {
      this.vehicleService.toggleFavorite(v.id);
    }
  }

  isFeatureActive(featName: string): boolean {
    const v = this.vehicleService.selectedVehicle();
    if (!v || !v.features) {
      // Default common active features
      return ['A/C', 'ABS', 'Airbag', 'Keyless Entry', 'Power Steering', 'Power Window'].includes(featName);
    }
    const lower = featName.toLowerCase();
    const directMatch = v.features.some((f) => f.toLowerCase().includes(lower));
    if (directMatch) return true;
    if (['A/C', 'ABS', 'Airbag', 'Keyless Entry'].includes(featName)) return true;
    return false;
  }

  scrollToPhotos() {
    const el = document.getElementById('photo-gallery-top');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBackToCatalog() {
    this.vehicleService.closeModal();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  filterByMake(make: string) {
    this.vehicleService.closeModal();
    this.vehicleService.navigateToModel({
      title: make + ' Véhicules Certifiés',
      subtitle: 'Sélection prête pour expédition RDC',
      criterionType: 'make',
      make: make,
      badge: 'CERTIFIÉ EXPORT',
      icon: 'directions_car',
    });
  }

  switchVehicle(veh: Vehicle) {
    this.vehicleService.selectVehicle(veh);
    this.currentImageIndex.set(0);
    this.scrollToTop();
  }

  openQuoteModal() {
    const v = this.vehicleService.selectedVehicle();
    if (v) {
      this.vehicleService.openQuoteModal(v);
    }
  }

  buyNow() {
    const v = this.vehicleService.selectedVehicle();
    if (!v) return;
    const proformaEl = document.getElementById('proforma-section');
    if (proformaEl) {
      proformaEl.scrollIntoView({ behavior: 'smooth' });
      proformaEl.classList.add('ring-2', 'ring-red-600');
      setTimeout(() => proformaEl.classList.remove('ring-2', 'ring-red-600'), 2500);
    } else {
      this.openQuoteModal();
    }
  }

  generateProformaInvoice(v: Vehicle) {
    const formVal = this.consigneeForm.getRawValue();
    const total = this.calculatedTotalCif();
    const formattedTotal = this.lang.formatPrice(total);
    const invoiceText = `
=====================================================
          AUTOFOWARD CO., LTD - PROFORMA INVOICE
=====================================================
Date: ${new Date().toLocaleDateString()}
Invoice Ref: PRO-${v.refNo}-${Date.now().toString().slice(-4)}

DESTINATAIRE / CONSIGNEE:
Nom: ${formVal.name}
Téléphone: ${formVal.phone}
Email: ${formVal.email}
Ville de destination: ${formVal.city}

VÉHICULE:
Marque & Modèle: ${v.make} ${v.model} (${v.year})
N° Châssis: ${v.chassisCode}
Origine: Stock ${v.stockCountry} (${v.locationCity})
Kilométrage: ${v.mileageKm.toLocaleString()} km
Volant: ${v.steering}

DÉCOMPTE FINANCIER:
1. Prix FOB Véhicule: ${this.lang.formatPrice(v.priceUsd)}
2. Fret maritime vers ${this.currentPortName()} (${this.shippingMethod().toUpperCase()}): ${this.lang.formatPrice(this.currentOceanFreight())}
3. Assurance maritime & Inspection JEVIC: ${this.lang.formatPrice(this.includeInsurance() ? 120 : 0)}
-----------------------------------------------------
TOTAL CIF À RÉGLER: ${formattedTotal}
(Équivalent en Francs Congolais: CDF ${this.formatCdf(total)})
-----------------------------------------------------
INSTRUCTIONS DE PAIEMENT BANCAIRE (SWIFT):
Banque Bénéficiaire: SMBC Bank Tokyo / Emirates NBD Dubai
Titulaire du compte: AutoForward Global Export Corp.
Motif obligatoire: PRO-${v.refNo}

Votre véhicule est réservé pendant 48 heures.
Contact support RDC: +243 81 440 3440 | top@autoforward.cd
=====================================================
    `;

    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proforma_Invoice_${v.refNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    this.priceAlertService.showToast({
      type: 'success',
      title: 'Facture Proforma Téléchargée !',
      message: `La Proforma officielle pour ${v.make} ${v.model} (Réf: ${v.refNo}) a été générée avec succès.`,
    });
  }

  confirmBooking(v: Vehicle) {
    const formVal = this.consigneeForm.getRawValue();
    this.priceAlertService.showToast({
      type: 'success',
      title: 'Réservation Enregistrée !',
      message: `Réservation de ${v.make} ${v.model} au nom de ${formVal.name}. Un conseiller commercial vous contactera via WhatsApp.`,
    });
  }

  openPriceDropAlertModal() {
    const v = this.vehicleService.selectedVehicle();
    if (v) {
      this.priceAlertService.openModal(v);
    }
  }

  shareFacebook() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }

  shareGeneric() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      const v = this.vehicleService.selectedVehicle();
      navigator.share({
        title: v ? `${v.make} ${v.model}` : 'AutoForward Vehicle',
        text: 'Découvrez ce véhicule prêt pour expédition en RDC sur AutoForward !',
        url: window.location.href,
      }).catch(() => undefined);
    } else {
      this.shareWhatsApp();
    }
  }

  shareWhatsApp() {
    const v = this.vehicleService.selectedVehicle();
    const text = v
      ? `Regardez cette ${v.year} ${v.make} ${v.model} (Réf: ${v.refNo}) à seulement ${this.lang.formatPrice(v.priceUsd)} sur AutoForward : ${window.location.href}`
      : 'AutoForward Export RDC';
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  openSupportChat() {
    const chatBtn = document.querySelector('app-support-chat button') as HTMLButtonElement;
    if (chatBtn) chatBtn.click();
  }

  likeReview(reviewId: number) {
    if (reviewId === 1) this.review1Likes.update((n) => n + 1);
    if (reviewId === 2) this.review2Likes.update((n) => n + 1);
    if (reviewId === 3) this.review3Likes.update((n) => n + 1);
  }

  onNewsletterEmailInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.newsletterEmail.set(val);
  }

  subscribeNewsletter() {
    const email = this.newsletterEmail().trim();
    if (!email || !email.includes('@')) {
      return;
    }
    this.newsletterEmail.set('');
    this.priceAlertService.showToast({
      type: 'success',
      title: 'Inscription Réussie !',
      message: `Merci ! Vos coupons de réduction export seront envoyés à ${email}.`,
    });
  }

  switchToPcSite() {
    this.viewMode.setMode('pc');
  }
}
