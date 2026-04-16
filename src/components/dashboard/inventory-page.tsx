"use client";

import { useState } from "react";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/shared/button";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { useApiResource } from "@/hooks/use-api-resource";
import { formatCurrency } from "@/lib/utils";
import type { ProductRecord } from "@/lib/types";

function getStatus(stock: number) {
  if (stock <= 20) return { label: "Reorder", color: "bg-rose-500" };
  if (stock <= 40) return { label: "Low", color: "bg-amber-500" };
  return { label: "Healthy", color: "bg-emerald-500" };
}

const emptyProduct = {
  name: "",
  category: "",
  price: 0,
  stock: 0
};

export function InventoryPage() {
  const productsQuery = useApiResource<{ products: ProductRecord[] }>("/api/products", { products: [] });
  const sessionQuery = useApiResource<{ user: { role: "DEALER" | "STAFF" } }>("/api/auth/me", {
    user: { role: "STAFF" }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRecord | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [submitting, setSubmitting] = useState(false);
  const isDealer = sessionQuery.data.user.role === "DEALER";

  async function saveProduct() {
    setSubmitting(true);
    try {
      const response = await fetch(editing ? `/api/products/${editing.id}` : "/api/products", {
        method: editing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to save product.");
      productsQuery.setData(payload);
      setModalOpen(false);
      setEditing(null);
      setForm(emptyProduct);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeProduct(productId: string) {
    if (!window.confirm("Delete this product?")) return;
    const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok) {
      window.alert(payload.error || "Unable to delete product.");
      return;
    }
    productsQuery.setData(payload);
  }

  if (productsQuery.loading || sessionQuery.loading) {
    return <LoadingPanel rows={4} />;
  }

  if (productsQuery.error || sessionQuery.error) {
    return (
      <div className="glass-panel rounded-[2rem] p-6 text-sm text-rose-700 shadow-sm">
        {productsQuery.error || sessionQuery.error}
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-[2rem] p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Inventory</p>
          <h2 className="mt-2 text-3xl font-semibold text-forest">Warehouse and stock health</h2>
        </div>
        {isDealer ? (
          <Button
            onClick={() => {
              setEditing(null);
              setForm(emptyProduct);
              setModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add product
          </Button>
        ) : null}
      </div>
      <div className="mt-6 space-y-4">
        {productsQuery.data.products.map((item) => {
          const status = getStatus(item.stock);
          const progress = Math.min(item.stock, 100);
          return (
            <div key={item.id} className="rounded-[1.6rem] border border-forest/10 bg-white/70 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xl font-semibold text-forest">{item.name}</p>
                  <p className="text-sm text-forest/55">
                    {item.category} | {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-forest/5 px-4 py-2 text-sm font-semibold text-forest">{status.label}</div>
                  {isDealer ? (
                    <>
                      <button
                        onClick={() => {
                          setEditing(item);
                          setForm({
                            name: item.name,
                            category: item.category,
                            price: item.price,
                            stock: item.stock
                          });
                          setModalOpen(true);
                        }}
                        className="rounded-full bg-forest/5 p-2 text-forest/60"
                      >
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button onClick={() => removeProduct(item.id)} className="rounded-full bg-rose-50 p-2 text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="mt-5 h-3 rounded-full bg-forest/10">
                <div className={`h-full rounded-full ${status.color}`} style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-3 flex justify-between text-sm text-forest/60">
                <span>{item.stock} units available</span>
                <span>Latest change {item.trend > 0 ? `+${item.trend}` : item.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4">
          <div className="w-full max-w-xl rounded-[2rem] bg-background p-6 shadow-ambient">
            <p className="text-sm uppercase tracking-[0.22em] text-gold">
              {editing ? "Update product" : "Add product"}
            </p>
            <h3 className="mt-2 text-3xl font-semibold text-forest">
              {editing ? editing.name : "New inventory item"}
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", "Product name"],
                  ["category", "Category"]
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label htmlFor={`product-${key}`} className="mb-2 block text-sm font-medium text-forest/70">{label}</label>
                  <input
                    id={`product-${key}`}
                    value={form[key]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="product-price" className="mb-2 block text-sm font-medium text-forest/70">Price</label>
                <input
                  id="product-price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
                  placeholder="Price"
                  className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label htmlFor="product-stock" className="mb-2 block text-sm font-medium text-forest/70">Stock</label>
                <input
                  id="product-stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(event) => setForm((current) => ({ ...current, stock: Number(event.target.value) }))}
                  placeholder="Stock count"
                  className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1" onClick={saveProduct} disabled={submitting}>
                {submitting ? "Saving..." : editing ? "Save Changes" : "Create Product"}
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
