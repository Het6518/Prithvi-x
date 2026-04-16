import { NextRequest } from "next/server";
import { requireRequestUser } from "@/lib/auth";
import { getCreditPageData } from "@/lib/dashboard-data";
import { jsonOk } from "@/lib/api";

export async function GET(request: NextRequest) {
  const { response } = await requireRequestUser(request);
  if (response) return response;

  const credit = await getCreditPageData();
  return jsonOk(credit);
}
