export type AppUserRole = "DEALER" | "STAFF";
export type LoyaltyTierValue = "BRONZE" | "SILVER" | "GOLD";
export type CreditStatus = "CLEAR" | "DUE" | "OVERDUE";
export type PaymentModeValue = "CASH" | "UPI";
export type ChatRole = "USER" | "ASSISTANT";

export type FarmerRecord = {
  id: string;
  name: string;
  village: string;
  mobile: string;
  cropType: string;
  loyaltyTier: LoyaltyTierValue;
  totalVisits: number;
  outstandingAmount: number;
  createdAt: string;
  latitude?: number | null;
  longitude?: number | null;
  creditStatus: CreditStatus;
};

export type ProductRecord = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  trend: number;
  updatedAt: string | null;
};

export type PaymentRecord = {
  id: string;
  farmerId: string;
  farmerName: string;
  amount: number;
  mode: PaymentModeValue;
  note: string | null;
  createdAt: string;
};

export type DashboardMetric = {
  label: string;
  value: number;
  change: string;
  kind: "number" | "currency";
};

export type ActivityItem = {
  title: string;
  detail: string;
  time: string;
};

export type CollectionTarget = {
  id: string;
  name: string;
  village: string;
  amount: number;
};

export type AnalyticsPoint = {
  month: string;
  revenue: number;
  farmers: number;
  collectionRate: number;
};

export type DonutSlice = {
  name: string;
  value: number;
  color: string;
};

export type MapPoint = {
  id: string;
  name: string;
  village: string;
  lat: number;
  lng: number;
  intensity: number;
  farmers: number;
};

export type ChatMessageRecord = {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ChatSessionRecord = {
  id: string;
  createdAt: string;
  title: string;
  preview: string;
  messageCount: number;
  messages: ChatMessageRecord[];
};

export type DashboardOverview = {
  stats: DashboardMetric[];
  recentActivity: ActivityItem[];
  overdueCount: number;
  overdueVillages: string[];
  collectionsFocus: CollectionTarget[];
};

export type AnalyticsPayload = {
  series: AnalyticsPoint[];
  collectionSplit: DonutSlice[];
};
