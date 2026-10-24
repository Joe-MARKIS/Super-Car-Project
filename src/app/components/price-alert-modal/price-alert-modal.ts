import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PriceAlertService } from '../../services/price-alert';
import { VehicleService } from '../../services/vehicle';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-price-alert-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    @if (priceAlertService.isModalOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn select-none">
        <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-zinc-300 flex flex-col max-h-[92vh]">
          <!-- Modal Header (Red, Black, White) -->
          <div class="bg-[#1A1A1A] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-red-600 shrink-0">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-red-600/20 text-red-500 border border-red-600/40 flex items-center justify-center">
                <mat-icon class="scale-90">notifications_active</mat-icon>
              </div>
              <div>
                <h3 class="text-sm sm:text-base font-black text-white leading-tight">
                  Alerte Baisse de Prix (Email & WhatsApp)
                </h3>
                <p class="text-[10px] text-zinc-300">
                  Soyez le premier prévenu dès qu'un véhicule baisse de prix
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="priceAlertService.closeModal()"
              class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <mat-icon class="scale-90">close</mat-icon>
            </button>
          </div>

          <!-- Navigation Tabs -->
          <div class="bg-zinc-100 px-4 pt-2 border-b border-zinc-200 flex items-center gap-2 text-xs font-bold shrink-0">
            <button
              type="button"
              (click)="activeTab.set('subscribe')"
              class="pb-2 px-2 border-b-2 cursor-pointer transition-colors"
              [class.border-red-600]="activeTab() === 'subscribe'"
              [class.text-red-600]="activeTab() === 'subscribe'"
              [class.border-transparent]="activeTab() !== 'subscribe'"
              [class.text-zinc-600]="activeTab() !== 'subscribe'"
            >
              Créer une alerte
            </button>
            <button
              type="button"
              (click)="activeTab.set('my_alerts')"
              class="pb-2 px-2 border-b-2 cursor-pointer transition-colors flex items-center gap-1"
              [class.border-red-600]="activeTab() === 'my_alerts'"
              [class.text-red-600]="activeTab() === 'my_alerts'"
              [class.border-transparent]="activeTab() !== 'my_alerts'"
              [class.text-zinc-600]="activeTab() !== 'my_alerts'"
            >
              <span>Mes alertes actives</span>
              <span class="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                {{ priceAlertService.alerts().length }}
              </span>
            </button>
          </div>

          <!-- Tab 1: Subscribe Form -->
          @if (activeTab() === 'subscribe') {
            <div class="p-5 overflow-y-auto space-y-4 flex-1">
              <!-- Vehicle Context Banner if vehicle is passed -->
              @if (currentVehicle(); as v) {
                <div class="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex items-center gap-3">
                  <img
                    [src]="v.imageUrl"
                    [alt]="v.make + ' ' + v.model"
                    class="w-16 h-12 object-cover rounded border border-zinc-200 shrink-0"
                    referrerpolicy="no-referrer"
                  />
                  <div class="flex-1 min-w-0 text-xs">
                    <span class="text-[10px] font-extrabold text-red-600 uppercase">{{ v.make }}</span>
                    <h4 class="font-black text-zinc-900 truncate">{{ v.model }} ({{ v.year }})</h4>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="text-[11px] text-zinc-500">Prix actuel:</span>
                      <strong class="text-xs font-black text-emerald-600">{{ lang.formatPrice(v.priceUsd) }}</strong>
                      <span class="text-[10px] text-zinc-400 font-mono">Ref: {{ v.refNo }}</span>
                    </div>
                  </div>
                </div>
              }

              <form [formGroup]="alertForm" (ngSubmit)="submitAlert()" class="space-y-3.5">
                <!-- Vehicle Make & Model Selection if not locked -->
                @if (!currentVehicle()) {
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label for="alert-make" class="block font-bold text-zinc-700 mb-1">
                        Marque du véhicule <span class="text-red-600">*</span>
                      </label>
                      <select
                        id="alert-make"
                        formControlName="make"
                        (change)="onMakeChange($event)"
                        class="w-full bg-white border border-zinc-300 rounded p-2 text-xs font-semibold"
                      >
                        @for (make of availableMakes; track make) {
                          <option [value]="make">{{ make }}</option>
                        }
                      </select>
                    </div>

                    <div>
                      <label for="alert-model" class="block font-bold text-zinc-700 mb-1">
                        Modèle de véhicule <span class="text-red-600">*</span>
                      </label>
                      <select
                        id="alert-model"
                        formControlName="model"
                        class="w-full bg-white border border-zinc-300 rounded p-2 text-xs font-semibold"
                      >
                        @for (model of availableModels(); track model) {
                          <option [value]="model">{{ model }}</option>
                        }
                      </select>
                    </div>
                  </div>
                }

                <!-- Email Input -->
                <div>
                  <label for="alert-email" class="block text-xs font-bold text-zinc-700 mb-1">
                    Votre Adresse E-mail pour recevoir les alertes <span class="text-red-600">*</span>
                  </label>
                  <div class="relative">
                    <input
                      id="alert-email"
                      type="email"
                      formControlName="email"
                      placeholder="exemple@domaine.com"
                      class="w-full bg-white border border-zinc-300 rounded p-2 text-xs font-medium pl-8 focus:border-red-600 focus:outline-hidden"
                    />
                    <mat-icon class="absolute left-2 top-2 text-zinc-400 scale-75">email</mat-icon>
                  </div>
                  @if (alertForm.get('email')?.touched && alertForm.get('email')?.invalid) {
                    <span class="text-[10px] text-red-600 font-bold">Veuillez entrer une adresse e-mail valide.</span>
                  }
                </div>

                <!-- WhatsApp Phone (Optional) -->
                <div>
                  <label for="alert-phone" class="block text-xs font-bold text-zinc-700 mb-1">
                    Numéro WhatsApp en RDC (Facultatif - alerte instantanée)
                  </label>
                  <div class="relative">
                    <input
                      id="alert-phone"
                      type="tel"
                      formControlName="phoneWhatsapp"
                      placeholder="+243 81 000 0000"
                      class="w-full bg-white border border-zinc-300 rounded p-2 text-xs font-medium pl-8 focus:border-red-600 focus:outline-hidden"
                    />
                    <mat-icon class="absolute left-2 top-2 text-zinc-400 scale-75">phone</mat-icon>
                  </div>
                </div>

                <!-- Trigger Rule: Any drop vs Threshold -->
                <div class="bg-zinc-50 border border-zinc-200 rounded-lg p-3 space-y-2 text-xs">
                  <div class="font-bold text-zinc-800">Condition de notification :</div>

                  <label class="flex items-center gap-2 cursor-pointer font-medium text-zinc-700">
                    <input
                      type="radio"
                      name="notifyRule"
                      [checked]="notifyOnAnyDrop()"
                      (change)="notifyOnAnyDrop.set(true)"
                      class="accent-red-600"
                    />
                    <span>M'avertir dès la moindre baisse de prix (-50$, -100$, promotions)</span>
                  </label>

                  <label class="flex items-center gap-2 cursor-pointer font-medium text-zinc-700">
                    <input
                      type="radio"
                      name="notifyRule"
                      [checked]="!notifyOnAnyDrop()"
                      (change)="notifyOnAnyDrop.set(false)"
                      class="accent-red-600"
                    />
                    <span>M'avertir seulement si le prix descend sous mon budget max</span>
                  </label>

                  @if (!notifyOnAnyDrop()) {
                    <div class="pt-1 pl-5">
                      <label for="target-price" class="block text-[11px] font-bold text-zinc-700 mb-1">
                        Budget maximum souhaité (USD) :
                      </label>
                      <div class="flex items-center gap-2">
                        <span class="text-zinc-500 font-bold">$</span>
                        <input
                          id="target-price"
                          type="number"
                          formControlName="targetPriceUsd"
                          placeholder="ex: 3500"
                          class="bg-white border border-zinc-300 rounded px-2.5 py-1 text-xs font-bold w-36"
                        />
                      </div>
                    </div>
                  }
                </div>

                <!-- Benefits Checklist -->
                <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-[11px] text-emerald-950 space-y-1">
                  <div class="font-bold text-emerald-900 flex items-center gap-1">
                    <mat-icon class="text-xs text-emerald-600">verified</mat-icon>
                    <span>Garanties du service d'alerte export :</span>
                  </div>
                  <div>✓ Notification prioritaire 15 minutes avant publication publique</div>
                  <div>✓ Calcul CIF automatique inclus vers le port de Matadi / Boma</div>
                  <div>✓ Blocage du véhicule possible 48h sans engagement</div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  [disabled]="alertForm.invalid"
                  class="w-full bg-[#EA580C] hover:bg-[#C2410C] disabled:bg-zinc-300 text-white py-3 px-4 rounded-md font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-[0.99]"
                >
                  <mat-icon class="scale-90">notifications_active</mat-icon>
                  <span>Activer mon alerte baisse de prix</span>
                </button>
              </form>
            </div>
          }

          <!-- Tab 2: My Active Alerts -->
          @if (activeTab() === 'my_alerts') {
            <div class="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              <div class="flex items-center justify-between text-zinc-600 font-bold pb-1 border-b border-zinc-200">
                <span>{{ priceAlertService.alerts().length }} souscription(s) configurée(s)</span>
                <span class="text-[10px] text-zinc-400">Actives pour notifications email</span>
              </div>

              @for (alert of priceAlertService.alerts(); track alert.id) {
                <div class="bg-zinc-50 border border-zinc-200 rounded-lg p-3 space-y-2 hover:border-red-400 transition-colors">
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="text-[9px] font-black uppercase text-red-600 px-1 py-0.2 bg-red-50 rounded">
                        {{ alert.make }}
                      </span>
                      <h4 class="font-black text-sm text-zinc-900 mt-0.5">
                        {{ alert.model }}
                      </h4>
                      <p class="text-[11px] text-zinc-600">
                        Destinataire : <strong class="text-zinc-800">{{ alert.email }}</strong>
                      </p>
                    </div>

                    <span
                      class="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      [class.bg-emerald-100]="alert.status === 'active'"
                      [class.text-emerald-800]="alert.status === 'active'"
                      [class.bg-zinc-200]="alert.status === 'paused'"
                      [class.text-zinc-600]="alert.status === 'paused'"
                    >
                      {{ alert.status === 'active' ? '● Active' : 'En pause' }}
                    </span>
                  </div>

                  <div class="text-[11px] text-zinc-600 bg-white p-2 rounded border border-zinc-100 flex items-center justify-between">
                    <div>
                      Condition :
                      @if (alert.notifyOnAnyDrop) {
                        <span class="font-bold text-zinc-800">Toute baisse de prix</span>
                      } @else {
                        <span class="font-bold text-zinc-800">Sous {{ lang.formatPrice(alert.targetPriceUsd || 4000) }}</span>
                      }
                    </div>
                    <div class="text-zinc-400 font-mono text-[10px]">
                      {{ alert.createdAt }}
                    </div>
                  </div>

                  <!-- Actions: Test Email Simulation & Delete -->
                  <div class="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      (click)="simulatePriceDrop(alert.id)"
                      class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      title="Tester l'email de notification"
                    >
                      <mat-icon class="text-xs scale-75">outgoing_mail</mat-icon>
                      <span>Tester l'alerte email</span>
                    </button>

                    <button
                      type="button"
                      (click)="priceAlertService.unsubscribe(alert.id)"
                      class="text-zinc-400 hover:text-red-600 p-1 rounded cursor-pointer"
                      title="Supprimer l'alerte"
                    >
                      <mat-icon class="scale-75">delete</mat-icon>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    }

    <!-- Simulated Email Preview Modal (High-Fidelity Inbox simulation) -->
    @if (priceAlertService.activeEmailPreview(); as email) {
      <div class="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none">
        <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-zinc-400 flex flex-col">
          <!-- Fake Email Client Bar -->
          <div class="bg-zinc-800 text-zinc-300 px-4 py-2.5 flex items-center justify-between text-xs border-b border-zinc-700">
            <div class="flex items-center gap-2">
              <mat-icon class="text-emerald-400 scale-75">mark_email_read</mat-icon>
              <span class="font-bold text-white">Aperçu Notification Email (Simulation Réelle)</span>
            </div>
            <button
              type="button"
              (click)="priceAlertService.closeEmailPreview()"
              class="text-zinc-400 hover:text-white cursor-pointer"
            >
              <mat-icon class="scale-75">close</mat-icon>
            </button>
          </div>

          <!-- Email Content Body -->
          <div class="p-5 space-y-4 text-xs">
            <!-- Email metadata headers -->
            <div class="bg-zinc-50 p-3 rounded-lg border border-zinc-200 text-zinc-700 space-y-1">
              <div><strong>De :</strong> AutoForward Price Alerts &lt;alerts&#64;autoforward.cd&gt;</div>
              <div><strong>À :</strong> {{ email.recipientEmail }}</div>
              <div><strong>Date :</strong> {{ email.timestamp }}</div>
              <div class="text-zinc-950 font-bold pt-1 border-t border-zinc-200">
                <strong>Objet :</strong> {{ email.subject }}
              </div>
            </div>

            <!-- Email Body Template -->
            <div class="border border-red-200 rounded-xl p-4 bg-gradient-to-b from-red-50/40 to-white space-y-3">
              <div class="flex items-center justify-between border-b border-zinc-200 pb-2">
                <span class="bg-red-600 text-white px-2 py-0.5 rounded font-black text-xs">AUTOFORWARD</span>
                <span class="text-[10px] text-zinc-500 font-mono">EXPORT DIRECT RDC</span>
              </div>

              <h4 class="font-black text-sm text-zinc-900 leading-tight">
                Bonne nouvelle ! Le prix de votre {{ email.make }} {{ email.model }} vient de baisser.
              </h4>

              <div class="flex items-center gap-3 bg-white p-3 rounded-lg border border-zinc-200">
                @if (email.vehicleImageUrl) {
                  <img
                    [src]="email.vehicleImageUrl"
                    alt="Car"
                    class="w-20 h-14 object-cover rounded border border-zinc-100 shrink-0"
                    referrerpolicy="no-referrer"
                  />
                }
                <div class="space-y-0.5">
                  <div class="font-extrabold text-zinc-900 text-xs">{{ email.make }} {{ email.model }}</div>
                  <div class="text-zinc-400 line-through text-[11px]">{{ lang.formatPrice(email.oldPriceUsd) }}</div>
                  <div class="text-base font-black text-emerald-600 leading-none">
                    {{ lang.formatPrice(email.newPriceUsd) }}
                  </div>
                  <div class="text-[10px] text-red-600 font-bold">
                    Économie immédiate : -{{ lang.formatPrice(email.priceDropAmountUsd) }} (-{{ email.priceDropPercent }}%)
                  </div>
                </div>
              </div>

              <p class="text-zinc-600 text-[11px] leading-relaxed">
                Le véhicule est disponible en stock et réservable avec option transport maritime vers {{ email.destinationPort }}.
              </p>

              <button
                type="button"
                (click)="priceAlertService.closeEmailPreview(); priceAlertService.closeModal()"
                class="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-md cursor-pointer"
              >
                <span>Voir le véhicule & Bloquer la réservation</span>
                <mat-icon class="scale-75">arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class PriceDropAlertModalComponent {
  readonly priceAlertService = inject(PriceAlertService);
  readonly vehicleService = inject(VehicleService);
  readonly lang = inject(LanguageService);
  readonly authService = inject(AuthService);

  readonly activeTab = signal<'subscribe' | 'my_alerts'>('subscribe');
  readonly notifyOnAnyDrop = signal<boolean>(true);

  readonly availableMakes = ['Toyota', 'Mercedes-Benz', 'Nissan', 'Honda', 'Mitsubishi', 'Mazda', 'Subaru', 'Lexus'];

  readonly currentVehicle = computed(() => {
    return this.priceAlertService.selectedVehicle();
  });

  readonly alertForm = new FormGroup({
    make: new FormControl('Toyota', { nonNullable: true, validators: [Validators.required] }),
    model: new FormControl('Corolla', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phoneWhatsapp: new FormControl(''),
    targetPriceUsd: new FormControl<number | null>(null),
  });

  readonly availableModels = computed(() => {
    const make = this.alertForm.get('make')?.value || 'Toyota';
    const all = this.vehicleService.vehicles();
    const models = all.filter((v) => v.make.toLowerCase() === make.toLowerCase()).map((v) => v.model);
    return Array.from(new Set(models));
  });

  constructor() {
    // If user is logged in, prefill their email
    const user = this.authService.currentUser();
    if (user?.email) {
      this.alertForm.patchValue({
        email: user.email,
        phoneWhatsapp: user.phone || '',
      });
    }

    // If vehicle context is provided
    const v = this.priceAlertService.selectedVehicle();
    if (v) {
      this.alertForm.patchValue({
        make: v.make,
        model: v.model,
        targetPriceUsd: Math.round(v.priceUsd * 0.95),
      });
    }
  }

  onMakeChange(e: Event) {
    const make = (e.target as HTMLSelectElement).value;
    this.alertForm.patchValue({ make });
    const models = this.availableModels();
    if (models.length > 0) {
      this.alertForm.patchValue({ model: models[0] });
    }
  }

  submitAlert() {
    if (this.alertForm.invalid) return;

    const val = this.alertForm.getRawValue();
    const v = this.currentVehicle();

    this.priceAlertService.subscribe({
      email: val.email,
      phoneWhatsapp: val.phoneWhatsapp || undefined,
      make: v ? v.make : val.make,
      model: v ? v.model : val.model,
      targetPriceUsd: this.notifyOnAnyDrop() ? undefined : (val.targetPriceUsd || undefined),
      notifyOnAnyDrop: this.notifyOnAnyDrop(),
      vehicle: v,
    });

    this.activeTab.set('my_alerts');
  }

  simulatePriceDrop(alertId: string) {
    this.priceAlertService.simulatePriceDropForAlert(alertId);
  }
}
