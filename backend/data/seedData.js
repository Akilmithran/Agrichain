// Initial Seed Data for AgriChain Direct

const initialCommodities = [
  {
    id: 'comm-1',
    name: 'Tomato',
    variety: 'Shivam Hybrid / Roma',
    category: 'highly_perishable',
    categoryLabel: 'Highly Perishable',
    mspFloor: 14.00,
    defaultCultivationCostPerKg: 12.00,
    shelfLifeDays: 10,
    storageRequirement: 'Cold pre-cooled 12°C - 15°C, 85-90% RH',
    qualityParameters: ['Brix: >4.5', 'Firmness: >4.5 kg/cm²', 'Size: 55-65mm', 'Defects: <2%']
  },
  {
    id: 'comm-2',
    name: 'Palak / Spinach',
    variety: 'All Green Exotic',
    category: 'ultra_perishable',
    categoryLabel: 'Ultra Perishable',
    mspFloor: 16.00,
    defaultCultivationCostPerKg: 14.00,
    shelfLifeDays: 3,
    storageRequirement: 'Immediate cold chain 4°C, high humidity micro-vent packs',
    qualityParameters: ['Crispness: High', 'Yellow leaves: 0%', 'Pesticide residue: Nil']
  },
  {
    id: 'comm-3',
    name: 'Onion',
    variety: 'Nashik Red Globe',
    category: 'moderately_perishable',
    categoryLabel: 'Moderately Perishable',
    mspFloor: 18.00,
    defaultCultivationCostPerKg: 15.00,
    shelfLifeDays: 60,
    storageRequirement: 'Well-ventilated ambient dry storage 20°C - 25°C, 65% RH',
    qualityParameters: ['Neck tightness: Good', 'Sprouting: 0%', 'Size: 45-55mm']
  },
  {
    id: 'comm-4',
    name: 'Basmati Rice (Paddy)',
    variety: 'Pusa 1121 Premium',
    category: 'storable',
    categoryLabel: 'Storable Grain',
    mspFloor: 28.00,
    defaultCultivationCostPerKg: 22.00,
    shelfLifeDays: 365,
    storageRequirement: 'Hermetic dry silos, moisture <12%',
    qualityParameters: ['Grain length: >8.2mm', 'Moisture: 11.5%', 'Aroma: High']
  }
];

const initialFarmers = [
  {
    id: 'farmer-1',
    name: 'Ramesh Gowda',
    phone: '+91 98451 23451',
    village: 'Hoskote Taluk, Kolar Cluster',
    state: 'Karnataka',
    fpoId: 'fpo-1',
    landAreaAcres: 2.5,
    soilType: 'Red Loam',
    experienceYears: 14,
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=60',
    preferredLanguage: 'kn' // Kannada
  },
  {
    id: 'farmer-2',
    name: 'Suresh Patil',
    phone: '+91 94482 78129',
    village: 'Chintamani, Chikkaballapur',
    state: 'Karnataka',
    fpoId: 'fpo-1',
    landAreaAcres: 3.0,
    soilType: 'Alluvial Loam',
    experienceYears: 18,
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
    preferredLanguage: 'kn'
  },
  {
    id: 'farmer-3',
    name: 'Lakshmi Devi',
    phone: '+91 99003 45612',
    village: 'Malur Rural, Kolar',
    state: 'Karnataka',
    fpoId: 'fpo-1',
    landAreaAcres: 4.2,
    soilType: 'Clay Loam',
    experienceYears: 12,
    rating: 5.0,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    preferredLanguage: 'kn'
  },
  {
    id: 'farmer-4',
    name: 'Rajesh Kumar',
    phone: '+91 97112 88401',
    village: 'Devanahalli Organic Belt',
    state: 'Karnataka',
    fpoId: 'fpo-1',
    landAreaAcres: 2.0,
    soilType: 'Rich Humus',
    experienceYears: 9,
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
    preferredLanguage: 'hi' // Hindi
  }
];

const initialFpos = [
  {
    id: 'fpo-1',
    name: 'GreenHarvest Farmers Producer Co. Ltd.',
    code: 'FPO-KA-KOLAR-09',
    district: 'Kolar & Chikkaballapur',
    state: 'Karnataka',
    contactPerson: 'M. Chennappa (Managing Director)',
    contactPhone: '+91 94480 11223',
    totalMembers: 480,
    collectionCentres: [
      { id: 'cc-1', name: 'Kolar Central Aggregation Hub', capacityKg: 50000, coldStorageAvailable: true },
      { id: 'cc-2', name: 'Malur Rural Collection Point', capacityKg: 20000, coldStorageAvailable: false }
    ],
    storageCapacityKg: 70000,
    coldStorageCapacityKg: 25000,
    currentStockKg: 14200,
    activeLotsCount: 6,
    bankAccount: {
      accountName: 'GreenHarvest FPO Escrow Payout A/C',
      accountNumber: '920020084719234',
      ifsc: 'SBIN0004128'
    }
  },
  {
    id: 'fpo-2',
    name: 'Sahyadri Organic Agro FPO',
    code: 'FPO-KA-SHIM-03',
    district: 'Shimoga',
    state: 'Karnataka',
    contactPerson: 'Ananth Hegde (Director)',
    contactPhone: '+91 98860 99441',
    totalMembers: 320,
    collectionCentres: [
      { id: 'cc-3', name: 'Thirthahalli Hub', capacityKg: 30000, coldStorageAvailable: true }
    ],
    storageCapacityKg: 40000,
    coldStorageCapacityKg: 15000,
    currentStockKg: 8500,
    activeLotsCount: 3
  }
];

const initialBuyers = [
  {
    id: 'buyer-1',
    name: 'Grand Hyatt Regency & Luxury Cafeterias',
    type: 'Hotel & Hospitality Chain',
    location: 'Bengaluru Central & Outer Ring Road',
    contactPerson: 'Chef Vikram Malhotra (Head of Culinary Procurement)',
    phone: '+91 98200 44881',
    email: 'procurement@grandhyattblr.com',
    creditRating: 'AAA',
    reliabilityScore: 98,
    paymentSpeedAvgDays: 1.2,
    disputeRatePercent: 0.4,
    preferredDeliveryTime: '06:00 AM - 08:30 AM IST',
    avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&auto=format&fit=crop&q=60'
  },
  {
    id: 'buyer-2',
    name: 'BigBasket Fresh Regional Hub',
    type: 'Supermarket / Quick Commerce',
    location: 'Whitefield Distribution Hub, Bengaluru',
    contactPerson: 'Sunil Rao (Category Manager - Fresh)',
    phone: '+91 99800 77112',
    email: 'vendor.fresh@bigbasket.com',
    creditRating: 'AAA',
    reliabilityScore: 96,
    paymentSpeedAvgDays: 2.0,
    disputeRatePercent: 1.1,
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=60'
  },
  {
    id: 'buyer-3',
    name: 'Metro Cash & Carry Wholesale',
    type: 'Wholesale Buyer / Processor',
    location: 'Yeshwanthpur Wholesale Center, Bengaluru',
    contactPerson: 'P. Nair (Lead Sourcing Officer)',
    phone: '+91 97400 33221',
    email: 'pnair@metro.co.in',
    creditRating: 'AA+',
    reliabilityScore: 95,
    paymentSpeedAvgDays: 1.8,
    disputeRatePercent: 0.8,
    avatar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=60'
  },
  {
    id: 'buyer-4',
    name: 'Infosys Green Dining Cafeterias',
    type: 'Corporate Cafeteria Chain',
    location: 'Electronic City Phase 1, Bengaluru',
    contactPerson: 'Meera Krishnan (Facility & Food Services)',
    phone: '+91 96110 55992',
    email: 'dining.ops@infosys-dining.com',
    creditRating: 'AAA',
    reliabilityScore: 99,
    paymentSpeedAvgDays: 1.0,
    disputeRatePercent: 0.2,
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=60'
  }
];

const initialSupplyDeclarations = [
  {
    id: 'sup-1',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Gowda',
    commodity: 'Tomato',
    variety: 'Shivam Hybrid',
    category: 'highly_perishable',
    cultivatedAreaAcres: 0.8,
    expectedYieldKg: 350,
    marketableQuantityKg: 300,
    harvestWindowStart: '2026-11-10',
    harvestWindowEnd: '2026-11-18',
    farmLocation: 'Hoskote, Kolar Cluster',
    expectedGrade: 'Grade A',
    cultivationCostPerKg: 12.00,
    minAcceptableNetPrice: 16.00,
    status: 'Planned Supply',
    fpoId: 'fpo-1',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'sup-2',
    farmerId: 'farmer-2',
    farmerName: 'Suresh Patil',
    commodity: 'Tomato',
    variety: 'Shivam Hybrid',
    category: 'highly_perishable',
    cultivatedAreaAcres: 1.2,
    expectedYieldKg: 580,
    marketableQuantityKg: 500,
    harvestWindowStart: '2026-11-12',
    harvestWindowEnd: '2026-11-20',
    farmLocation: 'Chintamani, Chikkaballapur',
    expectedGrade: 'Grade A',
    cultivationCostPerKg: 12.50,
    minAcceptableNetPrice: 16.50,
    status: 'Planned Supply',
    fpoId: 'fpo-1',
    createdAt: '2026-09-02T11:30:00Z'
  },
  {
    id: 'sup-3',
    farmerId: 'farmer-3',
    farmerName: 'Lakshmi Devi',
    commodity: 'Tomato',
    variety: 'Shivam Hybrid',
    category: 'highly_perishable',
    cultivatedAreaAcres: 1.8,
    expectedYieldKg: 800,
    marketableQuantityKg: 700,
    harvestWindowStart: '2026-11-10',
    harvestWindowEnd: '2026-11-20',
    farmLocation: 'Malur Rural, Kolar',
    expectedGrade: 'Grade A',
    cultivationCostPerKg: 11.80,
    minAcceptableNetPrice: 15.80,
    status: 'Planned Supply',
    fpoId: 'fpo-1',
    createdAt: '2026-09-02T14:15:00Z'
  },
  {
    id: 'sup-4',
    farmerId: 'farmer-4',
    farmerName: 'Rajesh Kumar',
    commodity: 'Palak / Spinach',
    variety: 'All Green Exotic',
    category: 'ultra_perishable',
    cultivatedAreaAcres: 0.5,
    expectedYieldKg: 400,
    marketableQuantityKg: 350,
    harvestWindowStart: '2026-09-12',
    harvestWindowEnd: '2026-09-15',
    farmLocation: 'Devanahalli Organic Belt',
    expectedGrade: 'Grade A',
    cultivationCostPerKg: 14.00,
    minAcceptableNetPrice: 18.00,
    status: 'Planned Supply',
    fpoId: 'fpo-1',
    createdAt: '2026-09-05T09:00:00Z'
  }
];

const initialDemandRequests = [
  {
    id: 'dem-1',
    buyerId: 'buyer-1',
    buyerName: 'Grand Hyatt Regency & Luxury Cafeterias',
    buyerType: 'Hotel & Hospitality Chain',
    commodity: 'Tomato',
    variety: 'Shivam Hybrid / Roma',
    requiredQuantityKg: 1500,
    qualityGrade: 'Grade A',
    maxPricePerKg: 28.00,
    deliveryLocation: 'Grand Hyatt Central Receiving Bay, Outer Ring Road, Bengaluru',
    deliveryDate: '2026-11-18',
    isRecurring: true,
    recurrencePattern: 'Weekly on Wednesdays for 3 Months',
    packagingRequirements: 'Ventilated 20kg food-grade plastic crates, sanitized',
    paymentTerms: 'Instant Escrow Settlement on Digital Acceptance (T+0)',
    cancellationTerms: '72 hours notice; 15% cancellation fee applies if produce already harvested',
    acceptedSubstitutes: 'Roma Vine Tomatoes Grade A accepted if Brix >5.0',
    status: 'Open',
    createdAt: '2026-09-03T08:30:00Z'
  },
  {
    id: 'dem-2',
    buyerId: 'buyer-3',
    buyerName: 'Metro Cash & Carry Wholesale',
    buyerType: 'Wholesale Buyer / Processor',
    commodity: 'Tomato',
    variety: 'Shivam Hybrid / Roma',
    requiredQuantityKg: 1500,
    qualityGrade: 'Grade A',
    maxPricePerKg: 28.50,
    deliveryLocation: 'Yeshwanthpur Wholesale Hub, Bengaluru',
    deliveryDate: '2026-11-19',
    isRecurring: false,
    packagingRequirements: 'Standard 25kg wooden/corrugated crates',
    paymentTerms: 'Instant Escrow Settlement on Gate Weighing',
    cancellationTerms: '48 hours prior notice',
    acceptedSubstitutes: 'Grade A / Grade B+ Shivam',
    status: 'Open',
    createdAt: '2026-09-04T12:00:00Z'
  },
  {
    id: 'dem-3',
    buyerId: 'buyer-4',
    buyerName: 'Infosys Green Dining Cafeterias',
    buyerType: 'Corporate Cafeteria Chain',
    commodity: 'Tomato',
    variety: 'Shivam Hybrid',
    requiredQuantityKg: 1500,
    qualityGrade: 'Grade A',
    maxPricePerKg: 29.00,
    deliveryLocation: 'Electronic City Phase 1 Main Food Court, Bengaluru',
    deliveryDate: '2026-11-18',
    isRecurring: true,
    recurrencePattern: 'Bi-weekly for 4 Months',
    packagingRequirements: 'Reusable stackable crates',
    paymentTerms: 'Pre-funded Escrow released upon QR scan',
    cancellationTerms: 'Strict no-cancellation conditional commitment',
    acceptedSubstitutes: 'None',
    status: 'Open',
    createdAt: '2026-09-05T15:00:00Z'
  }
];

const initialAlerts = [
  {
    id: 'alt-1',
    targetRole: 'Farmer',
    targetId: 'farmer-1',
    type: 'NEW_MATCH',
    title: 'AI Match Found for Tomato Cultivation!',
    message: 'Grand Hyatt Regency matched your 300kg Tomato planned harvest. Expected Net Realization: ₹22.16/kg (+₹6.16 above your MNR).',
    severity: 'success',
    isRead: false,
    timestamp: '2026-09-07T08:15:00Z'
  },
  {
    id: 'alt-2',
    targetRole: 'FPO',
    targetId: 'fpo-1',
    type: 'NEW_MATCH',
    title: 'Supply Aggregation Opportunity (1,500 kg)',
    message: 'Combined Tomatoes from Farmer Ramesh (300kg), Suresh (500kg), and Lakshmi (700kg) match Grand Hyatt weekly demand of 1,500kg.',
    severity: 'info',
    isRead: false,
    timestamp: '2026-09-07T08:20:00Z'
  },
  {
    id: 'alt-3',
    targetRole: 'Admin',
    targetId: 'admin',
    type: 'PRICE_BELOW_MNR',
    title: 'MNR Protection Shield Active',
    message: 'All 3 constituent tomato farmers are protected with Minimum Net Realization floors between ₹15.80 and ₹16.50/kg.',
    severity: 'info',
    isRead: true,
    timestamp: '2026-09-07T08:00:00Z'
  }
];

module.exports = {
  initialCommodities,
  initialFarmers,
  initialFpos,
  initialBuyers,
  initialSupplyDeclarations,
  initialDemandRequests,
  initialAlerts
};
