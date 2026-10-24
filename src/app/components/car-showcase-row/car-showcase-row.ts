import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Vehicle } from '../../models/vehicle';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card';

@Component({
  selector: 'app-car-showcase-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, VehicleCardComponent],
  template: `
    <section class="my-6">
      <!-- Section Header -->
      <div class="flex items-center justify-between pb-2 mb-3 border-b-2 border-red-600">
        <div class="flex items-center gap-2">
          @if (icon()) {
            <mat-icon class="text-red-600">{{ icon() }}</mat-icon>
          }
          <h2 class="text-sm md:text-base font-black text-zinc-900 uppercase tracking-tight">
            {{ title() }}
          </h2>
        </div>

        <button
          type="button"
          (click)="viewMore()"
          class="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-0.5 cursor-pointer"
        >
          <span>{{ lang.t('seeMore') }}</span>
          <mat-icon class="text-xs scale-75">arrow_forward</mat-icon>
        </button>
      </div>

      <!-- Vehicle Grid (5 ranked cards in row instead of 8) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-2.5">
        @for (veh of displayedVehicles(); track veh.id; let idx = $index) {
          <app-vehicle-card
            [vehicle]="veh"
            [rank]="showRank() ? idx + 1 : undefined"
          />
        }
      </div>
    </section>
  `,
})
export class CarShowcaseRowComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);

  readonly title = input.required<string>();
  readonly vehicles = input.required<Vehicle[]>();
  readonly icon = input<string>('');
  readonly showRank = input<boolean>(false);
  readonly limit = input<number>(5);

  readonly displayedVehicles = computed(() => {
    return this.vehicles().slice(0, this.limit());
  });

  viewMore() {
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
