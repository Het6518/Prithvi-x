"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PencilLine, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/shared/button";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { StatusPill } from "@/components/shared/status-pill";
import { useApiResource } from "@/hooks/use-api-resource";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import type { FarmerRecord } from "@/lib/types";

type FarmerPayload = {
  farmers: FarmerRecord[];
};

type SessionPayload = {
  user: {
    role: "DEALER" | "STAFF";
  };
};

type FarmerFormState = {
  name: string;
  village: string;
  mobile: string;
  cropType: string;
  loyaltyTier: FarmerRecord["loyaltyTier"];
  totalVisits: number;
  outstandingAmount: number;
};

const emptyForm: FarmerFormState = {
  name: "",
  village: "",
  mobile: "",
  cropType: "",
  loyaltyTier: "BRONZE" as const,
  totalVisits: 0,
  outstandingAmount: 0
};

export function FarmerManagementPage() {
  const farmersQuery = useApiResource<FarmerPayload>("/api/farmers", { farmers: [] });
  const sessionQuery = useApiResource<SessionPayload>("/api/auth/me", { user: { role: "STAFF" } });
  const [search, setSearch] = useState("");
  const [credit, setCredit] = useState("All");
  const [tier, setTier] = useState("All");
  const [selectedId, setSelectedId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FarmerFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const isDealer = sessionQuery.data.user.role === "DEALER";

  const farmers = farmersQuery.data.farmers;

  useEffect(() => {
    if (!selectedId && farmers[0]?.id) {
      setSelectedId(farmers[0].id);
    }
  }, [farmers, selectedId]);

  const filteredFarmers = useMemo(
    () =>
      farmers.filter((farmer) => {
        const matchesSearch =
          !search ||
          `${farmer.name} ${farmer.village} ${farmer.mobile} ${farmer.cropType}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesCredit = credit === "All" || farmer.creditStatus === credit;
        const matchesTier = tier === "All" || farmer.loyaltyTier === tier;
        return matchesSearch && matchesCredit && matchesTier;
      }),
    [credit, farmers, search, tier]
  );

  const selectedFarmer =
    filteredFarmers.find((farmer) => farmer.id === selectedId) || filteredFarmers[0] || null;

  async function saveFarmer(create = false) {
    setSaving(true);
    setFormError("");
    try {
      const response = await fetch(create ? "/api/farmers" : `/api/farmers/${selectedFarmer?.id}`, {
        method: create ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to save farmer.");

      farmersQuery.setData(payload);
      if (create && payload.farmers[0]?.id) {
        setSelectedId(payload.farmers[0].id);
      }
      setDrawerOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save farmer.");
    } finally {
      setSaving(false);
    }
  }

  if (farmersQuery.loading || sessionQuery.loading) {
    return <LoadingPanel rows={5} />;
  }

  if (farmersQuery.error || sessionQuery.error) {
    return <div className="neo-error">{farmersQuery.error || sessionQuery.error}</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="neo-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="neo-eyebrow">Farmer management</p>
            <h2 className="mt-2 text-3xl font-bold text-forest">Profiles, filters, and loyalty context</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 border-3 border-black bg-white px-4 py-2 shadow-neo-sm" style={{ borderRadius: "6px" }}>
              <Search className="h-4 w-4 text-forest/45" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="bg-transparent text-sm font-medium outline-none"
                placeholder="Search farmer"
              />
            </div>
            <select
              value={tier}
              onChange={(event) => setTier(event.target.value)}
              className="neo-select"
              style={{ width: "auto" }}
            >
              {["All", "BRONZE", "SILVER", "GOLD"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={credit}
              onChange={(event) => setCredit(event.target.value)}
              className="neo-select"
              style={{ width: "auto" }}
            >
              {["All", "CLEAR", "DUE", "OVERDUE"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {isDealer ? (
              <Button
                onClick={() => {
                  setForm(emptyForm);
                  setIsAdding(true);
                  setFormError("");
                  setDrawerOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add farmer
              </Button>
            ) : null}
          </div>
        </div>

        {filteredFarmers.length === 0 ? (
          <div className="neo-empty mt-6">
            {farmers.length === 0
              ? "No farmers registered yet. Add your first farmer to get started."
              : "No farmers match your current filters. Try adjusting your search."}
          </div>
        ) : (
          <div className="mt-6 overflow-hidden">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Farmer</th>
                  <th>Village</th>
                  <th>Crop</th>
                  <th>Tier</th>
                  <th>Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((farmer) => (
                  <tr
                    key={farmer.id}
                    onClick={() => setSelectedId(farmer.id)}
                    className={`cursor-pointer ${selectedId === farmer.id ? "!bg-gold/20" : ""}`}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-forest text-sm font-bold text-background" style={{ borderRadius: "4px" }}>
                          {initials(farmer.name)}
                        </div>
                        <div>
                          <p className="font-bold text-forest">{farmer.name}</p>
                          <p className="text-sm text-forest/55">{farmer.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-forest/75">{farmer.village}</td>
                    <td className="text-forest/75">{farmer.cropType}</td>
                    <td>
                      <StatusPill value={farmer.loyaltyTier} />
                    </td>
                    <td className="font-bold text-forest">{formatCurrency(farmer.outstandingAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedFarmer ? (
        <aside className="neo-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="neo-eyebrow">Farmer details</p>
              <h3 className="mt-2 text-2xl font-bold text-forest">{selectedFarmer.name}</h3>
            </div>
            {isDealer ? (
              <button
                onClick={() => {
                  setForm({
                    name: selectedFarmer.name,
                    village: selectedFarmer.village,
                    mobile: selectedFarmer.mobile,
                    cropType: selectedFarmer.cropType,
                    loyaltyTier: selectedFarmer.loyaltyTier,
                    totalVisits: selectedFarmer.totalVisits,
                    outstandingAmount: selectedFarmer.outstandingAmount
                  });
                  setIsAdding(false);
                  setFormError("");
                  setDrawerOpen(true);
                }}
                className="border-2 border-black bg-white p-2 text-forest/60 transition-all hover:shadow-neo-sm hover:translate-x-0.5"
              >
                <PencilLine className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <div className="mt-6 space-y-4">
            {[
              ["Village", selectedFarmer.village],
              ["Mobile", selectedFarmer.mobile],
              ["Crop type", selectedFarmer.cropType],
              ["Total visits", selectedFarmer.totalVisits.toString()],
              ["Created", formatDate(selectedFarmer.createdAt)],
              ["Outstanding", formatCurrency(selectedFarmer.outstandingAmount)]
            ].map(([label, value]) => (
              <div key={label} className="border-2 border-black/20 bg-white p-4" style={{ borderRadius: "6px" }}>
                <p className="text-xs font-bold uppercase tracking-wider text-forest/50">{label}</p>
                <p className="mt-2 font-bold text-forest">{value}</p>
              </div>
            ))}
            <div className="neo-card-dark p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Credit status</p>
              <p className="mt-3 text-2xl font-bold">{selectedFarmer.creditStatus}</p>
              <p className="mt-2 text-sm text-background/70">Loyalty tier: {selectedFarmer.loyaltyTier}</p>
            </div>
          </div>
        </aside>
      ) : null}

      {drawerOpen ? (
        <div className="neo-overlay">
          <div className="neo-modal max-w-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="neo-eyebrow">
                  {isAdding ? "Add farmer" : "Edit farmer"}
                </p>
                <h3 className="mt-2 text-3xl font-bold text-forest">
                  {isAdding ? "New farmer profile" : selectedFarmer?.name}
                </h3>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="border-2 border-black bg-white p-2 text-forest/60 hover:shadow-neo-sm">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", "Name"],
                  ["village", "Village"],
                  ["mobile", "Mobile"],
                  ["cropType", "Crop type"]
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label htmlFor={`farmer-${key}`} className="neo-label">{label}</label>
                  <input
                    id={`farmer-${key}`}
                    value={form[key]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="neo-input"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="farmer-loyaltyTier" className="neo-label">Loyalty tier</label>
                <select
                  id="farmer-loyaltyTier"
                  value={form.loyaltyTier}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, loyaltyTier: event.target.value as FarmerRecord["loyaltyTier"] }))
                  }
                  className="neo-select"
                >
                  {["BRONZE", "SILVER", "GOLD"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="farmer-totalVisits" className="neo-label">Total visits</label>
                <input
                  id="farmer-totalVisits"
                  type="number"
                  min={0}
                  value={form.totalVisits}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, totalVisits: Number(event.target.value) }))
                  }
                  placeholder="Total visits"
                  className="neo-input"
                />
              </div>
              <div>
                <label htmlFor="farmer-outstandingAmount" className="neo-label">Outstanding amount</label>
                <input
                  id="farmer-outstandingAmount"
                  type="number"
                  min={0}
                  value={form.outstandingAmount}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, outstandingAmount: Number(event.target.value) }))
                  }
                  placeholder="Outstanding amount"
                  className="neo-input"
                />
              </div>
            </div>
            {formError ? <div className="neo-toast">{formError}</div> : null}
            <div className="mt-6 flex gap-3">
              <Button className="flex-1" onClick={() => saveFarmer(isAdding)} disabled={saving}>
                {saving ? "Saving..." : isAdding ? "Create Farmer" : "Save Changes"}
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
