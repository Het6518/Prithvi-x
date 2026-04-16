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
  const [formError, setFormError] = useState("");

  async function savePayment() {
    if (!selected) return;
    setSaving(true);
    setFormError("");
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
      setFormError(error instanceof Error ? error.message : "Unable to save payment.");
    } finally {
      setSaving(false);
    }
  }

  if (creditQuery.loading) {
    return <LoadingPanel rows={5} />;
  }

  if (creditQuery.error) {
    return <div className="neo-error">{creditQuery.error}</div>;
  }

  const sortedFarmers = [...creditQuery.data.farmers].sort((a, b) => b.outstandingAmount - a.outstandingAmount);

  return (
    <div className="space-y-6">
      <div className="neo-card p-6">
        <p className="neo-eyebrow">Udhaar ledger</p>
        <h2 className="mt-2 text-3xl font-bold text-forest">Highest dues and recovery actions</h2>
        <div className="mt-6 space-y-4">
          {sortedFarmers.length === 0 ? (
            <div className="neo-empty">No farmers with outstanding dues. Great job!</div>
          ) : null}
          {sortedFarmers.map((farmer) => (
            <div key={farmer.id} className="flex flex-col gap-4 border-3 border-black bg-white p-5 shadow-neo-sm lg:flex-row lg:items-center lg:justify-between" style={{ borderRadius: "6px" }}>
              <div>
                <p className="text-xl font-bold text-forest">{farmer.name}</p>
                <p className="text-sm font-medium text-forest/55">
                  {farmer.village} | <span className="font-bold">{farmer.creditStatus}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-2xl font-bold text-forest">{formatCurrency(farmer.outstandingAmount)}</p>
                <Button
                  onClick={() => {
                    setSelected(farmer);
                    setFormError("");
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

      <div className="neo-card p-6">
        <p className="neo-eyebrow">Recent payments</p>
        <h2 className="mt-2 text-3xl font-bold text-forest">Collections timeline</h2>
        <div className="mt-6 space-y-4">
          {creditQuery.data.payments.length === 0 ? (
            <div className="neo-empty">No payments recorded yet.</div>
          ) : null}
          {creditQuery.data.payments.map((payment) => (
            <div key={payment.id} className="border-3 border-black bg-white p-5 shadow-neo-sm" style={{ borderRadius: "6px" }}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-bold text-forest">{payment.farmerName}</p>
                  <p className="text-sm font-medium text-forest/55">
                    <span className="neo-pill mr-2 bg-gold/20">{payment.mode}</span>
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
                <p className="text-xl font-bold text-forest">{formatCurrency(payment.amount)}</p>
              </div>
              {payment.note ? <p className="mt-3 text-sm text-forest/65">{payment.note}</p> : null}
            </div>
          ))}
        </div>
      </div>

      {open && selected ? (
        <div className="neo-overlay">
          <div className="neo-modal max-w-lg">
            <p className="neo-eyebrow">Payment modal</p>
            <h3 className="mt-2 text-3xl font-bold text-forest">{selected.name}</h3>
            <div className="mt-6 space-y-4">
              <div>
                <label className="neo-label">Amount</label>
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="neo-input"
                  placeholder="Amount"
                  type="number"
                  min={1}
                />
              </div>
              <div>
                <label className="neo-label">Payment mode</label>
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value as "CASH" | "UPI")}
                  className="neo-select"
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
              <div>
                <label className="neo-label">Notes</label>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="neo-input min-h-28"
                  placeholder="Notes"
                />
              </div>
            </div>
            {formError ? <div className="neo-toast">{formError}</div> : null}
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
