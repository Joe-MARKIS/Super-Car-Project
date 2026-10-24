import { Injectable, computed, signal } from '@angular/core';
import { CustomerReview, DestinationPort, ModelPageContext, Vehicle, VehicleFilterState } from '../models/vehicle';

export const INITIAL_PORTS: DestinationPort[] = [
  { id: 'matadi', name: 'Port de Matadi (R.D. Congo)', country: 'RDC', baseOceanFreightUsd: 1450, transitDays: 38, supportedMethods: ['roro', 'container'] },
  { id: 'boma', name: 'Port de Boma (R.D. Congo)', country: 'RDC', baseOceanFreightUsd: 1520, transitDays: 40, supportedMethods: ['roro', 'container'] },
  { id: 'dar_es_salaam', name: 'Port de Dar es Salaam (Tanzanie / Corridor Est)', country: 'Tanzanie', baseOceanFreightUsd: 1200, transitDays: 32, supportedMethods: ['roro', 'container'] },
  { id: 'mombasa', name: 'Port de Mombasa (Kenya / Transit Kivu & Ituri)', country: 'Kenya', baseOceanFreightUsd: 1180, transitDays: 30, supportedMethods: ['roro', 'container'] },
  { id: 'pointe_noire', name: 'Port de Pointe-Noire (Congo-Brazzaville)', country: 'Congo', baseOceanFreightUsd: 1390, transitDays: 36, supportedMethods: ['roro', 'container'] },
  { id: 'durban', name: 'Port de Durban (Afrique du Sud / Corridor Sud)', country: 'Afrique du Sud', baseOceanFreightUsd: 1100, transitDays: 28, supportedMethods: ['roro', 'container'] },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-nbox',
    refNo: 'BF-CE154824',
    make: 'HONDA',
    model: 'N BOX',
    year: 2021,
    priceUsd: 6330,
    originalPriceUsd: 7190,
    discountPercent: 12,
    estimatedShippingUsd: 1150,
    pointsReward: 20,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 34200,
    engineCc: 660,
    category: 'Monospace',
    driveType: '2WD',
    seats: 4,
    doors: 5,
    color: 'Marron Chocolat',
    chassisCode: 'JF3-128904',
    imageUrl: '/assets/images/car_honda_n_box.jpg',
    galleryImages: [
      '/assets/images/car_honda_n_box.jpg',
      '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    ],
    isTopDrcSeller: false,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Climatisation', 'Portes Coulissantes Électriques', 'Honda Sensing', 'Double Airbag', 'Caméra de Recul'],
    locationCity: 'Yokohama, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-aqua',
    refNo: 'BF-CIA58674',
    make: 'TOYOTA',
    model: 'Aqua',
    year: 2019,
    priceUsd: 4400,
    originalPriceUsd: 4890,
    discountPercent: 10,
    estimatedShippingUsd: 1100,
    pointsReward: 20,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Hybride',
    mileageKm: 52100,
    engineCc: 1490,
    category: 'Hatchback',
    driveType: '2WD',
    seats: 5,
    doors: 5,
    color: 'Blanc Pur',
    chassisCode: 'NHP10-218490',
    imageUrl: '/assets/images/car_toyota_aqua.jpg',
    galleryImages: [
      '/assets/images/car_toyota_aqua.jpg',
      '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    ],
    isTopDrcSeller: false,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Système Hybride Synergie Drive', 'Très Faible Consommation', 'Climatisation Automatique', 'Bouton Start/Stop', 'Toyota Safety Sense'],
    locationCity: 'Kobe, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-atenza',
    refNo: 'BF-CE54435',
    make: 'MAZDA',
    model: 'Atenza Wagon',
    year: 2018,
    priceUsd: 4530,
    originalPriceUsd: 5520,
    discountPercent: 18,
    estimatedShippingUsd: 1200,
    pointsReward: 30,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Diesel',
    mileageKm: 68400,
    engineCc: 2190,
    category: 'Berline',
    driveType: '2WD',
    seats: 5,
    doors: 5,
    color: 'Gris Métallisé',
    chassisCode: 'GJ2FW-104921',
    imageUrl: '/assets/images/car_mazda_atenza_wagon.jpg',
    galleryImages: [
      '/assets/images/car_mazda_atenza_wagon.jpg',
      '/assets/images/car_mercedes_c_class_1791895943618.jpg',
    ],
    isTopDrcSeller: false,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Moteur SkyActiv-D Turbo', 'Jantes Alliage 19"', 'Sellerie Cuir Noir', 'Phares LED Adaptatifs', 'Régulateur de Vitesse'],
    locationCity: 'Nagoya, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-bmw-x5',
    refNo: 'CE765503',
    make: 'BMW',
    model: 'X5 xDrive30d M Sport',
    year: 2020,
    priceUsd: 23170,
    originalPriceUsd: 26160,
    discountPercent: 11,
    estimatedShippingUsd: 2436,
    pointsReward: 40,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Diesel',
    mileageKm: 48000,
    engineCc: 2993,
    category: 'SUV',
    driveType: '4WD',
    seats: 5,
    doors: 5,
    color: 'Noir Carbone',
    chassisCode: '3DA-CV30A',
    imageUrl: '/assets/images/car_bmw_x5_black.jpg',
    galleryImages: [
      '/assets/images/car_bmw_x5_black.jpg',
      '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    ],
    isTopDrcSeller: true,
    topRankDrc: 4,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Pack M Sport', 'Toit Panoramique', 'Caméra 360°', 'Suspension Pneumatique Adaptative', 'Écran Tactile BMW Live Cockpit'],
    locationCity: 'Yokohama, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-man-tgs',
    refNo: 'CC652265',
    make: 'MAN',
    model: 'TGS Benne 41.480 8x4',
    year: 2009,
    priceUsd: 11231,
    originalPriceUsd: 11900,
    discountPercent: 5,
    estimatedShippingUsd: 10983,
    pointsReward: 40,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Left Hand Drive',
    transmission: 'Manuelle',
    fuel: 'Diesel',
    mileageKm: 521605,
    engineCc: 12419,
    category: 'Camion',
    driveType: '8x4',
    seats: 2,
    doors: 2,
    color: 'Blanc & Benne Acier',
    chassisCode: 'TGS414808X4BB',
    imageUrl: '/assets/images/car_man_tgs_tipper.jpg',
    galleryImages: [
      '/assets/images/car_man_tgs_tipper.jpg',
      '/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg',
    ],
    isTopDrcSeller: false,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Benne Basculante Hydraulique Meiller', 'Capacité de Charge 32 Tonnes', 'Ralentisseur Telma', 'Double Essieu Moteur'],
    locationCity: 'Osaka, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-volvo-fm',
    refNo: 'CC652268',
    make: 'VOLVO',
    model: 'FM 440 8x4 Benne Chantier',
    year: 2010,
    priceUsd: 9812,
    originalPriceUsd: 14745,
    discountPercent: 33,
    estimatedShippingUsd: 10332,
    pointsReward: 40,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Left Hand Drive',
    transmission: 'Manuelle',
    fuel: 'Diesel',
    mileageKm: 945991,
    engineCc: 12777,
    category: 'Camion',
    driveType: '8x4',
    seats: 2,
    doors: 2,
    color: 'Rouge Chantier',
    chassisCode: 'M8SB44H',
    imageUrl: '/assets/images/car_volvo_fm_truck.jpg',
    galleryImages: [
      '/assets/images/car_volvo_fm_truck.jpg',
      '/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg',
    ],
    isTopDrcSeller: false,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Moteur D13A 440ch', 'Transmission I-Shift Renforcée', 'Benne Ronde Hardox', 'Essieux Arrière Tandem'],
    locationCity: 'Kobe, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-01',
    refNo: 'BF-891042',
    make: 'TOYOTA',
    model: 'Land Cruiser Prado TX L-Package',
    year: 2021,
    priceUsd: 28900,
    originalPriceUsd: 31500,
    discountPercent: 8,
    estimatedShippingUsd: 1450,
    pointsReward: 60,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Diesel',
    mileageKm: 42100,
    engineCc: 2800,
    category: 'SUV',
    driveType: '4WD',
    seats: 7,
    doors: 5,
    color: 'Noir Ébène',
    chassisCode: 'GDJ150W-004819',
    imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    galleryImages: [
      '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
      '/assets/images/car_toyota_hilux_pickup_1791895943609.jpg',
    ],
    isTopDrcSeller: true,
    topRankDrc: 1,
    isPopularLhd: true,
    popularRankLhd: 1,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Climatisation Bi-Zone', 'Direction Assistée', 'Vitres Électriques', 'ABS', 'Airbags Frontaux & Latéraux', 'Toit Ouvrant', 'Sellerie Cuir', 'Système 4x4 Électronique', 'Jantes Alliage 18"', 'Caméra de Recul & GPS'],
    locationCity: 'Yokohama, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-02',
    refNo: 'BF-774920',
    make: 'TOYOTA',
    model: 'Hilux Double Cab Revo 4x4',
    year: 2022,
    priceUsd: 14380,
    originalPriceUsd: 16200,
    discountPercent: 11,
    estimatedShippingUsd: 1450,
    pointsReward: 50,
    stockCountry: 'Thaïlande',
    originFlag: '🇹🇭',
    steering: 'Left Hand Drive',
    transmission: 'Manuelle',
    fuel: 'Diesel',
    mileageKm: 58400,
    engineCc: 2400,
    category: 'Pick up',
    driveType: '4WD',
    seats: 5,
    doors: 4,
    color: 'Gris Métallisé',
    chassisCode: 'GUN125-882194',
    imageUrl: '/assets/images/car_toyota_hilux_pickup_1791895943609.jpg',
    galleryImages: [
      '/assets/images/car_toyota_hilux_pickup_1791895943609.jpg',
      '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    ],
    isTopDrcSeller: true,
    topRankDrc: 2,
    isPopularLhd: true,
    popularRankLhd: 2,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Climatisation', 'Attelage Remorque', 'Benne Renforcée', 'ABS', '4WD Tout-Terrain', 'Bluetooth & Écran Tactile', 'Marchepieds Latéraux', 'Verrouillage Centralisé'],
    locationCity: 'Laem Chabang, Thaïlande',
    inspectionPassed: true,
  },
  {
    id: 'veh-03',
    refNo: 'BF-641098',
    make: 'MERCEDES-BENZ',
    model: 'C-Class C200 Avantgarde',
    year: 2020,
    priceUsd: 6270,
    originalPriceUsd: 7400,
    discountPercent: 15,
    estimatedShippingUsd: 1350,
    pointsReward: 40,
    stockCountry: 'Singapour',
    originFlag: '🇸🇬',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 69200,
    engineCc: 1990,
    category: 'Berline',
    driveType: '2WD',
    seats: 5,
    doors: 4,
    color: 'Bronze Métallique',
    chassisCode: 'WDD205-042817',
    imageUrl: '/assets/images/car_mercedes_c_class_1791895943618.jpg',
    galleryImages: [
      '/assets/images/car_mercedes_c_class_1791895943618.jpg',
      '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    ],
    isTopDrcSeller: false,
    isRecommendedDubai: false,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Intérieur Cuir Brun', 'Système Navigation MBUX', 'Phares LED Haute Performance', 'Régulateur de Vitesse Adaptatif', 'Radar de Stationnement', 'Jantes AMG 18"'],
    locationCity: 'Jurong, Singapour',
    inspectionPassed: true,
  },
  {
    id: 'veh-04',
    refNo: 'BF-918234',
    make: 'MITSUBISHI',
    model: 'Canter Benne Basculante (Dump Truck)',
    year: 2019,
    priceUsd: 11400,
    originalPriceUsd: 12900,
    discountPercent: 12,
    estimatedShippingUsd: 1650,
    pointsReward: 60,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Manuelle',
    fuel: 'Diesel',
    mileageKm: 88500,
    engineCc: 2990,
    category: 'Camion',
    driveType: '2WD',
    seats: 3,
    doors: 2,
    color: 'Bleu Ciel',
    chassisCode: 'FBA00-519208',
    imageUrl: '/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg',
    galleryImages: [
      '/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg',
    ],
    isTopDrcSeller: true,
    topRankDrc: 7,
    isRecommendedDubai: true,
    recommendedRankDubai: 1,
    isSpecialOffer: false,
    isPrimeSeller: true,
    features: ['Système Benne Hydraulique Renforcée', 'Capacité de Charge 3.5T', 'Moteur Turbo Diesel Économique', 'Frein sur Échappement', 'Direction Assistée'],
    locationCity: 'Nagoya, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-05',
    refNo: 'BF-532189',
    make: 'TOYOTA',
    model: 'Corolla Axio 1.5X',
    year: 2018,
    priceUsd: 4400,
    originalPriceUsd: 4950,
    discountPercent: 11,
    estimatedShippingUsd: 1250,
    pointsReward: 40,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 74300,
    engineCc: 1490,
    category: 'Berline',
    driveType: '2WD',
    seats: 5,
    doors: 4,
    color: 'Blanc Nacré',
    chassisCode: 'NRE160-702319',
    imageUrl: '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    galleryImages: [
      '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    ],
    isTopDrcSeller: true,
    topRankDrc: 3,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Très Faible Consommation', 'Climatisation Automatique', 'Système Toyota Safety Sense', 'Double Airbag', 'Vitres Électriques', 'Lecteur CD/USB'],
    locationCity: 'Osaka, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-06',
    refNo: 'BF-830214',
    make: 'TOYOTA',
    model: 'Corolla Altis Prestige',
    year: 2019,
    priceUsd: 5720,
    originalPriceUsd: 6300,
    discountPercent: 9,
    estimatedShippingUsd: 1280,
    pointsReward: 40,
    stockCountry: 'Singapour',
    originFlag: '🇸🇬',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 65100,
    engineCc: 1598,
    category: 'Berline',
    driveType: '2WD',
    seats: 5,
    doors: 4,
    color: 'Gris Métallisé',
    chassisCode: 'ZRE172-559102',
    imageUrl: '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    galleryImages: [
      '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    ],
    isTopDrcSeller: false,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Intérieur Cuir Noir', 'Caméra de Recul', 'Climatisation Digitale', 'ABS', 'Bluetooth', 'Jantes Alu 16"'],
    locationCity: 'Singapour Port',
    inspectionPassed: true,
  },
  {
    id: 'veh-07',
    refNo: 'BF-992384',
    make: 'TOYOTA',
    model: 'Fortuner 2.7 4x4 SR5',
    year: 2020,
    priceUsd: 22800,
    originalPriceUsd: 24900,
    discountPercent: 8,
    estimatedShippingUsd: 1450,
    pointsReward: 60,
    stockCountry: 'Émirats arabes unis',
    originFlag: '🇦🇪',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 49000,
    engineCc: 2694,
    category: 'SUV',
    driveType: '4WD',
    seats: 7,
    doors: 5,
    color: 'Blanc Arctique',
    chassisCode: 'TGN166-004319',
    imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    galleryImages: [
      '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
      '/assets/images/car_toyota_hilux_pickup_1791895943609.jpg',
    ],
    isTopDrcSeller: true,
    topRankDrc: 4,
    isRecommendedDubai: true,
    recommendedRankDubai: 3,
    isPopularLhd: true,
    popularRankLhd: 3,
    isSpecialOffer: false,
    isPrimeSeller: true,
    features: ['Conduite à Gauche d\'Origine', '7 Places Assises', 'Climatisation Arrière Indépendante', 'Écran Tactile avec Carplay', 'Phares Xénon', 'Barres de Toit'],
    locationCity: 'Dubaï, Émirats Arabes Unis',
    inspectionPassed: true,
  },
  {
    id: 'veh-08',
    refNo: 'BF-332910',
    make: 'JEEP',
    model: 'Wrangler Unlimited Sahara 4x4',
    year: 2021,
    priceUsd: 26400,
    originalPriceUsd: 29500,
    discountPercent: 11,
    estimatedShippingUsd: 1550,
    pointsReward: 60,
    stockCountry: 'Émirats arabes unis',
    originFlag: '🇦🇪',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 38200,
    engineCc: 3600,
    category: 'SUV',
    driveType: '4WD',
    seats: 5,
    doors: 5,
    color: 'Blanc & Noir',
    chassisCode: '1C4HJXEG-582103',
    imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    galleryImages: [
      '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    ],
    isTopDrcSeller: true,
    topRankDrc: 6,
    isPopularLhd: true,
    popularRankLhd: 4,
    isSpecialOffer: false,
    isPrimeSeller: true,
    features: ['Toit Rigide Démontable (Freedom Top)', 'Transmission Intégrale Command-Trac', 'Pneus Tout-Terrain 33"', 'Système Audio Alpine', 'Protection Châssis Renforcée'],
    locationCity: 'Sharjah, EAU',
    inspectionPassed: true,
  },
  {
    id: 'veh-09',
    refNo: 'BF-420911',
    make: 'HYUNDAI',
    model: 'Santa Fe Premium LHD',
    year: 2019,
    priceUsd: 11800,
    originalPriceUsd: 13200,
    discountPercent: 11,
    estimatedShippingUsd: 1390,
    pointsReward: 40,
    stockCountry: 'Corée',
    originFlag: '🇰🇷',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Diesel',
    mileageKm: 61400,
    engineCc: 2199,
    category: 'SUV',
    driveType: '4WD',
    seats: 7,
    doors: 5,
    color: 'Blanc Perle',
    chassisCode: 'KMHS381-492019',
    imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    galleryImages: [
      '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    ],
    isTopDrcSeller: false,
    isPopularLhd: true,
    popularRankLhd: 5,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Conduite à Gauche d\'Origine Corée', 'Sièges Chauffants & Ventilés', 'Toit Panoramique Ouvrant', 'Détecteur d\'Angle Mort', 'Coffre Électrique'],
    locationCity: 'Incheon, Corée du Sud',
    inspectionPassed: true,
  },
  {
    id: 'veh-10',
    refNo: 'BF-229481',
    make: 'TOYOTA',
    model: 'Probox Van 1.5 DX Comfort',
    year: 2018,
    priceUsd: 3200,
    originalPriceUsd: 3600,
    discountPercent: 11,
    estimatedShippingUsd: 1250,
    pointsReward: 30,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 92000,
    engineCc: 1496,
    category: 'Van',
    driveType: '2WD',
    seats: 5,
    doors: 5,
    color: 'Blanc Utilitaire',
    chassisCode: 'NCP160-019284',
    imageUrl: '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    galleryImages: [
      '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    ],
    isTopDrcSeller: true,
    topRankDrc: 5,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Modèle Réputé Hyper Résistant en RDC', 'Grande Capacité de Chargement', 'Entretien Économique', 'Climatisation', 'Double Airbag'],
    locationCity: 'Kobe, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-11',
    refNo: 'BF-771209',
    make: 'HYUNDAI',
    model: 'Palisade 3.8 Calligraphy LHD',
    year: 2022,
    priceUsd: 22419,
    originalPriceUsd: 25000,
    discountPercent: 10,
    estimatedShippingUsd: 1550,
    pointsReward: 50,
    stockCountry: 'Corée',
    originFlag: '🇰🇷',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 34000,
    engineCc: 3778,
    category: 'SUV',
    driveType: 'AWD',
    seats: 8,
    doors: 5,
    color: 'Gris Métallisé',
    chassisCode: 'KM8R74-881923',
    imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    galleryImages: [
      '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    ],
    isTopDrcSeller: false,
    isPopularLhd: true,
    popularRankLhd: 6,
    isSpecialOffer: false,
    isPrimeSeller: true,
    features: ['8 Vrais Sièges en Cuir Nappa', 'Double Toit Ouvrant', 'Son Harman Kardon 12HP', 'Affichage Tête Haute (HUD)', 'Assistance de Conduite Niveau 2'],
    locationCity: 'Busan, Corée du Sud',
    inspectionPassed: true,
  },
  {
    id: 'veh-12',
    refNo: 'BF-881920',
    make: 'MERCEDES-BENZ',
    model: 'G-Class G500 4x4 V8',
    year: 2020,
    priceUsd: 58500,
    originalPriceUsd: 64000,
    discountPercent: 9,
    estimatedShippingUsd: 1750,
    pointsReward: 80,
    stockCountry: 'Émirats arabes unis',
    originFlag: '🇦🇪',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 41000,
    engineCc: 3982,
    category: 'SUV',
    driveType: '4WD',
    seats: 5,
    doors: 5,
    color: 'Blanc Nacré',
    chassisCode: 'WDB463-276192',
    imageUrl: '/assets/images/car_mercedes_c_class_1791895943618.jpg',
    galleryImages: [
      '/assets/images/car_mercedes_c_class_1791895943618.jpg',
    ],
    isTopDrcSeller: false,
    isPopularLhd: true,
    popularRankLhd: 7,
    isSpecialOffer: false,
    isPrimeSeller: true,
    features: ['Moteur V8 BiTurbo 422ch', '3 Différentiels Autobloquants', 'Suspension Adaptative', 'Échappement Sport Latéral', 'Finition Exclusive Designo'],
    locationCity: 'Dubaï Auto Zone, EAU',
    inspectionPassed: true,
  },
  {
    id: 'veh-13',
    refNo: 'BF-332190',
    make: 'MAZDA',
    model: 'CX-5 SkyActiv-D 2.2 XD',
    year: 2021,
    priceUsd: 7890,
    originalPriceUsd: 8900,
    discountPercent: 11,
    estimatedShippingUsd: 1300,
    pointsReward: 30,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Diesel',
    mileageKm: 51200,
    engineCc: 2191,
    category: 'SUV',
    driveType: 'AWD',
    seats: 5,
    doors: 5,
    color: 'Rouge Soul Crystal',
    chassisCode: 'KF2P-192831',
    imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    galleryImages: ['/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg'],
    isTopDrcSeller: true,
    topRankDrc: 2,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Couleur Rouge Signature Mazda', 'Système Son Bose', 'Radar Anti-Collision', 'Caméra 360°', 'Intérieur Cuir'],
    locationCity: 'Hiroshima, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-14',
    refNo: 'BF-441298',
    make: 'TOYOTA',
    model: 'Probox Van 1.5 DX Comfort',
    year: 2018,
    priceUsd: 3420,
    originalPriceUsd: 3900,
    discountPercent: 12,
    estimatedShippingUsd: 1250,
    pointsReward: 20,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 98400,
    engineCc: 1496,
    category: 'Fourgonnette',
    driveType: '2WD',
    seats: 5,
    doors: 5,
    color: 'Blanc Banquise',
    chassisCode: 'NCP160V-003819',
    imageUrl: '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    galleryImages: ['/assets/images/car_toyota_corolla_sedan_1791895944170.jpg'],
    isTopDrcSeller: true,
    topRankDrc: 3,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Véhicule N°1 des Commerçants en RDC', 'Banquette Arrière Rabattable à Plat', 'Entretien Minimal', 'Suspension Renforcée'],
    locationCity: 'Nagoya, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-15',
    refNo: 'BF-551029',
    make: 'TOYOTA',
    model: 'Harrier 2.0 Elegance',
    year: 2020,
    priceUsd: 10200,
    originalPriceUsd: 11500,
    discountPercent: 11,
    estimatedShippingUsd: 1350,
    pointsReward: 40,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 59300,
    engineCc: 1986,
    category: 'SUV',
    driveType: '2WD',
    seats: 5,
    doors: 5,
    color: 'Blanc Perle',
    chassisCode: 'ZSU60W-019283',
    imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    galleryImages: ['/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg'],
    isTopDrcSeller: true,
    topRankDrc: 4,
    isSpecialOffer: false,
    isPrimeSeller: true,
    features: ['SUV de Luxe Japonais', 'Éclairage d\'ambiance LED', 'Toit Panoramique', 'Jantes Alliage 18"', 'Coffre Électrique'],
    locationCity: 'Yokohama, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-16',
    refNo: 'BF-662910',
    make: 'TOYOTA',
    model: 'Wish 1.8X 7 Places',
    year: 2017,
    priceUsd: 4150,
    originalPriceUsd: 4800,
    discountPercent: 14,
    estimatedShippingUsd: 1280,
    pointsReward: 20,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 89000,
    engineCc: 1797,
    category: 'Minibus',
    driveType: '2WD',
    seats: 7,
    doors: 5,
    color: 'Gris Argenté',
    chassisCode: 'ZGE20G-002918',
    imageUrl: '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    galleryImages: ['/assets/images/car_toyota_corolla_sedan_1791895944170.jpg'],
    isTopDrcSeller: true,
    topRankDrc: 5,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['7 Places Modulables', 'Moteur 2ZR Valvematic Fiable', 'Climatisation Automatique', 'Double Airbags'],
    locationCity: 'Kobe, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-17',
    refNo: 'BF-773819',
    make: 'JEEP',
    model: 'Wrangler Unlimited Sahara 4x4',
    year: 2021,
    priceUsd: 18600,
    originalPriceUsd: 21000,
    discountPercent: 11,
    estimatedShippingUsd: 1550,
    pointsReward: 60,
    stockCountry: 'Émirats arabes unis',
    originFlag: '🇦🇪',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 42000,
    engineCc: 3604,
    category: 'SUV',
    driveType: '4WD',
    seats: 5,
    doors: 4,
    color: 'Blanc Polaire',
    chassisCode: '1C4HJXEG4MW-551920',
    imageUrl: '/assets/images/car_toyota_hilux_pickup_1791895943609.jpg',
    galleryImages: ['/assets/images/car_toyota_hilux_pickup_1791895943609.jpg'],
    isTopDrcSeller: true,
    topRankDrc: 6,
    isPopularLhd: true,
    popularRankLhd: 1,
    isSpecialOffer: false,
    isPrimeSeller: true,
    features: ['Toit Amovible 3 Pièces', 'Système 4x4 Command-Trac', 'Écran Tactile Uconnect 8.4"', 'Pneus Tout-Terrain Neufs'],
    locationCity: 'Dubaï, EAU',
    inspectionPassed: true,
  },
  {
    id: 'veh-18',
    refNo: 'BF-884920',
    make: 'NISSAN',
    model: 'X-Trail 2.0 4WD 7 Places',
    year: 2019,
    priceUsd: 6350,
    originalPriceUsd: 7200,
    discountPercent: 12,
    estimatedShippingUsd: 1320,
    pointsReward: 30,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 67400,
    engineCc: 1997,
    category: 'SUV',
    driveType: '4WD',
    seats: 7,
    doors: 5,
    color: 'Noir Nacré',
    chassisCode: 'NT32-092817',
    imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    galleryImages: ['/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg'],
    isTopDrcSeller: true,
    topRankDrc: 8,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Mode 4x4 All-Mode 4x4-i', 'Sièges Chauffants', 'Hayon Mains Libres', 'Aide au Freinage d\'Urgence'],
    locationCity: 'Yokohama, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-19',
    refNo: 'BF-995819',
    make: 'MITSUBISHI',
    model: 'Fighter Camion Lourd 8 Tonnes',
    year: 2018,
    priceUsd: 24800,
    originalPriceUsd: 27500,
    discountPercent: 10,
    estimatedShippingUsd: 2200,
    pointsReward: 70,
    stockCountry: 'Émirats arabes unis',
    originFlag: '🇦🇪',
    steering: 'Left Hand Drive',
    transmission: 'Manuelle',
    fuel: 'Diesel',
    mileageKm: 112000,
    engineCc: 7545,
    category: 'Camion',
    driveType: '2WD',
    seats: 3,
    doors: 2,
    color: 'Blanc Commercial',
    chassisCode: 'FK617-772918',
    imageUrl: '/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg',
    galleryImages: ['/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg'],
    isRecommendedDubai: true,
    recommendedRankDubai: 1,
    isSpecialOffer: false,
    isPrimeSeller: true,
    features: ['Châssis Long Renforcé', 'Charge Utile 8 Tonnes', 'Frein sur Échappement', 'Cabine Couchette', 'Parfait pour Axes Kinshasa - Matadi'],
    locationCity: 'Charjah / Dubaï, EAU',
    inspectionPassed: true,
  },
  {
    id: 'veh-20',
    refNo: 'BF-106720',
    make: 'TOYOTA',
    model: 'Dyna Truck Double Cabine 2.5T',
    year: 2019,
    priceUsd: 13500,
    originalPriceUsd: 14900,
    discountPercent: 9,
    estimatedShippingUsd: 1600,
    pointsReward: 40,
    stockCountry: 'Émirats arabes unis',
    originFlag: '🇦🇪',
    steering: 'Left Hand Drive',
    transmission: 'Manuelle',
    fuel: 'Diesel',
    mileageKm: 78500,
    engineCc: 4009,
    category: 'Camion',
    driveType: '2WD',
    seats: 6,
    doors: 4,
    color: 'Blanc',
    chassisCode: 'XZU414-001928',
    imageUrl: '/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg',
    galleryImages: ['/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg'],
    isRecommendedDubai: true,
    recommendedRankDubai: 7,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Double Cabine 6 Personnes', 'Benne Ridelles Rabattables', 'Moteur Diesel N04C Très Robuste'],
    locationCity: 'Dubaï, EAU',
    inspectionPassed: true,
  },
  {
    id: 'veh-21',
    refNo: 'BF-117829',
    make: 'MITSUBISHI',
    model: 'Rosa Minibus 29 Places',
    year: 2019,
    priceUsd: 19800,
    originalPriceUsd: 22000,
    discountPercent: 10,
    estimatedShippingUsd: 2100,
    pointsReward: 60,
    stockCountry: 'Émirats arabes unis',
    originFlag: '🇦🇪',
    steering: 'Left Hand Drive',
    transmission: 'Manuelle',
    fuel: 'Diesel',
    mileageKm: 94000,
    engineCc: 4899,
    category: 'Minibus',
    driveType: '2WD',
    seats: 29,
    doors: 2,
    color: 'Blanc & Liseré Bleu',
    chassisCode: 'BE64DJ-019283',
    imageUrl: '/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg',
    galleryImages: ['/assets/images/car_mitsubishi_canter_truck_1791895943838.jpg'],
    isRecommendedDubai: true,
    recommendedRankDubai: 8,
    isSpecialOffer: false,
    isPrimeSeller: true,
    features: ['29 Sièges Haut Dossier', 'Porte Automatique Coulissante', 'Double Climatisation Plafonnier'],
    locationCity: 'Dubaï, EAU',
    inspectionPassed: true,
  },
  {
    id: 'veh-22',
    refNo: 'BF-128930',
    make: 'FORD',
    model: 'Explorer 2.3 EcoBoost 4WD LHD',
    year: 2020,
    priceUsd: 12400,
    originalPriceUsd: 14000,
    discountPercent: 11,
    estimatedShippingUsd: 1450,
    pointsReward: 40,
    stockCountry: 'Émirats arabes unis',
    originFlag: '🇦🇪',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 58000,
    engineCc: 2261,
    category: 'SUV',
    driveType: '4WD',
    seats: 7,
    doors: 5,
    color: 'Bleu Nuit Métallisé',
    chassisCode: '1FM5K8F85LG-991823',
    imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    galleryImages: ['/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg'],
    isPopularLhd: true,
    popularRankLhd: 3,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['7 Places', 'Terrain Management System', 'Double Écran Ford SYNC 3', 'Régulateur de Vitesse'],
    locationCity: 'Dubaï, EAU',
    inspectionPassed: true,
  },
  {
    id: 'veh-23',
    refNo: 'BF-139041',
    make: 'JEEP',
    model: 'Grand Cherokee Laredo 4x4 LHD',
    year: 2019,
    priceUsd: 14200,
    originalPriceUsd: 15800,
    discountPercent: 10,
    estimatedShippingUsd: 1480,
    pointsReward: 50,
    stockCountry: 'Émirats arabes unis',
    originFlag: '🇦🇪',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 66000,
    engineCc: 3604,
    category: 'SUV',
    driveType: '4WD',
    seats: 5,
    doors: 5,
    color: 'Gris Granite',
    chassisCode: '1C4RJFAG6KC-772819',
    imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    galleryImages: ['/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg'],
    isPopularLhd: true,
    popularRankLhd: 4,
    isSpecialOffer: false,
    isPrimeSeller: true,
    features: ['Quadra-Trac II 4WD', 'Sièges Électriques', 'Démarrage Sans Clé Keyless Go'],
    locationCity: 'Dubaï, EAU',
    inspectionPassed: true,
  },
  {
    id: 'veh-24',
    refNo: 'BF-140152',
    make: 'MERCEDES-BENZ',
    model: 'ML 350 / M-Class 4MATIC LHD',
    year: 2018,
    priceUsd: 8900,
    originalPriceUsd: 10200,
    discountPercent: 12,
    estimatedShippingUsd: 1400,
    pointsReward: 30,
    stockCountry: 'Émirats arabes unis',
    originFlag: '🇦🇪',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 82000,
    engineCc: 3498,
    category: 'SUV',
    driveType: '4WD',
    seats: 5,
    doors: 5,
    color: 'Argent Iridium',
    chassisCode: 'WDC166-057192',
    imageUrl: '/assets/images/car_mercedes_c_class_1791895943618.jpg',
    galleryImages: ['/assets/images/car_mercedes_c_class_1791895943618.jpg'],
    isPopularLhd: true,
    popularRankLhd: 5,
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Transmission Intégrale 4MATIC', 'Suspension Airmatic', 'Cuir Véritable', 'Phares Xénon'],
    locationCity: 'Dubaï, EAU',
    inspectionPassed: true,
  },
  {
    id: 'veh-25',
    refNo: 'BF-151263',
    make: 'MERCEDES-BENZ',
    model: 'GLE-Class GLE 450 AMG Line LHD',
    year: 2021,
    priceUsd: 28500,
    originalPriceUsd: 31500,
    discountPercent: 10,
    estimatedShippingUsd: 1600,
    pointsReward: 70,
    stockCountry: 'Émirats arabes unis',
    originFlag: '🇦🇪',
    steering: 'Left Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 39000,
    engineCc: 2999,
    category: 'SUV',
    driveType: '4WD',
    seats: 7,
    doors: 5,
    color: 'Bleu Cavansite',
    chassisCode: 'W1N167-159201',
    imageUrl: '/assets/images/car_mercedes_c_class_1791895943618.jpg',
    galleryImages: ['/assets/images/car_mercedes_c_class_1791895943618.jpg'],
    isPopularLhd: true,
    popularRankLhd: 8,
    isSpecialOffer: false,
    isPrimeSeller: true,
    features: ['Pack Aérodynamique AMG', 'Écran Panoramique Widescreen MBUX', 'Suspension Pneumatique', 'Toit Ouvrant Panoramique'],
    locationCity: 'Dubaï, EAU',
    inspectionPassed: true,
  },
  {
    id: 'veh-26',
    refNo: 'BF-162374',
    make: 'SUZUKI',
    model: 'Jimny 4x4 Sierra',
    year: 2019,
    priceUsd: 2980,
    originalPriceUsd: 3500,
    discountPercent: 15,
    estimatedShippingUsd: 1150,
    pointsReward: 20,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Manuelle',
    fuel: 'Essence',
    mileageKm: 54000,
    engineCc: 1460,
    category: 'SUV',
    driveType: '4WD',
    seats: 4,
    doors: 3,
    color: 'Vert Jungle',
    chassisCode: 'JB74W-102918',
    imageUrl: '/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg',
    galleryImages: ['/assets/images/car_toyota_land_cruiser_prado_1791895942113.jpg'],
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Châssis Échelle', 'Boîte de Transfert Manuelle 4WD', 'Poids Plume Franchisseur'],
    locationCity: 'Shizuoka, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-27',
    refNo: 'BF-173485',
    make: 'SUZUKI',
    model: 'Swift 1.2 Dualjet RS',
    year: 2020,
    priceUsd: 7090,
    originalPriceUsd: 7900,
    discountPercent: 10,
    estimatedShippingUsd: 1200,
    pointsReward: 20,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 47000,
    engineCc: 1242,
    category: 'Berline',
    driveType: '2WD',
    seats: 5,
    doors: 5,
    color: 'Blanc Perlé',
    chassisCode: 'ZC83S-192831',
    imageUrl: '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    galleryImages: ['/assets/images/car_toyota_corolla_sedan_1791895944170.jpg'],
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Finition Sport RS', 'Palettes au Volant', 'Consommation 4.5L/100km'],
    locationCity: 'Nagoya, Japon',
    inspectionPassed: true,
  },
  {
    id: 'veh-28',
    refNo: 'BF-184596',
    make: 'HONDA',
    model: 'N-WGN Custom G Turbo',
    year: 2021,
    priceUsd: 5240,
    originalPriceUsd: 5900,
    discountPercent: 11,
    estimatedShippingUsd: 1180,
    pointsReward: 20,
    stockCountry: 'Japon',
    originFlag: '🇯🇵',
    steering: 'Right Hand Drive',
    transmission: 'Automatique',
    fuel: 'Essence',
    mileageKm: 32000,
    engineCc: 658,
    category: 'Berline',
    driveType: '2WD',
    seats: 4,
    doors: 5,
    color: 'Bleu Métallique',
    chassisCode: 'JH3-102918',
    imageUrl: '/assets/images/car_toyota_corolla_sedan_1791895944170.jpg',
    galleryImages: ['/assets/images/car_toyota_corolla_sedan_1791895944170.jpg'],
    isSpecialOffer: true,
    isPrimeSeller: true,
    features: ['Honda SENSING', 'Phares LED', 'Espace Intérieur Incroyable', 'Bouton Start/Stop'],
    locationCity: 'Tokyo, Japon',
    inspectionPassed: true,
  },
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    authorName: 'Mushid Yav Daudet',
    country: 'D.R.Congo (Lubumbashi)',
    countryFlag: '🇨🇩',
    date: '06/Oct/2026',
    title: 'Mon Porsche Cayenne & Land Cruiser reçus à Matadi',
    comment: 'Le véhicule est propre, le moteur tourne comme une horloge et les formalités de transit depuis le port de Matadi jusqu’à Kinshasa ont été impeccables. Je recommande AutoForward sans hésiter !',
    modelPurchased: 'PORSCHE Cayenne / TOYOTA Prado',
    chassisCode: 'ABA-9PAM5501',
    rating: 5,
    likes: 15,
  },
  {
    id: 'rev-02',
    authorName: 'Abdoul Aziz',
    country: 'Burundi (Bujumbura via Dar es Salaam)',
    countryFlag: '🇧🇮',
    date: '25/Sep/2026',
    title: 'Thank you AutoForward, excellent Canter truck',
    comment: 'Thank you AutoForward. Goods truck received in perfect condition. Tested and trusted, you are number one in international car export to East Africa!',
    modelPurchased: 'MITSUBISHI Canter Truck',
    chassisCode: 'KK-FK61HD',
    rating: 5,
    likes: 12,
  },
  {
    id: 'rev-03',
    authorName: 'Nyakuza Adhako Sylvain',
    country: 'D.R.Congo (Kinshasa)',
    countryFlag: '🇨🇩',
    date: '23/Aug/2026',
    title: 'Sylvamotors - Land Cruiser Prado conforme aux photos',
    comment: 'Je suis très heureux de mon achat. Toutes les options décrites sur la fiche étaient présentes, le kilométrage certifié et le dédouanement à Boma s\'est déroulé sans surprise.',
    modelPurchased: 'TOYOTA Land Cruiser Prado',
    chassisCode: 'CBA-TRJ150W',
    rating: 5,
    likes: 18,
  },
  {
    id: 'rev-04',
    authorName: 'Rongbo Liu',
    country: 'Canada (Vancouver)',
    countryFlag: '🇨🇦',
    date: '31/Aug/2026',
    title: 'Great importing experience & fast paperwork',
    comment: 'Very professional, one stop car shopping. Export certificate and original Bill of Lading arrived by DHL before the vessel docked. Highly recommend.',
    modelPurchased: 'HONDA Fit / Jazz',
    chassisCode: 'DBA-GE7',
    rating: 5,
    likes: 9,
  },
];

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  readonly vehicles = signal<Vehicle[]>(INITIAL_VEHICLES);
  readonly ports = signal<DestinationPort[]>(INITIAL_PORTS);
  readonly reviews = signal<CustomerReview[]>(INITIAL_REVIEWS);

  // Active selected destination port for calculations
  readonly selectedPortId = signal<string>('matadi');

  // Favorites & Liked items state
  readonly favoriteIds = signal<string[]>(['veh-01', 'veh-02']);
  readonly likedReviewIds = signal<string[]>(['rev-01', 'rev-03']);
  readonly recentlyViewedIds = signal<string[]>(['veh-01', 'veh-02', 'veh-03', 'veh-04', 'veh-05']);
  readonly isFavoritesModalOpen = signal<boolean>(false);
  readonly catalogVisibleLimit = signal<number>(10);

  // Dedicated Model / Vehicle Results Page State
  readonly activePage = signal<'home' | 'model-vehicles'>('home');
  readonly selectedModelContext = signal<ModelPageContext>({
    title: 'TOYOTA Land Cruiser Prado',
    subtitle: 'Véhicules certifiés disponibles à l\'exportation',
    make: 'TOYOTA',
    model: 'Land Cruiser Prado',
    category: 'SUV',
    criterionType: 'make',
    badge: 'Top Vente RDC 🇨🇩',
    icon: 'directions_car',
  });

  // Selected vehicle for details / quotation modal
  readonly selectedVehicle = signal<Vehicle | null>(null);
  readonly isModalOpen = signal<boolean>(false);
  readonly isQuoteModalOpen = signal<boolean>(false);

  // Main filter state
  readonly filter = signal<VehicleFilterState>({
    make: '',
    model: '',
    minPrice: 0,
    maxPrice: 0,
    minYear: 0,
    maxYear: 0,
    steering: 'all',
    category: '',
    stockCountry: '',
    keyword: '',
    discountOnly: false,
    todaysOfferOnly: false,
    primeSellerOnly: false,
    activeTab: 'all',
  });

  readonly selectedPort = computed(() => {
    return this.ports().find((p) => p.id === this.selectedPortId()) ?? this.ports()[0];
  });

  readonly hasActiveFilters = computed(() => {
    const f = this.filter();
    return !!(
      f.make ||
      f.model ||
      f.category ||
      f.keyword ||
      f.stockCountry ||
      f.driveType ||
      f.fuelType ||
      f.transmission ||
      f.maxMileage ||
      f.bonusPointsOnly ||
      f.minPrice > 0 ||
      f.maxPrice > 0 ||
      f.discountOnly ||
      f.todaysOfferOnly ||
      f.primeSellerOnly ||
      (f.steering && f.steering !== 'all')
    );
  });

  // Filtered vehicles computed
  readonly filteredVehicles = computed(() => {
    const list = this.vehicles();
    const f = this.filter();

    return list.filter((v) => {
      // Keyword search
      if (f.keyword.trim()) {
        const kw = f.keyword.toLowerCase();
        const match =
          v.make.toLowerCase().includes(kw) ||
          v.model.toLowerCase().includes(kw) ||
          v.refNo.toLowerCase().includes(kw) ||
          v.category.toLowerCase().includes(kw) ||
          v.stockCountry.toLowerCase().includes(kw);
        if (!match) return false;
      }

      // Make
      if (f.make && v.make !== f.make) return false;

      // Model
      if (f.model && !v.model.toLowerCase().includes(f.model.toLowerCase())) return false;

      // Steering
      if (f.steering && f.steering !== 'all' && v.steering !== f.steering) return false;

      // Category
      if (f.category && v.category !== f.category) return false;

      // Stock country
      if (f.stockCountry && v.stockCountry !== f.stockCountry) return false;

      // Max price
      if (f.maxPrice > 0 && v.priceUsd > f.maxPrice) return false;

      // Min price
      if (f.minPrice > 0 && v.priceUsd < f.minPrice) return false;

      // Min year
      if (f.minYear > 0 && v.year < f.minYear) return false;

      // Max year
      if (f.maxYear > 0 && v.year > f.maxYear) return false;

      // Checkboxes
      if (f.discountOnly && (!v.discountPercent || v.discountPercent <= 0)) return false;
      if (f.todaysOfferOnly && !v.isSpecialOffer) return false;
      if (f.primeSellerOnly && !v.isPrimeSeller) return false;

      // Tab filters
      if (f.activeTab === 'new_arrivals' && v.year < 2021) return false;
      if (f.activeTab === 'sales' && (!v.discountPercent || v.discountPercent < 10)) return false;
      if (f.activeTab === 'luxury' && v.priceUsd < 20000) return false;
      if (f.activeTab === 'certified' && !v.isPrimeSeller) return false;

      // Drive type (4WD / AWD / 2WD)
      if (f.driveType && v.driveType !== f.driveType) return false;

      // Fuel type
      if (f.fuelType) {
        if (f.fuelType === 'Hybride_Electric') {
          if (v.fuel !== 'Hybride' && v.fuel !== 'Électrique') return false;
        } else if (v.fuel !== f.fuelType) {
          return false;
        }
      }

      // Transmission
      if (f.transmission && v.transmission !== f.transmission) return false;

      // Max mileage
      if (f.maxMileage && f.maxMileage > 0 && v.mileageKm > f.maxMileage) return false;

      // Bonus points
      if (f.bonusPointsOnly && (!v.pointsReward || v.pointsReward < 20)) return false;

      return true;
    });
  });

  // Highlight Collections
  readonly topDrcVehicles = computed(() => {
    return this.vehicles()
      .filter((v) => v.isTopDrcSeller)
      .sort((a, b) => (a.topRankDrc ?? 99) - (b.topRankDrc ?? 99));
  });

  readonly recommendedDubaiVehicles = computed(() => {
    return this.vehicles()
      .filter((v) => v.stockCountry === 'Émirats arabes unis' || v.isRecommendedDubai)
      .sort((a, b) => (a.recommendedRankDubai ?? 99) - (b.recommendedRankDubai ?? 99));
  });

  readonly popularLhdVehicles = computed(() => {
    return this.vehicles()
      .filter((v) => v.steering === 'Left Hand Drive')
      .sort((a, b) => (a.popularRankLhd ?? 99) - (b.popularRankLhd ?? 99));
  });

  readonly specialRewardVehicles = computed(() => {
    return this.vehicles().filter((v) => v.pointsReward >= 20);
  });

  readonly clearanceDealsVehicles = computed(() => {
    return this.vehicles()
      .filter((v) => (v.discountPercent ?? 0) > 0 || v.isSpecialOffer)
      .sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
  });

  readonly recommendedForYouVehicles = computed(() => {
    return this.vehicles()
      .filter((v) => v.isPrimeSeller || v.isSpecialOffer || (v.discountPercent ?? 0) >= 8)
      .slice(0, 5);
  });

  readonly recentlyViewedVehicles = computed(() => {
    const ids = this.recentlyViewedIds();
    const map = new Map(this.vehicles().map((v) => [v.id, v]));
    return ids.map((id) => map.get(id)).filter((v): v is Vehicle => !!v).slice(0, 5);
  });

  readonly paginatedCatalogVehicles = computed(() => {
    const all = this.filteredVehicles();
    const limit = this.catalogVisibleLimit();
    return all.slice(0, limit);
  });

  // Favorite vehicles computed collection
  readonly favoriteVehicles = computed(() => {
    const ids = this.favoriteIds();
    return this.vehicles().filter((v) => ids.includes(v.id));
  });

  // Liked customer reviews computed collection
  readonly likedReviews = computed(() => {
    const ids = this.likedReviewIds();
    return this.reviews().filter((r) => ids.includes(r.id));
  });

  // Dedicated Model / Vehicle Results Page Vehicles Collection
  readonly modelPageVehicles = computed(() => {
    const ctx = this.selectedModelContext();
    const all = this.vehicles();
    if (!ctx) return all;

    let list: Vehicle[] = [];
    if (ctx.criterionType === 'make' && ctx.make) {
      const targetMake = ctx.make.toUpperCase().trim();
      list = all.filter((v) => v.make.toUpperCase() === targetMake || v.model.toUpperCase().includes(targetMake));
      if (list.length === 0) {
        list = all.slice(0, 5);
      }
    } else if (ctx.criterionType === 'category' && ctx.category) {
      const cat = ctx.category.toLowerCase().trim();
      list = all.filter((v) => v.category.toLowerCase() === cat || (cat === 'camion' && v.category === 'Camion'));
      if (list.length === 0) {
        list = all.filter((v) => v.category === 'SUV' || v.category === 'Berline' || v.category === 'Pick up');
      }
    } else if (ctx.criterionType === 'price') {
      const f = this.filter();
      list = all.filter((v) => {
        if (f.minPrice && v.priceUsd < f.minPrice) return false;
        if (f.maxPrice && v.priceUsd > f.maxPrice) return false;
        return true;
      });
      if (list.length === 0) list = all.slice(0, 5);
    } else if (ctx.criterionType === 'discount') {
      list = all.filter((v) => (v.discountPercent ?? 0) >= 10 || v.isSpecialOffer);
      if (list.length === 0) list = all.slice(0, 5);
    } else if (ctx.criterionType === 'stock' && ctx.criterionValue) {
      list = all.filter((v) => v.stockCountry === ctx.criterionValue);
      if (list.length === 0) list = all.slice(0, 5);
    } else if (ctx.criterionType === 'special') {
      list = all.filter((v) => v.isSpecialOffer || (v.discountPercent ?? 0) > 0);
      if (list.length === 0) list = all.slice(0, 5);
    } else {
      list = this.filteredVehicles();
      if (list.length === 0) list = all.slice(0, 5);
    }

    return [...list].sort((a, b) => {
      const aCustom = a.imageUrl.includes('car_');
      const bCustom = b.imageUrl.includes('car_');
      if (aCustom && !bCustom) return -1;
      if (!aCustom && bCustom) return 1;
      return 0;
    });
  });

  // Counts by Make
  readonly makeCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const v of this.vehicles()) {
      counts[v.make] = (counts[v.make] ?? 0) + 1;
    }
    return counts;
  });

  // Make list
  readonly distinctMakes = computed(() => {
    return Array.from(new Set(this.vehicles().map((v) => v.make))).sort();
  });

  // Models for selected make
  readonly modelsForSelectedMake = computed(() => {
    const make = this.filter().make;
    if (!make) {
      return Array.from(new Set(this.vehicles().map((v) => v.model))).sort();
    }
    return Array.from(
      new Set(this.vehicles().filter((v) => v.make === make).map((v) => v.model))
    ).sort();
  });

  setFilter(changes: Partial<VehicleFilterState>) {
    this.filter.update((curr) => ({ ...curr, ...changes }));
  }

  resetFilter() {
    this.filter.set({
      make: '',
      model: '',
      minPrice: 0,
      maxPrice: 0,
      minYear: 0,
      maxYear: 0,
      steering: 'all',
      category: '',
      stockCountry: '',
      keyword: '',
      discountOnly: false,
      todaysOfferOnly: false,
      primeSellerOnly: false,
      activeTab: 'all',
      driveType: undefined,
      fuelType: undefined,
      transmission: undefined,
      maxMileage: undefined,
      bonusPointsOnly: false,
    });
  }

  recordRecentlyViewed(vehicleId: string) {
    this.recentlyViewedIds.update((ids) => [vehicleId, ...ids.filter((id) => id !== vehicleId)].slice(0, 10));
  }

  clearRecentlyViewed() {
    this.recentlyViewedIds.set([]);
  }

  loadMoreCatalog() {
    this.catalogVisibleLimit.update((c) => c + 10);
  }

  showAllCatalog() {
    this.catalogVisibleLimit.set(this.filteredVehicles().length);
  }

  navigateToModel(context: ModelPageContext) {
    this.selectedModelContext.set(context);
    // Sync filter
    if (context.criterionType === 'make' && context.make) {
      this.setFilter({ make: context.make, model: '', category: '' });
    } else if (context.criterionType === 'category' && context.category) {
      this.setFilter({ category: context.category, make: '', model: '' });
    }
    this.activePage.set('model-vehicles');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  navigateToHome() {
    this.activePage.set('home');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  selectVehicle(vehicle: Vehicle) {
    this.recordRecentlyViewed(vehicle.id);
    this.selectedVehicle.set(vehicle);
    this.isModalOpen.set(true);
  }

  openQuoteModal(vehicle: Vehicle) {
    this.selectedVehicle.set(vehicle);
    this.isQuoteModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  closeQuoteModal() {
    this.isQuoteModalOpen.set(false);
  }

  openFavoritesModal() {
    this.isFavoritesModalOpen.set(true);
  }

  closeFavoritesModal() {
    this.isFavoritesModalOpen.set(false);
  }

  clearAllFavorites() {
    this.favoriteIds.set([]);
  }

  removeFavorite(vehicleId: string) {
    this.favoriteIds.update((favs) => favs.filter((id) => id !== vehicleId));
  }

  toggleLikeReview(reviewId: string) {
    this.likedReviewIds.update((ids) => {
      if (ids.includes(reviewId)) {
        return ids.filter((id) => id !== reviewId);
      }
      return [...ids, reviewId];
    });
  }

  isReviewLiked(reviewId: string): boolean {
    return this.likedReviewIds().includes(reviewId);
  }

  toggleFavorite(vehicleId: string) {
    this.favoriteIds.update((favs) => {
      if (favs.includes(vehicleId)) {
        return favs.filter((id) => id !== vehicleId);
      }
      return [...favs, vehicleId];
    });
  }

  isFavorite(vehicleId: string): boolean {
    return this.favoriteIds().includes(vehicleId);
  }

  setDestinationPort(portId: string) {
    this.selectedPortId.set(portId);
  }

  calculateTotalCif(vehicle: Vehicle, portId?: string): number {
    const pId = portId ?? this.selectedPortId();
    const port = this.ports().find((p) => p.id === pId) ?? this.selectedPort();
    // Vehicle price + Port freight + Marine insurance ($120) + Port documentation ($80)
    return vehicle.priceUsd + port.baseOceanFreightUsd + 120 + 80;
  }

  // ==============================================================
  // ADMIN & INDEPENDENT OWNER MANAGEMENT (Contrôle Propriétaire)
  // ==============================================================
  readonly platformCommissionPercent = signal<number>(5);
  readonly customExchangeRateUsdToCdf = signal<number>(2850);

  readonly adminQuotations = signal<{
    id: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    city: string;
    vehicleTitle: string;
    priceUsd: number;
    destinationPort: string;
    date: string;
    status: 'Nouveau' | 'Devis Envoyé' | 'Paiement Reçu' | 'Livré';
    notes?: string;
  }[]>([
    {
      id: 'DEV-2026-001',
      clientName: 'Marc Kabamba',
      clientEmail: 'marc.kabamba@autoforward-congo.cd',
      clientPhone: '+243 81 234 5678',
      city: 'Kinshasa / Gombe',
      vehicleTitle: 'Toyota Hilux Double Cabine 2021',
      priceUsd: 14800,
      destinationPort: 'Port de Boma (RDC)',
      date: '16 Mars 2026',
      status: 'Devis Envoyé',
      notes: 'Demande d\'inspection JEVIC + dédouanement express',
    },
    {
      id: 'DEV-2026-002',
      clientName: 'Albert Tshisekedi',
      clientEmail: 'albert.tshis@gmail.com',
      clientPhone: '+243 99 876 5432',
      city: 'Lubumbashi',
      vehicleTitle: 'Toyota Land Cruiser Prado TX 2020',
      priceUsd: 22400,
      destinationPort: 'Port de Dar es Salaam',
      date: '17 Mars 2026',
      status: 'Nouveau',
      notes: 'Livraison corridor Tanzanie vers Haut-Katanga',
    },
    {
      id: 'DEV-2026-003',
      clientName: 'Chantal Mwamba',
      clientEmail: 'c.mwamba@katanga-mining.cd',
      clientPhone: '+243 82 456 7890',
      city: 'Kolwezi',
      vehicleTitle: 'Toyota RAV4 Hybrid 2022',
      priceUsd: 18500,
      destinationPort: 'Port de Matadi',
      date: '18 Mars 2026',
      status: 'Paiement Reçu',
      notes: 'Acompte FOB 50% versé via TMB Bank',
    },
  ]);

  addVehicle(newVeh: Vehicle) {
    this.vehicles.update((list) => [newVeh, ...list]);
  }

  updateVehiclePrice(vehicleId: string, newFobPrice: number) {
    this.vehicles.update((list) =>
      list.map((v) => (v.id === vehicleId ? { ...v, priceUsd: newFobPrice } : v))
    );
  }

  updateVehicleStatus(vehicleId: string, status: 'Disponible' | 'Réservé' | 'Vendu') {
    this.vehicles.update((list) =>
      list.map((v) => (v.id === vehicleId ? { ...v, status } : v))
    );
  }

  deleteVehicle(vehicleId: string) {
    this.vehicles.update((list) => list.filter((v) => v.id !== vehicleId));
  }

  updatePortFreight(portId: string, newFreightUsd: number) {
    this.ports.update((list) =>
      list.map((p) => (p.id === portId ? { ...p, baseOceanFreightUsd: newFreightUsd } : p))
    );
  }

  updateQuotationStatus(
    quoteId: string,
    newStatus: 'Nouveau' | 'Devis Envoyé' | 'Paiement Reçu' | 'Livré'
  ) {
    this.adminQuotations.update((list) =>
      list.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
    );
  }

  addQuotationLead(quote: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    city: string;
    vehicleTitle: string;
    priceUsd: number;
    destinationPort: string;
    notes?: string;
  }) {
    const newLead = {
      id: 'DEV-2026-' + Math.floor(100 + Math.random() * 900),
      ...quote,
      date: 'Aujourd\'hui',
      status: 'Nouveau' as const,
    };
    this.adminQuotations.update((list) => [newLead, ...list]);
  }

  setPlatformCommission(percent: number) {
    this.platformCommissionPercent.set(percent);
  }

  setCustomExchangeRateCdf(rate: number) {
    this.customExchangeRateUsdToCdf.set(rate);
  }
}

