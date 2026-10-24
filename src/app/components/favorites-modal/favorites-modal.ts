import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { VehicleService } from '../../services/vehicle';
import { LanguageService } from '../../services/language';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-favorites-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (vehicleService.isFavoritesModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <!-- Backdrop -->
        <button
          type="button"
          (click)="vehicleService.closeFavoritesModal()"
          aria-label="Fermer la fenêtre des favoris"
          class="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity border-0 p-0 cursor-pointer w-full h-full"
        ></button>

        <!-- Modal Dialog -->
        <div
          role="dialog"
          aria-modal="true"
          class="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border-2 border-red-600/30 overflow-hidden z-10 flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-200"
        >
          <!-- Header (Signature Red & Black styling) -->
          <div class="bg-gradient-to-r from-[#181818] via-[#222222] to-[#181818] text-white p-4 border-b-2 border-[#DC2626] flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                <mat-icon class="scale-90 text-white">favorite</mat-icon>
              </div>
              <div>
                <h2 class="text-base font-black tracking-tight flex items-center gap-2 text-white">
                  <span>Mes Favoris &amp; Éléments Likés</span>
                  <span class="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {{ totalItems() }}
                  </span>
                </h2>
                <p class="text-xs text-zinc-400">
                  Consultez rapidement vos véhicules présélectionnés et vos avis clients sauvegardés
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="vehicleService.closeFavoritesModal()"
              aria-label="Fermer"
              class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <mat-icon class="scale-90">close</mat-icon>
            </button>
          </div>

          <!-- Tab Navigation Switcher -->
          <div class="bg-zinc-100 px-4 pt-2 border-b border-zinc-200 flex items-center gap-2 shrink-0">
            <button
              type="button"
              (click)="activeTab.set('vehicles')"
              [class.bg-white]="activeTab() === 'vehicles'"
              [class.text-red-700]="activeTab() === 'vehicles'"
              [class.border-t-2]="activeTab() === 'vehicles'"
              [class.border-red-600]="activeTab() === 'vehicles'"
              [class.text-zinc-600]="activeTab() !== 'vehicles'"
              class="px-4 py-2 font-black text-xs rounded-t border-x border-zinc-200 -mb-[1px] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <mat-icon class="text-sm scale-90 text-red-600">directions_car</mat-icon>
              <span>Véhicules Favoris ({{ vehicleService.favoriteVehicles().length }})</span>
            </button>

            <button
              type="button"
              (click)="activeTab.set('reviews')"
              [class.bg-white]="activeTab() === 'reviews'"
              [class.text-red-700]="activeTab() === 'reviews'"
              [class.border-t-2]="activeTab() === 'reviews'"
              [class.border-red-600]="activeTab() === 'reviews'"
              [class.text-zinc-600]="activeTab() !== 'reviews'"
              class="px-4 py-2 font-black text-xs rounded-t border-x border-zinc-200 -mb-[1px] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <mat-icon class="text-sm scale-90 text-amber-500">thumb_up</mat-icon>
              <span>Avis &amp; Témoignages Likés ({{ vehicleService.likedReviews().length }})</span>
            </button>
          </div>

          <!-- Body Content Area -->
          <div class="p-4 overflow-y-auto flex-1 space-y-3 bg-[#FAFAFA]">
            @if (activeTab() === 'vehicles') {
              <!-- Vehicles Tab -->
              @if (vehicleService.favoriteVehicles().length > 0) {
                <div class="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 text-xs">
                  <div class="text-zinc-600 font-semibold">
                    <strong class="text-zinc-900">{{ vehicleService.favoriteVehicles().length }}</strong> véhicules dans votre liste
                  </div>
                  <button
                    type="button"
                    (click)="vehicleService.clearAllFavorites()"
                    class="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer hover:underline text-[11px]"
                  >
                    <mat-icon class="text-xs scale-75">delete_outline</mat-icon>
                    <span>Tout vider</span>
                  </button>
                </div>

                <div class="space-y-3">
                  @for (veh of vehicleService.favoriteVehicles(); track veh.id) {
                    <div class="bg-white border border-zinc-200 rounded-lg p-3 shadow-xs hover:border-red-300 transition-all flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                      <!-- Left: Image & Specs -->
                      <div class="flex items-center gap-3 min-w-0 flex-1">
                        <div class="relative w-24 h-18 sm:w-28 sm:h-20 rounded bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                          <img
                            [src]="veh.imageUrl"
                            [alt]="veh.model"
                            class="w-full h-full object-cover"
                            referrerpolicy="no-referrer"
                          />
                          <span class="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                            {{ veh.year }}
                          </span>
                        </div>

                        <div class="min-w-0 flex-1">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-1 rounded">
                              {{ veh.refNo }}
                            </span>
                            <span class="text-xs">{{ veh.originFlag }}</span>
                            <span class="text-[10px] text-zinc-600 font-semibold">{{ veh.stockCountry }}</span>
                            @if (veh.discountPercent) {
                              <span class="bg-red-600 text-white text-[9px] font-black px-1 rounded">
                                -{{ veh.discountPercent }}%
                              </span>
                            }
                          </div>

                          <h3 class="font-black text-sm text-blue-900 truncate mt-0.5">
                            {{ veh.make }} {{ veh.model }}
                          </h3>

                          <div class="flex items-center gap-2 text-[11px] text-zinc-500 mt-1 flex-wrap">
                            <span>{{ veh.mileageKm.toLocaleString() }} km</span>
                            <span>•</span>
                            <span>{{ veh.transmission }}</span>
                            <span>•</span>
                            <span class="font-bold text-zinc-700">{{ veh.steering === 'Left Hand Drive' ? 'Volant Gauche (LHD)' : 'Volant Droite (RHD)' }}</span>
                            <span>•</span>
                            <span>{{ veh.fuel }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Right: Pricing & Actions -->
                      <div class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100 shrink-0">
                        <div class="text-left sm:text-right">
                          <div class="text-[10px] text-zinc-500">Prix FOB direct :</div>
                          <div class="text-base font-black text-red-600 tabular-nums leading-tight">
                            {{ lang.formatPrice(veh.priceUsd) }}
                          </div>
                          <div class="text-[10px] text-zinc-500 font-mono">
                            CIF Matadi : <strong class="text-zinc-800">{{ lang.formatPrice(vehicleService.calculateTotalCif(veh)) }}</strong>
                          </div>
                        </div>

                        <div class="flex items-center gap-1.5">
                          <button
                            type="button"
                            (click)="viewDetails(veh)"
                            class="bg-[#DC2626] hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <mat-icon class="text-xs scale-75">visibility</mat-icon>
                            <span>Détails</span>
                          </button>

                          <button
                            type="button"
                            (click)="requestQuote(veh)"
                            class="bg-[#EA580C] hover:bg-orange-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <mat-icon class="text-xs scale-75">receipt_long</mat-icon>
                            <span>Devis</span>
                          </button>

                          <button
                            type="button"
                            (click)="vehicleService.removeFavorite(veh.id)"
                            title="Retirer des favoris"
                            class="p-1.5 rounded bg-zinc-100 hover:bg-red-100 text-zinc-600 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <mat-icon class="text-xs scale-90">delete</mat-icon>
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <!-- Empty State -->
                <div class="py-12 text-center text-zinc-500">
                  <div class="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
                    <mat-icon class="text-3xl">favorite_border</mat-icon>
                  </div>
                  <h3 class="font-bold text-base text-zinc-800">Aucun véhicule favori pour le moment</h3>
                  <p class="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    Cliquez sur le cœur à côté de n'importe quel véhicule du catalogue pour l'ajouter à vos favoris et le retrouver ici.
                  </p>
                  <button
                    type="button"
                    (click)="exploreCatalog()"
                    class="mt-4 bg-[#DC2626] hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold transition-colors cursor-pointer"
                  >
                    Explorer le catalogue des véhicules
                  </button>
                </div>
              }
            } @else {
              <!-- Reviews Tab (Elements Likés) -->
              @if (vehicleService.likedReviews().length > 0) {
                <div class="space-y-3">
                  @for (rev of vehicleService.likedReviews(); track rev.id) {
                    <div class="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-xs">
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <span class="text-base">{{ rev.countryFlag }}</span>
                          <div>
                            <div class="font-black text-xs text-zinc-900">{{ rev.authorName }}</div>
                            <div class="text-[10px] text-zinc-500">{{ rev.country }} · {{ rev.date }}</div>
                          </div>
                        </div>

                        <!-- 5 Star rating -->
                        <div class="flex items-center gap-0.5 text-amber-500">
                          <mat-icon class="text-xs scale-90">star</mat-icon>
                          <mat-icon class="text-xs scale-90">star</mat-icon>
                          <mat-icon class="text-xs scale-90">star</mat-icon>
                          <mat-icon class="text-xs scale-90">star</mat-icon>
                          <mat-icon class="text-xs scale-90">star</mat-icon>
                        </div>
                      </div>

                      <div class="font-bold text-xs text-zinc-900 mb-1">
                        {{ rev.title }}
                      </div>
                      <p class="text-xs text-zinc-700 italic leading-relaxed">
                        "{{ rev.comment }}"
                      </p>

                      <div class="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                        <span class="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                          Modèle acheté : {{ rev.modelPurchased }}
                        </span>

                        <button
                          type="button"
                          (click)="vehicleService.toggleLikeReview(rev.id)"
                          class="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <mat-icon class="text-xs scale-75">thumb_up</mat-icon>
                          <span>Liké ({{ rev.likes + 1 }})</span>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="py-12 text-center text-zinc-500">
                  <div class="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                    <mat-icon class="text-3xl">thumb_up_off_alt</mat-icon>
                  </div>
                  <h3 class="font-bold text-base text-zinc-800">Aucun avis client liké pour le moment</h3>
                  <p class="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    Consultez la section des témoignages d'acheteurs en RDC et cliquez sur "J'aime" pour sauvegarder leurs retours d'expérience.
                  </p>
                </div>
              }
            }
          </div>

          <!-- Modal Footer -->
          <div class="bg-zinc-50 p-3.5 border-t border-zinc-200 flex items-center justify-between shrink-0">
            <div class="text-[11px] text-zinc-600 hidden sm:block">
              <span class="text-emerald-700 font-bold">✓ Livraison maritime garantie</span> vers Matadi, Boma, Mombasa &amp; Dar es Salaam
            </div>

            <div class="flex items-center gap-2 ml-auto">
              <button
                type="button"
                (click)="vehicleService.closeFavoritesModal()"
                class="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs rounded transition-colors cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="button"
                (click)="exploreCatalog()"
                class="px-4 py-2 bg-[#DC2626] hover:bg-red-700 text-white font-black text-xs rounded transition-colors cursor-pointer flex items-center gap-1"
              >
                <mat-icon class="text-xs scale-75">search</mat-icon>
                <span>Parcourir le stock</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class FavoritesModalComponent {
  readonly vehicleService = inject(VehicleService);
  readonly lang = inject(LanguageService);

  readonly activeTab = signal<'vehicles' | 'reviews'>('vehicles');

  totalItems() {
    return this.vehicleService.favoriteVehicles().length + this.vehicleService.likedReviews().length;
  }

  viewDetails(veh: Vehicle) {
    this.vehicleService.closeFavoritesModal();
    this.vehicleService.selectVehicle(veh);
  }

  requestQuote(veh: Vehicle) {
    this.vehicleService.closeFavoritesModal();
    this.vehicleService.openQuoteModal(veh);
  }

  exploreCatalog() {
    this.vehicleService.closeFavoritesModal();
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
