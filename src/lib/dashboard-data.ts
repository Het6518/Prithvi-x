import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  fallbackChatSessions,
  fallbackFarmers,
  fallbackPayments,
  fallbackProducts,
  fallbackVisits
} from "@/data/mock";
import { isPlaceholderEnv } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import type {
  ActivityItem,
  AnalyticsPayload,
  AnalyticsPoint,
  AppUserRole,
  ChatMessageRecord,
  ChatSessionRecord,
  CollectionTarget,
  CreditStatus,
  DashboardMetric,
  DashboardOverview,
  FarmerRecord,
  MapPoint,
  PaymentModeValue,
  PaymentRecord,
  ProductRecord
} from "@/lib/types";

type PrismaLike = PrismaClient;
type DbMessageRole = "USER" | "ASSISTANT";
type DecimalLike = { toNumber(): number };
type AuthUserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "DEALER" | "STAFF";
  createdAt: Date;
};

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const inMemoryUsers: AuthUserRecord[] = [];

function money(value: DecimalLike | number | string | null | undefined) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return value.toNumber();
}

function iso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function creditStatus(amount: number): CreditStatus {
  if (amount <= 0) return "CLEAR";
  if (amount >= 20000) return "OVERDUE";
  return "DUE";
}

function relativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.round(diff / (1000 * 60)));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function fallbackFarmerRecords(): FarmerRecord[] {
  return fallbackFarmers.map((farmer) => ({
    ...farmer,
    createdAt: farmer.createdAt.toISOString(),
    creditStatus: creditStatus(farmer.outstandingAmount)
  }));
}

function fallbackProductRecords(): ProductRecord[] {
  return fallbackProducts.map((product) => ({
    ...product,
    trend: Math.max(4, Math.round(product.stock * 0.22)),
    updatedAt: new Date().toISOString()
  }));
}

function fallbackPaymentRecords(): PaymentRecord[] {
  return fallbackPayments.map((payment) => ({
    ...payment,
    farmerName: fallbackFarmers.find((farmer) => farmer.id === payment.farmerId)?.name || "Farmer",
    createdAt: payment.createdAt.toISOString()
  }));
}

function buildOverviewFromFarmers(
  farmers: FarmerRecord[],
  payments: PaymentRecord[],
  visits: { notes: string; date: Date; farmerId: string; recommendedProduct: string | null }[]
): DashboardOverview {
  const registrations = farmers.length;
  const totalVisits = farmers.reduce((sum, farmer) => sum + farmer.totalVisits, 0);
  const collected = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = farmers.reduce((sum, farmer) => sum + farmer.outstandingAmount, 0);
  const overdue = farmers.filter((farmer) => farmer.creditStatus === "OVERDUE");

  const stats: DashboardMetric[] = [
    { label: "Registrations", value: registrations, change: "+12.4%", kind: "number" },
    { label: "Visits Logged", value: totalVisits, change: "+8.1%", kind: "number" },
    { label: "Money Collected", value: collected, change: "+18.6%", kind: "currency" },
    { label: "Outstanding Credit", value: outstanding, change: "-4.3%", kind: "currency" }
  ];

  const recentActivity: ActivityItem[] = [
    ...payments.slice(0, 2).map((payment) => ({
      title: "Payment collected",
      detail: `${payment.mode} payment of Rs ${payment.amount.toLocaleString("en-IN")} recorded for ${payment.farmerName}.`,
      time: relativeTime(new Date(payment.createdAt))
    })),
    ...visits.slice(0, 2).map((visit) => ({
      title: "Visit logged",
      detail: `${visit.notes} Recommended: ${visit.recommendedProduct || "Field follow-up"}.`,
      time: relativeTime(visit.date)
    })),
    {
      title: "New farmer onboarded",
      detail: `${farmers[0]?.name || "A farmer"} from ${farmers[0]?.village || "the region"} added with village profile.`,
      time: "Today"
    }
  ].slice(0, 4);

  const collectionsFocus: CollectionTarget[] = [...farmers]
    .sort((a, b) => b.outstandingAmount - a.outstandingAmount)
    .slice(0, 3)
    .map((farmer) => ({
      id: farmer.id,
      name: farmer.name,
      village: farmer.village,
      amount: farmer.outstandingAmount
    }));

  return {
    stats,
    recentActivity,
    overdueCount: overdue.length,
    overdueVillages: [...new Set(overdue.map((farmer) => farmer.village))].slice(0, 3),
    collectionsFocus
  };
}

function buildAnalyticsFromFarmers(farmers: FarmerRecord[], payments: PaymentRecord[]): AnalyticsPayload {
  const cumulativeFarmers = MONTHS.map((month, index) => farmers.length - Math.max(0, 5 - index) + index * 8);
  const series: AnalyticsPoint[] = MONTHS.map((month, index) => {
    const monthPayments = payments.reduce((sum, payment) => {
      const paymentMonth = new Date(payment.createdAt).toLocaleString("en-IN", { month: "short", timeZone: "UTC" });
      return paymentMonth === month ? sum + payment.amount : sum;
    }, 0);

    const revenue = monthPayments || 240000 + index * 52000;
    const farmersCount = Math.max(30, cumulativeFarmers[index]);
    const collectionRate = Math.min(92, 68 + index * 4);

    return {
      month,
      revenue,
      farmers: farmersCount,
      collectionRate
    };
  });

  const outstanding = farmers.reduce((sum, farmer) => sum + farmer.outstandingAmount, 0);
  const collected = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const total = Math.max(collected + outstanding, 1);

  return {
    series,
    collectionSplit: [
      {
        name: "Collected",
        value: Math.round((collected / total) * 100) || 82,
        color: "#1A3C2B"
      },
      {
        name: "Pending",
        value: Math.max(100 - (Math.round((collected / total) * 100) || 82), 8),
        color: "#D4A853"
      }
    ]
  };
}

function buildMapPoints(farmers: FarmerRecord[]): MapPoint[] {
  return farmers
    .filter((farmer) => farmer.latitude && farmer.longitude)
    .map((farmer) => ({
      id: farmer.id,
      name: farmer.name,
      village: farmer.village,
      lat: farmer.latitude || 0,
      lng: farmer.longitude || 0,
      intensity: Math.min(1, Math.max(0.25, farmer.outstandingAmount / 50000)),
      farmers: 1
    }));
}

function toChatSessionRecord(
  session: {
    id: string;
    createdAt: Date;
    messages: { id: string; role: DbMessageRole; content: string; createdAt: Date; sessionId: string }[];
  }
): ChatSessionRecord {
  const firstUserMessage = session.messages.find((message) => message.role === "USER");
  const title = firstUserMessage?.content.slice(0, 42) || "New advisory session";
  const preview = session.messages[session.messages.length - 1]?.content || "No messages yet";

  return {
    id: session.id,
    createdAt: session.createdAt.toISOString(),
    title,
    preview,
    messageCount: session.messages.length,
    messages: session.messages.map((message) => ({
      id: message.id,
      sessionId: message.sessionId,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString()
    }))
  };
}

function canUseDatabase() {
  if (process.env.NODE_ENV === "production") {
    console.log("[DB] Using production database.");
    return true;
  }
  const useDb = !isPlaceholderEnv(process.env.DATABASE_URL);
  if (!useDb) {
    console.log("[DB] Fallback mode active (No valid DATABASE_URL found).");
  }
  return useDb;
}

async function withDatabase<T>(operation: (db: PrismaLike) => Promise<T>, fallback: () => T | Promise<T>) {
  if (!canUseDatabase()) {
    return fallback();
  }

  try {
    return await operation(prisma);
  } catch {
    return fallback();
  }
}

export async function findUserByIdentifier(identifier: string) {
  return withDatabase(
    (db) =>
      db.user.findFirst({
        where: {
          email: {
            equals: identifier.trim(),
            mode: "insensitive"
          }
        }
      }),
    async () => {
      const email = identifier.trim().toLowerCase();
      const registeredUser = inMemoryUsers.find((user) => user.email.toLowerCase() === email);
      if (registeredUser) {
        return registeredUser;
      }

      const demoPassword = await bcrypt.hash("demo1234", 10);
      if (email === "dealer@prithvix.com") {
        return {
          id: "dealer-1",
          name: "Prithvix Dealer",
          email: "dealer@prithvix.com",
          password: demoPassword,
          role: "DEALER",
          createdAt: new Date()
        };
      }

      if (email === "staff@prithvix.com") {
        return {
          id: "staff-1",
          name: "Field Staff",
          email: "staff@prithvix.com",
          password: demoPassword,
          role: "STAFF",
          createdAt: new Date()
        };
      }

      return null;
    }
  );
}

export async function createUserAccount(data: {
  name: string;
  email: string;
  password: string;
  role: "DEALER" | "STAFF";
}) {
  const email = data.email.trim().toLowerCase();
  const existingUser = await findUserByIdentifier(email);
  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  if (!canUseDatabase()) {
    const createdUser: AuthUserRecord = {
      id: `local-${crypto.randomUUID()}`,
      name: data.name.trim(),
      email,
      password: hashedPassword,
      role: data.role,
      createdAt: new Date()
    };
    inMemoryUsers.unshift(createdUser);
    return createdUser;
  }

  return prisma.user.create({
    data: {
      name: data.name.trim(),
      email,
      password: hashedPassword,
      role: data.role
    }
  });
}

export async function getDashboardOverview() {
  return withDatabase(
    async (db) => {
      const [farmers, payments, visits] = await Promise.all([
        db.farmer.findMany({ orderBy: { outstandingAmount: "desc" } }),
        db.payment.findMany({
          orderBy: { createdAt: "desc" },
          include: { farmer: true }
        }),
        db.visit.findMany({
          orderBy: { date: "desc" },
          take: 4
        })
      ]);

      const farmerRecords: FarmerRecord[] = farmers.map((farmer) => ({
        id: farmer.id,
        name: farmer.name,
        village: farmer.village,
        mobile: farmer.mobile,
        cropType: farmer.cropType,
        loyaltyTier: farmer.loyaltyTier,
        totalVisits: farmer.totalVisits,
        outstandingAmount: money(farmer.outstandingAmount),
        createdAt: farmer.createdAt.toISOString(),
        latitude: farmer.latitude,
        longitude: farmer.longitude,
        creditStatus: creditStatus(money(farmer.outstandingAmount))
      }));

      const paymentRecords: PaymentRecord[] = payments.map((payment) => ({
        id: payment.id,
        farmerId: payment.farmerId,
        farmerName: payment.farmer.name,
        amount: money(payment.amount),
        mode: payment.mode,
        note: payment.note,
        createdAt: payment.createdAt.toISOString()
      }));

      return buildOverviewFromFarmers(
        farmerRecords,
        paymentRecords,
        visits.map((visit) => ({
          notes: visit.notes,
          date: visit.date,
          farmerId: visit.farmerId,
          recommendedProduct: visit.recommendedProduct
        }))
      );
    },
    async () =>
      buildOverviewFromFarmers(
        fallbackFarmerRecords(),
        fallbackPaymentRecords(),
        fallbackVisits.map((visit) => ({
          notes: visit.notes,
          date: visit.date,
          farmerId: visit.farmerId,
          recommendedProduct: visit.recommendedProduct
        }))
      )
  );
}

export async function listFarmers(search?: string) {
  return withDatabase(
    async (db) => {
      const farmers = await db.farmer.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { village: { contains: search, mode: "insensitive" } },
                { mobile: { contains: search, mode: "insensitive" } },
                { cropType: { contains: search, mode: "insensitive" } }
              ]
            }
          : undefined,
        orderBy: { createdAt: "desc" }
      });

      return farmers.map((farmer) => ({
        id: farmer.id,
        name: farmer.name,
        village: farmer.village,
        mobile: farmer.mobile,
        cropType: farmer.cropType,
        loyaltyTier: farmer.loyaltyTier,
        totalVisits: farmer.totalVisits,
        outstandingAmount: money(farmer.outstandingAmount),
        createdAt: farmer.createdAt.toISOString(),
        latitude: farmer.latitude,
        longitude: farmer.longitude,
        creditStatus: creditStatus(money(farmer.outstandingAmount))
      }));
    },
    async () => fallbackFarmerRecords()
  );
}

export async function createFarmer(data: {
  name: string;
  village: string;
  mobile: string;
  cropType: string;
  loyaltyTier: FarmerRecord["loyaltyTier"];
  totalVisits?: number;
  outstandingAmount?: number;
  latitude?: number;
  longitude?: number;
}) {
  if (!canUseDatabase()) {
    throw new Error("Database is not configured.");
  }

  return prisma.$transaction(async (db: Prisma.TransactionClient) => {
    const farmer = await db.farmer.create({
      data: {
        ...data,
        totalVisits: data.totalVisits || 0,
        outstandingAmount: data.outstandingAmount || 0
      }
    });

    await db.creditLedger.create({
      data: {
        farmerId: farmer.id,
        totalDue: data.outstandingAmount || 0
      }
    });

    return farmer;
  });
}

export async function updateFarmer(
  farmerId: string,
  data: Partial<{
    name: string;
    village: string;
    mobile: string;
    cropType: string;
    loyaltyTier: FarmerRecord["loyaltyTier"];
    totalVisits: number;
    outstandingAmount: number;
  }>
) {
  if (!canUseDatabase()) {
    throw new Error("Database is not configured.");
  }

  return prisma.$transaction(async (db: Prisma.TransactionClient) => {
    const farmer = await db.farmer.update({
      where: { id: farmerId },
      data: {
        ...data,
        outstandingAmount:
          typeof data.outstandingAmount === "number" ? data.outstandingAmount : undefined
      }
    });

    if (typeof data.outstandingAmount === "number") {
      await db.creditLedger.upsert({
        where: { farmerId },
        update: { totalDue: data.outstandingAmount },
        create: {
          farmerId,
          totalDue: data.outstandingAmount
        }
      });
    }

    return farmer;
  });
}

export async function listProducts() {
  return withDatabase(
    async (db) => {
      const products = await db.product.findMany({
        orderBy: { name: "asc" },
        include: {
          inventoryLogs: {
            orderBy: { date: "desc" },
            take: 1
          }
        }
      });

      return products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: money(product.price),
        stock: product.stock,
        trend: product.inventoryLogs[0]?.change || 0,
        updatedAt: product.inventoryLogs[0]?.date.toISOString() || null
      }));
    },
    async () => fallbackProductRecords()
  );
}

export async function createProduct(data: {
  name: string;
  category: string;
  price: number;
  stock: number;
}) {
  if (!canUseDatabase()) {
    throw new Error("Database is not configured.");
  }

  return prisma.$transaction(async (db: Prisma.TransactionClient) => {
    const product = await db.product.create({ data });
    await db.inventoryLog.create({
      data: {
        productId: product.id,
        change: data.stock
      }
    });
    return product;
  });
}

export async function updateProduct(
  productId: string,
  data: Partial<{ name: string; category: string; price: number; stock: number }>
) {
  if (!canUseDatabase()) {
    throw new Error("Database is not configured.");
  }

  return prisma.$transaction(async (db: Prisma.TransactionClient) => {
    const before = await db.product.findUniqueOrThrow({ where: { id: productId } });
    const updated = await db.product.update({
      where: { id: productId },
      data
    });

    if (typeof data.stock === "number" && data.stock !== before.stock) {
      await db.inventoryLog.create({
        data: {
          productId,
          change: data.stock - before.stock
        }
      });
    }

    return updated;
  });
}

export async function deleteProduct(productId: string) {
  if (!canUseDatabase()) {
    throw new Error("Database is not configured.");
  }

  return prisma.product.delete({
    where: { id: productId }
  });
}

export async function getCreditPageData() {
  return withDatabase(
    async (db) => {
      const [farmers, payments] = await Promise.all([
        db.farmer.findMany({
          orderBy: { outstandingAmount: "desc" },
          include: { creditLedger: true }
        }),
        db.payment.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          include: { farmer: true }
        })
      ]);

      return {
        farmers: farmers.map((farmer) => ({
          id: farmer.id,
          name: farmer.name,
          village: farmer.village,
          mobile: farmer.mobile,
          cropType: farmer.cropType,
          loyaltyTier: farmer.loyaltyTier,
          totalVisits: farmer.totalVisits,
          outstandingAmount: money(farmer.creditLedger?.totalDue ?? farmer.outstandingAmount),
          createdAt: farmer.createdAt.toISOString(),
          latitude: farmer.latitude,
          longitude: farmer.longitude,
          creditStatus: creditStatus(money(farmer.creditLedger?.totalDue ?? farmer.outstandingAmount))
        })),
        payments: payments.map((payment) => ({
          id: payment.id,
          farmerId: payment.farmerId,
          farmerName: payment.farmer.name,
          amount: money(payment.amount),
          mode: payment.mode,
          note: payment.note,
          createdAt: payment.createdAt.toISOString()
        }))
      };
    },
    async () => ({
      farmers: fallbackFarmerRecords().sort((a, b) => b.outstandingAmount - a.outstandingAmount),
      payments: fallbackPaymentRecords()
    })
  );
}

export async function recordPayment(data: {
  farmerId: string;
  amount: number;
  mode: PaymentModeValue;
  note?: string;
}) {
  if (!canUseDatabase()) {
    throw new Error("Database is not configured.");
  }

  return prisma.$transaction(async (db: Prisma.TransactionClient) => {
    const farmer = await db.farmer.findUniqueOrThrow({ where: { id: data.farmerId } });
    const nextDue = Math.max(0, money(farmer.outstandingAmount) - data.amount);

    const payment = await db.payment.create({
      data: {
        farmerId: data.farmerId,
        amount: data.amount,
        mode: data.mode,
        note: data.note
      },
      include: { farmer: true }
    });

    await db.farmer.update({
      where: { id: data.farmerId },
      data: {
        outstandingAmount: nextDue
      }
    });

    await db.creditLedger.upsert({
      where: { farmerId: data.farmerId },
      update: {
        totalDue: nextDue
      },
      create: {
        farmerId: data.farmerId,
        totalDue: nextDue
      }
    });

    return {
      id: payment.id,
      farmerId: payment.farmerId,
      farmerName: payment.farmer.name,
      amount: money(payment.amount),
      mode: payment.mode,
      note: payment.note,
      createdAt: payment.createdAt.toISOString()
    };
  });
}

export async function getAnalyticsData() {
  return withDatabase(
    async (db) => {
      const [farmers, payments] = await Promise.all([
        listFarmers(),
        db.payment.findMany({
          orderBy: { createdAt: "desc" },
          include: { farmer: true }
        })
      ]);

      return buildAnalyticsFromFarmers(
        farmers,
        payments.map((payment) => ({
          id: payment.id,
          farmerId: payment.farmerId,
          farmerName: payment.farmer.name,
          amount: money(payment.amount),
          mode: payment.mode,
          note: payment.note,
          createdAt: payment.createdAt.toISOString()
        }))
      );
    },
    async () => buildAnalyticsFromFarmers(fallbackFarmerRecords(), fallbackPaymentRecords())
  );
}

export async function getMapData() {
  return withDatabase(
    async () => buildMapPoints(await listFarmers()),
    async () => buildMapPoints(fallbackFarmerRecords())
  );
}

export async function getChatSessions(userId: string) {
  return withDatabase(
    async (db) => {
      const sessions = await db.chatSession.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          messages: {
            orderBy: { createdAt: "asc" }
          }
        }
      });

      return sessions.map(toChatSessionRecord);
    },
    async () =>
      fallbackChatSessions.map((session) =>
        toChatSessionRecord({
          ...session,
          messages: session.messages.map((message) => ({
            ...message,
            createdAt: message.createdAt,
            role: message.role as DbMessageRole
          }))
        })
      )
  );
}

export async function appendChatMessages(data: {
  userId: string;
  sessionId?: string;
  userMessage: string;
  assistantMessage: string;
}) {
  if (!canUseDatabase()) {
    const fallback = await getChatSessions(data.userId);
    const current = fallback[0];
    return {
      sessionId: current?.id || "session-fallback",
      messages: [
        ...(current?.messages || []),
        {
          id: crypto.randomUUID(),
          sessionId: current?.id || "session-fallback",
          role: "USER",
          content: data.userMessage,
          createdAt: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          sessionId: current?.id || "session-fallback",
          role: "ASSISTANT",
          content: data.assistantMessage,
          createdAt: new Date().toISOString()
        }
      ] as ChatMessageRecord[]
    };
  }

  return prisma.$transaction(async (db: Prisma.TransactionClient) => {
    const session =
      data.sessionId &&
      (await db.chatSession.findFirst({
        where: {
          id: data.sessionId,
          userId: data.userId
        }
      }));

    const activeSession =
      session ||
      (await db.chatSession.create({
        data: {
          userId: data.userId
        }
      }));

    await db.message.createMany({
      data: [
        {
          sessionId: activeSession.id,
          role: "USER",
          content: data.userMessage
        },
        {
          sessionId: activeSession.id,
          role: "ASSISTANT",
          content: data.assistantMessage
        }
      ]
    });

    const messages = await db.message.findMany({
      where: { sessionId: activeSession.id },
      orderBy: { createdAt: "asc" }
    });

    return {
      sessionId: activeSession.id,
      messages: messages.map((message) => ({
        id: message.id,
        sessionId: message.sessionId,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt.toISOString()
      }))
    };
  });
}

export async function getAuthProfile(userId: string, role: AppUserRole, name: string) {
  return {
    id: userId,
    role,
    name
  };
}
