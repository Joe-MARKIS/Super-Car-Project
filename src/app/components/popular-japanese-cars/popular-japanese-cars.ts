import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';

interface PopularJapaneseModel {
  id: string;
  name: string;
  category: string;
  yearRange: string;
  engine: string;
  fuelFr: string;
  fuelEn: string;
  fuelSw: string;
  fuelPt: string;
  fuelEs: string;
  reliabilityScore: string;
  marketDemandFr: string;
  marketDemandEn: string;
  marketDemandSw: string;
  marketDemandPt: string;
  marketDemandEs: string;
  startingPriceUsd: number;
  availableUnits: number;
  imageUrl: string;
  filterMake: string;
  filterKeyword: string;
}

@Component({
  selector: 'app-popular-japanese-cars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <section class="my-6 bg-white rounded-lg border border-zinc-200 p-4 shadow-xs">
      <!-- Section Header -->
      <div class="flex flex-wrap items-center justify-between pb-2.5 mb-3.5 border-b-2 border-red-600 gap-2">
        <div class="flex items-center gap-2">
          <span class="w-6 h-4 bg-zinc-900 border border-zinc-300 rounded-xs flex items-center justify-center overflow-hidden">
            <span class="w-2.5 h-2.5 bg-red-600 rounded-full"></span>
          </span>
          <h2 class="text-sm md:text-base font-black text-zinc-900 uppercase tracking-tight">
            {{ lang.t('popularJapaneseCarsPrefix') }} {{ lang.selectedCountry().name }}
          </h2>
        </div>

        <div class="flex items-center gap-1.5 text-xs text-zinc-600">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-bold text-zinc-800">{{ lang.t('inspectedBadge') }}</span>
        </div>
      </div>

      <!-- Models Grid (Red, Black, White cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3">
        @for (car of models(); track car.id) {
          <div
            class="group bg-white rounded-lg border border-zinc-200 hover:border-red-600 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
          >
            <!-- Car Image with Reliability Pill -->
            <div class="relative w-full aspect-4/3 bg-zinc-950 overflow-hidden">
              <img
                [src]="car.imageUrl"
                [alt]="car.name"
                referrerpolicy="no-referrer"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <!-- Reliability pill -->
              <div class="absolute top-2 right-2 bg-zinc-950/90 text-white border border-white/20 text-[10px] font-black px-2 py-0.5 rounded-sm flex items-center gap-1">
                <mat-icon class="text-amber-400 text-xs scale-75">star</mat-icon>
                <span>{{ car.reliabilityScore }}</span>
              </div>

              <!-- Market Demand Tag -->
              <div class="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs tracking-wide uppercase">
                {{ getMarketDemand(car) }}
              </div>
            </div>

            <!-- Car Specs & Details -->
            <div class="p-3 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between text-[11px] text-zinc-400 font-mono mb-1">
                  <span>{{ car.category }}</span>
                  <span>{{ car.yearRange }}</span>
                </div>

                <h3 class="font-black text-xs md:text-sm text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {{ car.name }}
                </h3>

                <!-- Key Specs Grid -->
                <div class="mt-2 grid grid-cols-2 gap-1 text-[11px] bg-zinc-50 p-2 rounded border border-zinc-100">
                  <div class="text-zinc-600">
                    <span class="text-zinc-400 text-[10px] block">Moteur</span>
                    <strong class="font-bold text-zinc-900">{{ car.engine }}</strong>
                  </div>
                  <div class="text-zinc-600">
                    <span class="text-zinc-400 text-[10px] block">Carburant</span>
                    <strong class="font-bold text-zinc-900">{{ getFuel(car) }}</strong>
                  </div>
                </div>
              </div>

              <!-- Price & CTA -->
              <div class="mt-3 pt-2.5 border-t border-zinc-100">
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <span class="block text-[10px] text-zinc-400 font-medium">{{ lang.t('startingFrom') }}</span>
                    <span class="text-xs md:text-sm font-black text-red-600 font-mono">
                      {{ lang.formatPrice(car.startingPriceUsd) }}
                    </span>
                  </div>
                  <span class="text-[10px] font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                    {{ car.availableUnits }} {{ lang.t('unitsAvailable') }}
                  </span>
                </div>

                <button
                  type="button"
                  (click)="exploreModel(car)"
                  class="w-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold py-1.5 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>{{ lang.t('viewStockForModel') }}</span>
                  <mat-icon class="text-xs scale-75">search</mat-icon>
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class PopularJapaneseCarsComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);

  readonly models = computed<PopularJapaneseModel[]>(() => [
    {
      id: 'jp-prado',
      name: 'Toyota Land Cruiser Prado',
      category: 'SUV 4WD',
      yearRange: '2012 - 2023',
      engine: '2.8L - 3.0L',
      fuelFr: 'Diesel / Turbo',
      fuelEn: 'Diesel / Turbo',
      fuelSw: 'Dizeli',
      fuelPt: 'Diesel',
      fuelEs: 'Diésel',
      reliabilityScore: '9.9 / 10',
      marketDemandFr: 'Très Forte Demande',
      marketDemandEn: 'High Demand',
      marketDemandSw: 'Mahitaji Makubwa',
      marketDemandPt: 'Alta Procura',
      marketDemandEs: 'Alta Demanda',
      startingPriceUsd: 14500,
      availableUnits: 38,
      imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
      filterMake: 'TOYOTA',
      filterKeyword: 'Prado',
    },
    {
      id: 'jp-hilux',
      name: 'Toyota Hilux Revo 4x4',
      category: 'Pick-up Double Cab',
      yearRange: '2015 - 2024',
      engine: '2.4L - 2.8L D-4D',
      fuelFr: 'Diesel',
      fuelEn: 'Diesel',
      fuelSw: 'Dizeli',
      fuelPt: 'Diesel',
      fuelEs: 'Diésel',
      reliabilityScore: '9.8 / 10',
      marketDemandFr: 'Best-Seller Mines & BTP',
      marketDemandEn: 'Best Seller',
      marketDemandSw: 'Inauza Zaidi',
      marketDemandPt: 'Mais Vendida',
      marketDemandEs: 'Más Vendida',
      startingPriceUsd: 12900,
      availableUnits: 27,
      imageUrl: '/assets/images/car_toyota_hilux_pickup_1791895943609.jpg',
      filterMake: 'TOYOTA',
      filterKeyword: 'Hilux',
    },
    {
      id: 'jp-canter',
      name: 'Mitsubishi Canter Benne',
      category: 'Camion / Dump Truck',
      yearRange: '2012 - 2022',
      engine: '3.0L - 4.9L',
      fuelFr: 'Diesel 4M50/4P10',
      fuelEn: 'Diesel',
      fuelSw: 'Dizeli',
      fuelPt: 'Diesel',
      fuelEs: 'Diésel',
      reliabilityScore: '9.7 / 10',
      marketDemandFr: 'Idéal Transport & Fret',
      marketDemandEn: 'Commercial Heavy',
      marketDemandSw: 'Usafiri wa Mizigo',
      marketDemandPt: 'Carga Pesada',
      marketDemandEs: 'Transporte Pesado',
      startingPriceUsd: 9800,
      availableUnits: 19,
      imageUrl: '/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg',
      filterMake: 'MITSUBISHI',
      filterKeyword: 'Canter',
    },
    {
      id: 'jp-corolla',
      name: 'Toyota Corolla Axio / Fielder',
      category: 'Berline Économique',
      yearRange: '2014 - 2022',
      engine: '1.5L VVT-i',
      fuelFr: 'Essence / Hybride',
      fuelEn: 'Petrol / Hybrid',
      fuelSw: 'Petroli / Mseto',
      fuelPt: 'Gasolina / Híbrido',
      fuelEs: 'Gasolina / Híbrido',
      reliabilityScore: '9.8 / 10',
      marketDemandFr: 'Consommation Réduite',
      marketDemandEn: 'Low Fuel Cons.',
      marketDemandSw: 'Inabana Mafuta',
      marketDemandPt: 'Pouco Consumo',
      marketDemandEs: 'Bajo Consumo',
      startingPriceUsd: 3800,
      availableUnits: 52,
      imageUrl: '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
      filterMake: 'TOYOTA',
      filterKeyword: 'Corolla',
    },
    {
      id: 'jp-mercedes',
      name: 'Mercedes-Benz C-Class Import Japon',
      category: 'Berline Premium',
      yearRange: '2015 - 2022',
      engine: '1.6L - 2.0L Turbo',
      fuelFr: 'Essence Turbo',
      fuelEn: 'Petrol Turbo',
      fuelSw: 'Petroli',
      fuelPt: 'Gasolina',
      fuelEs: 'Gasolina Turbo',
      reliabilityScore: '9.4 / 10',
      marketDemandFr: 'Finition Premium',
      marketDemandEn: 'Luxury Import',
      marketDemandSw: 'Kifahari',
      marketDemandPt: 'Luxo Japonês',
      marketDemandEs: 'Lujo Japonés',
      startingPriceUsd: 6270,
      availableUnits: 16,
      imageUrl: '/assets/images/car_mercedes_c_class_1791895943618.jpg',
      filterMake: 'MERCEDES-BENZ',
      filterKeyword: 'C-Class',
    },
  ]);

  getFuel(car: PopularJapaneseModel): string {
    const l = this.lang.currentLang();
    switch (l) {
      case 'en': return car.fuelEn;
      case 'sw': return car.fuelSw;
      case 'pt': return car.fuelPt;
      case 'es': return car.fuelEs;
      default: return car.fuelFr;
    }
  }

  getMarketDemand(car: PopularJapaneseModel): string {
    const l = this.lang.currentLang();
    switch (l) {
      case 'en': return car.marketDemandEn;
      case 'sw': return car.marketDemandSw;
      case 'pt': return car.marketDemandPt;
      case 'es': return car.marketDemandEs;
      default: return car.marketDemandFr;
    }
  }

  exploreModel(car: PopularJapaneseModel) {
    this.vehicleService.setFilter({
      make: car.filterMake,
      keyword: car.filterKeyword,
    });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
