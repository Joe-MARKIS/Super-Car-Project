export interface PriceDropAlert {
  id: string;
  email: string;
  phoneWhatsapp?: string;
  make: string;
  model: string;
  vehicleId?: string;
  vehicleRef?: string;
  vehicleTitle?: string;
  vehicleImageUrl?: string;
  initialPriceUsd?: number;
  currentPriceUsd?: number;
  targetPriceUsd?: number; // Notify when price drops at or below this value
  notifyOnAnyDrop: boolean;
  status: 'active' | 'triggered' | 'paused';
  createdAt: string;
  lastTriggeredAt?: string;
  notificationsSentCount: number;
}

export interface PriceDropEmailPreview {
  alertId: string;
  recipientEmail: string;
  recipientPhone?: string;
  subject: string;
  make: string;
  model: string;
  oldPriceUsd: number;
  newPriceUsd: number;
  priceDropAmountUsd: number;
  priceDropPercent: number;
  vehicleRef?: string;
  vehicleImageUrl?: string;
  destinationPort: string;
  timestamp: string;
}
