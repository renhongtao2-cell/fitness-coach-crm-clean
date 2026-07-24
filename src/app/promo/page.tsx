"use client";

import Link from "next/link";
import { Check, Zap, Gift, ArrowRight, Timer, Trophy } from "lucide-react";

export default function PromoPage() {
  const spotsLeft = 100; // Will be overridden by server

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1.5 text-sm font-medium text-purple-300 mb-8">
            <Gift className="w-4 h-4" />
            Launch Promotion — Limited Spots
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Join the First{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              100 Coaches
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Sign up now and get <span className="text-white font-bold">3 months of Basic Plan FREE</span>
            — normally $29/month, that&apos;s <span className="text-green-400 font-bold">$87 free</span>.
          </p>

          <p className="text-base text-gray-400 mb-10">
            No credit card required. Cancel anytime. Built for coaches who want more time and less chaos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?role=coach" className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40">
              Claim Your Spot
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-gray-300 hover:text-white font-medium px-8 py-4 rounded-xl transition-all">
              See All Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Scarcity Bar */}
      <section className="py-6 px-6 bg-black/20 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Promotional Offer Ends Soon
            </span>
            <span className="text-sm font-bold text-yellow-400">{spotsLeft} spots remaining</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all" style={{ width: `${(100 - spotsLeft) / 1}%` }} />
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What You Get Free for 3 Months</h2>
          <p className="text-gray-400 text-center mb-16 text-lg">Basic Plan value: $29/month × 3 = $87</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-6 h-6" />, title: "Up to 5 Clients", desc: "Manage your first clients without limits. Perfect for growing coaches." },
              { icon: <Gift className="w-6 h-6" />, title: "AI Workout Plans", desc: "Generate full training programs from plain English descriptions." },
              { icon: <Check className="w-6 h-6" />, title: "Progress Tracking", desc: "Body measurements, photos, and milestone tracking for each client." },
              { icon: <Trophy className="w-6 h-6" />, title: "Unlimited Programs", desc: "Create and assign custom programs to as many clients as you want." },
              { icon: <Check className="w-6 h-6" />, title: "Built-in Messaging", desc: "Chat with clients, send reminders, and share feedback." },
              { icon: <Gift className="w-6 h-6" />, title: "10 Languages Supported", desc: "Serve international clients with built-in translation." },
            ].map((f) => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-black/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            {[
              { step: "1", title: "Sign Up", desc: "Create your free account in 30 seconds. No credit card needed." },
              { step: "2", title: "Get Basic Plan Auto-Granted", desc: "If you are among the first 100 registrations, Basic Plan is automatically activated." },
              { step: "3", title: "Start Managing Clients", desc: "Upload your first client, generate a workout plan, and see the difference." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Don&apos;t Miss Out</h2>
          <p className="text-gray-400 text-lg mb-8">
            After 100 signups, new users will only get the Free plan. Be one of the founders.
          </p>
          <Link href="/register?role=coach" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-lg shadow-purple-500/25">
            Register Now — It&apos;s Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} FitCoach CRM. All rights reserved.</p>
      </footer>
    </div>
  );
}
