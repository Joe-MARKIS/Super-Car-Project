export interface Vehicle {
  id: string;
  refNo: string;
  make: string;
  model: string;
  year: number;
  priceUsd: number;
  originalPriceUsd?: number;
  discountPercent?: number;
  estimatedShippingUsd: number;
  pointsReward: number;
  stockCountry: 'Japon' | 'Singapour' | 'Émirats arabes unis' | 'Corée' | 'Thaïlande' | 'Royaume-Uni';
  originFlag: string;
  steering: 'Left Hand Drive' | 'Right Hand Drive';
  transmission: 'Automatique' | 'Manuelle';
  fuel: 'Essence' | 'Diesel' | 'Hybride' | 'Électrique';
  mileageKm: number;
  engineCc: number;
  category: 'SUV' | 'Pick up' | 'Berline' | 'Camion' | 'Van' | 'Monospace' | 'Hatchback' | 'Coupé' | 'Fourgonnette' | 'Minibus';
  driveType: '4WD' | '2WD' | 'AWD';
  seats: number;
  doors: number;
  color: string;
  chassisCode: string;
  imageUrl: string;
  galleryImages: string[];
  isTopDrcSeller?: boolean;
  topRankDrc?: number;
  isRecommendedDubai?: boolean;
  recommendedRankDubai?: number;
  isPopularLhd?: boolean;
  popularRankLhd?: number;
  isSpecialOffer?: boolean;
  isPrimeSeller?: boolean;
  features: string[];
  locationCity: string;
  inspectionPassed: boolean;
  status?: 'Disponible' | 'Réservé' | 'Vendu';
  modelCode?: string;
  versionClass?: string;
  engineCode?: string;
  subRefNo?: string;
  m3?: number;
  weightKg?: number;
  dimensions?: string;
  registrationMonth?: number;
}

export interface VehicleFilterState {
  make: string;
  model: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  steering: string; // 'all' | 'Left Hand Drive' | 'Right Hand Drive'
  category: string;
  stockCountry: string;
  keyword: string;
  discountOnly: boolean;
  todaysOfferOnly: boolean;
  primeSellerOnly: boolean;
  activeTab: 'all' | 'new_arrivals' | 'sales' | 'luxury' | 'certified';
  // Extra filter attributes for other categories
  driveType?: string;
  fuelType?: string;
  transmission?: string;
  maxMileage?: number;
  bonusPointsOnly?: boolean;
}

export interface DestinationPort {
  id: string;
  name: string;
  country: string;
  baseOceanFreightUsd: number;
  transitDays: number;
  supportedMethods: ('roro' | 'container')[];
}

export interface CustomerReview {
  id: string;
  authorName: string;
  country: string;
  countryFlag: string;
  date: string;
  title: string;
  comment: string;
  modelPurchased: string;
  chassisCode: string;
  rating: number;
  imageUrl?: string;
  likes: number;
}

export interface ModelPageContext {
  title: string;
  subtitle?: string;
  make?: string;
  model?: string;
  category?: string;
  criterionType: 'make' | 'category' | 'price' | 'discount' | 'other' | 'stock' | 'special';
  criterionValue?: string;
  badge?: string;
  icon?: string;
}
