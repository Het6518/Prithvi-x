import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { getCreditPageData, recordPayment } from "@/lib/dashboard-data";

const paymentSchema = z.object({
  farmerId: z.string().min(1),
  amount: z.number().positive(),
  mode: z.enum(["CASH", "UPI"]),
  note: z.string().max(200).optional()
});

export async function POST(request: NextRequest) {
  const { response } = await requireRequestUser(request);
  if (response) return response;

  const parsed = paymentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError("Invalid payment payload.");
  }

  try {
    await recordPayment(parsed.data);
    const credit = await getCreditPageData();
    return jsonOk(credit, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to record payment.", 500);
  }
}
