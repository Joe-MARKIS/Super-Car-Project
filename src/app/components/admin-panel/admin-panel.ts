import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';
import { VehicleService } from '../../services/vehicle';
import { LanguageService } from '../../services/language';
import { PriceAlertService } from '../../services/price-alert';
import { Vehicle } from '../../models/vehicle';
import { PriceDropAlert } from '../../models/price-alert';

@Component({
  selector: 'app-admin-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    @if (authService.isAdminPanelOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <!-- Backdrop -->
        <button
          type="button"
          (click)="authService.closeAdminPanel()"
          aria-label="Fermer le panneau d'administration"
          class="fixed inset-0 bg-black/85 backdrop-blur-xs transition-opacity border-0 p-0 cursor-pointer w-full h-full"
        ></button>

        <!-- Main Modal Window -->
        <div
          role="dialog"
          aria-modal="true"
          class="relative w-full max-w-6xl bg-zinc-950 text-zinc-100 rounded-2xl shadow-2xl border-2 border-red-600/60 overflow-hidden z-10 flex flex-col max-h-[94vh] my-auto animate-in fade-in zoom-in-95 duration-200"
        >
          <!-- Header Bar: AutoForward Independent Owner Space -->
          <div class="bg-gradient-to-r from-black via-zinc-900 to-black px-5 py-4 border-b-2 border-red-600 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg font-black">
                <mat-icon class="scale-100">admin_panel_settings</mat-icon>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-base sm:text-lg font-black tracking-tight text-white">
                    Console Propriétaire Indépendant
                  </h2>
                  <span class="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                    AutoForward CD
                  </span>
                </div>
                <p class="text-xs text-zinc-400">
                  Gestion autonome complète : stock véhicules, devis RDC, tarifs de fret, commissions et clients
                </p>
              </div>
            </div>

            <!-- Right Controls: Status & Close -->
            <div class="flex items-center gap-2">
              <span class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Plateforme Indépendante Connectée</span>
              </span>

              <button
                type="button"
                (click)="authService.closeAdminPanel()"
                aria-label="Fermer"
                class="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <mat-icon class="scale-90">close</mat-icon>
              </button>
            </div>
          </div>

          <!-- Navigation Tabs Bar -->
          <div class="bg-zinc-900/90 border-b border-zinc-800 px-4 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none text-xs">
            <button
              type="button"
              (click)="activeTab.set('dashboard')"
              [class.bg-red-600]="activeTab() === 'dashboard'"
              [class.text-white]="activeTab() === 'dashboard'"
              [class.font-black]="activeTab() === 'dashboard'"
              [class.text-zinc-400]="activeTab() !== 'dashboard'"
              class="px-3.5 py-2.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer hover:text-white"
            >
              <mat-icon class="text-sm scale-90">insights</mat-icon>
              <span>1. Tableau de Bord</span>
            </button>

            <button
              type="button"
              (click)="activeTab.set('stock')"
              [class.bg-red-600]="activeTab() === 'stock'"
              [class.text-white]="activeTab() === 'stock'"
              [class.font-black]="activeTab() === 'stock'"
              [class.text-zinc-400]="activeTab() !== 'stock'"
              class="px-3.5 py-2.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer hover:text-white"
            >
              <mat-icon class="text-sm scale-90">directions_car</mat-icon>
              <span>2. Catalogue & Stock ({{ vehicleService.vehicles().length }})</span>
            </button>

            <button
              type="button"
              (click)="activeTab.set('quotes')"
              [class.bg-red-600]="activeTab() === 'quotes'"
              [class.text-white]="activeTab() === 'quotes'"
              [class.font-black]="activeTab() === 'quotes'"
              [class.text-zinc-400]="activeTab() !== 'quotes'"
              class="px-3.5 py-2.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer hover:text-white"
            >
              <mat-icon class="text-sm scale-90">receipt_long</mat-icon>
              <span>3. Devis & Leads RDC ({{ vehicleService.adminQuotations().length }})</span>
            </button>

            <button
              type="button"
              (click)="activeTab.set('tariffs')"
              [class.bg-red-600]="activeTab() === 'tariffs'"
              [class.text-white]="activeTab() === 'tariffs'"
              [class.font-black]="activeTab() === 'tariffs'"
              [class.text-zinc-400]="activeTab() !== 'tariffs'"
              class="px-3.5 py-2.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer hover:text-white"
            >
              <mat-icon class="text-sm scale-90">local_shipping</mat-icon>
              <span>4. Tarifs Maritimes & Taux</span>
            </button>

            <button
              type="button"
              (click)="activeTab.set('add_vehicle')"
              [class.bg-red-600]="activeTab() === 'add_vehicle'"
              [class.text-white]="activeTab() === 'add_vehicle'"
              [class.font-black]="activeTab() === 'add_vehicle'"
              [class.text-zinc-400]="activeTab() !== 'add_vehicle'"
              class="px-3.5 py-2.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer hover:text-white"
            >
              <mat-icon class="text-sm scale-90">add_circle</mat-icon>
              <span>5. + Ajouter un Véhicule</span>
            </button>

            <button
              type="button"
              (click)="activeTab.set('price_alerts')"
              [class.bg-red-600]="activeTab() === 'price_alerts'"
              [class.text-white]="activeTab() === 'price_alerts'"
              [class.font-black]="activeTab() === 'price_alerts'"
              [class.text-zinc-400]="activeTab() !== 'price_alerts'"
              class="px-3.5 py-2.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer hover:text-white"
            >
              <mat-icon class="text-sm scale-90 text-amber-400">notifications_active</mat-icon>
              <span>6. Alertes Baisse & Leads ({{ priceAlertService.alerts().length }})</span>
            </button>
          </div>

          <!-- Notification Banner -->
          @if (feedbackNotice(); as notice) {
            <div
              class="px-5 py-2 text-xs font-bold flex items-center justify-between border-b"
              [class.bg-emerald-950]="notice.type === 'success'"
              [class.text-emerald-200]="notice.type === 'success'"
              [class.border-emerald-800]="notice.type === 'success'"
              [class.bg-red-950]="notice.type === 'error'"
              [class.text-red-200]="notice.type === 'error'"
              [class.border-red-800]="notice.type === 'error'"
            >
              <div class="flex items-center gap-2">
                <mat-icon class="text-sm">{{ notice.type === 'success' ? 'check_circle' : 'error' }}</mat-icon>
                <span>{{ notice.text }}</span>
              </div>
              <button type="button" (click)="feedbackNotice.set(null)" class="text-xs hover:underline cursor-pointer">
                ✕
              </button>
            </div>
          }

          <!-- Modal Scrollable Body -->
          <div class="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            <!-- ============================================== -->
            <!-- TAB 1 : DASHBOARD & INDEPENDENCE METRICS       -->
            <!-- ============================================== -->
            @if (activeTab() === 'dashboard') {
              <div class="space-y-6">
                <!-- Top Key KPI Cards -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
                    <div class="flex items-center justify-between text-zinc-400 font-bold mb-1">
                      <span>Total Véhicules en Stock</span>
                      <mat-icon class="text-red-500 text-sm">directions_car</mat-icon>
                    </div>
                    <div class="text-2xl font-black text-white font-mono">
                      {{ vehicleService.vehicles().length }}
                    </div>
                    <div class="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                      <span class="text-emerald-400 font-bold">● Actifs</span>
                      <span>Disponibles à l'export</span>
                    </div>
                  </div>

                  <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
                    <div class="flex items-center justify-between text-zinc-400 font-bold mb-1">
                      <span>Valeur Marchande Totale</span>
                      <mat-icon class="text-amber-400 text-sm">payments</mat-icon>
                    </div>
                    <div class="text-2xl font-black text-amber-400 font-mono">
                      &#36;{{ totalCatalogValue().toLocaleString() }}
                    </div>
                    <div class="text-[10px] text-zinc-400 mt-1">
                      Prix FOB cumulé du stock
                    </div>
                  </div>

                  <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
                    <div class="flex items-center justify-between text-zinc-400 font-bold mb-1">
                      <span>Commissions Propriétaire Estimées</span>
                      <mat-icon class="text-emerald-400 text-sm">monetization_on</mat-icon>
                    </div>
                    <div class="text-2xl font-black text-emerald-400 font-mono">
                      &#36;{{ estimatedOwnerRevenue().toLocaleString() }}
                    </div>
                    <div class="text-[10px] text-zinc-400 mt-1">
                      Taux appliqué : {{ vehicleService.platformCommissionPercent() }}%
                    </div>
                  </div>

                  <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
                    <div class="flex items-center justify-between text-zinc-400 font-bold mb-1">
                      <span>Devis Traités en RDC</span>
                      <mat-icon class="text-blue-400 text-sm">receipt_long</mat-icon>
                    </div>
                    <div class="text-2xl font-black text-blue-400 font-mono">
                      {{ vehicleService.adminQuotations().length }}
                    </div>
                    <div class="text-[10px] text-zinc-400 mt-1">
                      Demandes de cotation enregistrées
                    </div>
                  </div>
                </div>

                <!-- Independence Banner -->
                <div class="bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-900 border border-red-600/40 rounded-xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-red-600"></span>
                      <h3 class="text-sm font-black text-white uppercase tracking-wider">
                        Contrôle & Autonomie Totale du Propriétaire
                      </h3>
                    </div>
                    <p class="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                      Vous êtes le propriétaire direct de cette plateforme AutoForward. Vous gérez sans intermédiaire vos marges, vos prix FOB d'importation, vos frais de dédouanement et le contact direct avec chaque client en République Démocratique du Congo.
                    </p>
                  </div>
                  <button
                    type="button"
                    (click)="activeTab.set('add_vehicle')"
                    class="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    <mat-icon class="text-sm">add</mat-icon>
                    <span>Ajouter une voiture au stock</span>
                  </button>
                </div>

                <!-- Ports Summary Table -->
                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div class="flex items-center justify-between">
                    <h4 class="font-black text-xs uppercase tracking-tight text-white flex items-center gap-2">
                      <mat-icon class="text-amber-400 text-sm">anchor</mat-icon>
                      <span>Corridors d'Importation Maritime Actifs (RDC & Afrique Centrale)</span>
                    </h4>
                    <span class="text-[11px] text-zinc-400">Taux de fret configurés</span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    @for (port of vehicleService.ports(); track port.id) {
                      <div class="bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <div class="font-bold text-white text-xs flex items-center gap-1.5">
                            <mat-icon class="text-xs text-amber-400">anchor</mat-icon>
                            <span>{{ port.name }}</span>
                          </div>
                          <div class="text-[10px] text-zinc-400">{{ port.country }} • {{ port.transitDays }} jours de transit</div>
                        </div>
                        <div class="text-right">
                          <div class="font-mono font-bold text-emerald-400 text-xs">
                            &#36;{{ port.baseOceanFreightUsd }}
                          </div>
                          <div class="text-[10px] text-zinc-500">Fret Océanique</div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }

            <!-- ============================================== -->
            <!-- TAB 2 : STOCK & CATALOGUE MANAGEMENT (CRUD)    -->
            <!-- ============================================== -->
            @if (activeTab() === 'stock') {
              <div class="space-y-4">
                <!-- Search & Filters in Admin Stock -->
                <div class="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <div class="flex items-center gap-2 flex-1 max-w-md">
                    <div class="relative w-full">
                      <mat-icon class="absolute left-2.5 top-2 text-sm text-zinc-400">search</mat-icon>
                      <input
                        type="text"
                        [value]="stockSearch()"
                        (input)="stockSearch.set($any($event.target).value)"
                        placeholder="Rechercher par marque, modèle ou réf..."
                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="activeTab.set('add_vehicle')"
                      class="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <mat-icon class="text-sm">add_circle</mat-icon>
                      <span>Ajouter un Véhicule</span>
                    </button>
                  </div>
                </div>

                <!-- Vehicles Table -->
                <div class="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xs">
                  <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                      <thead>
                        <tr class="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-tight text-[10px]">
                          <th class="p-3">Véhicule</th>
                          <th class="p-3">Réf / Origine</th>
                          <th class="p-3">Année & Km</th>
                          <th class="p-3">Prix FOB ($ USD)</th>
                          <th class="p-3">Statut</th>
                          <th class="p-3 text-right">Actions Propriétaire</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-zinc-800 text-xs">
                        @for (v of filteredAdminVehicles(); track v.id) {
                          <tr class="hover:bg-zinc-800/50 transition-colors">
                            <td class="p-3">
                              <div class="flex items-center gap-2.5">
                                <img
                                  [src]="v.imageUrl"
                                  [alt]="v.make + ' ' + v.model"
                                  class="w-12 h-9 object-cover rounded border border-zinc-700"
                                  referrerpolicy="no-referrer"
                                />
                                <div>
                                  <div class="font-bold text-white">{{ v.make }} {{ v.model }}</div>
                                  <div class="text-[10px] text-zinc-400">{{ v.category }} • {{ v.transmission }} • {{ v.fuel }}</div>
                                </div>
                              </div>
                            </td>

                            <td class="p-3">
                              <div class="font-mono text-zinc-300 font-bold text-[11px]">{{ v.refNo }}</div>
                              <div class="text-[10px] text-zinc-400 flex items-center gap-1">
                                <span>{{ v.originFlag }}</span>
                                <span>{{ v.stockCountry }}</span>
                              </div>
                            </td>

                            <td class="p-3">
                              <div class="font-bold text-white">{{ v.year }}</div>
                              <div class="text-[10px] text-zinc-400 font-mono">{{ v.mileageKm.toLocaleString() }} km</div>
                            </td>

                            <td class="p-3">
                              <div class="flex items-center gap-1.5">
                                <span class="text-emerald-400 font-black font-mono text-sm">&#36;{{ v.priceUsd.toLocaleString() }}</span>
                                <button
                                  type="button"
                                  (click)="promptUpdatePrice(v)"
                                  title="Modifier le prix"
                                  class="text-zinc-400 hover:text-white cursor-pointer"
                                >
                                  <mat-icon class="text-xs scale-75">edit</mat-icon>
                                </button>
                              </div>
                              <div class="text-[10px] text-zinc-500">CIF Boma ~&#36;{{ (v.priceUsd + 1600).toLocaleString() }}</div>
                            </td>

                            <td class="p-3">
                              <select
                                [value]="v.status || 'Disponible'"
                                (change)="onStatusChange(v.id, getSelectedValue($event))"
                                class="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-[11px] font-bold focus:outline-none"
                                [class.text-emerald-400]="(v.status || 'Disponible') === 'Disponible'"
                                [class.text-amber-400]="v.status === 'Réservé'"
                                [class.text-red-400]="v.status === 'Vendu'"
                              >
                                <option value="Disponible">🟢 Disponible</option>
                                <option value="Réservé">🟡 Réservé</option>
                                <option value="Vendu">🔴 Vendu</option>
                              </select>
                            </td>

                            <td class="p-3 text-right">
                              <div class="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  (click)="deleteVehicle(v.id, v.make + ' ' + v.model)"
                                  class="px-2 py-1 rounded bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white transition-colors cursor-pointer text-[11px] font-bold flex items-center gap-1"
                                >
                                  <mat-icon class="text-xs scale-75">delete</mat-icon>
                                  <span>Supprimer</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }

            <!-- ============================================== -->
            <!-- TAB 3 : DEVIS & LEADS CLIENTS RDC              -->
            <!-- ============================================== -->
            @if (activeTab() === 'quotes') {
              <div class="space-y-4">
                <div class="flex items-center justify-between bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <div>
                    <h3 class="font-bold text-white text-xs">Demandes de Cotation Reçues (Clients RDC)</h3>
                    <p class="text-[11px] text-zinc-400">Traitez directement vos leads et contactez les acheteurs via WhatsApp</p>
                  </div>
                  <span class="bg-red-600 text-white font-black px-2.5 py-1 rounded text-xs">
                    {{ vehicleService.adminQuotations().length }} Demandes
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  @for (q of vehicleService.adminQuotations(); track q.id) {
                    <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-xs">
                      <div class="flex items-start justify-between">
                        <div>
                          <span class="font-mono font-bold text-red-400 text-[10px]">{{ q.id }}</span>
                          <h4 class="font-bold text-white text-sm">{{ q.clientName }}</h4>
                          <div class="text-[11px] text-zinc-400 flex items-center gap-1">
                            <mat-icon class="text-xs scale-75 text-zinc-500">location_on</mat-icon>
                            <span>{{ q.city }}</span>
                          </div>
                        </div>

                        <span
                          class="px-2 py-0.5 rounded text-[10px] font-black uppercase"
                          [class.bg-blue-900]="q.status === 'Nouveau'"
                          [class.text-blue-200]="q.status === 'Nouveau'"
                          [class.bg-amber-900]="q.status === 'Devis Envoyé'"
                          [class.text-amber-200]="q.status === 'Devis Envoyé'"
                          [class.bg-emerald-900]="q.status === 'Paiement Reçu'"
                          [class.text-emerald-200]="q.status === 'Paiement Reçu'"
                          [class.bg-purple-900]="q.status === 'Livré'"
                          [class.text-purple-200]="q.status === 'Livré'"
                        >
                          {{ q.status }}
                        </span>
                      </div>

                      <div class="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 space-y-1">
                        <div class="font-semibold text-zinc-200 text-xs">{{ q.vehicleTitle }}</div>
                        <div class="flex items-center justify-between text-[11px]">
                          <span class="text-zinc-400">Port : {{ q.destinationPort }}</span>
                          <span class="font-mono font-bold text-emerald-400">&#36;{{ q.priceUsd.toLocaleString() }}</span>
                        </div>
                        @if (q.notes) {
                          <div class="text-[10px] text-amber-300 italic pt-1 border-t border-zinc-800">
                            "{{ q.notes }}"
                          </div>
                        }
                      </div>

                      <!-- Action Buttons: WhatsApp & Status Change -->
                      <div class="space-y-2 pt-1">
                        <a
                          [href]="'https://wa.me/' + cleanPhone(q.clientPhone) + '?text=' + encodeMessage(q)"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded text-center flex items-center justify-center gap-1.5 text-xs transition-colors"
                        >
                          <mat-icon class="text-sm">chat</mat-icon>
                          <span>Répondre par WhatsApp ({{ q.clientPhone }})</span>
                        </a>

                        <div class="flex items-center gap-1.5">
                          <span class="text-[10px] text-zinc-400">Changer statut :</span>
                          <select
                            [value]="q.status"
                            (change)="onQuoteStatusChange(q.id, getQuoteStatusValue($event))"
                            class="flex-1 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-[11px] text-zinc-200"
                          >
                            <option value="Nouveau">Nouveau</option>
                            <option value="Devis Envoyé">Devis Envoyé</option>
                            <option value="Paiement Reçu">Paiement Reçu</option>
                            <option value="Livré">Livré</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- ============================================== -->
            <!-- TAB 4 : TARIFS MARITIMES & TAUX DE CHANGE      -->
            <!-- ============================================== -->
            @if (activeTab() === 'tariffs') {
              <div class="space-y-6">
                <!-- Commission & Exchange Rate Settings -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                    <h4 class="font-black text-xs uppercase tracking-tight text-white flex items-center gap-2">
                      <mat-icon class="text-emerald-400 text-sm">percent</mat-icon>
                      <span>Marge Bénéficiaire / Commission Propriétaire</span>
                    </h4>
                    <p class="text-[11px] text-zinc-400">
                      Pourcentage appliqué sur le prix FOB des véhicules vendus sur la plateforme
                    </p>
                    <div class="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="25"
                        [value]="vehicleService.platformCommissionPercent()"
                        (change)="onCommissionChange($any($event.target).value)"
                        class="w-24 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-black text-emerald-400 font-mono text-center"
                      />
                      <span class="text-zinc-200 font-bold text-xs">% par véhicule vendu</span>
                    </div>
                  </div>

                  <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                    <h4 class="font-black text-xs uppercase tracking-tight text-white flex items-center gap-2">
                      <mat-icon class="text-amber-400 text-sm">currency_exchange</mat-icon>
                      <span>Taux de Change USD ⇄ CDF (Franc Congolais)</span>
                    </h4>
                    <p class="text-[11px] text-zinc-400">
                      Taux de conversion officiel utilisé pour les clients de Kinshasa et des provinces
                    </p>
                    <div class="flex items-center gap-3">
                      <input
                        type="number"
                        step="50"
                        min="2000"
                        max="3500"
                        [value]="vehicleService.customExchangeRateUsdToCdf()"
                        (change)="onExchangeRateChange($any($event.target).value)"
                        class="w-32 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-black text-amber-400 font-mono text-center"
                      />
                      <span class="text-zinc-200 font-bold text-xs">CDF pour 1 USD</span>
                    </div>
                  </div>
                </div>

                <!-- Shipping Freight per Port -->
                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <h4 class="font-black text-xs uppercase tracking-tight text-white flex items-center gap-2">
                    <mat-icon class="text-blue-400 text-sm">directions_boat</mat-icon>
                    <span>Frais de Fret Maritime par Port de Destination</span>
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    @for (p of vehicleService.ports(); track p.id) {
                      <div class="bg-zinc-950 border border-zinc-800 rounded-lg p-3 space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-white flex items-center gap-1">
                            <mat-icon class="text-xs text-amber-400">anchor</mat-icon>
                            <span>{{ p.name }}</span>
                          </span>
                          <span class="text-[10px] text-zinc-400">{{ p.country }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="text-zinc-400 text-xs">$</span>
                          <input
                            type="number"
                            step="50"
                            [value]="p.baseOceanFreightUsd"
                            (change)="onFreightChange(p.id, $any($event.target).value)"
                            class="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-xs font-mono font-bold text-emerald-400"
                          />
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }

            <!-- ============================================== -->
            <!-- TAB 5 : + AJOUTER UN VÉHICULE AU STOCK         -->
            <!-- ============================================== -->
            @if (activeTab() === 'add_vehicle') {
              <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 max-w-3xl mx-auto">
                <div class="border-b border-zinc-800 pb-3">
                  <h3 class="font-black text-sm text-white uppercase tracking-tight flex items-center gap-2">
                    <mat-icon class="text-red-500">add_circle</mat-icon>
                    <span>Ajout d'un Nouveau Véhicule au Stock AutoForward</span>
                  </h3>
                  <p class="text-[11px] text-zinc-400">
                    Le véhicule apparaîtra instantanément dans le catalogue et pourra être réservé par les clients
                  </p>
                </div>

                <form [formGroup]="newVehicleForm" (ngSubmit)="submitNewVehicle()" class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label for="adm-make" class="block text-zinc-300 font-bold mb-1">Marque *</label>
                      <input
                        id="adm-make"
                        type="text"
                        formControlName="make"
                        placeholder="ex: TOYOTA"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white uppercase font-bold"
                      />
                    </div>

                    <div>
                      <label for="adm-model" class="block text-zinc-300 font-bold mb-1">Modèle *</label>
                      <input
                        id="adm-model"
                        type="text"
                        formControlName="model"
                        placeholder="ex: Land Cruiser Prado"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white font-bold"
                      />
                    </div>

                    <div>
                      <label for="adm-year" class="block text-zinc-300 font-bold mb-1">Année *</label>
                      <input
                        id="adm-year"
                        type="number"
                        formControlName="year"
                        placeholder="ex: 2021"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label for="adm-price" class="block text-zinc-300 font-bold mb-1">Prix FOB ($ USD) *</label>
                      <input
                        id="adm-price"
                        type="number"
                        formControlName="priceUsd"
                        placeholder="ex: 18500"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-emerald-400 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label for="adm-mileage" class="block text-zinc-300 font-bold mb-1">Kilométrage (km) *</label>
                      <input
                        id="adm-mileage"
                        type="number"
                        formControlName="mileageKm"
                        placeholder="ex: 45000"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label for="adm-category" class="block text-zinc-300 font-bold mb-1">Catégorie</label>
                      <select
                        id="adm-category"
                        formControlName="category"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white font-medium"
                      >
                        <option value="SUV">SUV</option>
                        <option value="Pick up">Pick up</option>
                        <option value="Berline">Berline</option>
                        <option value="Camion">Camion</option>
                        <option value="Van">Van</option>
                        <option value="Minibus">Minibus</option>
                      </select>
                    </div>

                    <div>
                      <label for="adm-country" class="block text-zinc-300 font-bold mb-1">Pays de Stock / Origine</label>
                      <select
                        id="adm-country"
                        formControlName="stockCountry"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white font-medium"
                      >
                        <option value="Japon">🇯🇵 Japon</option>
                        <option value="Singapour">🇸🇬 Singapour</option>
                        <option value="Émirats arabes unis">🇦🇪 Dubaï / Émirats</option>
                        <option value="Corée">🇰🇷 Corée du Sud</option>
                        <option value="Thaïlande">🇹🇭 Thaïlande</option>
                      </select>
                    </div>

                    <div>
                      <label for="adm-steering" class="block text-zinc-300 font-bold mb-1">Volant / Conduite</label>
                      <select
                        id="adm-steering"
                        formControlName="steering"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white font-medium"
                      >
                        <option value="Left Hand Drive">Volant à Gauche (LHD)</option>
                        <option value="Right Hand Drive">Volant à Droite (RHD)</option>
                      </select>
                    </div>

                    <div class="sm:col-span-2">
                      <label for="adm-image" class="block text-zinc-300 font-bold mb-1">URL de l'image</label>
                      <input
                        id="adm-image"
                        type="text"
                        formControlName="imageUrl"
                        placeholder="https://images.unsplash.com/photo-..."
                        class="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    [disabled]="newVehicleForm.invalid"
                    class="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black py-3 px-4 rounded-lg uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                  >
                    <mat-icon class="text-sm">save</mat-icon>
                    <span>Enregistrer et Publier sur le Site</span>
                  </button>
                </form>
              </div>
            }

            <!-- TAB 6: PRICE DROP ALERTS & LEADS MANAGEMENT -->
            @if (activeTab() === 'price_alerts') {
              <div class="space-y-5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <div>
                    <h3 class="font-black text-sm text-white flex items-center gap-2">
                      <mat-icon class="text-amber-400">notifications_active</mat-icon>
                      <span>Abonnés aux Alertes Baisse de Prix (Leads Acheteurs RDC)</span>
                    </h3>
                    <p class="text-[11px] text-zinc-400 mt-0.5">
                      Base d'acheteurs en attente de réduction pour déclencher un achat immédiat
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                      {{ priceAlertService.alerts().length }} Acheteurs Inscrits
                    </span>
                  </div>
                </div>

                <!-- Metrics Summary Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl">
                    <span class="text-[10px] text-zinc-400 font-bold uppercase">Abonnements Actifs</span>
                    <div class="text-xl font-black text-white font-mono mt-1">
                      {{ priceAlertService.totalActiveAlertsCount() }}
                    </div>
                    <span class="text-[10px] text-emerald-400 font-semibold">Prets a recevoir notifications</span>
                  </div>

                  <div class="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl">
                    <span class="text-[10px] text-zinc-400 font-bold uppercase">Modèle le Plus Demandé</span>
                    <div class="text-base font-black text-amber-400 mt-1 truncate">
                      Toyota Corolla / Hilux
                    </div>
                    <span class="text-[10px] text-zinc-400">Kinshasa & Lubumbashi</span>
                  </div>

                  <div class="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl">
                    <span class="text-[10px] text-zinc-400 font-bold uppercase">Conversion Estimée</span>
                    <div class="text-xl font-black text-emerald-400 font-mono mt-1">
                      34%
                    </div>
                    <span class="text-[10px] text-zinc-400">Taux ouverture alertes</span>
                  </div>
                </div>

                <!-- Subscribers Table -->
                <div class="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div class="p-3.5 border-b border-zinc-800 flex items-center justify-between">
                    <h4 class="font-black text-xs text-white uppercase tracking-wider">
                      Liste des Souscriptions Clients aux Alertes
                    </h4>
                  </div>

                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                      <thead class="bg-zinc-950 text-zinc-400 text-[10px] uppercase font-bold border-b border-zinc-800">
                        <tr>
                          <th class="p-3">Client (Email & WhatsApp)</th>
                          <th class="p-3">Véhicule Souhaité</th>
                          <th class="p-3">Condition Déclenchement</th>
                          <th class="p-3">Date Inscription</th>
                          <th class="p-3 text-right">Actions Propriétaire</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-zinc-800">
                        @for (alert of priceAlertService.alerts(); track alert.id) {
                          <tr class="hover:bg-zinc-800/50 transition-colors">
                            <td class="p-3">
                              <div class="font-bold text-white">{{ alert.email }}</div>
                              @if (alert.phoneWhatsapp) {
                                <div class="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                                  <span>WhatsApp:</span>
                                  <span>{{ alert.phoneWhatsapp }}</span>
                                </div>
                              }
                            </td>
                            <td class="p-3">
                              <span class="text-[10px] bg-red-600/30 text-red-300 px-1.5 py-0.2 rounded font-black uppercase">
                                {{ alert.make }}
                              </span>
                              <div class="font-extrabold text-zinc-200 mt-0.5">{{ alert.model }}</div>
                              @if (alert.currentPriceUsd) {
                                <div class="text-[10px] text-zinc-400">Prix ref: {{ '$' }}{{ alert.currentPriceUsd.toLocaleString() }}</div>
                              }
                            </td>
                            <td class="p-3">
                              @if (alert.notifyOnAnyDrop) {
                                <span class="bg-blue-900/40 text-blue-300 border border-blue-700/50 text-[10px] px-2 py-0.5 rounded font-bold">
                                  Toute baisse (-50$ min)
                                </span>
                              } @else {
                                <span class="bg-amber-900/40 text-amber-300 border border-amber-700/50 text-[10px] px-2 py-0.5 rounded font-bold">
                                  Budget max: {{ '$' }}{{ alert.targetPriceUsd?.toLocaleString() }}
                                </span>
                              }
                            </td>
                            <td class="p-3 text-zinc-400 font-mono text-[11px]">
                              {{ alert.createdAt }}
                            </td>
                            <td class="p-3 text-right">
                              <div class="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  (click)="simulatePriceDropForAlert(alert.id)"
                                  class="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                                  title="Déclencher une baisse de prix et envoyer l'email de notification"
                                >
                                  <mat-icon class="text-xs scale-75">trending_down</mat-icon>
                                  <span>Baisser & Alerter</span>
                                </button>

                                @if (alert.phoneWhatsapp) {
                                  <a
                                    [href]="'https://wa.me/' + alert.phoneWhatsapp.replace('+', '').replace(' ', '') + '?text=' + encodeWhatsappPromo(alert)"
                                    target="_blank"
                                    rel="noopener"
                                    class="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded flex items-center justify-center cursor-pointer"
                                    title="Contacter sur WhatsApp"
                                  >
                                    <mat-icon class="text-xs scale-90">chat</mat-icon>
                                  </a>
                                }

                                <button
                                  type="button"
                                  (click)="priceAlertService.unsubscribe(alert.id)"
                                  class="text-zinc-500 hover:text-red-400 p-1 rounded cursor-pointer"
                                  title="Supprimer la souscription"
                                >
                                  <mat-icon class="scale-75">delete</mat-icon>
                                </button>
                              </div>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminPanelComponent {
  readonly authService = inject(AuthService);
  readonly vehicleService = inject(VehicleService);
  readonly lang = inject(LanguageService);
  readonly priceAlertService = inject(PriceAlertService);

  readonly activeTab = signal<'dashboard' | 'stock' | 'quotes' | 'tariffs' | 'add_vehicle' | 'price_alerts'>('dashboard');
  readonly stockSearch = signal<string>('');
  readonly feedbackNotice = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  readonly newVehicleForm = new FormGroup({
    make: new FormControl('TOYOTA', { nonNullable: true, validators: [Validators.required] }),
    model: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    year: new FormControl(2021, { nonNullable: true, validators: [Validators.required] }),
    priceUsd: new FormControl(14500, { nonNullable: true, validators: [Validators.required] }),
    mileageKm: new FormControl(55000, { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('SUV', { nonNullable: true }),
    stockCountry: new FormControl('Japon', { nonNullable: true }),
    steering: new FormControl('Left Hand Drive', { nonNullable: true }),
    imageUrl: new FormControl('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', { nonNullable: true }),
  });

  readonly totalCatalogValue = computed(() => {
    return this.vehicleService.vehicles().reduce((sum, v) => sum + v.priceUsd, 0);
  });

  readonly estimatedOwnerRevenue = computed(() => {
    const total = this.totalCatalogValue();
    const percent = this.vehicleService.platformCommissionPercent();
    return Math.round(total * (percent / 100));
  });

  readonly filteredAdminVehicles = computed(() => {
    const query = this.stockSearch().toLowerCase().trim();
    const list = this.vehicleService.vehicles();
    if (!query) return list;
    return list.filter(
      (v) =>
        v.make.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.refNo.toLowerCase().includes(query)
    );
  });

  onStatusChange(vehicleId: string, status: 'Disponible' | 'Réservé' | 'Vendu') {
    this.vehicleService.updateVehicleStatus(vehicleId, status);
    this.feedbackNotice.set({
      type: 'success',
      text: `Statut du véhicule mis à jour : ${status}`,
    });
  }

  promptUpdatePrice(vehicle: Vehicle) {
    const input = prompt(`Nouveau prix FOB pour ${vehicle.make} ${vehicle.model} ($ USD) :`, vehicle.priceUsd.toString());
    if (input && !isNaN(Number(input))) {
      const newPrice = Number(input);
      this.vehicleService.updateVehiclePrice(vehicle.id, newPrice);
      this.feedbackNotice.set({
        type: 'success',
        text: `Prix FOB de ${vehicle.make} ${vehicle.model} mis à jour à $${newPrice.toLocaleString()} USD.`,
      });
    }
  }

  getSelectedValue(event: Event): 'Disponible' | 'Réservé' | 'Vendu' {
    return (event.target as HTMLSelectElement).value as 'Disponible' | 'Réservé' | 'Vendu';
  }

  getQuoteStatusValue(event: Event): 'Nouveau' | 'Devis Envoyé' | 'Paiement Reçu' | 'Livré' {
    return (event.target as HTMLSelectElement).value as 'Nouveau' | 'Devis Envoyé' | 'Paiement Reçu' | 'Livré';
  }

  deleteVehicle(id: string, name: string) {
    if (confirm(`Confirmez-vous la suppression de ${name} du stock ?`)) {
      this.vehicleService.deleteVehicle(id);
      this.feedbackNotice.set({
        type: 'success',
        text: `Le véhicule ${name} a été retiré du catalogue.`,
      });
    }
  }

  onQuoteStatusChange(
    quoteId: string,
    newStatus: 'Nouveau' | 'Devis Envoyé' | 'Paiement Reçu' | 'Livré'
  ) {
    this.vehicleService.updateQuotationStatus(quoteId, newStatus);
    this.feedbackNotice.set({
      type: 'success',
      text: `Devis ${quoteId} marqué comme "${newStatus}".`,
    });
  }

  onCommissionChange(val: string) {
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      this.vehicleService.setPlatformCommission(num);
      this.feedbackNotice.set({
        type: 'success',
        text: `Commission propriétaire mise à jour à ${num}%.`,
      });
    }
  }

  onExchangeRateChange(val: string) {
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      this.vehicleService.setCustomExchangeRateCdf(num);
      this.feedbackNotice.set({
        type: 'success',
        text: `Taux USD/CDF mis à jour à 1 USD = ${num} CDF.`,
      });
    }
  }

  onFreightChange(portId: string, val: string) {
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      this.vehicleService.updatePortFreight(portId, num);
      this.feedbackNotice.set({
        type: 'success',
        text: `Frais de fret maritime mis à jour pour ce port.`,
      });
    }
  }

  submitNewVehicle() {
    if (this.newVehicleForm.invalid) return;
    const val = this.newVehicleForm.getRawValue();

    const flagMap: Record<string, string> = {
      Japon: '🇯🇵',
      Singapour: '🇸🇬',
      'Émirats arabes unis': '🇦🇪',
      Corée: '🇰🇷',
      Thaïlande: '🇹🇭',
    };

    const newVeh: Vehicle = {
      id: 'veh-' + Math.floor(1000 + Math.random() * 9000),
      refNo: 'AF-' + Math.floor(10000 + Math.random() * 90000),
      make: val.make.toUpperCase(),
      model: val.model,
      year: val.year,
      priceUsd: val.priceUsd,
      estimatedShippingUsd: 1400,
      pointsReward: 100,
      stockCountry: val.stockCountry as Vehicle['stockCountry'],
      originFlag: flagMap[val.stockCountry] || '🇯🇵',
      steering: val.steering as Vehicle['steering'],
      transmission: 'Automatique',
      fuel: 'Essence',
      mileageKm: val.mileageKm,
      engineCc: 2400,
      category: val.category as Vehicle['category'],
      driveType: '4WD',
      seats: 5,
      doors: 5,
      color: 'Blanc Perle',
      chassisCode: 'TRJ150-' + Math.floor(1000 + Math.random() * 9000),
      imageUrl: val.imageUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      galleryImages: [],
      features: ['Climatisation', 'Caméra de recul', 'Jantes alu', 'Bluetooth'],
      locationCity: 'Yokohama',
      inspectionPassed: true,
      status: 'Disponible',
    };

    this.vehicleService.addVehicle(newVeh);
    this.feedbackNotice.set({
      type: 'success',
      text: `Le véhicule ${newVeh.make} ${newVeh.model} (${newVeh.year}) a été ajouté au catalogue avec succès !`,
    });
    this.activeTab.set('stock');
    this.newVehicleForm.reset({
      make: 'TOYOTA',
      model: '',
      year: 2021,
      priceUsd: 14500,
      mileageKm: 55000,
      category: 'SUV',
      stockCountry: 'Japon',
      steering: 'Left Hand Drive',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    });
  }

  cleanPhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  encodeMessage(q: { clientName: string; vehicleTitle: string; destinationPort: string }): string {
    const text = `Bonjour ${q.clientName}, ici l'équipe AutoForward RDC concernant votre demande de devis pour le véhicule ${q.vehicleTitle} (Port : ${q.destinationPort}). Nous avons bien votre dossier !`;
    return encodeURIComponent(text);
  }

  simulatePriceDropForAlert(alertId: string) {
    this.priceAlertService.simulatePriceDropForAlert(alertId);
    this.feedbackNotice.set({
      type: 'success',
      text: "Baisse de prix simulée avec succès ! L'email de notification automatique a été généré.",
    });
  }

  encodeWhatsappPromo(alert: PriceDropAlert): string {
    const text = `Bonjour, nous avons une opportunité et une réduction exclusive sur votre recherche de ${alert.make} ${alert.model} chez AutoForward Export RDC ! Voulez-vous recevoir la fiche technique et le devis CIF ?`;
    return encodeURIComponent(text);
  }
}
