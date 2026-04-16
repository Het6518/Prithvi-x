import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { createProduct, listProducts } from "@/lib/dashboard-data";

const productSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  price: z.number().min(0),
  stock: z.number().int().min(0)
});

export async function GET(request: NextRequest) {
  const { response } = await requireRequestUser(request);
  if (response) return response;

  const products = await listProducts();
  return jsonOk({ products });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireRequestUser(request);
  if (response || !user) return response;
  if (user.role !== "DEALER") return jsonError("Only dealers can add products.", 403);

  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError("Invalid product payload.");
  }

  try {
    await createProduct(parsed.data);
    const products = await listProducts();
    return jsonOk({ products }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create product.", 500);
  }
}
