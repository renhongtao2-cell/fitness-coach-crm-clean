"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, CreditCard, Download, Receipt, Loader2 } from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';
import { showToast } from "@/components/Toast";

export default function BillingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, invRes] = await Promise.all([
        fetch("/api/subscriptions"),
        fetch("/api/invoices"),
      ]);
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData.subscription);
      }
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvoices(invData.invoices || []);
      }
    } catch (e) {
      console.error("Failed to fetch billing data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (invoiceId: string) => {
    setDownloading(invoiceId);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/receipt`);
      if (res.ok) {
        showToast("success", "Receipt generated");
      }
    } catch (e: any) {
      showToast("error", "Download failed: " + e.message);
    } finally {
      setDownloading(null);
    }
  };

  const planNameMap: Record<string, string> = {
    free: "Free",
    basic: "Basic",
    pro: "Pro",
    enterprise: "Enterprise",
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "text-green-600 bg-green-50" },
    past_due: { label: "Past Due", color: "text-yellow-600 bg-yellow-50" },
    canceled: { label: "Canceled", color: "text-gray-600 bg-gray-50" },
    unpaid: { label: "Unpaid", color: "text-red-600 bg-red-50" },
    paid: { label: "Paid", color: "text-green-600 bg-green-50" },
    pending: { label: "Pending", color: "text-blue-600 bg-blue-50" },
    failed: { label: "Failed", color: "text-red-600 bg-red-50" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing Center</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your subscription and invoices</p>
          </div>
        </div>

        {/* Current Subscription */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Current Subscription
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusMap[subscription?.status || "free"]?.color || "bg-gray-100 text-gray-600"}`}>
              {statusMap[subscription?.status || "free"]?.label || "Free"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="text-lg font-semibold text-gray-900">{planNameMap[subscription?.plan_type || "free"]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {subscription?.stripe_current_period_end
                  ? new Date(subscription.stripe_current_period_end).toLocaleDateString("zh-CN")
                  : "Permanent"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {subscription?.amount_cents ? `¥${(subscription.amount_cents / 100).toFixed(2)}` : "Free"}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => router.push("/pricing")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
            >
              Change Plan
            </button>
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-purple-600" />
            Invoice History
          </h2>

          {invoices.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No invoice history</p>
              <p className="text-xs mt-1">Will appear after your first payment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Description</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-gray-900">
                        {inv.issued_at ? new Date(inv.issued_at).toLocaleDateString("zh-CN") : "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {inv.subscription_plan || "Monthly subscription fee"}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        ¥{(inv.amount_cents / 100).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusMap[inv.status]?.color || "bg-gray-100 text-gray-600"
                        }`}>
                          {statusMap[inv.status]?.label || inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDownloadReceipt(inv.id)}
                          disabled={downloading === inv.id}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium transition disabled:opacity-50"
                        >
                          {downloading === inv.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payment Methods Info */}
        <div className="mt-6 bg-blue-50 rounded-xl border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">Payment Methods</p>
              <p className="text-xs text-blue-700 mt-1">
                We support Alipay, WeChat Pay, and bank cards. Stripe secures your payment information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

