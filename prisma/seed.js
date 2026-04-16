const { PrismaClient, UserRole, LoyaltyTier, PaymentMode, MessageRole } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("demo1234", 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "dealer@prithvix.com" },
      update: {},
      create: {
        name: "Prithvix Dealer",
        email: "dealer@prithvix.com",
        password,
        role: UserRole.DEALER
      }
    }),
    prisma.user.upsert({
      where: { email: "staff@prithvix.com" },
      update: {},
      create: {
        name: "Field Staff",
        email: "staff@prithvix.com",
        password,
        role: UserRole.STAFF
      }
    })
  ]);

  const farmerSeeds = [
    {
      name: "Asha Rathore",
      village: "Kherli",
      mobile: "9876543210",
      cropType: "Cotton",
      loyaltyTier: LoyaltyTier.GOLD,
      totalVisits: 6,
      outstandingAmount: 12000,
      latitude: 27.211,
      longitude: 76.854
    },
    {
      name: "Ratan Meghwal",
      village: "Laxmipura",
      mobile: "9898987676",
      cropType: "Soybean",
      loyaltyTier: LoyaltyTier.SILVER,
      totalVisits: 4,
      outstandingAmount: 42000,
      latitude: 24.585,
      longitude: 73.712
    },
    {
      name: "Meena Solanki",
      village: "Bhanpur",
      mobile: "9811198111",
      cropType: "Wheat",
      loyaltyTier: LoyaltyTier.BRONZE,
      totalVisits: 3,
      outstandingAmount: 0,
      latitude: 22.307,
      longitude: 73.181
    },
    {
      name: "Gopal Choudhary",
      village: "Piploda",
      mobile: "9797971212",
      cropType: "Maize",
      loyaltyTier: LoyaltyTier.GOLD,
      totalVisits: 5,
      outstandingAmount: 18500,
      latitude: 23.334,
      longitude: 75.037
    }
  ];

  const farmers = [];
  for (const seed of farmerSeeds) {
    const farmer = await prisma.farmer.upsert({
      where: { mobile: seed.mobile },
      update: seed,
      create: seed
    });
    farmers.push(farmer);

    await prisma.creditLedger.upsert({
      where: { farmerId: farmer.id },
      update: { totalDue: seed.outstandingAmount },
      create: {
        farmerId: farmer.id,
        totalDue: seed.outstandingAmount
      }
    });
  }

  const products = await Promise.all(
    [
      { name: "Organic Growth Booster", category: "Nutrition", price: 890, stock: 92, change: 92 },
      { name: "Cotton Shield Pro", category: "Protection", price: 1240, stock: 31, change: 31 },
      { name: "Soil Rebalance Mix", category: "Soil Health", price: 760, stock: 14, change: 14 },
      { name: "Micro Drip Activator", category: "Irrigation", price: 990, stock: 64, change: 64 }
    ].map(async ({ change, ...product }) => {
      const created = await prisma.product.upsert({
        where: { name: product.name },
        update: product,
        create: product
      });

      const logCount = await prisma.inventoryLog.count({ where: { productId: created.id } });
      if (!logCount) {
        await prisma.inventoryLog.create({
          data: {
            productId: created.id,
            change
          }
        });
      }

      return created;
    })
  );

  const visitCount = await prisma.visit.count();
  if (!visitCount) {
    await prisma.visit.createMany({
      data: [
        {
          farmerId: farmers[0].id,
          date: new Date(),
          notes: "Lower leaf yellowing after delayed irrigation. Follow-up advised.",
          recommendedProduct: products[0].name
        },
        {
          farmerId: farmers[1].id,
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          notes: "Pest pressure visible on edges of field. Spray planning shared.",
          recommendedProduct: products[1].name
        },
        {
          farmerId: farmers[3].id,
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          notes: "Soil moisture variability observed in two plots.",
          recommendedProduct: products[3].name
        }
      ]
    });
  }

  const paymentCount = await prisma.payment.count();
  if (!paymentCount) {
    await prisma.payment.create({
      data: {
        farmerId: farmers[0].id,
        amount: 8000,
        mode: PaymentMode.UPI,
        note: "Part payment after cotton pickup"
      }
    });
  }

  const sessionCount = await prisma.chatSession.count();
  if (!sessionCount) {
    const session = await prisma.chatSession.create({
      data: {
        userId: users[0].id
      }
    });

    await prisma.message.createMany({
      data: [
        {
          sessionId: session.id,
          role: MessageRole.ASSISTANT,
          content: "Share the crop stage, irrigation pattern, and whether the yellowing starts on older or younger leaves."
        },
        {
          sessionId: session.id,
          role: MessageRole.USER,
          content: "Yellowing is on lower leaves after irrigation was delayed for 5 days."
        }
      ]
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
