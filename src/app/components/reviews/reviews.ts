import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';
import { CustomerReview } from '../../models/vehicle';

interface BuyerReviewWithPhoto extends CustomerReview {
  carPhotoUrl: string;
  deliveryPort: string;
}

@Component({
  selector: 'app-reviews',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <section id="reviews" class="my-6 bg-white rounded-lg border border-zinc-200 p-5 shadow-xs">
      <!-- Section Header -->
      <div class="flex flex-wrap items-center justify-between pb-3 mb-4 border-b-2 border-red-600 gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center">
              <mat-icon class="text-sm">verified_user</mat-icon>
            </span>
            <h2 class="text-base md:text-lg font-black text-zinc-900 uppercase tracking-tight">
              {{ lang.t('popularSearchesTitle') }}
            </h2>
          </div>
          <div class="flex items-center gap-2 mt-1 text-xs text-zinc-600">
            <div class="flex text-amber-500">
              <mat-icon class="text-sm scale-90">star</mat-icon>
              <mat-icon class="text-sm scale-90">star</mat-icon>
              <mat-icon class="text-sm scale-90">star</mat-icon>
              <mat-icon class="text-sm scale-90">star</mat-icon>
              <mat-icon class="text-sm scale-90">star</mat-icon>
            </div>
            <strong class="font-black text-zinc-900">4.9 / 5</strong>
            <span>·</span>
            <span class="text-zinc-600">Plus de 22 800 clients livrés avec succès</span>
          </div>
        </div>

        <button
          type="button"
          (click)="openReviewModal()"
          class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
        >
          <mat-icon class="text-xs scale-75">rate_review</mat-icon>
          <span>Laisser un avis vérifié</span>
        </button>
      </div>

      <!-- Part 1: Popular Searches / Quick Search Filters (Pills) -->
      <div class="mb-5 bg-zinc-50 border border-zinc-200 rounded-lg p-3">
        <div class="flex items-center gap-1.5 mb-2 text-xs font-extrabold text-zinc-800 uppercase tracking-tight">
          <mat-icon class="text-xs text-red-600 scale-90">travel_explore</mat-icon>
          <span>Recherches les plus fréquentes en {{ lang.selectedCountry().name }} :</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          @for (tag of popularSearchTags(); track tag.label) {
            <button
              type="button"
              (click)="applySearchTag(tag.keyword, tag.category)"
              class="bg-white hover:bg-zinc-900 hover:text-white border border-zinc-200 text-zinc-800 text-xs font-medium px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>{{ tag.label }}</span>
              <span class="text-[10px] text-zinc-400 group-hover:text-zinc-300 font-mono">({{ tag.count }})</span>
            </button>
          }
        </div>
      </div>

      <!-- In-UI Feedback message when user clicks "Laisser un avis" -->
      @if (showReviewNotice()) {
        <div class="mb-4 bg-zinc-900 text-white p-3 rounded-lg text-xs flex items-center justify-between animate-fadeIn">
          <div class="flex items-center gap-2">
            <mat-icon class="text-emerald-400 text-sm">info</mat-icon>
            <span>
              Pour soumettre un avis avec photos de votre véhicule réceptionné au port, connectez-vous à votre Espace Client ou contactez votre agent commercial.
            </span>
          </div>
          <button
            type="button"
            (click)="showReviewNotice.set(false)"
            class="text-zinc-400 hover:text-white p-1 cursor-pointer"
          >
            <mat-icon class="text-sm">close</mat-icon>
          </button>
        </div>
      }

      <!-- Part 2: Customer Reviews with Real Vehicle Delivery Photos (Using User-Provided Images) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        @for (rev of enhancedReviews(); track rev.id) {
          <div class="border border-zinc-200 rounded-lg p-3.5 bg-white hover:border-red-600 hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <!-- Top Row: Photo + Vehicle Name + Rating -->
              <div class="flex gap-3 mb-3">
                <div class="relative w-24 h-20 shrink-0 rounded overflow-hidden border border-zinc-200 bg-zinc-900">
                  <img
                    [src]="rev.carPhotoUrl"
                    [alt]="rev.modelPurchased"
                    referrerpolicy="no-referrer"
                    class="w-full h-full object-cover"
                  />
                  <span class="absolute bottom-0 inset-x-0 bg-zinc-900/90 text-white text-[8px] text-center font-bold uppercase tracking-wider py-0.5">
                    Photo Reçue
                  </span>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-1">
                    <h3 class="font-black text-xs md:text-sm text-zinc-900 line-clamp-1">
                      {{ rev.title }}
                    </h3>
                    <span class="text-base" [title]="rev.country">{{ rev.countryFlag }}</span>
                  </div>

                  <div class="flex items-center gap-1 text-amber-500 text-xs my-0.5">
                    @for (star of [1,2,3,4,5]; track star) {
                      <mat-icon class="text-xs scale-90">star</mat-icon>
                    }
                    <span class="ml-1 text-[10px] text-zinc-400 font-medium">{{ rev.date }}</span>
                  </div>

                  <div class="text-[11px] text-zinc-600 flex items-center gap-1.5 flex-wrap">
                    <span><strong>{{ rev.authorName }}</strong></span>
                    <span class="text-zinc-400">·</span>
                    <span class="text-red-700 font-bold">{{ rev.deliveryPort }}</span>
                  </div>
                </div>
              </div>

              <!-- Testimonial Content -->
              <p class="text-xs text-zinc-700 leading-relaxed italic bg-zinc-50 p-2.5 rounded border border-zinc-100 mb-3">
                "{{ rev.comment }}"
              </p>
            </div>

            <!-- Footer: Vehicle Model Link & Likes -->
            <div class="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
              <button
                type="button"
                (click)="searchModel(rev.modelPurchased)"
                class="text-zinc-900 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer text-[11px]"
              >
                <mat-icon class="text-xs text-red-600 scale-75">directions_car</mat-icon>
                <span>{{ rev.modelPurchased }}</span>
              </button>

              <button
                type="button"
                (click)="likeReview(rev)"
                [class.text-red-600]="vehicleService.isReviewLiked(rev.id)"
                [class.bg-red-50]="vehicleService.isReviewLiked(rev.id)"
                class="flex items-center gap-1 hover:text-zinc-900 transition-colors cursor-pointer bg-zinc-100 hover:bg-zinc-200 px-2 py-0.5 rounded text-[11px]"
              >
                <mat-icon class="text-xs scale-75" [class.text-red-600]="vehicleService.isReviewLiked(rev.id)">thumb_up</mat-icon>
                <span>{{ vehicleService.isReviewLiked(rev.id) ? 'Utile' : lang.t('helpful') }}</span>
                <span class="font-bold text-zinc-700 font-mono">({{ rev.likes + (vehicleService.isReviewLiked(rev.id) ? 1 : 0) }})</span>
              </button>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class ReviewsComponent {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);
  readonly showReviewNotice = signal<boolean>(false);

  readonly popularSearchTags = computed(() => [
    { label: 'Toyota Prado TX', keyword: 'Prado', category: 'SUV', count: 48 },
    { label: 'Hilux Double Cab 4x4', keyword: 'Hilux', category: 'Pick up', count: 36 },
    { label: 'Canter Benne Basculante', keyword: 'Canter', category: 'Camion', count: 29 },
    { label: 'Corolla Axio Essence', keyword: 'Corolla', category: 'Berline', count: 64 },
    { label: 'Mercedes C200 Avantgarde', keyword: 'C-Class', category: 'Berline', count: 22 },
    { label: '4WD / 4x4 Tout-Terrain', keyword: '', category: 'SUV', count: 85 },
    { label: 'Conduite à Gauche (LHD)', keyword: 'Left', category: '', count: 120 },
    { label: 'Moins de $5 000 USD', keyword: '', category: '', count: 54 },
  ]);

  readonly enhancedReviews = computed<BuyerReviewWithPhoto[]>(() => [
    {
      id: 'rev-01',
      authorName: 'Jean-Claude Mutombo',
      country: 'R.D. Congo (Kinshasa)',
      countryFlag: '🇨🇩',
      date: '28/Sep/2026',
      title: 'Prado TX reçu en parfait état au Port de Matadi !',
      comment: 'Véhicule parfaitement conforme aux photos de l\'inspection. Le moteur démarre au quart de tour, climatisation impeccable et le suivi du navire était très précis.',
      modelPurchased: 'TOYOTA Land Cruiser Prado',
      chassisCode: 'GDJ150W-004819',
      rating: 5,
      likes: 24,
      carPhotoUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
      deliveryPort: 'Port de Matadi (RDC)',
    },
    {
      id: 'rev-02',
      authorName: 'Éric Kabamba',
      country: 'R.D. Congo (Lubumbashi)',
      countryFlag: '🇨🇩',
      date: '19/Sep/2026',
      title: 'Hilux 4x4 robuste pour mon exploitation minière',
      comment: 'Deuxième achat chez vous. Le pick-up Hilux est arrivé via Dar es Salaam sans aucun dégât. Délais respectés et rapport qualité/prix imbattable.',
      modelPurchased: 'TOYOTA Hilux Double Cab Revo',
      chassisCode: 'GUN125-882194',
      rating: 5,
      likes: 31,
      carPhotoUrl: '/assets/images/car_toyota_hilux_pickup_1791895943609.jpg',
      deliveryPort: 'Transit Dar es Salaam -> Lubumbashi',
    },
    {
      id: 'rev-03',
      authorName: 'Moïse Bondo',
      country: 'R.D. Congo (Goma)',
      countryFlag: '🇨🇩',
      date: '04/Sep/2026',
      title: 'Camion Canter benne parfait pour nos chantiers',
      comment: 'La benne hydraulique fonctionne à merveille, pneus neufs et moteur très sain. Très bonne communication avec l\'équipe commerciale tout au long du transport.',
      modelPurchased: 'MITSUBISHI Canter Dump Truck',
      chassisCode: 'FBA00-519208',
      rating: 5,
      likes: 18,
      carPhotoUrl: '/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg',
      deliveryPort: 'Transit Mombasa -> Goma',
    },
    {
      id: 'rev-04',
      authorName: 'Patrick Lukusa',
      country: 'R.D. Congo (Kinshasa)',
      countryFlag: '🇨🇩',
      date: '22/Aug/2026',
      title: 'Mercedes C200 Avantgarde luxueuse et très propre',
      comment: 'Intérieur cuir impeccable, carrosserie sans rayures. Dédouanement rapide à Boma avec tous les documents originaux DHL reçus à temps.',
      modelPurchased: 'MERCEDES-BENZ C-Class C200',
      chassisCode: 'WDD205-042817',
      rating: 5,
      likes: 14,
      carPhotoUrl: '/assets/images/car_mercedes_c_class_1791895943618.jpg',
      deliveryPort: 'Port de Boma (RDC)',
    },
  ]);

  likeReview(review: CustomerReview) {
    this.vehicleService.toggleLikeReview(review.id);
  }

  searchModel(model: string) {
    const brand = model.split(' ')[0];
    this.vehicleService.setFilter({ keyword: brand });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  applySearchTag(keyword: string, category: string) {
    this.vehicleService.setFilter({
      keyword,
      category: category || '',
    });
    const el = document.getElementById('catalog-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  openReviewModal() {
    this.showReviewNotice.set(true);
  }
}
