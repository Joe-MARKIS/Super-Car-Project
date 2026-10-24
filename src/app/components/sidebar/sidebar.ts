import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';

export interface BrandItem {
  name: string;
  count: number;
}

export interface PriceBracket {
  key: string;
  min?: number;
  max?: number;
}

export interface DiscountItem {
  key: string;
  discount: number;
}

export interface CategoryItem {
  key: string;
  name: string;
  count: number;
  icon: string;
}

export interface OtherCategoryItem {
  key: string;
  icon: string;
  count: number;
  filterType: 'hybrid' | '4wd' | 'commercial' | 'lhd' | 'rhd' | 'manual' | 'auto' | 'lowKm' | 'recent' | 'bonusReward';
}

export interface StockCountryItem {
  key: string;
  name: string; // matches stockCountry in Vehicle
  flag: string;
  count: number;
}

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <aside class="space-y-3 text-xs">
      <!-- 1. Choix par marque (Brands) -->
      <div class="bg-white rounded border border-zinc-200 overflow-hidden shadow-xs">
        <div class="bg-[#1A1A1A] text-white px-3 py-1.5 font-black text-xs uppercase tracking-tight flex items-center justify-between border-b-2 border-red-600">
          <span>{{ lang.t('filterByMake') }}</span>
          <mat-icon class="text-xs scale-75 text-red-500">directions_car</mat-icon>
        </div>
        <div class="p-1 space-y-0.5 max-h-[380px] overflow-y-auto divide-y divide-zinc-100">
          @for (make of displayedBrands(); track make.name) {
            <button
              type="button"
              (click)="selectMake(make.name)"
              [class.bg-red-50]="vehicleService.filter().make === make.name"
              [class.text-red-700]="vehicleService.filter().make === make.name"
              [class.font-bold]="vehicleService.filter().make === make.name"
              class="w-full text-left px-2 py-1 hover:bg-zinc-100 flex items-center justify-between text-zinc-800 transition-colors cursor-pointer text-[11px]"
            >
              <div class="flex items-center gap-1.5 truncate">
                <span class="w-1.5 h-1.5 rounded-full shrink-0" [class.bg-red-600]="vehicleService.filter().make === make.name" [class.bg-zinc-300]="vehicleService.filter().make !== make.name"></span>
                <span class="truncate font-semibold">{{ make.name }}</span>
              </div>
              <span class="text-zinc-500 text-[10px] tabular-nums font-mono shrink-0">({{ make.count.toLocaleString() }})</span>
            </button>
          }
        </div>
        <!-- Toggle show more / less brands -->
        <div class="bg-zinc-50 border-t border-zinc-200 p-1.5 text-center">
          <button
            type="button"
            (click)="showAllBrands.set(!showAllBrands())"
            class="text-[11px] font-bold text-red-600 hover:text-red-800 cursor-pointer"
          >
            {{ showAllBrands() ? lang.t('sidebarShowLess') : (lang.t('sidebarSeeAllBrands') + ' (' + brandList.length + ') ▼') }}
          </button>
        </div>
      </div>

      <!-- 3. Choix par prix (Price Brackets) -->
      <div class="bg-white rounded border border-zinc-200 overflow-hidden shadow-xs">
        <div class="bg-[#1A1A1A] text-white px-3 py-1.5 font-black text-xs uppercase tracking-tight flex items-center justify-between border-b-2 border-red-600">
          <span>{{ lang.t('filterByPrice') }}</span>
          <mat-icon class="text-xs scale-75 text-amber-400">attach_money</mat-icon>
        </div>
        <div class="p-1 space-y-0.5 divide-y divide-zinc-100">
          @for (bracket of priceBrackets; track bracket.key) {
            <button
              type="button"
              (click)="selectPrice(bracket.min, bracket.max, bracket.key)"
              [class.bg-red-50]="vehicleService.filter().maxPrice === bracket.max && vehicleService.filter().minPrice === bracket.min"
              [class.text-red-700]="vehicleService.filter().maxPrice === bracket.max && vehicleService.filter().minPrice === bracket.min"
              [class.font-bold]="vehicleService.filter().maxPrice === bracket.max && vehicleService.filter().minPrice === bracket.min"
              class="w-full text-left px-2 py-1.5 hover:bg-zinc-100 flex items-center justify-between text-zinc-700 transition-colors cursor-pointer text-[11px]"
            >
              <div class="flex items-center gap-1.5">
                <mat-icon class="text-[10px] scale-75 text-zinc-400">monetization_on</mat-icon>
                <span>{{ lang.t(bracket.key) }}</span>
              </div>
              <mat-icon class="text-zinc-300 text-[10px] scale-75">chevron_right</mat-icon>
            </button>
          }
        </div>
      </div>

      <!-- 4. Choix par réduction (Discounts) -->
      <div class="bg-white rounded border border-zinc-200 overflow-hidden shadow-xs">
        <div class="bg-[#1A1A1A] text-white px-3 py-1.5 font-black text-xs uppercase tracking-tight flex items-center justify-between border-b-2 border-red-600">
          <span>{{ lang.t('filterByDiscount') }}</span>
          <mat-icon class="text-xs scale-75 text-red-500">percent</mat-icon>
        </div>
        <div class="p-1 space-y-0.5 divide-y divide-zinc-100">
          @for (disc of discountTiers; track disc.key) {
            <button
              type="button"
              (click)="selectDiscount(disc.discount, disc.key)"
              [class.bg-red-50]="vehicleService.filter().discountOnly && activeDiscount() === disc.discount"
              [class.font-bold]="vehicleService.filter().discountOnly && activeDiscount() === disc.discount"
              class="w-full text-left px-2 py-1.5 hover:bg-zinc-100 flex items-center justify-between text-zinc-700 transition-colors cursor-pointer text-[11px]"
            >
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                <span>{{ lang.t(disc.key) }}</span>
              </div>
              <span class="text-red-600 font-bold text-[10px]">{{ lang.t('saleTag') }}</span>
            </button>
          }
        </div>
      </div>

      <!-- 5. Choix par catégorie / carrosserie -->
      <div class="bg-white rounded border border-zinc-200 overflow-hidden shadow-xs">
        <div class="bg-[#1A1A1A] text-white px-3 py-1.5 font-black text-xs uppercase tracking-tight flex items-center justify-between border-b-2 border-red-600">
          <span>{{ lang.t('filterByCategory') }}</span>
          <mat-icon class="text-xs scale-75 text-amber-400">category</mat-icon>
        </div>
        <div class="p-1 space-y-0.5 divide-y divide-zinc-100">
          @for (cat of categories; track cat.name) {
            <button
              type="button"
              (click)="selectCategory(cat.name, cat.key)"
              [class.bg-red-50]="vehicleService.filter().category === cat.name"
              [class.text-red-700]="vehicleService.filter().category === cat.name"
              [class.font-bold]="vehicleService.filter().category === cat.name"
              class="w-full text-left px-2 py-1 hover:bg-zinc-100 flex items-center justify-between text-zinc-700 transition-colors cursor-pointer text-[11px]"
            >
              <div class="flex items-center gap-1.5">
                <mat-icon class="text-sm scale-75 text-zinc-500">{{ cat.icon }}</mat-icon>
                <span>{{ lang.t(cat.key) }}</span>
              </div>
              <span class="text-zinc-400 text-[10px] tabular-nums font-mono">({{ cat.count.toLocaleString() }})</span>
            </button>
          }
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- SECTION 1 AJOUTÉE : 1. AUTRES CATÉGORIES (Other Categories) -->
      <!-- ============================================================== -->
      <div class="bg-white rounded border border-zinc-200 overflow-hidden shadow-xs">
        <div class="bg-[#1A1A1A] text-white px-3 py-1.5 font-black text-xs uppercase tracking-tight flex items-center justify-between border-b-2 border-red-600">
          <div class="flex items-center gap-1.5">
            <mat-icon class="text-xs scale-75 text-red-500">dashboard_customize</mat-icon>
            <span>{{ lang.t('otherCategoriesTitle') }}</span>
          </div>
          <span class="bg-red-600 text-white text-[9px] font-mono px-1 rounded font-bold">10</span>
        </div>
        <div class="p-1 space-y-0.5 divide-y divide-zinc-100">
          @for (item of otherCategoriesList; track item.key) {
            <button
              type="button"
              (click)="selectOtherCategory(item)"
              [class.bg-red-50]="isOtherCategoryActive(item)"
              [class.text-red-700]="isOtherCategoryActive(item)"
              [class.font-bold]="isOtherCategoryActive(item)"
              [class.border-l-2]="isOtherCategoryActive(item)"
              [class.border-red-600]="isOtherCategoryActive(item)"
              class="w-full text-left px-2 py-1.5 hover:bg-zinc-100 flex items-center justify-between text-zinc-700 transition-colors cursor-pointer text-[11px]"
            >
              <div class="flex items-center gap-1.5 truncate">
                <mat-icon
                  class="text-xs scale-75 shrink-0"
                  [class.text-red-600]="isOtherCategoryActive(item)"
                  [class.text-zinc-500]="!isOtherCategoryActive(item)"
                >
                  {{ item.icon }}
                </mat-icon>
                <span class="truncate">{{ lang.t(item.key) }}</span>
              </div>
              <span class="text-zinc-400 text-[10px] tabular-nums font-mono shrink-0">({{ item.count.toLocaleString() }})</span>
            </button>
          }
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- SECTION 2 AJOUTÉE : 2. VÉHICULES EN STOCK (Vehicles in Stock) -->
      <!-- ============================================================== -->
      <div class="bg-white rounded border border-zinc-200 overflow-hidden shadow-xs">
        <div class="bg-[#1A1A1A] text-white px-3 py-1.5 font-black text-xs uppercase tracking-tight flex items-center justify-between border-b-2 border-red-600">
          <div class="flex items-center gap-1.5">
            <mat-icon class="text-xs scale-75 text-red-500">public</mat-icon>
            <span>{{ lang.t('vehiclesInStockTitle') }}</span>
          </div>
          <span class="bg-red-600/30 text-red-300 text-[9px] font-mono px-1 rounded font-bold">MONDE</span>
        </div>
        <!-- Sub-label bar -->
        <div class="bg-zinc-50 px-2.5 py-1 text-[10px] text-zinc-500 border-b border-zinc-100 flex items-center justify-between font-medium">
          <span>{{ lang.t('stockSubtitle') }}</span>
          <span class="text-[9px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-bold">✓ DISPO</span>
        </div>
        <div class="p-1 space-y-0.5 divide-y divide-zinc-100">
          @for (origin of stockOriginsList; track origin.key) {
            <button
              type="button"
              (click)="selectStockOrigin(origin.name, origin.key)"
              [class.bg-red-50]="(origin.name === '' && !vehicleService.filter().stockCountry) || vehicleService.filter().stockCountry === origin.name"
              [class.text-red-700]="(origin.name === '' && !vehicleService.filter().stockCountry) || vehicleService.filter().stockCountry === origin.name"
              [class.font-bold]="(origin.name === '' && !vehicleService.filter().stockCountry) || vehicleService.filter().stockCountry === origin.name"
              [class.border-l-2]="(origin.name === '' && !vehicleService.filter().stockCountry) || vehicleService.filter().stockCountry === origin.name"
              [class.border-red-600]="(origin.name === '' && !vehicleService.filter().stockCountry) || vehicleService.filter().stockCountry === origin.name"
              class="w-full text-left px-2 py-1.5 hover:bg-zinc-100 flex items-center justify-between text-zinc-700 transition-colors cursor-pointer text-[11px]"
            >
              <div class="flex items-center gap-2 truncate">
                <span class="text-sm shrink-0 leading-none">{{ origin.flag }}</span>
                <span class="truncate">{{ lang.t(origin.key) }}</span>
              </div>
              <span class="text-zinc-500 text-[10px] tabular-nums font-mono shrink-0">({{ origin.count.toLocaleString() }})</span>
            </button>
          }
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);

  readonly showAllBrands = signal<boolean>(false);
  readonly activeDiscount = signal<number | null>(null);

  // Exact brands and counts matching screenshot Capture d'écran
  readonly brandList: BrandItem[] = [
    { name: 'TOYOTA', count: 90708 },
    { name: 'NISSAN', count: 37237 },
    { name: 'HONDA', count: 38090 },
    { name: 'MAZDA', count: 13018 },
    { name: 'MITSUBISHI', count: 14346 },
    { name: 'SUBARU', count: 10803 },
    { name: 'SUZUKI', count: 43790 },
    { name: 'ISUZU', count: 6616 },
    { name: 'DAIHATSU', count: 32865 },
    { name: 'HINO', count: 4877 },
    { name: 'LEXUS', count: 7235 },
    { name: 'MERCEDES-BENZ', count: 20025 },
    { name: 'BMW', count: 21017 },
    { name: 'VOLKSWAGEN', count: 5045 },
    { name: 'AUDI', count: 6221 },
    { name: 'PEUGEOT', count: 1307 },
    { name: 'FORD', count: 3959 },
    { name: 'VOLVO', count: 3370 },
    { name: 'LAND ROVER', count: 7599 },
    { name: 'JAGUAR', count: 943 },
    { name: 'JEEP', count: 3382 },
    { name: 'CHEVROLET', count: 7114 },
    { name: 'HYUNDAI', count: 48009 },
    { name: 'KIA', count: 43719 },
    { name: 'SSANGYONG', count: 6490 },
    { name: 'RENAULT SAMSUNG', count: 5435 },
  ];

  // Exact Price Brackets with translation keys
  readonly priceBrackets: PriceBracket[] = [
    { key: 'priceUnder500', max: 500 },
    { key: 'price500to1000', min: 500, max: 1000 },
    { key: 'price1000to1500', min: 1000, max: 1500 },
    { key: 'price1500to2000', min: 1500, max: 2000 },
    { key: 'price2000to2500', min: 2000, max: 2500 },
    { key: 'price2500to4000', min: 2500, max: 4000 },
    { key: 'priceOver4000', min: 4000 },
  ];

  // Exact Discount tiers with translation keys
  readonly discountTiers: DiscountItem[] = [
    { key: 'discount70Plus', discount: 70 },
    { key: 'discount60Plus', discount: 60 },
    { key: 'discount50Plus', discount: 50 },
    { key: 'discount40Plus', discount: 40 },
  ];

  // Body types / categories
  readonly categories: CategoryItem[] = [
    { key: 'catSuv', name: 'SUV', count: 86420, icon: 'directions_car' },
    { key: 'catSedan', name: 'Berline', count: 72150, icon: 'directions_car' },
    { key: 'catTruck', name: 'Camion', count: 24500, icon: 'local_shipping' },
    { key: 'catMinibus', name: 'Minibus', count: 18320, icon: 'airport_shuttle' },
    { key: 'catPickup', name: 'Pick up', count: 31200, icon: 'agriculture' },
    { key: 'catVan', name: 'Fourgonnette', count: 14600, icon: 'rv_hookup' },
  ];

  // SECTION 1 : Autres catégories
  readonly otherCategoriesList: OtherCategoryItem[] = [
    { key: 'otherCatHybrid', icon: 'electric_car', count: 18400, filterType: 'hybrid' },
    { key: 'otherCat4wd', icon: 'terrain', count: 94850, filterType: '4wd' },
    { key: 'otherCatCommercial', icon: 'local_shipping', count: 32400, filterType: 'commercial' },
    { key: 'otherCatLhd', icon: 'swap_horiz', count: 62700, filterType: 'lhd' },
    { key: 'otherCatRhd', icon: 'directions_car', count: 185300, filterType: 'rhd' },
    { key: 'otherCatManual', icon: 'tune', count: 48900, filterType: 'manual' },
    { key: 'otherCatAuto', icon: 'settings', count: 198200, filterType: 'auto' },
    { key: 'otherCatLowKm', icon: 'speed', count: 71200, filterType: 'lowKm' },
    { key: 'otherCatRecent', icon: 'calendar_today', count: 53100, filterType: 'recent' },
    { key: 'otherCatReward', icon: 'loyalty', count: 29800, filterType: 'bonusReward' },
  ];

  // SECTION 2 : Véhicules en stock
  readonly stockOriginsList: StockCountryItem[] = [
    { key: 'stockJapan', name: 'Japon', flag: '🇯🇵', count: 142500 },
    { key: 'stockDubai', name: 'Émirats arabes unis', flag: '🇦🇪', count: 48200 },
    { key: 'stockSingapore', name: 'Singapour', flag: '🇸🇬', count: 19400 },
    { key: 'stockKorea', name: 'Corée', flag: '🇰🇷', count: 32100 },
    { key: 'stockThailand', name: 'Thaïlande', flag: '🇹🇭', count: 15800 },
    { key: 'stockUk', name: 'Royaume-Uni', flag: '🇬🇧', count: 8900 },
    { key: 'stockAll', name: '', flag: '🌐', count: 266900 },
  ];

  displayedBrands() {
    if (this.showAllBrands()) {
      return this.brandList;
    }
    return this.brandList.slice(0, 14);
  }

  selectMake(make: string) {
    this.vehicleService.setFilter({ make, model: '', category: '' });
    this.vehicleService.navigateToModel({
      title: `${make}`,
      subtitle: `Tous les véhicules certifiés de marque ${make} prêts à l'exportation`,
      make,
      criterionType: 'make',
      badge: `Marque: ${make}`,
      icon: 'directions_car',
    });
  }

  selectPrice(min?: number, max?: number, bracketKey?: string) {
    this.vehicleService.setFilter({ minPrice: min ?? 0, maxPrice: max ?? 0 });
    const label = bracketKey ? this.lang.t(bracketKey) : 'Sélection par budget';
    this.vehicleService.navigateToModel({
      title: label,
      subtitle: `Véhicules dans votre tranche budgétaire garantie`,
      criterionType: 'price',
      badge: 'Budget garanti',
      icon: 'attach_money',
    });
  }

  selectDiscount(discount: number, discKey?: string) {
    this.activeDiscount.set(discount);
    this.vehicleService.setFilter({ activeTab: 'sales', discountOnly: true });
    const label = discKey ? this.lang.t(discKey) : `Remise ${discount}%`;
    this.vehicleService.navigateToModel({
      title: label,
      subtitle: `Véhicules avec remises exceptionnelles jusqu'à -80%`,
      criterionType: 'discount',
      badge: `Offre Spéciale -${discount}%`,
      icon: 'percent',
    });
  }

  selectCategory(cat: string, catKey?: string) {
    this.vehicleService.setFilter({ category: cat, make: '', model: '' });
    const label = catKey ? this.lang.t(catKey) : cat;
    this.vehicleService.navigateToModel({
      title: label,
      subtitle: `Tous les véhicules de catégorie ${cat} disponibles`,
      category: cat,
      criterionType: 'category',
      badge: `Catégorie: ${cat}`,
      icon: 'category',
    });
  }

  selectSpecialOffer() {
    this.vehicleService.setFilter({ activeTab: 'sales' });
    this.vehicleService.navigateToModel({
      title: 'Happy October Sale - Déstockage Spécial',
      subtitle: 'Milliers de véhicules à prix cassés pour la RDC et l\'Afrique',
      criterionType: 'special',
      badge: 'PROMO JUSQU\'À -70%',
      icon: 'local_fire_department',
    });
  }

  // Handle "Autres catégories" selection
  selectOtherCategory(item: OtherCategoryItem) {
    const f = this.vehicleService.filter();
    switch (item.filterType) {
      case 'hybrid':
        this.vehicleService.setFilter({
          fuelType: f.fuelType === 'Hybride_Electric' ? undefined : 'Hybride_Electric',
        });
        break;
      case '4wd':
        this.vehicleService.setFilter({
          driveType: f.driveType === '4WD' ? undefined : '4WD',
        });
        break;
      case 'commercial':
        this.vehicleService.setFilter({
          category: f.category === 'Camion' ? '' : 'Camion',
        });
        break;
      case 'lhd':
        this.vehicleService.setFilter({
          steering: f.steering === 'Left Hand Drive' ? 'all' : 'Left Hand Drive',
        });
        break;
      case 'rhd':
        this.vehicleService.setFilter({
          steering: f.steering === 'Right Hand Drive' ? 'all' : 'Right Hand Drive',
        });
        break;
      case 'manual':
        this.vehicleService.setFilter({
          transmission: f.transmission === 'Manuelle' ? undefined : 'Manuelle',
        });
        break;
      case 'auto':
        this.vehicleService.setFilter({
          transmission: f.transmission === 'Automatique' ? undefined : 'Automatique',
        });
        break;
      case 'lowKm':
        this.vehicleService.setFilter({
          maxMileage: f.maxMileage === 60000 ? undefined : 60000,
        });
        break;
      case 'recent':
        this.vehicleService.setFilter({
          minYear: f.minYear === 2020 ? 0 : 2020,
        });
        break;
      case 'bonusReward':
        this.vehicleService.setFilter({
          bonusPointsOnly: !f.bonusPointsOnly,
        });
        break;
    }
    this.vehicleService.navigateToModel({
      title: this.lang.t(item.key),
      subtitle: `Sélection spécialisée selon vos critères d'exportation`,
      criterionType: 'other',
      badge: 'Spécification Premium',
      icon: item.icon,
    });
  }

  isOtherCategoryActive(item: OtherCategoryItem): boolean {
    const f = this.vehicleService.filter();
    switch (item.filterType) {
      case 'hybrid':
        return f.fuelType === 'Hybride_Electric';
      case '4wd':
        return f.driveType === '4WD';
      case 'commercial':
        return f.category === 'Camion';
      case 'lhd':
        return f.steering === 'Left Hand Drive';
      case 'rhd':
        return f.steering === 'Right Hand Drive';
      case 'manual':
        return f.transmission === 'Manuelle';
      case 'auto':
        return f.transmission === 'Automatique';
      case 'lowKm':
        return f.maxMileage === 60000;
      case 'recent':
        return f.minYear === 2020;
      case 'bonusReward':
        return !!f.bonusPointsOnly;
      default:
        return false;
    }
  }

  // Handle "Véhicules en stock" selection
  selectStockOrigin(countryName: string, originKey?: string) {
    if (countryName === '') {
      this.vehicleService.setFilter({ stockCountry: '' });
    } else {
      this.vehicleService.setFilter({ stockCountry: countryName });
    }
    const label = originKey ? this.lang.t(originKey) : (countryName ? `Stock ${countryName}` : 'Tous les stocks mondiaux');
    this.vehicleService.navigateToModel({
      title: label,
      subtitle: countryName ? `Véhicules stockés et vérifiés en direct depuis ${countryName}` : 'Disponibilité mondiale',
      criterionType: 'stock',
      criterionValue: countryName,
      badge: countryName || 'International',
      icon: 'public',
    });
  }

  private scrollToGrid() {
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
