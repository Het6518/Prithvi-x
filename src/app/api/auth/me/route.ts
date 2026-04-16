import { NextRequest } from "next/server";
import { getTokenFromRequest } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET(request: NextRequest) {
  const user = await getTokenFromRequest(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  return jsonOk({ user });
}
