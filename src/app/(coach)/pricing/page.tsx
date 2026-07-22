"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Star, Zap, Building2, ArrowLeft, CreditCard, Sparkles, Shield, Loader2 } from "lucide-react";
import { showToast } from "@/components/Toast";

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success")) {
      setUpgradeSuccess(true);
      showToast("success", "Upgrade successful!");
      setTimeout(() => router.replace("/pricing"), 2000);
    }
    if (searchParams.get("canceled")) {
      showToast("info", "Upgrade canceled");
      setTimeout(() => router.replace("/pricing"), 2000);
    }
    fetchSubscription();
  }, [searchParams]);

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription);
      }
    } catch (e) {
      console.error("Failed to fetch subscription:", e);
    }
  };

  const planNameMap: Record<string, string> = { free: "Free", basic: "Basic", pro: "Pro", enterprise: "Enterprise" };

  const handleUpgrade = async (planType: string) => {
    if (subscription?.plan_type === planType) {
      showToast("info", "You are already on this plan");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType, billingCycle }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        showToast("error", data.error);
      } else {
        showToast("error", "Upgrade failed");
      }
    } catch (e: any) {
      showToast("error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Downgrade to Free plan? Changes apply at end of billing cycle.")) return;
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: "free" }),
      });
      if (res.ok) {
        showToast("success", "Downgraded to Free");
        router.refresh();
      }
    } catch (e: any) {
      showToast("error", e.message);
    }
  };

  interface PlanFeature {
    feature_key: string;
    feature_name: string;
    feature_desc: string;
    limit_value: number | null;
  }

  interface Plan {
    type: string;
    name: string;
    icon: any;
    monthlyPrice: number;
    yearlyPrice: number;
    description: string;
    features: PlanFeature[];
    highlighted?: boolean;
    badge?: string;
    color: string;
  }

  const plans: Plan[] = [
    {
      type: "free", name: "Free", icon: Zap, monthlyPrice: 0, yearlyPrice: 0,
      description: "Essential tools for individual trainers", color: "gray",
      features: [
        { feature_key: "coachees", feature_name: "Clients", feature_desc: "Max managed clients", limit_value: 5 },
        { feature_key: "programs", feature_name: "Training Plans", feature_desc: "Active plans", limit_value: 5 },
        { feature_key: "ai_generations", feature_name: "AI Generation", feature_desc: "Monthly AI generations", limit_value: 5 },
        { feature_key: "storage", feature_name: "Training Logs", feature_desc: "Stored records", limit_value: 50 },
        { feature_key: "messages", feature_name: "Messages", feature_desc: "Client messages", limit_value: 50 },
      ],
    },
    {
      type: "basic", name: "Basic", icon: Star, monthlyPrice: 29, yearlyPrice: 290,
      description: "Perfect for growing coaches", color: "blue", badge: "Most Popular", highlighted: true,
      features: [
        { feature_key: "coachees", feature_name: "Clients", feature_desc: "Max managed clients", limit_value: 20 },
        { feature_key: "programs", feature_name: "Training Plans", feature_desc: "Active plans", limit_value: 20 },
        { feature_key: "ai_generations", feature_name: "AI Generation", feature_desc: "Monthly AI generations", limit_value: 20 },
        { feature_key: "storage", feature_name: "Training Logs", feature_desc: "Stored records", limit_value: 200 },
        { feature_key: "messages", feature_name: "Messages", feature_desc: "Client messages", limit_value: 200 },
        { feature_key: "branding", feature_name: "Branding", feature_desc: "Remove watermarks", limit_value: null },
      ],
    },
    {
      type: "pro", name: "Pro", icon: Sparkles, monthlyPrice: 99, yearlyPrice: 990,
      description: "For professional coaches", color: "purple",
      features: [
        { feature_key: "coachees", feature_name: "Clients", feature_desc: "Max managed clients", limit_value: 100 },
        { feature_key: "programs", feature_name: "Training Plans", feature_desc: "Active plans", limit_value: 100 },
        { feature_key: "ai_generations", feature_name: "AI Generation", feature_desc: "Monthly AI generations", limit_value: 100 },
        { feature_key: "storage", feature_name: "Training Logs", feature_desc: "Stored records", limit_value: 1000 },
        { feature_key: "messages", feature_name: "Messages", feature_desc: "Client messages", limit_value: -1 },
        { feature_key: "branding", feature_name: "Branding", feature_desc: "Remove watermarks", limit_value: null },
        { feature_key: "analytics", feature_name: "Analytics", feature_desc: "Advanced reports", limit_value: null },
        { feature_key: "priority_support", feature_name: "Priority Support", feature_desc: "Priority tech support", limit_value: null },
      ],
    },
    {
      type: "enterprise", name: "Enterprise", icon: Building2, monthlyPrice: 299, yearlyPrice: 2990,
      description: "For large gyms and agencies", color: "indigo",
      features: [
        { feature_key: "coachees", feature_name: "Clients", feature_desc: "Max managed clients", limit_value: -1 },
        { feature_key: "programs", feature_name: "Training Plans", feature_desc: "Active plans", limit_value: -1 },
        { feature_key: "ai_generations", feature_name: "AI Generation", feature_desc: "Monthly AI generations", limit_value: -1 },
        { feature_key: "storage", feature_name: "Training Logs", feature_desc: "Stored records", limit_value: -1 },
        { feature_key: "messages", feature_name: "Messages", feature_desc: "Client messages", limit_value: -1 },
        { feature_key: "branding", feature_name: "Branding", feature_desc: "Full white-label", limit_value: null },
        { feature_key: "analytics", feature_name: "Analytics", feature_desc: "Advanced reports", limit_value: null },
        { feature_key: "priority_support", feature_name: "Priority Support", feature_desc: "Dedicated manager", limit_value: null },
        { feature_key: "white_label", feature_name: "White Label", feature_desc: "White-label solution", limit_value: null },
        { feature_key: "api_access", feature_name: "API Access", feature_desc: "Open API endpoints", limit_value: null },
        { feature_key: "custom_integration", feature_name: "Custom Integration", feature_desc: "Custom system integration", limit_value: null },
      ],
    },
  ];

  const currentPlan = subscription?.plan_type || "free";

  const getFeatureDisplay = (feature: PlanFeature): string => {
    if (feature.limit_value === -1 || feature.limit_value === null) return "Unlimited";
    const units: Record<string, string> = {
      coachees: "clients", programs: "plans", ai_generations: "/mo",
      storage: "records", messages: "messages",
    };
    return String(feature.limit_value) + (units[feature.feature_key] || "");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Start free, upgrade anytime to unlock more features</p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={"text-sm font-medium " + (billingCycle === "monthly" ? "text-gray-900" : "text-gray-400")}>Monthly</span>
            <button onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")} className="relative w-14 h-7 bg-gray-200 rounded-full transition-colors duration-300">
              <div className={"absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 " + (billingCycle === "yearly" ? "translate-x-7" : "translate-x-0.5")} />
            </button>
            <span className={"text-sm font-medium " + (billingCycle === "yearly" ? "text-gray-900" : "text-gray-400")}>
              Yearly <span className="text-green-600 text-xs font-bold">Save 17%</span>
            </span>
          </div>
        </div>

        {upgradeSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 font-medium">Upgrade successful! Features activated immediately.</p>
          </div>
        )}

        {subscription && (
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              Current Plan: {planNameMap[currentPlan] || "Free"}
              {currentPlan !== "free" && (
                <button onClick={handleCancel} className="ml-2 text-xs underline hover:no-underline">Downgrade to Free</button>
              )}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billingCycle === "monthly" ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);
            const isCurrentPlan = currentPlan === plan.type;
            const colorClasses: Record<string, string> = {
              gray: "bg-gray-100 text-gray-600",
              blue: "bg-blue-100 text-blue-600",
              purple: "bg-purple-100 text-purple-600",
              indigo: "bg-indigo-100 text-indigo-600",
            };
            const borderClass = plan.highlighted ? "border-blue-500 shadow-lg scale-105" : isCurrentPlan ? "border-green-400 shadow-md" : "border-gray-200";

            return (
              <div key={plan.type} className={"relative bg-white rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg " + borderClass}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">{plan.badge}</span>
                  </div>
                )}
                {isCurrentPlan && !plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Current Plan</span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className={"inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 " + (colorClasses[plan.color] || colorClasses.gray)}><Icon className="w-6 h-6" /></div>
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">${price}</span>
                    <span className="text-gray-500 ml-1">/{billingCycle === "monthly" ? "mo" : "mo"}</span>
                  </div>
                  {billingCycle === "yearly" && plan.yearlyPrice > 0 && (
                    <p className="text-xs text-gray-400 mt-1">Billed ${plan.yearlyPrice} yearly</p>
                  )}
                </div>
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <div key={feature.feature_key} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">{feature.feature_name}</p>
                        <p className="text-xs text-gray-400">{getFeatureDisplay(feature)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleUpgrade(plan.type)} disabled={loading || isCurrentPlan} className={"w-full py-3 rounded-xl font-semibold text-sm transition " + (isCurrentPlan ? "bg-green-50 text-green-600 cursor-default" : loading ? "bg-gray-200 text-gray-400" : plan.highlighted ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200" : "bg-gray-900 hover:bg-gray-800 text-white")}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</span>
                  ) : isCurrentPlan ? "Current Plan" : plan.type === "free" ? "Downgrade to Free" : "Upgrade Now"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Can I upgrade or downgrade anytime?", a: "Yes! Upgrades take effect immediately. Downgrades apply at the end of your billing cycle." },
              { q: "What payment methods do you accept?", a: "We accept all major credit cards: Visa, Mastercard, American Express via Stripe." },
              { q: "Is there a free trial?", a: "Free plan is forever. Paid plans include a 14-day free trial." },
              { q: "Is my data secure?", a: "All data is encrypted and stored securely. We are GDPR compliant." },
              { q: "Can Enterprise be customized?", a: "Yes! Enterprise supports white-label, API access, and custom integrations." },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition">{faq.q}</summary>
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 mb-3">Secure payments powered by</p>
          <div className="flex items-center justify-center gap-6 text-gray-400">
            <CreditCard className="w-8 h-8" />
            <span className="text-lg font-bold">Visa</span>
            <span className="text-lg font-bold">Mastercard</span>
            <span className="text-lg font-bold">Amex</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/></div>}>
      <PricingContent />
    </Suspense>
  );
}


