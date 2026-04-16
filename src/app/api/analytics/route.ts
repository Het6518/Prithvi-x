import { NextRequest } from "next/server";
import { requireRequestUser } from "@/lib/auth";
import { getAnalyticsData } from "@/lib/dashboard-data";
import { jsonOk } from "@/lib/api";

export async function GET(request: NextRequest) {
  const { response } = await requireRequestUser(request);
  if (response) return response;

  const analytics = await getAnalyticsData();
  return jsonOk(analytics);
}
