"use client";

import { useState } from "react";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/shared/button";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { useApiResource } from "@/hooks/use-api-resource";
import { formatCurrency } from "@/lib/utils";
import type { ProductRecord } from "@/lib/types";

function getStatus(stock: number) {
  if (stock <= 20) return { label: "Reorder", color: "bg-rose-400" };
  if (stock <= 40) return { label: "Low", color: "bg-amber-400" };
  return { label: "Healthy", color: "bg-emerald-400" };
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
  const [formError, setFormError] = useState("");
  const isDealer = sessionQuery.data.user.role === "DEALER";

  async function saveProduct() {
    setSubmitting(true);
    setFormError("");
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
      setFormError(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeProduct(productId: string) {
    if (!window.confirm("Delete this product?")) return;
    const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok) {
      setFormError(payload.error || "Unable to delete product.");
      return;
    }
    productsQuery.setData(payload);
  }

  if (productsQuery.loading || sessionQuery.loading) {
    return <LoadingPanel rows={4} />;
  }

  if (productsQuery.error || sessionQuery.error) {
    return <div className="neo-error">{productsQuery.error || sessionQuery.error}</div>;
  }

  return (
    <div className="neo-card p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="neo-eyebrow">Inventory</p>
          <h2 className="mt-2 text-3xl font-bold text-forest">Warehouse and stock health</h2>
        </div>
        {isDealer ? (
          <Button
            onClick={() => {
              setEditing(null);
              setForm(emptyProduct);
              setFormError("");
              setModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add product
          </Button>
        ) : null}
      </div>

      {formError && !modalOpen ? <div className="neo-toast mt-4">{formError}</div> : null}

      <div className="mt-6 space-y-4">
        {productsQuery.data.products.length === 0 ? (
          <div className="neo-empty">No products in inventory. Add your first product to get started.</div>
        ) : null}
        {productsQuery.data.products.map((item) => {
          const status = getStatus(item.stock);
          const progress = Math.min(item.stock, 100);
          return (
            <div key={item.id} className="border-3 border-black bg-white p-5 shadow-neo-sm" style={{ borderRadius: "6px" }}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xl font-bold text-forest">{item.name}</p>
                  <p className="text-sm font-medium text-forest/55">
                    {item.category} | {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="neo-pill bg-forest/5 text-forest">{status.label}</div>
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
                          setFormError("");
                          setModalOpen(true);
                        }}
                        className="border-2 border-black bg-white p-2 text-forest/60 hover:shadow-neo-sm"
                      >
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button onClick={() => removeProduct(item.id)} className="border-2 border-black bg-rose-100 p-2 text-rose-700 hover:shadow-neo-sm">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="mt-5 h-4 border-2 border-black bg-white" style={{ borderRadius: "2px" }}>
                <div className={`h-full ${status.color}`} style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-3 flex justify-between text-sm font-medium text-forest/60">
                <span>{item.stock} units available</span>
                <span>Latest change {item.trend > 0 ? `+${item.trend}` : item.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen ? (
        <div className="neo-overlay">
          <div className="neo-modal max-w-xl">
            <p className="neo-eyebrow">
              {editing ? "Update product" : "Add product"}
            </p>
            <h3 className="mt-2 text-3xl font-bold text-forest">
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
                  <label htmlFor={`product-${key}`} className="neo-label">{label}</label>
                  <input
                    id={`product-${key}`}
                    value={form[key]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="neo-input"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="product-price" className="neo-label">Price</label>
                <input
                  id="product-price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
                  placeholder="Price"
                  className="neo-input"
                />
              </div>
              <div>
                <label htmlFor="product-stock" className="neo-label">Stock</label>
                <input
                  id="product-stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(event) => setForm((current) => ({ ...current, stock: Number(event.target.value) }))}
                  placeholder="Stock count"
                  className="neo-input"
                />
              </div>
            </div>
            {formError ? <div className="neo-toast">{formError}</div> : null}
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
