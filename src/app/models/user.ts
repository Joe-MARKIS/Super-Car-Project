export interface UserOrder {
  id: string;
  vehicleTitle: string;
  price: number;
  destinationPort: string;
  status: 'En attente d\'embarquement' | 'En transit maritime' | 'Arrivé au port' | 'Dédouané';
  date: string;
}

export interface UserQuote {
  id: string;
  vehicleTitle: string;
  cifPrice: number;
  port: string;
  clientPhone?: string;
  status: 'En attente' | 'Devis envoyé' | 'Validé' | 'Payé';
  date: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  loyaltyPoints: number;
  memberTier: 'Standard' | 'Silver' | 'Gold' | 'VIP Export';
  memberSince: string;
  token?: string;
  role?: 'client' | 'admin';
  orders?: UserOrder[];
  quotes?: UserQuote[];
}

