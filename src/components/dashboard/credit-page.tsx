"use client";

import { useState } from "react";
import { Button } from "@/components/shared/button";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { useApiResource } from "@/hooks/use-api-resource";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { FarmerRecord, PaymentRecord } from "@/lib/types";

type CreditPayload = {
  farmers: FarmerRecord[];
  payments: PaymentRecord[];
};

export function CreditPage() {
  const creditQuery = useApiResource<CreditPayload>("/api/credit", { farmers: [], payments: [] });
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FarmerRecord | null>(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"CASH" | "UPI">("UPI");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function savePayment() {
    if (!selected) return;
    setSaving(true);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          farmerId: selected.id,
          amount: Number(amount),
          mode,
          note
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to save payment.");
      creditQuery.setData(payload);
      setOpen(false);
      setAmount("");
      setNote("");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to save payment.");
    } finally {
      setSaving(false);
    }
  }

  if (creditQuery.loading) {
    return <LoadingPanel rows={5} />;
  }

  if (creditQuery.error) {
    return <div className="glass-panel rounded-[2rem] p-6 text-sm text-rose-700 shadow-sm">{creditQuery.error}</div>;
  }

  const sortedFarmers = [...creditQuery.data.farmers].sort((a, b) => b.outstandingAmount - a.outstandingAmount);

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">Udhaar ledger</p>
        <h2 className="mt-2 text-3xl font-semibold text-forest">Highest dues and recovery actions</h2>
        <div className="mt-6 space-y-4">
          {sortedFarmers.map((farmer) => (
            <div key={farmer.id} className="flex flex-col gap-4 rounded-[1.6rem] border border-forest/10 bg-white/75 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xl font-semibold text-forest">{farmer.name}</p>
                <p className="text-sm text-forest/55">
                  {farmer.village} | {farmer.creditStatus}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold text-forest">{formatCurrency(farmer.outstandingAmount)}</p>
                <Button
                  onClick={() => {
                    setSelected(farmer);
                    setOpen(true);
                  }}
                >
                  Record Payment
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">Recent payments</p>
        <h2 className="mt-2 text-3xl font-semibold text-forest">Collections timeline</h2>
        <div className="mt-6 space-y-4">
          {creditQuery.data.payments.map((payment) => (
            <div key={payment.id} className="rounded-[1.6rem] border border-forest/10 bg-white/75 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-forest">{payment.farmerName}</p>
                  <p className="text-sm text-forest/55">
                    {payment.mode} | {formatDate(payment.createdAt)}
                  </p>
                </div>
                <p className="text-xl font-semibold text-forest">{formatCurrency(payment.amount)}</p>
              </div>
              {payment.note ? <p className="mt-3 text-sm text-forest/65">{payment.note}</p> : null}
            </div>
          ))}
        </div>
      </div>

      {open && selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-background p-6 shadow-ambient">
            <p className="text-sm uppercase tracking-[0.22em] text-gold">Payment modal</p>
            <h3 className="mt-2 text-3xl font-semibold text-forest">{selected.name}</h3>
            <div className="mt-6 space-y-4">
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                placeholder="Amount"
                type="number"
                min={1}
              />
              <select
                value={mode}
                onChange={(event) => setMode(event.target.value as "CASH" | "UPI")}
                className="w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
              </select>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="min-h-28 w-full rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 outline-none"
                placeholder="Notes"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1" onClick={savePayment} disabled={saving}>
                {saving ? "Saving..." : "Save Payment"}
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
