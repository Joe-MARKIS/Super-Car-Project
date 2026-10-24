import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';
import { PriceAlertService } from '../../services/price-alert';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehicle-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    @if (vehicleService.isModalOpen() && vehicleService.selectedVehicle()) {
      @let v = vehicleService.selectedVehicle()!;
      <!-- Modal container for Large Screens (hidden on small screens, which use mobile-vehicle-detail) -->
      <div class="hidden lg:flex fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs items-center justify-center p-3 md:p-6 animate-fadeIn select-none">
        <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col border border-zinc-300">
          <!-- Modal Header (Red, Black, White) -->
          <div class="bg-[#1A1A1A] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-red-600 sticky top-0 z-20">
            <div class="flex items-center gap-2">
              <span class="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded uppercase">
                REF: {{ v.refNo }}
              </span>
              <h2 class="text-sm md:text-base font-extrabold text-white truncate max-w-md">
                {{ v.make }} {{ v.model }} ({{ v.year }})
              </h2>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="openPriceDropAlert(v)"
                class="bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs px-2.5 py-1 rounded border border-blue-400/40 flex items-center gap-1 font-bold cursor-pointer"
                title="Alerte Baisse de Prix"
              >
                <mat-icon class="text-xs scale-75 text-amber-300">notifications_active</mat-icon>
                <span>Alerte Baisse</span>
              </button>

              <button
                type="button"
                (click)="vehicleService.closeModal()"
                class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <mat-icon class="scale-90">close</mat-icon>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-5 space-y-6">
            <!-- 1. Media & Highlights Top Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Gallery & Image -->
              <div>
                <div class="aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 relative">
                  <img
                    [src]="selectedImage() || v.imageUrl"
                    [alt]="v.model"
                    class="w-full h-full object-cover"
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <span>{{ v.originFlag }}</span>
                    <span>Stock: {{ v.stockCountry }} ({{ v.locationCity }})</span>
                  </div>
                </div>

                <!-- Gallery Thumbnails -->
                <div class="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    (click)="selectedImage.set(v.imageUrl)"
                    class="w-16 h-12 rounded border-2 overflow-hidden cursor-pointer"
                    [class.border-red-600]="selectedImage() === v.imageUrl || !selectedImage()"
                    [class.border-zinc-200]="selectedImage() !== v.imageUrl && selectedImage()"
                  >
                    <img [src]="v.imageUrl" class="w-full h-full object-cover" alt="Main view" referrerpolicy="no-referrer" />
                  </button>
                  @for (thumb of v.galleryImages; track thumb) {
                    <button
                      type="button"
                      (click)="selectedImage.set(thumb)"
                      class="w-16 h-12 rounded border-2 overflow-hidden cursor-pointer"
                      [class.border-red-600]="selectedImage() === thumb"
                      [class.border-zinc-200]="selectedImage() !== thumb"
                    >
                      <img [src]="thumb" class="w-full h-full object-cover" alt="Angle view" referrerpolicy="no-referrer" />
                    </button>
                  }
                </div>
              </div>

              <!-- Quick Specs & Live Pricing -->
              <div class="flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between pb-2 border-b border-zinc-200">
                    <div>
                      <span class="text-xs text-zinc-500 font-bold uppercase">{{ v.make }}</span>
                      <h3 class="text-lg font-black text-zinc-900">{{ v.model }}</h3>
                    </div>
                    <div class="text-right">
                      <div class="text-xs text-zinc-400 line-through tabular-nums">
                        @if (v.originalPriceUsd) {
                          {{ lang.formatPrice(v.originalPriceUsd!) }}
                        }
                      </div>
                      <div class="text-xl font-black text-red-600 tabular-nums">
                        {{ lang.formatPrice(v.priceUsd) }}
                      </div>
                    </div>
                  </div>

                  <!-- Key Spec Grid -->
                  <div class="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div class="bg-zinc-50 p-2 rounded border border-zinc-200">
                      <span class="text-zinc-500 block text-[10px]">{{ lang.t('year') }}</span>
                      <strong class="text-zinc-800">{{ v.year }}</strong>
                    </div>
                    <div class="bg-zinc-50 p-2 rounded border border-zinc-200">
                      <span class="text-zinc-500 block text-[10px]">{{ lang.t('mileage') }}</span>
                      <strong class="text-zinc-800">{{ v.mileageKm.toLocaleString() }} km</strong>
                    </div>
                    <div class="bg-zinc-50 p-2 rounded border border-zinc-200">
                      <span class="text-zinc-500 block text-[10px]">{{ lang.t('transmission') }}</span>
                      <strong class="text-zinc-800">{{ v.transmission }}</strong>
                    </div>
                    <div class="bg-zinc-50 p-2 rounded border border-zinc-200">
                      <span class="text-zinc-500 block text-[10px]">{{ lang.t('fuel') }}</span>
                      <strong class="text-zinc-800">{{ v.fuel }}</strong>
                    </div>
                    <div class="bg-zinc-50 p-2 rounded border border-zinc-200">
                      <span class="text-zinc-500 block text-[10px]">{{ lang.t('steering') }}</span>
                      <strong [class.text-red-600]="v.steering === 'Left Hand Drive'">
                        {{ v.steering === 'Left Hand Drive' ? 'Volant Gauche (LHD)' : 'Volant Droite (RHD)' }}
                      </strong>
                    </div>
                    <div class="bg-zinc-50 p-2 rounded border border-zinc-200">
                      <span class="text-zinc-500 block text-[10px]">Châssis Code</span>
                      <strong class="font-mono text-zinc-800">{{ v.chassisCode }}</strong>
                    </div>
                  </div>
                </div>

                <!-- Reward Points -->
                @if (v.pointsReward > 0) {
                  <div class="bg-blue-50 border border-blue-200 p-2.5 rounded-lg flex items-center gap-2 mt-3 text-xs text-blue-900 font-bold">
                    <span class="bg-amber-400 text-black px-1.5 py-0.5 rounded text-[10px] font-black">P</span>
                    <span>Gagnez {{ v.pointsReward }} points bonus (valeur {{ lang.formatPrice(v.pointsReward) }}) sur cet achat !</span>
                  </div>
                }
              </div>
            </div>

            <!-- 2. Ocean Shipping & Maritime Destination Calculator -->
            <div class="bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-3">
              <div class="flex items-center justify-between border-b border-zinc-200 pb-2">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-red-600">directions_boat</mat-icon>
                  <h4 class="font-black text-xs uppercase text-zinc-900">{{ lang.t('shippingCalcTitle') }}</h4>
                </div>
                <span class="text-[11px] text-zinc-500 font-bold">Corridors RDC & Afrique Centrale</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <!-- Port Selection -->
                <div>
                  <label for="vm-port-select" class="block font-bold text-zinc-700 mb-1">{{ lang.t('destinationPort') }}</label>
                  <select
                    id="vm-port-select"
                    [value]="selectedPortId()"
                    (change)="onPortChange($event)"
                    class="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-800 font-semibold cursor-pointer"
                  >
                    @for (port of vehicleService.ports(); track port.id) {
                      <option [value]="port.id">{{ port.name }} (+{{ lang.formatPrice(port.baseOceanFreightUsd) }})</option>
                    }
                  </select>
                </div>

                <!-- Shipping Method -->
                <div>
                  <label for="vm-ship-method" class="block font-bold text-zinc-700 mb-1">{{ lang.t('shippingMethod') }}</label>
                  <select
                    id="vm-ship-method"
                    [value]="shippingMethod()"
                    (change)="onShippingMethodChange($event)"
                    class="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-800 font-semibold cursor-pointer"
                  >
                    <option value="roro">RORO (Navire Roulier standard)</option>
                    <option value="container">Conteneur Dédié (+450$)</option>
                  </select>
                </div>

                <!-- Maritime Insurance Toggle -->
                <div class="flex items-center pt-5">
                  <label for="vm-insurance" class="flex items-center gap-2 cursor-pointer font-bold text-zinc-700">
                    <input
                      id="vm-insurance"
                      type="checkbox"
                      [checked]="includeInsurance()"
                      (change)="toggleInsurance($event)"
                      class="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{{ lang.t('insuranceInspection') }} (+120$)</span>
                  </label>
                </div>
              </div>

              <!-- Price Breakdown Summary -->
              <div class="bg-white p-3 rounded border border-zinc-200 space-y-1.5 text-xs">
                <div class="flex justify-between text-zinc-600">
                  <span>Prix FOB Véhicule :</span>
                  <span class="font-bold text-zinc-900 tabular-nums">{{ lang.formatPrice(v.priceUsd) }}</span>
                </div>
                <div class="flex justify-between text-zinc-600">
                  <span>Fret Maritime vers {{ currentPortName() }} :</span>
                  <span class="font-bold text-zinc-900 tabular-nums">{{ lang.formatPrice(currentOceanFreight()) }}</span>
                </div>
                <div class="flex justify-between text-zinc-600">
                  <span>Assurance maritime & Inspection pré-embarquement :</span>
                  <span class="font-bold text-zinc-900 tabular-nums">{{ lang.formatPrice(includeInsurance() ? 120 : 0) }}</span>
                </div>
                <div class="pt-2 border-t border-zinc-200 flex justify-between items-center text-sm font-black text-red-600">
                  <span>TOTAL ESTIMÉ CIF :</span>
                  <span class="text-lg tabular-nums">{{ lang.formatPrice(calculatedTotalCif()) }}</span>
                </div>
              </div>
            </div>

            <!-- 3. Consignee / Buyer Information Form (Reactive Form) -->
            <form [formGroup]="consigneeForm" class="border border-zinc-200 rounded-lg p-4">
              <h4 class="font-black text-xs uppercase text-zinc-900 mb-3 pb-1 border-b border-zinc-200 flex items-center gap-1.5">
                <mat-icon class="text-xs scale-90 text-red-600">badge</mat-icon>
                <span>Informations du Destinataire pour la Facture Proforma</span>
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label for="vm-consignee-name" class="block font-bold text-zinc-700 mb-1">{{ lang.t('consigneeName') }}</label>
                  <input
                    id="vm-consignee-name"
                    type="text"
                    formControlName="name"
                    placeholder="ex: Jean-Marc Kabeya"
                    class="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-900 font-medium"
                  />
                </div>
                <div>
                  <label for="vm-consignee-phone" class="block font-bold text-zinc-700 mb-1">{{ lang.t('consigneePhone') }}</label>
                  <input
                    id="vm-consignee-phone"
                    type="text"
                    formControlName="phone"
                    placeholder="ex: +243 81 234 5678"
                    class="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-900 font-medium"
                  />
                </div>
                <div>
                  <label for="vm-consignee-email" class="block font-bold text-zinc-700 mb-1">{{ lang.t('consigneeEmail') }}</label>
                  <input
                    id="vm-consignee-email"
                    type="email"
                    formControlName="email"
                    placeholder="ex: kabeya@gmail.com"
                    class="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-900 font-medium"
                  />
                </div>
                <div>
                  <label for="vm-consignee-city" class="block font-bold text-zinc-700 mb-1">{{ lang.t('consigneeCity') }}</label>
                  <input
                    id="vm-consignee-city"
                    type="text"
                    formControlName="city"
                    placeholder="ex: Kinshasa, Gombe"
                    class="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-900 font-medium"
                  />
                </div>
              </div>
            </form>

            <!-- Features list -->
            <div>
              <h4 class="font-black text-xs uppercase text-zinc-900 mb-2">Options & Équipements Inclus</h4>
              <div class="flex flex-wrap gap-1.5">
                @for (feat of v.features; track feat) {
                  <span class="bg-zinc-100 text-zinc-800 px-2 py-1 rounded text-[11px] font-semibold border border-zinc-200">
                    ✓ {{ feat }}
                  </span>
                }
              </div>
            </div>
          </div>

          <!-- Modal Footer CTA Buttons -->
          <div class="bg-zinc-100 px-5 py-3.5 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20">
            <button
              type="button"
              (click)="vehicleService.closeModal()"
              class="px-4 py-2 rounded border border-zinc-300 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {{ lang.t('close') }}
            </button>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="generateProformaInvoice(v)"
                class="bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-900 px-4 py-2 rounded text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <mat-icon class="text-sm scale-90">print</mat-icon>
                <span>{{ lang.t('downloadProforma') }}</span>
              </button>

              <button
                type="button"
                (click)="confirmBooking(v)"
                class="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-5 py-2 rounded text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <mat-icon class="text-sm scale-90">check_circle</mat-icon>
                <span>{{ lang.t('confirmReservation') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class VehicleModalComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);
  readonly priceAlertService = inject(PriceAlertService);

  readonly selectedImage = signal<string>('');
  readonly selectedPortId = signal<string>('matadi');
  readonly shippingMethod = signal<'roro' | 'container'>('roro');
  readonly includeInsurance = signal<boolean>(true);

  readonly consigneeForm = new FormGroup({
    name: new FormControl('Client AutoForward', { nonNullable: true }),
    phone: new FormControl('+243 81 000 0000', { nonNullable: true }),
    email: new FormControl('client@autoforward.com', { nonNullable: true }),
    city: new FormControl('Kinshasa / Lubumbashi', { nonNullable: true }),
  });

  onPortChange(e: Event) {
    const pId = (e.target as HTMLSelectElement).value;
    this.selectedPortId.set(pId);
  }

  onShippingMethodChange(e: Event) {
    const method = (e.target as HTMLSelectElement).value as 'roro' | 'container';
    this.shippingMethod.set(method);
  }

  toggleInsurance(e: Event) {
    this.includeInsurance.set((e.target as HTMLInputElement).checked);
  }

  currentPortName(): string {
    const p = this.vehicleService.ports().find((port) => port.id === this.selectedPortId());
    return p ? p.name : 'Port';
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

  openPriceDropAlert(v: Vehicle) {
    this.priceAlertService.openModal(v);
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
2. Fret maritime vers ${this.currentPortName()}: ${this.lang.formatPrice(this.currentOceanFreight())}
3. Assurance tous risques & Inspection: ${this.lang.formatPrice(this.includeInsurance() ? 120 : 0)}
-----------------------------------------------------
TOTAL CIF À RÉGLER: ${formattedTotal}
-----------------------------------------------------
INSTRUCTIONS DE PAIEMENT BANCAIRE (SWIFT):
Banque Bénéficiaire: SMBC Bank Tokyo / Emirates NBD Dubai
Titulaire du compte: AutoForward Global Export Corp.
Motif obligatoire: PRO-${v.refNo}

Votre véhicule est réservé pendant 48 heures.
Contact support RDC: +243 81 440 3440 | top@autoforward.com
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
      message: `La Proforma officielle pour ${v.make} ${v.model} (Réf: ${v.refNo}) a été générée.`,
    });
  }

  confirmBooking(v: Vehicle) {
    const formVal = this.consigneeForm.getRawValue();
    this.priceAlertService.showToast({
      type: 'success',
      title: 'Réservation Enregistrée !',
      message: `Réservation de ${v.make} ${v.model} au nom de ${formVal.name}. Un conseiller vous contactera via WhatsApp.`,
    });
    this.vehicleService.closeModal();
  }
}
