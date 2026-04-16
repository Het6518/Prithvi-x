import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { listFarmers, updateFarmer } from "@/lib/dashboard-data";
import { geocodeVillage } from "@/lib/geocode";

const updateFarmerSchema = z.object({
  name: z.string().min(2).optional(),
  village: z.string().min(2).optional(),
  mobile: z.string().min(10).optional(),
  cropType: z.string().min(2).optional(),
  loyaltyTier: z.enum(["BRONZE", "SILVER", "GOLD"]).optional(),
  totalVisits: z.number().int().min(0).optional(),
  outstandingAmount: z.number().min(0).optional()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireRequestUser(request);
  if (response || !user) return response;
  if (user.role !== "DEALER") return jsonError("Only dealers can edit farmers.", 403);

  const parsed = updateFarmerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError("Invalid farmer update.");
  }

  try {
    const { id } = await params;
    const data: Record<string, unknown> = { ...parsed.data };

    // If village is being changed, auto-geocode the new village
    if (data.village && typeof data.village === "string") {
      const coords = await geocodeVillage(data.village);
      if (coords) {
        data.latitude = coords.lat;
        data.longitude = coords.lng;
      }
    }

    await updateFarmer(id, data as Parameters<typeof updateFarmer>[1]);
    const farmers = await listFarmers();
    return jsonOk({ farmers });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update farmer.", 500);
  }
}
