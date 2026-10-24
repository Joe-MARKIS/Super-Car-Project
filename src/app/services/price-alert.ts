import { Injectable, computed, inject, signal } from '@angular/core';
import { PriceDropAlert, PriceDropEmailPreview } from '../models/price-alert';
import { Vehicle } from '../models/vehicle';
import { AuthService } from './auth';

const STORAGE_KEY = 'autoforward_price_drop_alerts';

const INITIAL_ALERTS: PriceDropAlert[] = [
  {
    id: 'ALT-101',
    email: 'acheteur.kin@gmail.com',
    phoneWhatsapp: '+243 81 234 5678',
    make: 'Toyota',
    model: 'Corolla',
    vehicleId: 'v-101',
    vehicleRef: 'TY-COR-001',
    vehicleTitle: 'Toyota Corolla Axio 1.5X 2020',
    vehicleImageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    initialPriceUsd: 3800,
    currentPriceUsd: 3400,
    targetPriceUsd: 3300,
    notifyOnAnyDrop: false,
    status: 'active',
    createdAt: '12 Mars 2026',
    notificationsSentCount: 1,
  },
  {
    id: 'ALT-102',
    email: 'export.congo@yahoo.fr',
    phoneWhatsapp: '+243 99 876 5432',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    vehicleTitle: 'Toyota Land Cruiser Prado TX-L 2021',
    vehicleImageUrl: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=800&q=80',
    initialPriceUsd: 26500,
    currentPriceUsd: 24800,
    targetPriceUsd: 24000,
    notifyOnAnyDrop: true,
    status: 'active',
    createdAt: '14 Mars 2026',
    notificationsSentCount: 0,
  },
  {
    id: 'ALT-103',
    email: 'lubum.logistics@outlook.com',
    phoneWhatsapp: '+243 82 555 1212',
    make: 'Toyota',
    model: 'Hilux',
    vehicleTitle: 'Toyota Hilux Revo Double Cab 2021',
    vehicleImageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    initialPriceUsd: 15400,
    currentPriceUsd: 14800,
    targetPriceUsd: 14500,
    notifyOnAnyDrop: false,
    status: 'active',
    createdAt: '16 Mars 2026',
    notificationsSentCount: 1,
  },
  {
    id: 'ALT-104',
    email: 'client@autoforward.cd',
    phoneWhatsapp: '+243 81 000 0000',
    make: 'Nissan',
    model: 'X-Trail',
    vehicleTitle: 'Nissan X-Trail 20X Hybrid 2019',
    vehicleImageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    initialPriceUsd: 4900,
    currentPriceUsd: 4600,
    targetPriceUsd: 4300,
    notifyOnAnyDrop: true,
    status: 'active',
    createdAt: '18 Mars 2026',
    notificationsSentCount: 0,
  },
];

@Injectable({
  providedIn: 'root',
})
export class PriceAlertService {
  private readonly authService = inject(AuthService);

  readonly alerts = signal<PriceDropAlert[]>(this.loadAlerts());
  readonly isModalOpen = signal<boolean>(false);
  readonly selectedVehicle = signal<Vehicle | null>(null);
  readonly selectedMakeModel = signal<{ make: string; model: string } | null>(null);

  // Active email preview modal (simulating received notification)
  readonly activeEmailPreview = signal<PriceDropEmailPreview | null>(null);

  // In-app alert notification toast
  readonly activeToast = signal<{
    id: string;
    type: 'success' | 'drop_alert' | 'info';
    title: string;
    message: string;
    emailPreview?: PriceDropEmailPreview;
  } | null>(null);

  readonly totalActiveAlertsCount = computed(() => {
    return this.alerts().filter((a) => a.status === 'active').length;
  });

  readonly userAlerts = computed(() => {
    const user = this.authService.currentUser();
    const all = this.alerts();
    if (!user || !user.email) {
      return all;
    }
    const userEmail = user.email.toLowerCase();
    const filtered = all.filter((a) => a.email.toLowerCase() === userEmail);
    // If user has no specific saved alerts under their email, display the general mock list so they see how it works
    return filtered.length > 0 ? filtered : all;
  });

  private loadAlerts(): PriceDropAlert[] {
    if (typeof window === 'undefined') return INITIAL_ALERTS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_ALERTS;
  }

  private saveAlerts(list: PriceDropAlert[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore
    }
  }

  openModal(vehicle?: Vehicle | null, preset?: { make: string; model: string } | null) {
    this.selectedVehicle.set(vehicle || null);
    if (preset) {
      this.selectedMakeModel.set(preset);
    } else if (vehicle) {
      this.selectedMakeModel.set({ make: vehicle.make, model: vehicle.model });
    } else {
      this.selectedMakeModel.set(null);
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedVehicle.set(null);
    this.selectedMakeModel.set(null);
  }

  subscribe(params: {
    email: string;
    phoneWhatsapp?: string;
    make: string;
    model: string;
    targetPriceUsd?: number;
    notifyOnAnyDrop: boolean;
    vehicle?: Vehicle | null;
  }): { success: boolean; alert: PriceDropAlert; message: string } {
    const cleanEmail = params.email.trim().toLowerCase();
    const existing = this.alerts().find(
      (a) =>
        a.email.toLowerCase() === cleanEmail &&
        a.make.toLowerCase() === params.make.toLowerCase() &&
        a.model.toLowerCase() === params.model.toLowerCase()
    );

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const v = params.vehicle;

    if (existing) {
      // Update existing alert
      const updated: PriceDropAlert = {
        ...existing,
        targetPriceUsd: params.targetPriceUsd,
        notifyOnAnyDrop: params.notifyOnAnyDrop,
        phoneWhatsapp: params.phoneWhatsapp || existing.phoneWhatsapp,
        status: 'active',
      };
      const newList = this.alerts().map((a) => (a.id === existing.id ? updated : a));
      this.alerts.set(newList);
      this.saveAlerts(newList);

      this.showToast({
        type: 'success',
        title: 'Alerte Baisse de Prix Mise à Jour !',
        message: `Votre abonnement pour ${params.make} ${params.model} est actif pour ${cleanEmail}.`,
      });

      return {
        success: true,
        alert: updated,
        message: 'Alerte mise à jour avec succès.',
      };
    }

    const newAlert: PriceDropAlert = {
      id: 'ALT-' + Math.floor(100 + Math.random() * 900),
      email: cleanEmail,
      phoneWhatsapp: params.phoneWhatsapp,
      make: params.make,
      model: params.model,
      vehicleId: v?.id,
      vehicleRef: v?.refNo,
      vehicleTitle: v ? `${v.make} ${v.model} (${v.year})` : `${params.make} ${params.model}`,
      vehicleImageUrl: v?.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      initialPriceUsd: v?.priceUsd,
      currentPriceUsd: v?.priceUsd,
      targetPriceUsd: params.targetPriceUsd,
      notifyOnAnyDrop: params.notifyOnAnyDrop,
      status: 'active',
      createdAt: dateStr,
      notificationsSentCount: 0,
    };

    const updatedList = [newAlert, ...this.alerts()];
    this.alerts.set(updatedList);
    this.saveAlerts(updatedList);

    this.showToast({
      type: 'success',
      title: 'Alerte Baisse de Prix Enregistrée !',
      message: `Vous recevrez un email dès que le prix de ${params.make} ${params.model} diminue !`,
    });

    return {
      success: true,
      alert: newAlert,
      message: 'Abonnement activé avec succès.',
    };
  }

  unsubscribe(alertId: string) {
    const target = this.alerts().find((a) => a.id === alertId);
    const updated = this.alerts().filter((a) => a.id !== alertId);
    this.alerts.set(updated);
    this.saveAlerts(updated);

    this.showToast({
      type: 'info',
      title: 'Alerte supprimée',
      message: target
        ? `L'alerte pour ${target.make} ${target.model} a été désactivée.`
        : 'Alerte supprimée.',
    });
  }

  toggleAlertStatus(alertId: string) {
    const updated = this.alerts().map((a) => {
      if (a.id === alertId) {
        const nextStatus: 'active' | 'paused' = a.status === 'active' ? 'paused' : 'active';
        return { ...a, status: nextStatus };
      }
      return a;
    });
    this.alerts.set(updated);
    this.saveAlerts(updated);
  }

  /**
   * Called when a vehicle price decreases (or simulated)
   */
  processVehiclePriceDrop(params: {
    make: string;
    model: string;
    vehicleId?: string;
    vehicleRef?: string;
    oldPriceUsd: number;
    newPriceUsd: number;
    imageUrl?: string;
    destinationPort?: string;
  }) {
    if (params.newPriceUsd >= params.oldPriceUsd) return;

    const diff = params.oldPriceUsd - params.newPriceUsd;
    const percent = Math.round((diff / params.oldPriceUsd) * 100);

    const matchingAlerts = this.alerts().filter(
      (a) =>
        a.status === 'active' &&
        a.make.toLowerCase() === params.make.toLowerCase() &&
        a.model.toLowerCase() === params.model.toLowerCase() &&
        (a.notifyOnAnyDrop || !a.targetPriceUsd || params.newPriceUsd <= a.targetPriceUsd)
    );

    if (matchingAlerts.length === 0) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Update alerts with notification count & last triggered
    const updatedAlerts = this.alerts().map((a) => {
      const match = matchingAlerts.some((m) => m.id === a.id);
      if (match) {
        return {
          ...a,
          currentPriceUsd: params.newPriceUsd,
          lastTriggeredAt: dateStr,
          notificationsSentCount: (a.notificationsSentCount || 0) + 1,
        };
      }
      return a;
    });
    this.alerts.set(updatedAlerts);
    this.saveAlerts(updatedAlerts);

    // Prepare simulated email preview for the first matched recipient
    const firstMatch = matchingAlerts[0];
    const preview: PriceDropEmailPreview = {
      alertId: firstMatch.id,
      recipientEmail: firstMatch.email,
      recipientPhone: firstMatch.phoneWhatsapp,
      subject: `📉 Baisse de prix AutoForward : -${diff}$ sur votre ${params.make} ${params.model} !`,
      make: params.make,
      model: params.model,
      oldPriceUsd: params.oldPriceUsd,
      newPriceUsd: params.newPriceUsd,
      priceDropAmountUsd: diff,
      priceDropPercent: percent,
      vehicleRef: params.vehicleRef || firstMatch.vehicleRef || 'EXP-RDC-' + Math.floor(1000 + Math.random() * 9000),
      vehicleImageUrl: params.imageUrl || firstMatch.vehicleImageUrl,
      destinationPort: params.destinationPort || 'Port de Matadi / Boma (RDC)',
      timestamp: dateStr,
    };

    // Show in-app banner toast with direct action to view the simulated email
    this.showToast({
      type: 'drop_alert',
      title: `📉 Baisse de prix détectée : -${diff}$ USD !`,
      message: `${matchingAlerts.length} abonné(s) alerté(s) par email pour ${params.make} ${params.model} (${firstMatch.email}).`,
      emailPreview: preview,
    });
  }

  /**
   * Trigger an instant simulation of a price drop for an alert so user can experience the feature immediately!
   */
  simulatePriceDropForAlert(alertId: string) {
    const alert = this.alerts().find((a) => a.id === alertId);
    if (!alert) return;

    const currentPrice = alert.currentPriceUsd || alert.initialPriceUsd || 4000;
    const drop = Math.min(Math.round(currentPrice * 0.12), 600); // 12% drop or $600
    const newPrice = Math.max(1000, currentPrice - drop);

    this.processVehiclePriceDrop({
      make: alert.make,
      model: alert.model,
      vehicleId: alert.vehicleId,
      vehicleRef: alert.vehicleRef,
      oldPriceUsd: currentPrice,
      newPriceUsd: newPrice,
      imageUrl: alert.vehicleImageUrl,
      destinationPort: 'Port de Matadi (RDC)',
    });
  }

  openEmailPreview(preview: PriceDropEmailPreview) {
    this.activeEmailPreview.set(preview);
  }

  closeEmailPreview() {
    this.activeEmailPreview.set(null);
  }

  showToast(params: {
    type: 'success' | 'drop_alert' | 'info';
    title: string;
    message: string;
    emailPreview?: PriceDropEmailPreview;
  }) {
    this.activeToast.set({
      id: 'toast-' + Date.now(),
      type: params.type,
      title: params.title,
      message: params.message,
      emailPreview: params.emailPreview,
    });

    // Auto dismiss after 7s unless it's a drop_alert
    const delay = params.type === 'drop_alert' ? 10000 : 5000;
    setTimeout(() => {
      this.dismissToast();
    }, delay);
  }

  dismissToast() {
    this.activeToast.set(null);
  }
}
