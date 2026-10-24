import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';

interface CategoryBestSeller {
  id: string;
  categoryKey: string;
  titleFr: string;
  titleEn: string;
  titleSw: string;
  titlePt: string;
  titleEs: string;
  filterCategory: string;
  filterKeyword?: string;
  bestModel: string;
  unitsInStock: number;
  basePriceUsd: number;
  imageUrl: string;
  badgeTextFr: string;
  badgeTextEn: string;
  badgeTextSw: string;
  badgeTextPt: string;
  badgeTextEs: string;
}

@Component({
  selector: 'app-best-sellers-category',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <section class="my-6 bg-white rounded-lg border border-zinc-200 p-4 shadow-xs">
      <!-- Section Header -->
      <div class="flex flex-wrap items-center justify-between pb-2.5 mb-3.5 border-b-2 border-red-600 gap-2">
        <div class="flex items-center gap-2">
          <mat-icon class="text-red-600">category</mat-icon>
          <h2 class="text-sm md:text-base font-black text-zinc-900 uppercase tracking-tight">
            {{ lang.t('bestSellersCategoryPrefix') }} {{ lang.selectedCountry().name }}
          </h2>
        </div>

        <span class="text-xs font-semibold text-zinc-500 flex items-center gap-1">
          <mat-icon class="text-xs text-red-600 scale-75">verified</mat-icon>
          <span>Top sélections import</span>
        </span>
      </div>

      <!-- Categories Grid (5 categories matching user images & red/black/white theme) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-3">
        @for (item of categories(); track item.id) {
          <div
            role="button"
            tabindex="0"
            (click)="selectCategory(item)"
            (keydown.enter)="selectCategory(item)"
            class="group bg-white rounded-lg border border-zinc-200 hover:border-red-600 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <!-- Image Area -->
            <div class="relative w-full aspect-4/3 bg-zinc-900 overflow-hidden">
              <img
                [src]="item.imageUrl"
                [alt]="getCategoryTitle(item)"
                referrerpolicy="no-referrer"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <!-- Tag badge -->
              <span class="absolute top-2 left-2 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-sm tracking-wide uppercase">
                {{ getBadgeText(item) }}
              </span>
            </div>

            <!-- Content Area -->
            <div class="p-2.5 flex flex-col flex-1 justify-between">
              <div>
                <h3 class="font-extrabold text-xs text-zinc-900 group-hover:text-red-600 transition-colors uppercase line-clamp-1">
                  {{ getCategoryTitle(item) }}
                </h3>
                <p class="text-[11px] text-zinc-500 font-medium line-clamp-1 mt-0.5">
                  {{ item.bestModel }}
                </p>
              </div>

              <div class="mt-2.5 pt-2 border-t border-zinc-100 flex items-end justify-between">
                <div>
                  <span class="block text-[10px] text-zinc-400 font-medium">
                    {{ lang.t('startingFrom') }}
                  </span>
                  <span class="text-xs md:text-sm font-black text-red-600 font-mono">
                    {{ lang.formatPrice(item.basePriceUsd) }}
                  </span>
                </div>

                <div class="text-right">
                  <span class="text-[10px] font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                    {{ item.unitsInStock }} {{ lang.t('unitsAvailable') }}
                  </span>
                </div>
              </div>

              <!-- Action button in Red/Black/White -->
              <button
                type="button"
                class="mt-2 w-full bg-zinc-900 group-hover:bg-red-600 text-white text-[11px] font-bold py-1.5 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{{ lang.t('exploreCategoryStock') }}</span>
                <mat-icon class="text-xs scale-75">arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class BestSellersCategoryComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);

  readonly categories = computed<CategoryBestSeller[]>(() => [
    {
      id: 'cat-suv',
      categoryKey: 'suv',
      titleFr: 'SUV & Tout-Terrain',
      titleEn: 'SUV & 4WD',
      titleSw: 'Magari ya SUV na 4WD',
      titlePt: 'SUV & Todo-o-Terreno',
      titleEs: 'SUV y Todoterreno',
      filterCategory: 'SUV',
      bestModel: 'Toyota Land Cruiser Prado',
      unitsInStock: 48,
      basePriceUsd: 8500,
      imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
      badgeTextFr: 'N°1 en RDC',
      badgeTextEn: 'Top Choice',
      badgeTextSw: 'Bora Zaidi',
      badgeTextPt: 'Mais Vendido',
      badgeTextEs: 'Más Vendido',
    },
    {
      id: 'cat-pickup',
      categoryKey: 'pickup',
      titleFr: 'Pick-up & Double Cabine',
      titleEn: 'Pickup & Double Cab',
      titleSw: 'Pick-up na Bodi Mbili',
      titlePt: 'Pick-up & Cabine Dupla',
      titleEs: 'Pick-up y Doble Cabina',
      filterCategory: 'Pick up',
      bestModel: 'Toyota Hilux Revo',
      unitsInStock: 36,
      basePriceUsd: 7200,
      imageUrl: '/assets/images/car_toyota_hilux_pickup_1791895943609.jpg',
      badgeTextFr: 'Très Robuste',
      badgeTextEn: 'Heavy Duty',
      badgeTextSw: 'Inadumu Sana',
      badgeTextPt: 'Alta Resistência',
      badgeTextEs: 'Gran Resistencia',
    },
    {
      id: 'cat-truck',
      categoryKey: 'truck',
      titleFr: 'Camions & Poids Lourds',
      titleEn: 'Trucks & Dumpers',
      titleSw: 'Malori na Bennes',
      titlePt: 'Camiões & Básculas',
      titleEs: 'Camiones y Volquetes',
      filterCategory: 'Camion',
      bestModel: 'Mitsubishi Canter Benne',
      unitsInStock: 29,
      basePriceUsd: 9800,
      imageUrl: '/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg',
      badgeTextFr: 'Commerce & Fret',
      badgeTextEn: 'Commercial Freight',
      badgeTextSw: 'Usafirishaji',
      badgeTextPt: 'Frete Comercial',
      badgeTextEs: 'Carga Pesada',
    },
    {
      id: 'cat-sedan',
      categoryKey: 'sedan',
      titleFr: 'Berlines & Citadines',
      titleEn: 'Sedans & City Cars',
      titleSw: 'Sedan & Magari ya Mjini',
      titlePt: 'Sedans & Citadinos',
      titleEs: 'Sedanes y Autos Urbanos',
      filterCategory: 'Berline',
      bestModel: 'Toyota Corolla Axio',
      unitsInStock: 64,
      basePriceUsd: 3200,
      imageUrl: '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
      badgeTextFr: 'Économique',
      badgeTextEn: 'Best Fuel Econ',
      badgeTextSw: 'Mafuta Kidogo',
      badgeTextPt: 'Super Económico',
      badgeTextEs: 'Muy Económico',
    },
    {
      id: 'cat-luxury',
      categoryKey: 'luxury',
      titleFr: 'Berlines Luxe & Premium',
      titleEn: 'Luxury & Premium Sedans',
      titleSw: 'Magari ya Kifahari',
      titlePt: 'Gama Alta & Luxo',
      titleEs: 'Alta Gama y Lujo',
      filterCategory: 'Berline',
      filterKeyword: 'MERCEDES-BENZ',
      bestModel: 'Mercedes-Benz C200 Avantgarde',
      unitsInStock: 22,
      basePriceUsd: 6270,
      imageUrl: '/assets/images/car_mercedes_c_class_1791895943618.jpg',
      badgeTextFr: 'Luxe Import',
      badgeTextEn: 'Premium Import',
      badgeTextSw: 'Kifahari',
      badgeTextPt: 'Importação Luxo',
      badgeTextEs: 'Lujo Premium',
    },
  ]);

  getCategoryTitle(item: CategoryBestSeller): string {
    const l = this.lang.currentLang();
    switch (l) {
      case 'en': return item.titleEn;
      case 'sw': return item.titleSw;
      case 'pt': return item.titlePt;
      case 'es': return item.titleEs;
      default: return item.titleFr;
    }
  }

  getBadgeText(item: CategoryBestSeller): string {
    const l = this.lang.currentLang();
    switch (l) {
      case 'en': return item.badgeTextEn;
      case 'sw': return item.badgeTextSw;
      case 'pt': return item.badgeTextPt;
      case 'es': return item.badgeTextEs;
      default: return item.badgeTextFr;
    }
  }

  selectCategory(item: CategoryBestSeller) {
    this.vehicleService.setFilter({
      category: item.filterCategory,
      keyword: item.filterKeyword ?? '',
    });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
