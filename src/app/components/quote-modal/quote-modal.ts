import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';

@Component({
  selector: 'app-quote-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    @if (vehicleService.isQuoteModalOpen() && vehicleService.selectedVehicle()) {
      @let v = vehicleService.selectedVehicle()!;
      <div class="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
        <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-zinc-300">
          <!-- Header -->
          <div class="bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white px-5 py-3.5 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <mat-icon class="scale-90">request_quote</mat-icon>
              <h3 class="font-black text-sm uppercase tracking-wide">
                {{ lang.t('proformaTitle') }}
              </h3>
            </div>
            <button
              (click)="vehicleService.closeQuoteModal()"
              class="w-7 h-7 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer"
            >
              <mat-icon class="scale-75">close</mat-icon>
            </button>
          </div>

          <!-- Content -->
          <div class="p-5 space-y-4 text-xs">
            <!-- Vehicle Summary -->
            <div class="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
              <img
                [src]="v.imageUrl"
                [alt]="v.model"
                class="w-16 h-12 rounded object-cover border border-zinc-200"
                referrerpolicy="no-referrer"
              />
              <div class="flex-1 min-w-0">
                <span class="text-[10px] text-red-600 font-bold uppercase">{{ v.make }}</span>
                <h4 class="font-bold text-zinc-900 truncate">{{ v.model }} ({{ v.year }})</h4>
                <div class="text-[11px] text-zinc-500 font-medium">Châssis: {{ v.chassisCode }}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-zinc-400">Prix FOB</div>
                <div class="font-black text-red-600 text-sm tabular-nums">{{ lang.formatPrice(v.priceUsd) }}</div>
              </div>
            </div>

            <!-- Port Selection -->
            <div>
              <label for="quote-port-select" class="block font-bold text-zinc-700 mb-1">{{ lang.t('selectPort') }}</label>
              <select
                id="quote-port-select"
                [value]="selectedPortId()"
                (change)="onPortChange($event)"
                class="w-full bg-white p-2 rounded border border-zinc-300 font-semibold text-zinc-800 outline-none text-xs"
              >
                @for (port of vehicleService.ports(); track port.id) {
                  <option [value]="port.id">{{ port.name }}</option>
                }
              </select>
            </div>

            <!-- User Contacts -->
            <div class="space-y-2">
              <div>
                <label for="quote-consignee-name" class="block font-bold text-zinc-700 mb-0.5">{{ lang.t('consigneeName') }}</label>
                <input
                  id="quote-consignee-name"
                  type="text"
                  [(ngModel)]="name"
                  placeholder="Votre nom complet"
                  class="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-900"
                />
              </div>
              <div>
                <label for="quote-consignee-phone" class="block font-bold text-zinc-700 mb-0.5">{{ lang.t('consigneePhone') }}</label>
                <input
                  id="quote-consignee-phone"
                  type="text"
                  [(ngModel)]="phone"
                  placeholder="Numéro WhatsApp (avec indicatif)"
                  class="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-900"
                />
              </div>
            </div>

            <!-- CIF Total Highlight -->
            <div class="bg-red-50 border border-red-200 rounded p-3 flex items-center justify-between">
              <div>
                <div class="text-[11px] font-bold text-red-900 uppercase">Total Clé en Main CIF :</div>
                <div class="text-[10px] text-red-700">FOB + Fret maritime + Assurance</div>
              </div>
              <div class="text-lg font-black text-red-600 tabular-nums">
                {{ lang.formatPrice(calculatedTotalCif()) }}
              </div>
            </div>

            <!-- Submit Button -->
            <button
              (click)="sendQuoteRequest()"
              class="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white py-2.5 rounded font-black text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <mat-icon class="text-sm scale-90">send</mat-icon>
              <span>Envoyer ma demande de facture proforma</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class QuoteModalComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);

  readonly selectedPortId = signal<string>('matadi');
  name = '';
  phone = '';

  onPortChange(e: Event) {
    this.selectedPortId.set((e.target as HTMLSelectElement).value);
  }

  calculatedTotalCif(): number {
    const v = this.vehicleService.selectedVehicle();
    if (!v) return 0;
    const port = this.vehicleService.ports().find((p) => p.id === this.selectedPortId()) ?? this.vehicleService.ports()[0];
    return v.priceUsd + port.baseOceanFreightUsd + 120;
  }

  sendQuoteRequest() {
    if (!this.name || !this.phone) {
      alert('Veuillez renseigner votre nom et votre numéro WhatsApp.');
      return;
    }
    const v = this.vehicleService.selectedVehicle()!;
    alert(
      `Votre demande de devis CIF pour le ${v.make} ${v.model} a été reçue ! Un conseiller vous contactera sur WhatsApp au ${this.phone} avec la facture proforma officielle.`
    );
    this.vehicleService.closeQuoteModal();
  }
}
