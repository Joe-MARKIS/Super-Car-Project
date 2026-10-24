import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';
import {
  YEAR_MILEAGE_DATA,
  PRICE_YEAR_DATA,
  PRICE_MILEAGE_DATA,
  MILEAGE_COLUMNS,
  PRICE_COLUMNS,
} from './quotation-data';

export type QuotationMode = 'price_year' | 'price_mileage' | 'year_mileage';

@Component({
  selector: 'app-quotation-matrix',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-xs text-xs">
      <!-- 1. Header Toolbar with the 3 Sub-Sub Columns / Mode Selectors -->
      <!-- Authentic Quotation Tabs & Results Summary (Matching User Images) -->
      <div class="bg-white border-b-2 border-red-600 pt-2 px-2 sm:px-3">
        <!-- Top Row: Tab Buttons + Results Summary (Exact layout as in User Screenshot) -->
        <div class="flex flex-wrap items-end justify-between gap-2">
          <!-- The 3 Sub-sub Column Tabs (prix * annee, prix * kilometrage, annee * kilometrage) -->
          <div class="flex flex-wrap items-end gap-1 -mb-[2px]">
            <!-- Tab 1: PRIX * ANNÉE -->
            <button
              type="button"
              (click)="setMode('price_year')"
              [class.bg-red-600]="activeMode() === 'price_year'"
              [class.text-white]="activeMode() === 'price_year'"
              [class.border-red-600]="activeMode() === 'price_year'"
              [class.shadow-xs]="activeMode() === 'price_year'"
              [class.bg-zinc-100]="activeMode() !== 'price_year'"
              [class.text-zinc-700]="activeMode() !== 'price_year'"
              [class.hover:bg-zinc-200]="activeMode() !== 'price_year'"
              [class.border-zinc-300]="activeMode() !== 'price_year'"
              class="px-3 sm:px-4 py-2 rounded-t-md font-black text-xs uppercase tracking-tight transition-all border border-b-0 cursor-pointer flex items-center gap-1.5"
            >
              <mat-icon class="text-xs scale-75">table_chart</mat-icon>
              <span>{{ lang.t('priceXYear') }}</span>
            </button>

            <!-- Tab 2: PRIX * KILOMÉTRAGE -->
            <button
              type="button"
              (click)="setMode('price_mileage')"
              [class.bg-red-600]="activeMode() === 'price_mileage'"
              [class.text-white]="activeMode() === 'price_mileage'"
              [class.border-red-600]="activeMode() === 'price_mileage'"
              [class.shadow-xs]="activeMode() === 'price_mileage'"
              [class.bg-zinc-100]="activeMode() !== 'price_mileage'"
              [class.text-zinc-700]="activeMode() !== 'price_mileage'"
              [class.hover:bg-zinc-200]="activeMode() !== 'price_mileage'"
              [class.border-zinc-300]="activeMode() !== 'price_mileage'"
              class="px-3 sm:px-4 py-2 rounded-t-md font-black text-xs uppercase tracking-tight transition-all border border-b-0 cursor-pointer flex items-center gap-1.5"
            >
              <mat-icon class="text-xs scale-75">speed</mat-icon>
              <span>{{ lang.t('priceXMileage') }}</span>
            </button>

            <!-- Tab 3: ANNÉE * KILOMÉTRAGE -->
            <button
              type="button"
              (click)="setMode('year_mileage')"
              [class.bg-red-600]="activeMode() === 'year_mileage'"
              [class.text-white]="activeMode() === 'year_mileage'"
              [class.border-red-600]="activeMode() === 'year_mileage'"
              [class.shadow-xs]="activeMode() === 'year_mileage'"
              [class.bg-zinc-100]="activeMode() !== 'year_mileage'"
              [class.text-zinc-700]="activeMode() !== 'year_mileage'"
              [class.hover:bg-zinc-200]="activeMode() !== 'year_mileage'"
              [class.border-zinc-300]="activeMode() !== 'year_mileage'"
              class="px-3 sm:px-4 py-2 rounded-t-md font-black text-xs uppercase tracking-tight transition-all border border-b-0 cursor-pointer flex items-center gap-1.5"
            >
              <mat-icon class="text-xs scale-75">event_repeat</mat-icon>
              <span>{{ lang.t('yearXMileage') }}</span>
            </button>
          </div>

          <!-- Total Results & Min/Max (Directly from User Screenshot) -->
          <div class="flex items-center gap-2 pb-2 text-xs font-mono text-zinc-700 ml-auto">
            <span class="flex items-center gap-1">
              <span class="text-zinc-500 font-semibold">{{ lang.t('quotationResults') }}:</span>
              <strong class="text-red-600 font-black text-sm">500,466</strong>
            </span>
            <span class="text-zinc-300">|</span>
            <span class="text-zinc-600 text-[11px]">
              min: <strong class="text-zinc-950 font-bold">$1</strong> ~ max: <strong class="text-zinc-950 font-bold">$83,147,740</strong>
            </span>
          </div>
        </div>
      </div>

      <!-- Active Filter Pill if cell clicked -->
      @if (activeCellFilter(); as filter) {
        <div class="bg-red-50 border-b border-red-200 px-3 py-1.5 flex items-center justify-between text-xs text-red-900">
          <div class="flex items-center gap-1.5">
            <mat-icon class="text-xs scale-75 text-red-600">filter_alt</mat-icon>
            <span class="font-bold">{{ lang.t('filterByQuotation') }}:</span>
            <span class="bg-red-600 text-white font-mono px-1.5 py-0.2 rounded text-[10px] font-bold">
              {{ filter.label }} ({{ filter.count.toLocaleString() }} {{ lang.t('unitsAvailable') }})
            </span>
          </div>
          <button
            type="button"
            (click)="clearCellFilter()"
            class="text-red-700 hover:text-red-900 font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
          >
            <mat-icon class="text-xs scale-75">close</mat-icon>
            <span>Effacer</span>
          </button>
        </div>
      }

      <!-- Helper Notice -->
      <div class="bg-zinc-50 px-3 py-1 text-[11px] text-zinc-500 border-b border-zinc-200 flex items-center justify-between">
        <span class="flex items-center gap-1">
          <mat-icon class="text-[11px] scale-75 text-zinc-400">touch_app</mat-icon>
          <span>{{ lang.t('clickToFilterStock') }}</span>
        </span>
        <div class="flex items-center gap-2 text-[10px]">
          <span class="flex items-center gap-1">
            <span class="w-2.5 h-2.5 bg-red-200 rounded-xs border border-red-300"></span>
            <span>Forte densité</span>
          </span>
          <span class="flex items-center gap-1">
            <span class="w-2.5 h-2.5 bg-red-100 rounded-xs border border-red-200"></span>
            <span>Moyenne</span>
          </span>
          <span class="flex items-center gap-1">
            <span class="w-2.5 h-2.5 bg-white rounded-xs border border-zinc-300"></span>
            <span>Disponible</span>
          </span>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- MATRIX 1: PRIX × ANNÉE -->
      <!-- ======================================================== -->
      @if (activeMode() === 'price_year') {
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-[10px] sm:text-[11px] text-center font-mono">
            <thead class="sticky top-0 z-20">
              <!-- Row 1: Header Axis -->
              <tr class="bg-[#1A1A1A] text-white">
                <th rowspan="2" class="p-1.5 border border-zinc-700 font-black min-w-[75px] bg-[#1A1A1A] sticky left-0 z-30">
                  {{ lang.t('yearLabel') }}
                </th>
                <th colspan="20" class="p-1 border border-zinc-700 font-black tracking-wider uppercase text-red-400">
                  {{ lang.t('priceUsdLabel') }}
                </th>
              </tr>
              <!-- Row 2: Price Brackets -->
              <tr class="bg-[#1A1A1A] text-white text-[10px]">
                @for (col of priceColumns; track col) {
                  <th
                    class="p-1 border border-zinc-700 font-bold whitespace-nowrap min-w-[50px]"
                    [class.bg-red-600]="col === 'TOTAL'"
                    [class.text-white]="col === 'TOTAL'"
                  >
                    {{ col === 'Plus de' ? lang.t('moreThan') : col }}
                  </th>
                }
              </tr>
              <!-- Row 3: Column Totals -->
              <tr class="bg-red-50 text-red-950 font-black border-b-2 border-red-600">
                <th class="p-1 border border-zinc-200 bg-red-100 sticky left-0 z-30 font-black text-red-950 text-left px-2">
                  {{ lang.t('totalLabel') }}
                </th>
                @for (tot of priceYearTotals; track $index) {
                  <td class="p-1 border border-zinc-200 font-bold tabular-nums" [class.bg-red-200]="tot > 50000">
                    {{ tot ? tot.toLocaleString() : '' }}
                  </td>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of displayedPriceYearRows(); track row.year) {
                <tr class="hover:bg-zinc-100 transition-colors">
                  <!-- Row Header (Year) -->
                  <th
                    (click)="filterByYear(row.year)"
                    class="p-1 border border-zinc-200 bg-zinc-900 text-white font-black sticky left-0 z-10 cursor-pointer hover:bg-red-600 transition-colors text-left px-2 tabular-nums"
                  >
                    {{ row.year }}
                  </th>
                  <!-- Total of the Row -->
                  <td class="p-1 border border-zinc-200 font-bold bg-zinc-50 text-zinc-900 tabular-nums">
                    {{ row.total ? row.total.toLocaleString() : '' }}
                  </td>
                  <!-- Data Cells -->
                  @for (val of row.values; track $index) {
                    <td
                      (click)="onCellClick(row.year + ' × ' + priceColumns[$index + 1], val)"
                      [class]="getCellClass(val)"
                      class="p-1 border border-zinc-200 tabular-nums transition-all cursor-pointer"
                      [title]="row.year + ' | ' + priceColumns[$index + 1] + ': ' + (val ? val.toLocaleString() : '0') + ' véhicules'"
                    >
                      {{ val ? val.toLocaleString() : '' }}
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- ======================================================== -->
      <!-- MATRIX 2: PRIX × KILOMÉTRAGE -->
      <!-- ======================================================== -->
      @if (activeMode() === 'price_mileage') {
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-[10px] sm:text-[11px] text-center font-mono">
            <thead class="sticky top-0 z-20">
              <!-- Row 1: Header Axis -->
              <tr class="bg-[#1A1A1A] text-white">
                <th rowspan="2" class="p-1.5 border border-zinc-700 font-black min-w-[95px] bg-[#1A1A1A] sticky left-0 z-30">
                  {{ lang.t('mileageLabel') }}
                </th>
                <th colspan="20" class="p-1 border border-zinc-700 font-black tracking-wider uppercase text-red-400">
                  {{ lang.t('priceUsdLabel') }}
                </th>
              </tr>
              <!-- Row 2: Price Brackets -->
              <tr class="bg-[#1A1A1A] text-white text-[10px]">
                @for (col of priceColumns; track col) {
                  <th
                    class="p-1 border border-zinc-700 font-bold whitespace-nowrap min-w-[50px]"
                    [class.bg-red-600]="col === 'TOTAL'"
                    [class.text-white]="col === 'TOTAL'"
                  >
                    {{ col === 'Plus de' ? lang.t('moreThan') : col }}
                  </th>
                }
              </tr>
              <!-- Row 3: Column Totals -->
              <tr class="bg-red-50 text-red-950 font-black border-b-2 border-red-600">
                <th class="p-1 border border-zinc-200 bg-red-100 sticky left-0 z-30 font-black text-red-950 text-left px-2">
                  {{ lang.t('totalLabel') }}
                </th>
                @for (tot of priceMileageTotals; track $index) {
                  <td class="p-1 border border-zinc-200 font-bold tabular-nums" [class.bg-red-200]="tot > 50000">
                    {{ tot ? tot.toLocaleString() : '' }}
                  </td>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of priceMileageRows; track row.mileage) {
                <tr class="hover:bg-zinc-100 transition-colors">
                  <!-- Row Header (Mileage) -->
                  <th
                    (click)="filterByMileage(row.mileage)"
                    class="p-1 border border-zinc-200 bg-zinc-900 text-white font-black sticky left-0 z-10 cursor-pointer hover:bg-red-600 transition-colors text-left px-2 whitespace-nowrap"
                  >
                    {{ row.mileage === 'Plus de' ? lang.t('moreThan') : row.mileage }}
                  </th>
                  <!-- Total of the Row -->
                  <td class="p-1 border border-zinc-200 font-bold bg-zinc-50 text-zinc-900 tabular-nums">
                    {{ row.total ? row.total.toLocaleString() : '' }}
                  </td>
                  <!-- Data Cells -->
                  @for (val of row.values; track $index) {
                    <td
                      (click)="onCellClick(row.mileage + ' × ' + priceColumns[$index + 1], val)"
                      [class]="getCellClass(val)"
                      class="p-1 border border-zinc-200 tabular-nums transition-all cursor-pointer"
                      [title]="row.mileage + ' | ' + priceColumns[$index + 1] + ': ' + (val ? val.toLocaleString() : '0') + ' véhicules'"
                    >
                      {{ val ? val.toLocaleString() : '' }}
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- ======================================================== -->
      <!-- MATRIX 3: ANNÉE × KILOMÉTRAGE -->
      <!-- ======================================================== -->
      @if (activeMode() === 'year_mileage') {
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-[10px] sm:text-[11px] text-center font-mono">
            <thead class="sticky top-0 z-20">
              <!-- Row 1: Header Axis -->
              <tr class="bg-[#1A1A1A] text-white">
                <th rowspan="2" class="p-1.5 border border-zinc-700 font-black min-w-[75px] bg-[#1A1A1A] sticky left-0 z-30">
                  {{ lang.t('yearLabel') }}
                </th>
                <th colspan="13" class="p-1 border border-zinc-700 font-black tracking-wider uppercase text-red-400">
                  {{ lang.t('mileageLabel') }}
                </th>
              </tr>
              <!-- Row 2: Mileage Brackets -->
              <tr class="bg-[#1A1A1A] text-white text-[10px]">
                @for (col of mileageColumns; track col) {
                  <th
                    class="p-1 border border-zinc-700 font-bold whitespace-nowrap min-w-[55px]"
                    [class.bg-red-600]="col === 'TOTAL'"
                    [class.text-white]="col === 'TOTAL'"
                  >
                    {{ col === 'Plus de' ? lang.t('moreThan') : col }}
                  </th>
                }
              </tr>
              <!-- Row 3: Column Totals -->
              <tr class="bg-red-50 text-red-950 font-black border-b-2 border-red-600">
                <th class="p-1 border border-zinc-200 bg-red-100 sticky left-0 z-30 font-black text-red-950 text-left px-2">
                  {{ lang.t('totalLabel') }}
                </th>
                @for (tot of yearMileageTotals; track $index) {
                  <td class="p-1 border border-zinc-200 font-bold tabular-nums" [class.bg-red-200]="tot > 50000">
                    {{ tot ? tot.toLocaleString() : '' }}
                  </td>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of displayedYearMileageRows(); track row.year) {
                <tr class="hover:bg-zinc-100 transition-colors">
                  <!-- Row Header (Year) -->
                  <th
                    (click)="filterByYear(row.year)"
                    class="p-1 border border-zinc-200 bg-zinc-900 text-white font-black sticky left-0 z-10 cursor-pointer hover:bg-red-600 transition-colors text-left px-2 tabular-nums"
                  >
                    {{ row.year }}
                  </th>
                  <!-- Total of the Row -->
                  <td class="p-1 border border-zinc-200 font-bold bg-zinc-50 text-zinc-900 tabular-nums">
                    {{ row.total ? row.total.toLocaleString() : '' }}
                  </td>
                  <!-- Data Cells -->
                  @for (val of row.values; track $index) {
                    <td
                      (click)="onCellClick(row.year + ' × ' + mileageColumns[$index + 1], val)"
                      [class]="getCellClass(val)"
                      class="p-1 border border-zinc-200 tabular-nums transition-all cursor-pointer"
                      [title]="row.year + ' | ' + mileageColumns[$index + 1] + ': ' + (val ? val.toLocaleString() : '0') + ' véhicules'"
                    >
                      {{ val ? val.toLocaleString() : '' }}
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Bottom Footer Info -->
      <div class="p-2.5 bg-zinc-900 text-white flex flex-wrap items-center justify-between gap-2 text-[10px]">
        <div class="flex items-center gap-1.5 text-zinc-300">
          <mat-icon class="text-xs scale-75 text-emerald-400">gpp_good</mat-icon>
          <span>Données issues des enchères japonaises USS, TAA, CAA & JU actualisées quotidiennement.</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="toggleShowOlderYears()"
            class="text-red-400 hover:text-red-300 underline font-bold cursor-pointer"
          >
            {{ showOlderYears() ? 'Afficher années récentes (2000-2027)' : "Afficher tout l'historique (1970-2027)" }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class QuotationMatrixComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);

  readonly activeMode = signal<QuotationMode>('price_year');
  readonly showOlderYears = signal<boolean>(false);
  readonly activeCellFilter = signal<{ label: string; count: number } | null>(null);

  readonly priceColumns = PRICE_COLUMNS;
  readonly mileageColumns = MILEAGE_COLUMNS;

  readonly priceYearRows = PRICE_YEAR_DATA;
  readonly priceMileageRows = PRICE_MILEAGE_DATA;
  readonly yearMileageRows = YEAR_MILEAGE_DATA;

  readonly priceYearTotals = [
    500466, 6, 31, 343, 3657, 10334, 13818, 16094, 15729, 17041, 19062, 16239, 29959, 27221, 24983, 25062, 24516,
    96190, 58067, 102114,
  ];

  readonly priceMileageTotals = [
    500466, 6, 31, 343, 3657, 10334, 13818, 16094, 15729, 17041, 19062, 16239, 29959, 27221, 24983, 25062, 24516,
    96190, 58067, 102114,
  ];

  readonly yearMileageTotals = [
    500430, 23497, 24116, 28589, 32674, 36019, 38762, 111038, 62597, 89344, 34066, 12763, 6965,
  ];

  readonly displayedPriceYearRows = computed(() => {
    if (this.showOlderYears()) {
      return this.priceYearRows;
    }
    return this.priceYearRows.slice(0, 28); // 2027 down to 2000
  });

  readonly displayedYearMileageRows = computed(() => {
    if (this.showOlderYears()) {
      return this.yearMileageRows;
    }
    return this.yearMileageRows.slice(0, 28);
  });

  setMode(mode: QuotationMode) {
    this.activeMode.set(mode);
  }

  toggleShowOlderYears() {
    this.showOlderYears.update((v) => !v);
  }

  getCellClass(val: number): string {
    if (!val || val === 0) {
      return 'bg-white text-zinc-300';
    }
    if (val >= 10000) {
      return 'bg-red-200/90 text-red-950 font-black hover:bg-red-300 ring-1 ring-red-400/50';
    }
    if (val >= 4000) {
      return 'bg-red-100 text-red-950 font-bold hover:bg-red-200';
    }
    if (val >= 1000) {
      return 'bg-red-50 text-red-900 font-medium hover:bg-red-100';
    }
    return 'bg-white text-zinc-700 hover:bg-red-50';
  }

  onCellClick(label: string, count: number) {
    if (!count) return;
    this.activeCellFilter.set({ label, count });
    // Also scroll gently to stock list or notify
    const stockEl = document.getElementById('stock-list-container');
    if (stockEl) {
      stockEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  clearCellFilter() {
    this.activeCellFilter.set(null);
  }

  filterByYear(year: number) {
    this.vehicleService.setFilter({ minYear: year, maxYear: year });
    this.activeCellFilter.set({ label: `Année ${year}`, count: 1200 });
  }

  filterByMileage(mileageStr: string) {
    let max = 100000;
    if (mileageStr.includes('1,000')) max = 10000;
    else if (mileageStr.includes('50,000')) max = 50000;
    else if (mileageStr.includes('100,000')) max = 100000;
    else if (mileageStr.includes('150,000')) max = 150000;
    else if (mileageStr.includes('200,000')) max = 200000;

    this.vehicleService.setFilter({ maxMileage: max });
    this.activeCellFilter.set({ label: `Kilométrage ${mileageStr}`, count: 3200 });
  }
}
