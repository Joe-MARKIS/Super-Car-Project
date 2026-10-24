import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';

@Component({
  selector: 'app-promo-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 my-3">
      <!-- Promo 1: Buy Now 50 BF Points -->
      <button
        type="button"
        (click)="filterByPromo('reward')"
        class="text-left bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black p-3 rounded-md shadow-xs border border-amber-400 cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[90px]"
      >
        <div class="flex items-start justify-between w-full">
          <span class="bg-black text-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Points</span>
          <mat-icon class="text-amber-900 scale-90">loyalty</mat-icon>
        </div>
        <div>
          <div class="font-black text-xs leading-tight text-zinc-950">
            BUY NOW GET <span class="text-white bg-black px-1 rounded">$50</span> BF POINTS!
          </div>
          <div class="text-[10px] text-zinc-900 font-semibold mt-0.5 underline">Utiliser Buy Now ></div>
        </div>
      </button>

      <!-- Promo 2: Dump Trucks / Korean Stock -->
      <button
        type="button"
        (click)="filterByCategory('Camion')"
        class="text-left bg-gradient-to-br from-zinc-900 to-black hover:from-zinc-800 hover:to-zinc-900 text-white p-3 rounded-md shadow-xs border border-zinc-700 cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[90px]"
      >
        <div class="flex items-start justify-between w-full">
          <span class="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Camions</span>
          <mat-icon class="text-zinc-400 scale-90">local_shipping</mat-icon>
        </div>
        <div>
          <div class="font-extrabold text-xs leading-tight text-white">
            KOREAN TRACTOR & DUMP TRUCKS
          </div>
          <div class="text-[10px] text-amber-400 font-bold mt-0.5">Bennes & Poids Lourds ></div>
        </div>
      </button>

      <!-- Promo 3: Points Reward -->
      <button
        type="button"
        (click)="filterByPromo('reward')"
        class="text-left bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white p-3 rounded-md shadow-xs border border-red-500 cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[90px]"
      >
        <div class="flex items-start justify-between w-full">
          <span class="bg-amber-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Bonus</span>
          <mat-icon class="text-white scale-90">monetization_on</mat-icon>
        </div>
        <div>
          <div class="font-black text-xs leading-tight text-white">
            GAGNEZ JUSQU'À <span class="text-amber-300">150$</span> DE POINTS !
          </div>
          <div class="text-[10px] text-red-200 font-semibold mt-0.5">À chaque achat ></div>
        </div>
      </button>

      <!-- Promo 4: Today's Special Offer -->
      <button
        type="button"
        (click)="filterByPromo('special')"
        class="text-left bg-gradient-to-br from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white p-3 rounded-md shadow-xs border border-blue-600 cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[90px]"
      >
        <div class="flex items-start justify-between w-full">
          <span class="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Hot Deal</span>
          <mat-icon class="text-blue-300 scale-90">local_fire_department</mat-icon>
        </div>
        <div>
          <div class="font-extrabold text-xs leading-tight text-white">
            TODAY'S SPECIAL OFFER !!
          </div>
          <div class="text-[10px] text-amber-300 font-bold mt-0.5">Voir les prix cassés ></div>
        </div>
      </button>

      <!-- Promo 5: Container Plan -->
      <button
        type="button"
        (click)="filterByPromo('container')"
        class="text-left bg-gradient-to-br from-zinc-800 to-zinc-950 hover:from-zinc-700 hover:to-zinc-900 text-white p-3 rounded-md shadow-xs border border-zinc-700 cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[90px] col-span-2 sm:col-span-1"
      >
        <div class="flex items-start justify-between w-full">
          <span class="bg-green-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Maritime</span>
          <mat-icon class="text-zinc-400 scale-90">directions_boat</mat-icon>
        </div>
        <div>
          <div class="font-black text-xs leading-tight text-white">
            FIND BEST CONTAINER PLAN
          </div>
          <div class="text-[10px] text-emerald-400 font-bold mt-0.5">Économisez 3 000 $ ></div>
        </div>
      </button>
    </div>
  `,
})
export class PromoBannerComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);

  filterByPromo(type: 'reward' | 'special' | 'container') {
    if (type === 'special') {
      this.vehicleService.setFilter({ todaysOfferOnly: true });
    } else if (type === 'reward') {
      this.vehicleService.setFilter({ discountOnly: true });
    }
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  filterByCategory(cat: string) {
    this.vehicleService.setFilter({ category: cat });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
