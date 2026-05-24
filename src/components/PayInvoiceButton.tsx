"use client";
import { useState } from "react";
import { CreditCard } from "lucide-react";

interface Props {
  token: string;
  invoiceId: string;
  amount: number;
}

export default function PayInvoiceButton({ token, invoiceId, amount }: Props) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    const res = await fetch(`/api/portal/${token}/invoices/${invoiceId}/checkout`, {
      method: "POST",
    });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all hover:opacity-90"
      style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
    >
      <CreditCard className="w-3.5 h-3.5" />
      {loading ? "Chargement..." : `Payer ${amount}€`}
    </button>
  );
}
