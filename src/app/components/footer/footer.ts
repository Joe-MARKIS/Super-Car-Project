import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { PriceAlertService } from '../../services/price-alert';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <!-- Top Newsletter Bar in Dark Black & Red -->
    <div class="bg-[#181818] text-white border-t-2 border-red-600 py-6 px-4">
      <div class="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-black uppercase tracking-wide text-white flex items-center gap-2">
            <mat-icon class="text-red-500 scale-90">mail</mat-icon>
            <span>{{ lang.t('newsletterTitle') }}</span>
          </h3>
          <p class="text-xs text-zinc-400 mt-1">
            {{ lang.t('newsletterDesc') }}
          </p>
        </div>

        <div class="flex-1 max-w-md min-w-[280px]">
          <div class="flex items-center gap-1.5">
            <input
              type="email"
              [value]="newsletterEmail()"
              (input)="onEmailInput($event)"
              placeholder="Adresse e-mail..."
              class="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white outline-hidden focus:border-red-500"
            />
            <button
              type="button"
              (click)="subscribeNewsletter()"
              class="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-5 py-2 rounded text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              {{ lang.t('subscribeBtn') }}
            </button>
          </div>
          <div class="text-[10px] text-zinc-500 mt-1">
            {{ lang.t('newsletterDisclaimer') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer Body in Pure Deep Charcoal (#121212) -->
    <footer class="bg-[#121212] text-zinc-400 text-xs border-t border-zinc-800">
      <div class="max-w-[1440px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <!-- Col 1: Brand & Headquarters Info -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center gap-1.5">
            <div class="w-7 h-7 bg-red-600 rounded flex items-center justify-center font-black text-white text-base">
              A
            </div>
            <div class="font-black text-xl tracking-tighter text-white">
              AUTO<span class="text-red-600">FORWARD</span>
            </div>
          </div>

          <p class="text-zinc-400 text-xs leading-relaxed max-w-sm">
            AutoForward Global Export Co., Ltd est le leader japonais et dubaïote spécialisé dans l'exportation maritime directe de véhicules d'occasion vers la République Démocratique du Congo (ports de Matadi et Boma) et toute l'Afrique Centrale.
          </p>

          <div class="space-y-1.5 text-zinc-300 text-xs">
            <div class="flex items-center gap-2">
              <mat-icon class="text-red-500 text-sm scale-90">location_on</mat-icon>
              <span>1-32-2 Kojimacho, Chofu City, Tokyo 182-0026, Japan</span>
            </div>
            <div class="flex items-center gap-2">
              <mat-icon class="text-red-500 text-sm scale-90">phone</mat-icon>
              <span>+81 42 440 3440 (Tokyo Head Office)</span>
            </div>
            <div class="flex items-center gap-2">
              <mat-icon class="text-red-500 text-sm scale-90">email</mat-icon>
              <span>top&#64;autoforward.cd / sales&#64;autoforward.com</span>
            </div>
            <div class="flex items-center gap-2">
              <mat-icon class="text-emerald-500 text-sm scale-90">chat</mat-icon>
              <span>WhatsApp Kinshasa Support: +243 81 440 3440</span>
            </div>
          </div>
        </div>

        <!-- Col 2: Useful Links -->
        <div class="space-y-3">
          <h4 class="font-extrabold text-white text-xs uppercase tracking-wider border-b border-zinc-800 pb-1.5">
            {{ lang.t('footerAbout') }}
          </h4>
          <ul class="space-y-2 text-zinc-400">
            <li><a href="#how-to-buy" class="hover:text-white transition-colors">{{ lang.t('howToBuyLink') }}</a></li>
            <li><a href="#payment-methods" class="hover:text-white transition-colors">{{ lang.t('paymentLink') }}</a></li>
            <li><a href="#shipping" class="hover:text-white transition-colors">{{ lang.t('shippingLink') }}</a></li>
            <li><a href="#inspection" class="hover:text-white transition-colors">Inspection &amp; Certificat JEVIC</a></li>
            <li><a href="#drc-ports" class="hover:text-white transition-colors">Ports RDC (Matadi, Boma, Dar)</a></li>
            <li><a href="#faq" class="hover:text-white transition-colors">Questions Fréquentes (FAQ)</a></li>
          </ul>
        </div>

        <!-- Col 3: Popular Makes -->
        <div class="space-y-3">
          <h4 class="font-extrabold text-white text-xs uppercase tracking-wider border-b border-zinc-800 pb-1.5">
            {{ lang.t('footerServices') }}
          </h4>
          <ul class="space-y-2 text-zinc-400">
            <li><a href="#toyota" class="hover:text-white transition-colors">Toyota Japon &amp; Dubaï</a></li>
            <li><a href="#nissan" class="hover:text-white transition-colors">Nissan X-Trail &amp; Patrol</a></li>
            <li><a href="#mercedes" class="hover:text-white transition-colors">Mercedes-Benz Classe V &amp; C</a></li>
            <li><a href="#honda" class="hover:text-white transition-colors">Honda CR-V &amp; Fit</a></li>
            <li><a href="#suv" class="hover:text-white transition-colors">4x4 &amp; Tout-terrains RDC</a></li>
            <li><a href="#commercial" class="hover:text-white transition-colors">Camions &amp; Minibus Hiace</a></li>
          </ul>
        </div>

        <!-- Col 4: Trust, Security & Partners -->
        <div class="space-y-3">
          <h4 class="font-extrabold text-white text-xs uppercase tracking-wider border-b border-zinc-800 pb-1.5">
            Garanties &amp; Sécurité
          </h4>
          <div class="space-y-2 text-zinc-400">
            <div class="flex items-center gap-2">
              <mat-icon class="text-amber-400 scale-75">verified_user</mat-icon>
              <span>Membre certifié JUMVEA #084</span>
            </div>
            <div class="flex items-center gap-2">
              <mat-icon class="text-amber-400 scale-75">security</mat-icon>
              <span>Paiements bancaires sécurisés SWIFT</span>
            </div>
            <div class="flex items-center gap-2">
              <mat-icon class="text-amber-400 scale-75">lock</mat-icon>
              <span>Protection acheteur 100% garantie</span>
            </div>
            <div class="flex items-center gap-2">
              <mat-icon class="text-amber-400 scale-75">local_police</mat-icon>
              <span>Contrôle technique pré-exportation</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Legal & Copyright Bar -->
      <div class="border-t border-zinc-800/80 bg-[#0A0A0A] py-4 px-4 text-center text-zinc-400 text-xs">
        <p>© 2026 AutoForward Co., Ltd. {{ lang.t('allRightsReserved') }}</p>
        <div class="mt-1 flex items-center justify-center gap-3 text-[11px] text-zinc-400">
          <a href="#privacy" class="hover:text-white transition-colors">{{ lang.t('privacyPolicy') }}</a>
          <span>·</span>
          <a href="#terms" class="hover:text-white transition-colors">{{ lang.t('termsConditions') }}</a>
          <span>·</span>
          <a href="#cookies" class="hover:text-white transition-colors">{{ lang.t('cookieLink') }}</a>
          <span>·</span>
          <a href="#sitemap" class="hover:text-white transition-colors">{{ lang.t('sitemapLink') }}</a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly lang = inject(LanguageService);
  readonly priceAlertService = inject(PriceAlertService);

  readonly newsletterEmail = signal<string>('');

  onEmailInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.newsletterEmail.set(val);
  }

  subscribeNewsletter() {
    const email = this.newsletterEmail().trim();
    if (!email || !email.includes('@')) {
      this.priceAlertService.showToast({
        type: 'info',
        title: 'Adresse E-mail Requise',
        message: 'Veuillez entrer une adresse e-mail valide pour la newsletter.',
      });
      return;
    }

    this.priceAlertService.showToast({
      type: 'success',
      title: 'Inscription Confirmée !',
      message:
        this.lang.currentLang() === 'fr'
          ? `Merci ! Votre inscription avec ${email} a bien été enregistrée. Vous recevrez nos meilleures offres chaque semaine.`
          : `Thank you! ${email} has been subscribed to our weekly car export offers.`,
    });
    this.newsletterEmail.set('');
  }
}
