import { NextRequest } from "next/server";
import { requireRequestUser } from "@/lib/auth";
import {
  getAnalyticsData,
  getChatSessions,
  getCreditPageData,
  getDashboardOverview,
  getMapData,
  listFarmers,
  listProducts
} from "@/lib/dashboard-data";
import { jsonOk } from "@/lib/api";

export async function GET(request: NextRequest) {
  const { user, response } = await requireRequestUser(request);
  if (response || !user) return response;

  const [overview, farmers, products, credit, analytics, mapPoints, chatSessions] = await Promise.all([
    getDashboardOverview(),
    listFarmers(),
    listProducts(),
    getCreditPageData(),
    getAnalyticsData(),
    getMapData(),
    getChatSessions(user.sub)
  ]);

  return jsonOk({
    overview,
    farmers,
    products,
    credit,
    analytics,
    mapPoints,
    chatSessions,
    user
  });
}
