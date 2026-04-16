import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { deleteProduct, listProducts, updateProduct } from "@/lib/dashboard-data";

const productUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.string().min(2).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireRequestUser(request);
  if (response || !user) return response;
  if (user.role !== "DEALER") return jsonError("Only dealers can edit products.", 403);

  const parsed = productUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError("Invalid product update.");
  }

  try {
    const { id } = await params;
    await updateProduct(id, parsed.data);
    const products = await listProducts();
    return jsonOk({ products });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to update product.", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireRequestUser(request);
  if (response || !user) return response;
  if (user.role !== "DEALER") return jsonError("Only dealers can delete products.", 403);

  try {
    const { id } = await params;
    await deleteProduct(id);
    const products = await listProducts();
    return jsonOk({ products });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to delete product.", 500);
  }
}
