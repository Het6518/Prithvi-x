"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FarmerFormState>(emptyForm);
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

  useEffect(() => {
    if (selectedFarmer) {
      setForm({
        name: selectedFarmer.name,
        village: selectedFarmer.village,
        mobile: selectedFarmer.mobile,
        cropType: selectedFarmer.cropType,
        loyaltyTier: selectedFarmer.loyaltyTier,
        totalVisits: selectedFarmer.totalVisits,
        outstandingAmount: selectedFarmer.outstandingAmount
      });
    }
  }, [selectedFarmer]);

  async function saveFarmer(create = false) {
    setSaving(true);
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
      window.alert(error instanceof Error ? error.message : "Unable to save farmer.");
    } finally {
      setSaving(false);
    }
  }

  if (farmersQuery.loading || sessionQuery.loading) {
    return <LoadingPanel rows={5} />;
  }

  if (farmersQuery.error || sessionQuery.error) {
    return (
      <div className="glass-panel rounded-[2rem] p-6 text-sm text-rose-700 shadow-sm">
        {farmersQuery.error || sessionQuery.error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="glass-panel rounded-[2rem] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gold">Farmer management</p>
            <h2 className="mt-2 text-3xl font-semibold text-forest">Profiles, filters, and loyalty context</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full border border-forest/10 bg-white/70 px-4 py-2">
              <Search className="h-4 w-4 text-forest/45" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="bg-transparent text-sm outline-none"
                placeholder="Search farmer"
              />
            </div>
            <select
              value={tier}
              onChange={(event) => setTier(event.target.value)}
              className="rounded-full border border-forest/10 bg-white/70 px-4 py-2 text-sm outline-none"
            >
              {["All", "BRONZE", "SILVER", "GOLD"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={credit}
              onChange={(event) => setCredit(event.target.value)}
              className="rounded-full border border-forest/10 bg-white/70 px-4 py-2 text-sm outline-none"
            >
              {["All", "CLEAR", "DUE", "OVERDUE"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {isDealer ? (
              <Button
                onClick={() => {
                  setForm(emptyForm);
                  setDrawerOpen(true);
                  setSelectedId("");
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add farmer
              </Button>
            ) : null}
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-forest/10">
          <table className="min-w-full divide-y divide-forest/10 text-left">
            <thead className="bg-forest text-sm text-background">
              <tr>
                <th className="px-4 py-4 font-medium">Farmer</th>
                <th className="px-4 py-4 font-medium">Village</th>
                <th className="px-4 py-4 font-medium">Crop</th>
                <th className="px-4 py-4 font-medium">Tier</th>
                <th className="px-4 py-4 font-medium">Outstanding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10 bg-white/75">
              {filteredFarmers.map((farmer) => (
                <tr
                  key={farmer.id}
                  onClick={() => setSelectedId(farmer.id)}
                  className="cursor-pointer transition hover:bg-gold/10"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-sm font-semibold text-background">
                        {initials(farmer.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-forest">{farmer.name}</p>
                        <p className="text-sm text-forest/55">{farmer.mobile}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-forest/75">{farmer.village}</td>
                  <td className="px-4 py-4 text-forest/75">{farmer.cropType}</td>
                  <td className="px-4 py-4">
                    <StatusPill value={farmer.loyaltyTier} />
                  </td>
                  <td className="px-4 py-4 font-semibold text-forest">{formatCurrency(farmer.outstandingAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedFarmer ? (
        <aside className="glass-panel rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-gold">Farmer details</p>
              <h3 className="mt-2 text-2xl font-semibold text-forest">{selectedFarmer.name}</h3>
            </div>
            {isDealer ? (
              <button
                onClick={() => setDrawerOpen(true)}
                className="rounded-full bg-forest/5 p-2 text-forest/60 transition hover:bg-forest/10"
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
              <div key={label} className="rounded-[1.3rem] bg-white/70 p-4">
                <p className="text-sm text-forest/50">{label}</p>
                <p className="mt-2 font-semibold text-forest">{value}</p>
              </div>
            ))}
            <div className="rounded-[1.3rem] bg-forest p-5 text-background">
              <p className="text-sm uppercase tracking-[0.2em] text-background/60">Credit status</p>
              <p className="mt-3 text-2xl font-semibold">{selectedFarmer.creditStatus}</p>
              <p className="mt-2 text-sm text-background/70">Loyalty tier: {selectedFarmer.loyaltyTier}</p>
            </div>
          </div>
        </aside>
      ) : null}

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4">
          <div className="w-full max-w-2xl rounded-[2rem] bg-background p-6 shadow-ambient">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-gold">
                  {selectedId ? "Edit farmer" : "Add farmer"}
                </p>
                <h3 className="mt-2 text-3xl font-semibold text-forest">
                  {selectedId ? selectedFarmer?.name : "New farmer profile"}
                </h3>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="rounded-full bg-forest/5 p-2 text-forest/60">
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
                  <label htmlFor={`farmer-${key}`} className="mb-2 block text-sm font-medium text-forest/70">{label}</label>
                  <input
                    id={`farmer-${key}`}
                    value={form[key]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="farmer-loyaltyTier" className="mb-2 block text-sm font-medium text-forest/70">Loyalty tier</label>
                <select
                  id="farmer-loyaltyTier"
                  value={form.loyaltyTier}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, loyaltyTier: event.target.value as FarmerRecord["loyaltyTier"] }))
                  }
                  className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                >
                  {["BRONZE", "SILVER", "GOLD"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="farmer-totalVisits" className="mb-2 block text-sm font-medium text-forest/70">Total visits</label>
                <input
                  id="farmer-totalVisits"
                  type="number"
                  min={0}
                  value={form.totalVisits}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, totalVisits: Number(event.target.value) }))
                  }
                  placeholder="Total visits"
                  className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label htmlFor="farmer-outstandingAmount" className="mb-2 block text-sm font-medium text-forest/70">Outstanding amount</label>
                <input
                  id="farmer-outstandingAmount"
                  type="number"
                  min={0}
                  value={form.outstandingAmount}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, outstandingAmount: Number(event.target.value) }))
                  }
                  placeholder="Outstanding amount"
                  className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1" onClick={() => saveFarmer(!selectedId)} disabled={saving}>
                {saving ? "Saving..." : selectedId ? "Save Changes" : "Create Farmer"}
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
