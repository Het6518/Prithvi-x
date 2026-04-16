export const testimonials = [
  {
    name: "Savitri Patel",
    village: "Anand",
    quote:
      "Prithvix helped our dealer team track udhaar and follow-up visits without the usual confusion."
  },
  {
    name: "Mukesh Jat",
    village: "Nagaur",
    quote:
      "The village-wise map and QR farmer cards made field operations feel finally under control."
  },
  {
    name: "Rakesh Chavan",
    village: "Satara",
    quote:
      "Our staff use Marathi chat support daily when advising growers on crop stress and recovery."
  }
];

// City → lat/lng geocoding lookup for Indian agricultural cities
export const cityGeocodeLookup: Record<string, { lat: number; lng: number }> = {
  // Rajasthan
  kherli: { lat: 27.211, lng: 76.854 },
  nagaur: { lat: 27.202, lng: 73.736 },
  jodhpur: { lat: 26.293, lng: 73.023 },
  jaipur: { lat: 26.912, lng: 75.787 },
  udaipur: { lat: 24.585, lng: 73.712 },
  kota: { lat: 25.180, lng: 75.864 },
  ajmer: { lat: 26.453, lng: 74.639 },
  // Gujarat
  anand: { lat: 22.556, lng: 72.951 },
  bhanpur: { lat: 22.307, lng: 73.181 },
  rajkot: { lat: 22.303, lng: 70.802 },
  ahmedabad: { lat: 23.023, lng: 72.571 },
  surat: { lat: 21.170, lng: 72.831 },
  vadodara: { lat: 22.310, lng: 73.192 },
  junagadh: { lat: 21.522, lng: 70.457 },
  // Madhya Pradesh
  piploda: { lat: 23.334, lng: 75.037 },
  indore: { lat: 22.720, lng: 75.858 },
  bhopal: { lat: 23.259, lng: 77.412 },
  ujjain: { lat: 23.182, lng: 75.776 },
  // Maharashtra
  satara: { lat: 17.680, lng: 74.000 },
  pune: { lat: 18.520, lng: 73.856 },
  nashik: { lat: 19.998, lng: 73.791 },
  nagpur: { lat: 21.146, lng: 79.088 },
  kolhapur: { lat: 16.705, lng: 74.243 },
  // Uttar Pradesh
  lucknow: { lat: 26.846, lng: 80.946 },
  agra: { lat: 27.176, lng: 78.008 },
  varanasi: { lat: 25.321, lng: 83.010 },
  // Punjab / Haryana
  ludhiana: { lat: 30.901, lng: 75.857 },
  amritsar: { lat: 31.634, lng: 74.872 },
  karnal: { lat: 29.691, lng: 76.983 },
  // South
  mysuru: { lat: 12.296, lng: 76.639 },
  hyderabad: { lat: 17.385, lng: 78.486 },
  // General default (central India)
  laxmipura: { lat: 24.585, lng: 73.712 }
};

export const fallbackFarmers = [
  {
    id: "far-1",
    name: "Asha Rathore",
    village: "Kherli",
    mobile: "9876543210",
    cropType: "Cotton",
    loyaltyTier: "GOLD" as const,
    totalVisits: 6,
    outstandingAmount: 12000,
    latitude: 27.211,
    longitude: 76.854,
    createdAt: new Date("2026-02-11T10:30:00.000Z")
  },
  {
    id: "far-2",
    name: "Ratan Meghwal",
    village: "Laxmipura",
    mobile: "9898987676",
    cropType: "Soybean",
    loyaltyTier: "SILVER" as const,
    totalVisits: 4,
    outstandingAmount: 42000,
    latitude: 24.585,
    longitude: 73.712,
    createdAt: new Date("2026-01-18T08:15:00.000Z")
  },
  {
    id: "far-3",
    name: "Meena Solanki",
    village: "Bhanpur",
    mobile: "9811198111",
    cropType: "Wheat",
    loyaltyTier: "BRONZE" as const,
    totalVisits: 3,
    outstandingAmount: 0,
    latitude: 22.307,
    longitude: 73.181,
    createdAt: new Date("2026-03-05T11:45:00.000Z")
  },
  {
    id: "far-4",
    name: "Gopal Choudhary",
    village: "Piploda",
    mobile: "9797971212",
    cropType: "Maize",
    loyaltyTier: "GOLD" as const,
    totalVisits: 5,
    outstandingAmount: 18500,
    latitude: 23.334,
    longitude: 75.037,
    createdAt: new Date("2026-02-23T09:00:00.000Z")
  },
  {
    id: "far-5",
    name: "Bhavna Desai",
    village: "Anand",
    mobile: "9123456789",
    cropType: "Groundnut",
    loyaltyTier: "SILVER" as const,
    totalVisits: 7,
    outstandingAmount: 8500,
    latitude: 22.556,
    longitude: 72.951,
    createdAt: new Date("2026-01-29T14:00:00.000Z")
  },
  {
    id: "far-6",
    name: "Suraj Patil",
    village: "Nashik",
    mobile: "9234567890",
    cropType: "Grape",
    loyaltyTier: "GOLD" as const,
    totalVisits: 9,
    outstandingAmount: 35000,
    latitude: 19.998,
    longitude: 73.791,
    createdAt: new Date("2026-03-12T07:30:00.000Z")
  },
  {
    id: "far-7",
    name: "Kavita Sharma",
    village: "Jaipur",
    mobile: "9345678901",
    cropType: "Mustard",
    loyaltyTier: "BRONZE" as const,
    totalVisits: 2,
    outstandingAmount: 5200,
    latitude: 26.912,
    longitude: 75.787,
    createdAt: new Date("2026-04-01T10:00:00.000Z")
  },
  {
    id: "far-8",
    name: "Ramesh Yadav",
    village: "Indore",
    mobile: "9456789012",
    cropType: "Soybean",
    loyaltyTier: "SILVER" as const,
    totalVisits: 4,
    outstandingAmount: 22000,
    latitude: 22.720,
    longitude: 75.858,
    createdAt: new Date("2026-02-15T08:00:00.000Z")
  },
  {
    id: "far-9",
    name: "Devika Nair",
    village: "Pune",
    mobile: "9567890123",
    cropType: "Sugarcane",
    loyaltyTier: "GOLD" as const,
    totalVisits: 8,
    outstandingAmount: 28000,
    latitude: 18.520,
    longitude: 73.856,
    createdAt: new Date("2026-03-20T11:00:00.000Z")
  },
  {
    id: "far-10",
    name: "Arjun Singh",
    village: "Ludhiana",
    mobile: "9678901234",
    cropType: "Rice",
    loyaltyTier: "BRONZE" as const,
    totalVisits: 3,
    outstandingAmount: 15000,
    latitude: 30.901,
    longitude: 75.857,
    createdAt: new Date("2026-04-05T09:30:00.000Z")
  }
];

export const fallbackProducts = [
  {
    id: "prod-1",
    name: "Organic Growth Booster",
    category: "Nutrition",
    price: 890,
    stock: 92
  },
  {
    id: "prod-2",
    name: "Cotton Shield Pro",
    category: "Protection",
    price: 1240,
    stock: 31
  },
  {
    id: "prod-3",
    name: "Soil Rebalance Mix",
    category: "Soil Health",
    price: 760,
    stock: 14
  },
  {
    id: "prod-4",
    name: "Micro Drip Activator",
    category: "Irrigation",
    price: 990,
    stock: 64
  }
];

export const fallbackVisits = [
  {
    id: "visit-1",
    farmerId: "far-1",
    date: new Date("2026-04-14T09:30:00.000Z"),
    notes: "Lower leaf yellowing after delayed irrigation. Follow-up advised.",
    recommendedProduct: "Organic Growth Booster"
  },
  {
    id: "visit-2",
    farmerId: "far-2",
    date: new Date("2026-04-12T12:00:00.000Z"),
    notes: "Pest pressure visible on edges of field. Spray planning shared.",
    recommendedProduct: "Cotton Shield Pro"
  },
  {
    id: "visit-3",
    farmerId: "far-4",
    date: new Date("2026-04-10T14:15:00.000Z"),
    notes: "Soil moisture variability observed in two plots.",
    recommendedProduct: "Micro Drip Activator"
  }
];

export const fallbackPayments = [
  {
    id: "pay-1",
    farmerId: "far-1",
    amount: 8000,
    mode: "UPI" as const,
    note: "Part payment after cotton pickup",
    createdAt: new Date("2026-04-15T08:30:00.000Z")
  }
];

export const fallbackChatSessions = [
  {
    id: "session-1",
    userId: "dealer-1",
    createdAt: new Date("2026-04-13T09:00:00.000Z"),
    messages: [
      {
        id: "msg-1",
        sessionId: "session-1",
        role: "ASSISTANT" as const,
        content:
          "Share the crop stage, irrigation pattern, and whether the yellowing starts on older or younger leaves.",
        createdAt: new Date("2026-04-13T09:00:00.000Z")
      },
      {
        id: "msg-2",
        sessionId: "session-1",
        role: "USER" as const,
        content: "Yellowing is on lower leaves after irrigation was delayed for 5 days.",
        createdAt: new Date("2026-04-13T09:02:00.000Z")
      }
    ]
  }
];
