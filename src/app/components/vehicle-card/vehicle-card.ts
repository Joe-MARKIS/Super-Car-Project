import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Vehicle } from '../../models/vehicle';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';
import { PriceAlertService } from '../../services/price-alert';

@Component({
  selector: 'app-vehicle-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      class="group bg-white rounded-md border border-zinc-200 hover:border-red-600 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative select-none"
    >
      <!-- Top Badges Bar -->
      <div class="absolute top-2 left-2 z-10 flex items-center gap-1.5 pointer-events-none">
        @if (rank()) {
          <span class="bg-[#EA580C] text-white font-black text-xs px-2 py-0.5 rounded shadow-sm">
            #{{ rank() }}
          </span>
        }
        @if (vehicle().pointsReward > 0) {
          <span class="bg-[#1E40AF] text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
            <span class="bg-amber-400 text-black font-black px-1 rounded-xs text-[9px]">P</span>
            <span>{{ vehicle().pointsReward }} {{ lang.t('pointsBadge') }}</span>
          </span>
        }
      </div>

      <!-- Quick Action Buttons Top Right: Price Alert & Favorite -->
      <div class="absolute top-2 right-2 z-10 flex items-center gap-1">
        <!-- Price Drop Alert Bell -->
        <button
          type="button"
          (click)="openPriceAlert($event)"
          title="Créer une alerte baisse de prix"
          class="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-500 hover:text-amber-500 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
        >
          <mat-icon class="text-xs scale-90">notifications_active</mat-icon>
        </button>

        <!-- Favorite Button -->
        <button
          type="button"
          (click)="toggleFavorite($event)"
          [title]="lang.t('favorites')"
          class="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-400 hover:text-red-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
        >
          <mat-icon class="text-sm scale-90" [class.text-red-600]="isFav()">
            {{ isFav() ? 'favorite' : 'favorite_border' }}
          </mat-icon>
        </button>
      </div>

      <!-- Vehicle Photo -->
      <button
        type="button"
        (click)="openDetail()"
        class="text-left w-full relative aspect-[4/3] bg-zinc-100 overflow-hidden cursor-pointer"
      >
        <img
          [src]="vehicle().imageUrl"
          [alt]="vehicle().make + ' ' + vehicle().model"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerpolicy="no-referrer"
        />

        <!-- Origin Stock Tag -->
        <div class="absolute bottom-1.5 left-1.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
          <span>{{ vehicle().originFlag }}</span>
          <span>Stock {{ vehicle().stockCountry }}</span>
        </div>

        @if (hasDiscount()) {
          <div class="absolute bottom-1.5 right-1.5 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
            -{{ vehicle().discountPercent }}%
          </div>
        }
      </button>

      <!-- Content Details -->
      <div class="p-3 flex-1 flex flex-col justify-between">
        <div>
          <!-- Title / Model -->
          <button
            type="button"
            (click)="openDetail()"
            class="text-left w-full cursor-pointer"
          >
            <span class="text-[11px] font-extrabold text-red-700 uppercase tracking-tight block">
              {{ vehicle().make }}
            </span>
            <h3 class="text-xs font-bold text-blue-900 group-hover:text-red-600 transition-colors line-clamp-1 leading-snug">
              {{ vehicle().model }}
            </h3>
          </button>

          <!-- Specs Summary Row -->
          <div class="mt-1.5 flex flex-wrap items-center gap-1 text-[11px] text-zinc-500 font-medium">
            <span class="text-zinc-800 font-bold">{{ vehicle().year }}</span>
            <span>·</span>
            <span>{{ vehicle().mileageKm.toLocaleString() }} km</span>
            <span>·</span>
            <span [class.text-red-700]="vehicle().steering === 'Left Hand Drive'" class="font-semibold">
              {{ vehicle().steering === 'Left Hand Drive' ? 'LHD' : 'RHD' }}
            </span>
            <span>·</span>
            <span>{{ vehicle().fuel }}</span>
          </div>

          <!-- Price Block -->
          <div class="mt-2 pt-2 border-t border-zinc-100">
            <div class="text-[11px] text-zinc-500 font-medium flex items-baseline justify-between">
              <span>{{ lang.t('vehiclePrice') }}</span>
              @if (vehicle().originalPriceUsd) {
                <span class="line-through text-zinc-400 text-[10px]">
                  {{ lang.formatPrice(vehicle().originalPriceUsd!) }}
                </span>
              }
            </div>

            <div class="text-base font-black text-red-600 tracking-tight tabular-nums">
              {{ lang.formatPrice(vehicle().priceUsd) }}
            </div>

            <!-- CIF estimate -->
            <div class="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded mt-1 flex items-center justify-between">
              <span>CIF {{ lang.selectedCountry().primaryPort }}:</span>
              <span class="font-bold tabular-nums">
                {{ lang.formatPrice(cifTotal()) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-3 pt-2 grid grid-cols-2 gap-1.5 text-xs">
          <button
            type="button"
            (click)="openQuote()"
            class="bg-white hover:bg-red-50 text-red-700 font-bold py-1.5 px-2 rounded border border-red-300 text-[11px] transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            {{ lang.t('requestQuoteBtn') }}
          </button>

          <button
            type="button"
            (click)="openDetail()"
            class="bg-black hover:bg-red-600 text-white font-bold py-1.5 px-2 rounded text-[11px] transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            {{ lang.t('buyNowBtn') }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class VehicleCardComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);
  readonly priceAlertService = inject(PriceAlertService);

  readonly vehicle = input.required<Vehicle>();
  readonly rank = input<number | undefined>(undefined);

  hasDiscount(): boolean {
    return (this.vehicle().discountPercent ?? 0) > 0;
  }

  cifTotal(): number {
    return this.vehicleService.calculateTotalCif(this.vehicle());
  }

  isFav(): boolean {
    return this.vehicleService.isFavorite(this.vehicle().id);
  }

  toggleFavorite(event: MouseEvent) {
    event.stopPropagation();
    this.vehicleService.toggleFavorite(this.vehicle().id);
  }

  openPriceAlert(event: MouseEvent) {
    event.stopPropagation();
    this.priceAlertService.openModal(this.vehicle());
  }

  openDetail() {
    this.vehicleService.selectVehicle(this.vehicle());
  }

  openQuote() {
    this.vehicleService.openQuoteModal(this.vehicle());
  }
}
