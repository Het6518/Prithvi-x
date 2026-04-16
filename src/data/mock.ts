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
