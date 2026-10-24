import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';

@Component({
  selector: 'app-catalog-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-md border border-zinc-200 p-3 shadow-xs mb-4">
      <!-- Upper Tabs Row -->
      <div class="flex flex-wrap items-center gap-2 pb-3 border-b border-zinc-100">
        <button
          (click)="setTab('all')"
          [class.bg-[#DC2626]]="vehicleService.filter().activeTab === 'all'"
          [class.text-white]="vehicleService.filter().activeTab === 'all'"
          [class.bg-zinc-100]="vehicleService.filter().activeTab !== 'all'"
          [class.text-zinc-800]="vehicleService.filter().activeTab !== 'all'"
          class="px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <mat-icon class="text-xs scale-90">grid_view</mat-icon>
          <span>{{ lang.t('all') }}</span>
        </button>

        <button
          (click)="setTab('new_arrivals')"
          [class.bg-[#DC2626]]="vehicleService.filter().activeTab === 'new_arrivals'"
          [class.text-white]="vehicleService.filter().activeTab === 'new_arrivals'"
          [class.bg-zinc-100]="vehicleService.filter().activeTab !== 'new_arrivals'"
          [class.text-zinc-800]="vehicleService.filter().activeTab !== 'new_arrivals'"
          class="px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <mat-icon class="text-xs scale-90">fiber_new</mat-icon>
          <span>{{ lang.t('tabNewArrivals') }}</span>
        </button>

        <button
          (click)="setTab('sales')"
          [class.bg-[#DC2626]]="vehicleService.filter().activeTab === 'sales'"
          [class.text-white]="vehicleService.filter().activeTab === 'sales'"
          [class.bg-zinc-100]="vehicleService.filter().activeTab !== 'sales'"
          [class.text-zinc-800]="vehicleService.filter().activeTab !== 'sales'"
          class="px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <mat-icon class="text-xs scale-90">local_offer</mat-icon>
          <span>{{ lang.t('tabSales') }}</span>
        </button>

        <button
          (click)="setTab('luxury')"
          [class.bg-[#DC2626]]="vehicleService.filter().activeTab === 'luxury'"
          [class.text-white]="vehicleService.filter().activeTab === 'luxury'"
          [class.bg-zinc-100]="vehicleService.filter().activeTab !== 'luxury'"
          [class.text-zinc-800]="vehicleService.filter().activeTab !== 'luxury'"
          class="px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <mat-icon class="text-xs scale-90">diamond</mat-icon>
          <span>{{ lang.t('tabLuxury') }}</span>
        </button>

        <button
          (click)="setTab('certified')"
          [class.bg-[#DC2626]]="vehicleService.filter().activeTab === 'certified'"
          [class.text-white]="vehicleService.filter().activeTab === 'certified'"
          [class.bg-zinc-100]="vehicleService.filter().activeTab !== 'certified'"
          [class.text-zinc-800]="vehicleService.filter().activeTab !== 'certified'"
          class="px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <mat-icon class="text-xs scale-90">verified</mat-icon>
          <span>{{ lang.t('tabThirdParty') }}</span>
        </button>
      </div>

      <!-- Lower Country Origin Buttons Row -->
      <div class="pt-2.5 flex flex-wrap items-center gap-2 text-xs">
        <span class="text-zinc-500 font-semibold">{{ lang.t('filterOriginFrom') }}</span>

        <button
          (click)="setCountry('')"
          [class.bg-black]="!vehicleService.filter().stockCountry"
          [class.text-white]="!vehicleService.filter().stockCountry"
          [class.bg-zinc-100]="vehicleService.filter().stockCountry"
          [class.text-zinc-700]="vehicleService.filter().stockCountry"
          class="px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer"
        >
          {{ lang.t('all') }}
        </button>

        @for (c of origins; track c.name) {
          <button
            (click)="setCountry(c.name)"
            [class.bg-red-600]="vehicleService.filter().stockCountry === c.name"
            [class.text-white]="vehicleService.filter().stockCountry === c.name"
            [class.bg-zinc-100]="vehicleService.filter().stockCountry !== c.name"
            [class.text-zinc-800]="vehicleService.filter().stockCountry !== c.name"
            class="px-2.5 py-1 rounded text-xs font-medium border border-zinc-200 hover:border-red-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{{ c.flag }}</span>
            <span>{{ c.name }}</span>
          </button>
        }
      </div>
    </div>
  `,
})
export class CatalogTabsComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);

  readonly origins = [
    { name: 'Japon', flag: '🇯🇵' },
    { name: 'Singapour', flag: '🇸🇬' },
    { name: 'Émirats arabes unis', flag: '🇦🇪' },
    { name: 'Thaïlande', flag: '🇹🇭' },
    { name: 'Corée', flag: '🇰🇷' },
  ];

  setTab(tab: 'all' | 'new_arrivals' | 'sales' | 'luxury' | 'certified') {
    this.vehicleService.setFilter({ activeTab: tab });
  }

  setCountry(country: string) {
    this.vehicleService.setFilter({ stockCountry: country });
  }
}
