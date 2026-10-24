import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';
import { LanguageService } from '../../services/language';
import { VehicleService } from '../../services/vehicle';
import { PriceAlertService } from '../../services/price-alert';

@Component({
  selector: 'app-auth-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    @if (authService.isAuthModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <!-- Backdrop -->
        <button
          type="button"
          (click)="authService.closeModal()"
          aria-label="Fermer la fenêtre d'authentification"
          class="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity border-0 p-0 cursor-pointer w-full h-full"
        ></button>

        <!-- Modal Dialog -->
        <div
          role="dialog"
          aria-modal="true"
          class="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border-2 border-red-600/30 overflow-hidden z-10 flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200"
        >
          <!-- Modal Header (AutoForward Red & Black Styling) -->
          <div class="bg-gradient-to-r from-[#181818] via-[#242424] to-[#181818] text-white p-4 border-b-2 border-[#DC2626] flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                @if (authService.currentUser()) {
                  <mat-icon class="scale-95 text-white">account_circle</mat-icon>
                } @else if (authService.authMode() === 'login') {
                  <mat-icon class="scale-95 text-white">login</mat-icon>
                } @else {
                  <mat-icon class="scale-95 text-white">person_add</mat-icon>
                }
              </div>
              <div>
                <h2 class="text-base font-black tracking-tight text-white flex items-center gap-2">
                  @if (authService.currentUser()) {
                    <span>Mon Espace Client AutoForward</span>
                  } @else if (authService.authMode() === 'login') {
                    <span>Connexion à votre Compte</span>
                  } @else {
                    <span>Création de Compte Client</span>
                  }
                </h2>
                <p class="text-xs text-zinc-400">
                  @if (authService.currentUser()) {
                    Gérez vos réservations, devis FOB/CIF et points de fidélité
                  } @else if (authService.authMode() === 'login') {
                    Accédez au suivi de vos expéditions et véhicules favoris
                  } @else {
                    Rejoignez les acheteurs de RDC et bénéficiez de remises exclusives
                  }
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="authService.closeModal()"
              aria-label="Fermer"
              class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <mat-icon class="scale-90">close</mat-icon>
            </button>
          </div>

          <!-- Alert / Status Notice Banner -->
          @if (authService.statusMessage(); as msg) {
            <div
              class="px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b"
              [class.bg-emerald-50]="msg.type === 'success'"
              [class.text-emerald-800]="msg.type === 'success'"
              [class.border-emerald-200]="msg.type === 'success'"
              [class.bg-red-50]="msg.type === 'error'"
              [class.text-red-800]="msg.type === 'error'"
              [class.border-red-200]="msg.type === 'error'"
            >
              <mat-icon class="text-sm">
                {{ msg.type === 'success' ? 'check_circle' : 'error_outline' }}
              </mat-icon>
              <span>{{ msg.text }}</span>
            </div>
          }

          <!-- If User is Logged In: Show Account Profile Card -->
          @if (authService.currentUser(); as user) {
            <div class="p-5 space-y-4 overflow-y-auto">
              <!-- Profile Header Card -->
              <div class="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center gap-4">
                <div
                  class="w-14 h-14 rounded-full text-white font-black text-xl flex items-center justify-center shadow-md shrink-0"
                  [class.bg-gradient-to-tr]="user.role !== 'admin'"
                  [class.from-red-600]="user.role !== 'admin'"
                  [class.to-amber-500]="user.role !== 'admin'"
                  [class.bg-black]="user.role === 'admin'"
                  [class.border-2]="user.role === 'admin'"
                  [class.border-red-600]="user.role === 'admin'"
                >
                  @if (user.role === 'admin') {
                    <mat-icon class="scale-110 text-red-500">admin_panel_settings</mat-icon>
                  } @else {
                    {{ user.fullName.charAt(0).toUpperCase() }}
                  }
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="font-bold text-zinc-900 text-base truncate">{{ user.fullName }}</h3>
                    @if (user.role === 'admin') {
                      <span class="bg-black text-red-400 text-[10px] font-black px-2 py-0.5 rounded border border-red-600 uppercase tracking-wider">
                        👑 PROPRIÉTAIRE INDÉPENDANT
                      </span>
                    } @else {
                      <span class="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded border border-amber-300 uppercase">
                        {{ user.memberTier }}
                      </span>
                    }
                  </div>
                  <p class="text-xs text-zinc-500 truncate">{{ user.email }}</p>
                  @if (user.city) {
                    <p class="text-xs text-zinc-600 font-medium flex items-center gap-1 mt-0.5">
                      <mat-icon class="text-xs scale-75 text-zinc-400">location_on</mat-icon>
                      <span>{{ user.city }}, {{ user.country }}</span>
                    </p>
                  }
                </div>
              </div>

              <!-- IF ADMIN / PROPRIETAIRE INDEPENDANT -->
              @if (user.role === 'admin') {
                <div class="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black text-white rounded-xl p-4 border border-red-600/50 space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-red-500 text-base">shield</mat-icon>
                      <h4 class="font-black text-xs uppercase tracking-wider text-white">Console d'Indépendance Propriétaire</h4>
                    </div>
                    <span class="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Accès Maître
                    </span>
                  </div>

                  <p class="text-[11px] text-zinc-300 leading-normal">
                    Vous pilotez la plateforme en toute autonomie : ajout de véhicules, modification directe des prix FOB, gestion des devis reçus en RDC, ajustement des frais de fret maritime et des marges.
                  </p>

                  <div class="grid grid-cols-3 gap-2 text-center pt-1">
                    <div class="bg-zinc-900/90 p-2 rounded border border-zinc-800">
                      <div class="text-[10px] text-zinc-400 font-bold">Véhicules</div>
                      <div class="text-sm font-black text-white font-mono">{{ vehicleService.vehicles().length }}</div>
                    </div>
                    <div class="bg-zinc-900/90 p-2 rounded border border-zinc-800">
                      <div class="text-[10px] text-zinc-400 font-bold">Devis RDC</div>
                      <div class="text-sm font-black text-red-400 font-mono">{{ vehicleService.adminQuotations().length }}</div>
                    </div>
                    <div class="bg-zinc-900/90 p-2 rounded border border-zinc-800">
                      <div class="text-[10px] text-zinc-400 font-bold">Marge</div>
                      <div class="text-sm font-black text-emerald-400 font-mono">{{ vehicleService.platformCommissionPercent() }}%</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    (click)="openAdminPanelFromModal()"
                    class="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-2.5 px-3 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <mat-icon class="text-sm">dashboard_customize</mat-icon>
                    <span>Ouvrir la Console d'Administration Indépendante</span>
                  </button>
                </div>
              } @else {
                <!-- IF CLIENT ACHETEUR -->
                <!-- Loyalty Points & Stats -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <div class="text-[11px] font-bold text-red-800 uppercase tracking-tight">Points de Fidélité</div>
                    <div class="text-xl font-black text-red-600 mt-0.5">{{ user.loyaltyPoints }} pts</div>
                    <div class="text-[10px] text-zinc-500">Valeur : {{ user.loyaltyPoints / 20 }}$ USD de remise</div>
                  </div>
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <div class="text-[11px] font-bold text-blue-800 uppercase tracking-tight">Véhicules Sauvegardés</div>
                    <div class="text-xl font-black text-blue-700 mt-0.5">{{ vehicleService.favoriteIds().length }}</div>
                    <div class="text-[10px] text-zinc-500">En liste de favoris</div>
                  </div>
                </div>

                <!-- My Orders (Suivi maritime RDC) -->
                @if (user.orders && user.orders.length > 0) {
                  <div class="space-y-1.5 pt-1">
                    <div class="text-[11px] font-black uppercase text-zinc-700 flex items-center gap-1">
                      <mat-icon class="text-xs text-red-600">directions_boat</mat-icon>
                      <span>Mes Commandes & Expéditions Maritimes ({{ user.orders.length }})</span>
                    </div>
                    <div class="space-y-1.5">
                      @for (ord of user.orders; track ord.id) {
                        <div class="bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs flex items-center justify-between">
                          <div>
                            <div class="font-bold text-zinc-900">{{ ord.vehicleTitle }}</div>
                            <div class="text-[10px] text-zinc-500">{{ ord.destinationPort }} • {{ ord.date }}</div>
                          </div>
                          <div class="text-right">
                            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              {{ ord.status }}
                            </span>
                            <div class="text-[11px] font-mono font-bold text-zinc-900 mt-0.5">&#36;{{ ord.price.toLocaleString() }}</div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }

                <!-- Quick Account Actions for Client -->
                <div class="space-y-2 pt-1">
                  <button
                    type="button"
                    (click)="openFavoritesFromModal()"
                    class="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <span class="flex items-center gap-2">
                      <mat-icon class="text-red-600 text-sm">favorite</mat-icon>
                      <span>Consulter mes favoris ({{ vehicleService.favoriteIds().length }})</span>
                    </span>
                    <mat-icon class="text-zinc-400 text-sm">chevron_right</mat-icon>
                  </button>

                  <button
                    type="button"
                    (click)="openPriceAlertsFromModal()"
                    class="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <span class="flex items-center gap-2">
                      <mat-icon class="text-amber-500 text-sm">notifications_active</mat-icon>
                      <span>Mes alertes baisse de prix ({{ priceAlertService.alerts().length }})</span>
                    </span>
                    <mat-icon class="text-zinc-400 text-sm">chevron_right</mat-icon>
                  </button>
                </div>
              }

              <!-- Logout Button -->
              <div class="pt-2">
                <button
                  type="button"
                  (click)="authService.logout()"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-300 hover:bg-red-50 text-red-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  <mat-icon class="text-sm">logout</mat-icon>
                  <span>Se déconnecter de ce compte</span>
                </button>
              </div>
            </div>
          } @else {
            <!-- Tab Switcher Header between Connexion & Inscription -->
            <div class="bg-zinc-100 p-1.5 border-b border-zinc-200 flex items-center gap-2 shrink-0">
              <button
                type="button"
                (click)="authService.switchToLogin()"
                [class.bg-white]="authService.authMode() === 'login'"
                [class.text-red-700]="authService.authMode() === 'login'"
                [class.font-black]="authService.authMode() === 'login'"
                [class.shadow-xs]="authService.authMode() === 'login'"
                [class.text-zinc-600]="authService.authMode() !== 'login'"
                class="flex-1 py-2 text-xs rounded font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-transparent"
                [class.border-zinc-200]="authService.authMode() === 'login'"
              >
                <mat-icon class="text-sm">login</mat-icon>
                <span>Connexion</span>
              </button>

              <button
                type="button"
                (click)="authService.switchToRegister()"
                [class.bg-white]="authService.authMode() === 'register'"
                [class.text-red-700]="authService.authMode() === 'register'"
                [class.font-black]="authService.authMode() === 'register'"
                [class.shadow-xs]="authService.authMode() === 'register'"
                [class.text-zinc-600]="authService.authMode() !== 'register'"
                class="flex-1 py-2 text-xs rounded font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-transparent"
                [class.border-zinc-200]="authService.authMode() === 'register'"
              >
                <mat-icon class="text-sm">person_add</mat-icon>
                <span>Inscription</span>
                <span class="bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded font-black">+10$</span>
              </button>
            </div>

            <!-- Modal Body Content -->
            <div class="p-5 overflow-y-auto space-y-4">
              <!-- ============================================== -->
              <!-- MODE 1 : FORMULAIRE DE CONNEXION              -->
              <!-- ============================================== -->
              @if (authService.authMode() === 'login') {
                <form [formGroup]="loginForm" (ngSubmit)="submitLogin()" class="space-y-4">
                  <div>
                    <label for="login-email" class="block text-xs font-bold text-zinc-700 mb-1">
                      Adresse e-mail ou Identifiant Client
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <mat-icon class="text-sm">mail</mat-icon>
                      </div>
                      <input
                        id="login-email"
                        type="email"
                        formControlName="email"
                        placeholder="exemple: client@gmail.com"
                        class="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-900 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label for="login-password" class="text-xs font-bold text-zinc-700">Mot de passe</label>
                      <button
                        type="button"
                        (click)="forgotPasswordNotice()"
                        class="text-[11px] text-red-600 hover:text-red-700 hover:underline font-semibold cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <mat-icon class="text-sm">lock</mat-icon>
                      </div>
                      <input
                        id="login-password"
                        [type]="showPassword() ? 'text' : 'password'"
                        formControlName="password"
                        placeholder="••••••••"
                        class="w-full pl-9 pr-10 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-900 transition-all"
                      />
                      <button
                        type="button"
                        (click)="toggleShowPassword()"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
                      >
                        <mat-icon class="text-sm">
                          {{ showPassword() ? 'visibility_off' : 'visibility' }}
                        </mat-icon>
                      </button>
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-xs text-zinc-600">
                    <label class="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        formControlName="rememberMe"
                        class="rounded border-zinc-300 text-red-600 focus:ring-red-500"
                      />
                      <span>Se souvenir de moi</span>
                    </label>
                  </div>

                  <!-- Primary Login Action Button -->
                  <button
                    type="submit"
                    class="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white py-2.5 px-4 rounded font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <mat-icon class="text-base">login</mat-icon>
                    <span>Se connecter</span>
                  </button>

                  <!-- 1-Click Fast Demo Logins -->
                  <div class="space-y-2 pt-1">
                    <button
                      type="button"
                      (click)="authService.loginDemoUser()"
                      class="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 py-2 px-3 rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <mat-icon class="text-xs text-amber-600">flash_on</mat-icon>
                      <span>Connexion Démo Client (Acheteur Kinshasa RDC)</span>
                    </button>

                    <button
                      type="button"
                      (click)="authService.loginAdminDemo()"
                      class="w-full bg-[#1A1A1A] hover:bg-black text-white border border-red-600 py-2 px-3 rounded font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <mat-icon class="text-xs text-red-500">admin_panel_settings</mat-icon>
                      <span>Connexion Propriétaire & Admin Indépendant (Plateforme)</span>
                    </button>
                  </div>

                  <!-- ======================================================== -->
                  <!-- EXPLICIT SWITCH BUTTON TO REGISTRATION (USER REQUIREMENT) -->
                  <!-- "avec un bouton Inscription qui mene au formulaire..."    -->
                  <!-- ======================================================== -->
                  <div class="mt-4 pt-4 border-t border-zinc-200 text-center">
                    <p class="text-xs text-zinc-600 mb-2">
                      Vous n'avez pas encore de compte AutoForward ?
                    </p>
                    <button
                      type="button"
                      (click)="authService.switchToRegister()"
                      class="w-full bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-black hover:to-zinc-900 text-white font-extrabold text-xs py-2.5 px-4 rounded border border-zinc-700 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:border-red-500"
                    >
                      <mat-icon class="text-sm text-red-400">person_add</mat-icon>
                      <span>Inscription — Créer un nouveau compte</span>
                    </button>
                  </div>
                </form>
              }

              <!-- ============================================== -->
              <!-- MODE 2 : FORMULAIRE D'INSCRIPTION             -->
              <!-- ============================================== -->
              @if (authService.authMode() === 'register') {
                <form [formGroup]="registerForm" (ngSubmit)="submitRegister()" class="space-y-3.5">
                  <!-- Registration Welcome Incentive Promo -->
                  <div class="bg-gradient-to-r from-amber-50 to-red-50 border border-amber-200/80 rounded-lg p-3 flex items-start gap-2.5">
                    <mat-icon class="text-amber-600 text-lg shrink-0 mt-0.5">card_giftcard</mat-icon>
                    <div class="text-[11px] text-amber-900">
                      <span class="font-black text-red-700">Bonus d'inscription :</span>
                      Recevez automatiquement <span class="font-bold underline">200 points fidélité (valeur 10 $ USD)</span> crédités sur votre compte pour votre 1ère importation maritime !
                    </div>
                  </div>

                  <div>
                    <label for="reg-fullname" class="block text-xs font-bold text-zinc-700 mb-1">
                      Nom complet ou Entreprise <span class="text-red-600">*</span>
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <mat-icon class="text-sm">person</mat-icon>
                      </div>
                      <input
                        id="reg-fullname"
                        type="text"
                        formControlName="fullName"
                        placeholder="ex: Jean-Pierre Mutombo"
                        class="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-900 transition-all"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label for="reg-email" class="block text-xs font-bold text-zinc-700 mb-1">
                        Adresse e-mail <span class="text-red-600">*</span>
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                          <mat-icon class="text-sm">mail</mat-icon>
                        </div>
                        <input
                          id="reg-email"
                          type="email"
                          formControlName="email"
                          placeholder="client@domaine.cd"
                          class="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-900 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label for="reg-phone" class="block text-xs font-bold text-zinc-700 mb-1">
                        Téléphone / WhatsApp <span class="text-red-600">*</span>
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                          <mat-icon class="text-sm">phone</mat-icon>
                        </div>
                        <input
                          id="reg-phone"
                          type="tel"
                          formControlName="phone"
                          placeholder="+243 81 000 0000"
                          class="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-900 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label for="reg-country" class="block text-xs font-bold text-zinc-700 mb-1">
                        Pays de destination
                      </label>
                      <select
                        id="reg-country"
                        formControlName="country"
                        class="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-900 transition-all"
                      >
                        <option value="R.D. Congo">🇨🇩 R.D. Congo</option>
                        <option value="Congo-Brazzaville">🇨🇬 Congo-Brazzaville</option>
                        <option value="Burundi">🇧🇮 Burundi</option>
                        <option value="Rwanda">🇷🇼 Rwanda</option>
                        <option value="Tanzanie">🇹🇿 Tanzanie</option>
                        <option value="Autre pays">🌍 Autre pays</option>
                      </select>
                    </div>

                    <div>
                      <label for="reg-city" class="block text-xs font-bold text-zinc-700 mb-1">
                        Ville / Port de livraison
                      </label>
                      <select
                        id="reg-city"
                        formControlName="city"
                        class="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-900 transition-all"
                      >
                        <option value="Kinshasa">Kinshasa</option>
                        <option value="Matadi (Port maritime)">Matadi (Port maritime)</option>
                        <option value="Boma (Port maritime)">Boma (Port maritime)</option>
                        <option value="Lubumbashi">Lubumbashi</option>
                        <option value="Goma">Goma</option>
                        <option value="Bukavu">Bukavu</option>
                        <option value="Autre ville">Autre ville</option>
                      </select>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label for="reg-password" class="block text-xs font-bold text-zinc-700 mb-1">
                        Mot de passe <span class="text-red-600">*</span>
                      </label>
                      <input
                        id="reg-password"
                        type="password"
                        formControlName="password"
                        placeholder="Au moins 6 caractères"
                        class="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-900 transition-all"
                      />
                    </div>

                    <div>
                      <label for="reg-confirm-password" class="block text-xs font-bold text-zinc-700 mb-1">
                        Confirmer le mot de passe <span class="text-red-600">*</span>
                      </label>
                      <input
                        id="reg-confirm-password"
                        type="password"
                        formControlName="confirmPassword"
                        placeholder="Confirmez votre mot de passe"
                        class="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-900 transition-all"
                      />
                    </div>
                  </div>

                    <div>
                      <label for="reg-role" class="block text-xs font-bold text-zinc-700 mb-1">
                        Type de compte à créer <span class="text-red-600">*</span>
                      </label>
                      <select
                        id="reg-role"
                        formControlName="role"
                        class="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:bg-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-900 font-bold transition-all"
                      >
                        <option value="client">👤 Compte Client Acheteur RDC (Particulier / Société)</option>
                        <option value="admin">🛡️ Compte Propriétaire &amp; Admin Indépendant (Plateforme)</option>
                      </select>
                    </div>

                    <label for="reg-terms" class="flex items-start gap-2 text-[11px] text-zinc-600 pt-1 cursor-pointer">
                    <input
                      id="reg-terms"
                      type="checkbox"
                      formControlName="acceptTerms"
                      class="mt-0.5 rounded border-zinc-300 text-red-600 focus:ring-red-500"
                    />
                    <span>
                      J'accepte les conditions générales de commande et le suivi maritime officiel d'AutoForward.
                    </span>
                  </label>

                  <!-- Registration Submit Button -->
                  <button
                    type="submit"
                    class="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white py-2.5 px-4 rounded font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <mat-icon class="text-base">how_to_reg</mat-icon>
                    <span>Créer le Compte &amp; Accéder à l'Espace</span>
                  </button>

                  <!-- Back to Login Switcher Button -->
                  <div class="mt-4 pt-3 border-t border-zinc-200 text-center">
                    <p class="text-xs text-zinc-600">
                      Vous avez déjà un compte AutoForward ?
                    </p>
                    <button
                      type="button"
                      (click)="authService.switchToLogin()"
                      class="mt-1.5 text-xs font-black text-red-600 hover:text-red-700 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <mat-icon class="text-xs">arrow_back</mat-icon>
                      <span>Se connecter avec un compte existant</span>
                    </button>
                  </div>
                </form>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class AuthModalComponent {
  readonly authService = inject(AuthService);
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);
  readonly priceAlertService = inject(PriceAlertService);

  readonly showPassword = signal<boolean>(false);

  readonly loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rememberMe: new FormControl<boolean>(true, { nonNullable: true }),
  });

  readonly registerForm = new FormGroup({
    fullName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    country: new FormControl<string>('R.D. Congo', { nonNullable: true }),
    city: new FormControl<string>('Kinshasa', { nonNullable: true }),
    role: new FormControl<'client' | 'admin'>('client', { nonNullable: true }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    acceptTerms: new FormControl<boolean>(true, { nonNullable: true }),
  });

  toggleShowPassword() {
    this.showPassword.update((curr) => !curr);
  }

  forgotPasswordNotice() {
    this.authService.statusMessage.set({
      type: 'success',
      text: 'Un lien de réinitialisation sécurisé sera envoyé à votre adresse e-mail.',
    });
  }

  submitLogin() {
    if (this.loginForm.invalid) {
      this.authService.statusMessage.set({
        type: 'error',
        text: 'Veuillez saisir votre e-mail et votre mot de passe.',
      });
      return;
    }
    const val = this.loginForm.getRawValue();
    this.authService.login(val.email, val.password);
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.authService.statusMessage.set({
        type: 'error',
        text: 'Veuillez renseigner correctement tous les champs obligatoires.',
      });
      return;
    }
    const val = this.registerForm.getRawValue();
    if (val.password !== val.confirmPassword) {
      this.authService.statusMessage.set({
        type: 'error',
        text: 'Les mots de passe saisis ne correspondent pas.',
      });
      return;
    }
    this.authService.register({
      fullName: val.fullName,
      email: val.email,
      phone: val.phone,
      country: val.country,
      city: val.city,
      role: val.role,
      password: val.password,
    });
  }

  openFavoritesFromModal() {
    this.authService.closeModal();
    this.vehicleService.openFavoritesModal();
  }

  openPriceAlertsFromModal() {
    this.authService.closeModal();
    this.priceAlertService.openModal();
  }

  openAdminPanelFromModal() {
    this.authService.closeModal();
    this.authService.openAdminPanel();
  }
}

