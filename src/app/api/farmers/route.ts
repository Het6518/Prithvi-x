import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { createFarmer, listFarmers } from "@/lib/dashboard-data";
import { geocodeVillage } from "@/lib/geocode";

const createFarmerSchema = z.object({
  name: z.string().min(2),
  village: z.string().min(2),
  mobile: z.string().min(10),
  cropType: z.string().min(2),
  loyaltyTier: z.enum(["BRONZE", "SILVER", "GOLD"]),
  totalVisits: z.number().int().min(0).optional(),
  outstandingAmount: z.number().min(0).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export async function GET(request: NextRequest) {
  const { response } = await requireRequestUser(request);
  if (response) return response;

  const search = request.nextUrl.searchParams.get("search") || undefined;
  const farmers = await listFarmers(search);
  return jsonOk({ farmers });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireRequestUser(request);
  if (response || !user) return response;
  if (user.role !== "DEALER") return jsonError("Only dealers can create farmers.", 403);

  const parsed = createFarmerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError("Invalid farmer payload.");
  }

  try {
    const data = { ...parsed.data };

    // Auto-geocode if no lat/lng provided
    if (!data.latitude || !data.longitude) {
      const coords = await geocodeVillage(data.village);
      if (coords) {
        data.latitude = coords.lat;
        data.longitude = coords.lng;
      }
    }

    await createFarmer(data);
    const farmers = await listFarmers();
    return jsonOk({ farmers }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create farmer.", 500);
  }
}
