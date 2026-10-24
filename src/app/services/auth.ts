import { computed, Injectable, signal } from '@angular/core';
import { UserProfile } from '../models/user';

const STORAGE_KEY = 'autoforward_current_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isAuthModalOpen = signal<boolean>(false);
  readonly isAdminPanelOpen = signal<boolean>(false);
  readonly authMode = signal<'login' | 'register'>('login');
  readonly currentUser = signal<UserProfile | null>(this.loadStoredUser());
  readonly statusMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  private loadStoredUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data) as UserProfile;
      }
    } catch {
      // Ignore storage read errors
    }
    return null;
  }

  private saveUser(user: UserProfile | null) {
    if (typeof window === 'undefined') return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage write errors
    }
  }

  openLogin() {
    this.authMode.set('login');
    this.statusMessage.set(null);
    this.isAuthModalOpen.set(true);
  }

  openRegister() {
    this.authMode.set('register');
    this.statusMessage.set(null);
    this.isAuthModalOpen.set(true);
  }

  openAdminPanel() {
    this.isAdminPanelOpen.set(true);
  }

  closeAdminPanel() {
    this.isAdminPanelOpen.set(false);
  }

  switchToLogin() {
    this.authMode.set('login');
    this.statusMessage.set(null);
  }

  switchToRegister() {
    this.authMode.set('register');
    this.statusMessage.set(null);
  }

  closeModal() {
    this.isAuthModalOpen.set(false);
    this.statusMessage.set(null);
  }

  login(email: string, password: string): boolean {
    if (!email || !password) {
      this.statusMessage.set({
        type: 'error',
        text: 'Veuillez saisir votre identifiant / email et mot de passe.',
      });
      return false;
    }

    const lowerEmail = email.trim().toLowerCase();
    const isAdminUser = lowerEmail.includes('admin') || password.toLowerCase().includes('admin');

    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    if (isAdminUser) {
      const admin: UserProfile = {
        id: 'ADM-001',
        fullName: 'Propriétaire & Administrateur Indépendant',
        email: lowerEmail,
        phone: '+243 82 000 0000',
        country: 'R.D. Congo',
        city: 'Kinshasa (Siège Principal)',
        loyaltyPoints: 9999,
        memberTier: 'VIP Export',
        memberSince: '2024',
        role: 'admin',
      };
      this.currentUser.set(admin);
      this.saveUser(admin);
      this.statusMessage.set({
        type: 'success',
        text: 'Connexion Propriétaire & Admin réussie ! Accès total activé.',
      });
      setTimeout(() => {
        this.closeModal();
      }, 1000);
      return true;
    }

    const user: UserProfile = {
      id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
      fullName: formattedName || 'Client Acheteur',
      email: lowerEmail,
      country: 'R.D. Congo',
      city: 'Kinshasa',
      loyaltyPoints: 120,
      memberTier: 'Silver',
      memberSince: '2026',
      role: 'client',
      orders: [
        {
          id: 'CMD-9241',
          vehicleTitle: 'Toyota Hilux Double Cabine 2021',
          price: 14800,
          destinationPort: 'Port de Boma (RDC)',
          status: 'En transit maritime',
          date: '14 Mars 2026',
        },
      ],
      quotes: [
        {
          id: 'DEV-418',
          vehicleTitle: 'Toyota RAV4 Hybrid 2022',
          cifPrice: 18500,
          port: 'Port de Matadi',
          status: 'Devis envoyé',
          date: '15 Mars 2026',
        },
      ],
    };

    this.currentUser.set(user);
    this.saveUser(user);
    this.statusMessage.set({
      type: 'success',
      text: `Connexion réussie ! Bienvenue ${user.fullName}.`,
    });

    setTimeout(() => {
      this.closeModal();
    }, 1200);

    return true;
  }

  loginDemoUser() {
    const demoUser: UserProfile = {
      id: 'USR-88241',
      fullName: 'Marc Kabamba',
      email: 'marc.kabamba@autoforward-congo.cd',
      phone: '+243 81 234 5678',
      country: 'R.D. Congo',
      city: 'Kinshasa / Gombe',
      loyaltyPoints: 350,
      memberTier: 'VIP Export',
      memberSince: '2025',
      role: 'client',
      orders: [
        {
          id: 'CMD-8812',
          vehicleTitle: 'Toyota Land Cruiser Prado TX 2020',
          price: 22400,
          destinationPort: 'Port de Boma (RDC)',
          status: 'En transit maritime',
          date: '02 Mars 2026',
        },
        {
          id: 'CMD-7740',
          vehicleTitle: 'Toyota RAV4 4WD 2018',
          price: 11900,
          destinationPort: 'Port de Matadi (RDC)',
          status: 'Dédouané',
          date: '15 Janv 2026',
        },
      ],
      quotes: [
        {
          id: 'DEV-502',
          vehicleTitle: 'Lexus RX450h Hybrid 2021',
          cifPrice: 19800,
          port: 'Port de Boma',
          status: 'Validé',
          date: '12 Mars 2026',
        },
      ],
    };

    this.currentUser.set(demoUser);
    this.saveUser(demoUser);
    this.statusMessage.set({
      type: 'success',
      text: `Connecté en tant que ${demoUser.fullName} (Compte Client VIP RDC).`,
    });

    setTimeout(() => {
      this.closeModal();
    }, 1000);
  }

  loginAdminDemo() {
    const adminUser: UserProfile = {
      id: 'ADM-001',
      fullName: 'Propriétaire & Administrateur Indépendant',
      email: 'admin@autoforward.cd',
      phone: '+243 82 000 0000',
      country: 'R.D. Congo',
      city: 'Kinshasa (Siège Principal)',
      loyaltyPoints: 9999,
      memberTier: 'VIP Export',
      memberSince: '2024',
      role: 'admin',
    };

    this.currentUser.set(adminUser);
    this.saveUser(adminUser);
    this.statusMessage.set({
      type: 'success',
      text: `Connexion Administrateur Propriétaire réussie ! Contrôle total de la plateforme activé.`,
    });

    setTimeout(() => {
      this.closeModal();
      this.openAdminPanel();
    }, 800);
  }

  register(data: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city?: string;
    password: string;
    role?: 'client' | 'admin';
  }): boolean {
    if (!data.fullName || !data.email || !data.password) {
      this.statusMessage.set({
        type: 'error',
        text: 'Veuillez remplir tous les champs obligatoires.',
      });
      return false;
    }

    const newUser: UserProfile = {
      id: (data.role === 'admin' ? 'ADM-' : 'USR-') + Math.floor(100000 + Math.random() * 900000),
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      country: data.country || 'R.D. Congo',
      city: data.city || 'Kinshasa',
      loyaltyPoints: data.role === 'admin' ? 9999 : 200,
      memberTier: data.role === 'admin' ? 'VIP Export' : 'Standard',
      memberSince: '2026',
      role: data.role || 'client',
      orders: [],
      quotes: [],
    };

    this.currentUser.set(newUser);
    this.saveUser(newUser);
    this.statusMessage.set({
      type: 'success',
      text: data.role === 'admin'
        ? `Compte Propriétaire créé avec succès ! Bienvenue ${newUser.fullName}.`
        : `Compte créé avec succès ! Félicitations ${newUser.fullName}, 200 points (+10$ USD) crédités.`,
    });

    setTimeout(() => {
      this.closeModal();
      if (data.role === 'admin') {
        this.openAdminPanel();
      }
    }, 1200);

    return true;
  }

  logout() {
    this.currentUser.set(null);
    this.saveUser(null);
    this.closeAdminPanel();
    this.statusMessage.set({
      type: 'success',
      text: 'Vous avez été déconnecté.',
    });
  }
}

