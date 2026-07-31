import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowLeft, TrendingUp, Users, DollarSign, Briefcase, Brain, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Start a Personal Training Business in 2026 (Complete Blueprint)",
  description: "Step-by-step guide to launching a profitable personal training business in 2026. From first client to scaling with AI tools.",
  keywords: ["start personal training business", "fitness entrepreneur", "personal trainer income", "how to become a fitness coach"],
  openGraph: {
    title: "How to Start a Personal Training Business in 2026",
    description: "Step-by-step guide to launching a profitable personal training business.",
    type: "article",
  },
};

const pillars = [
  { icon: <DollarSign className="w-5 h-5" />, title: "Pillar 1: Define Your Niche", content: "General trainers compete on price. Specialists compete on value. Pick a niche: postnatal fitness, senior mobility, athlete performance, body recomposition for busy professionals. Your niche determines your messaging, pricing power, and referral pipeline." },
  { icon: <Users className="w-5 h-5" />, title: "Pillar 2: Get Certified (or Already Are)", content: "A nationally recognized certification (NASM, ACE, NSCA) builds trust and liability protection. But certifications are table stakes in 2026 — your differentiator is technology fluency. Coaches who can demonstrate digital tools close 3x more clients than those who rely on word-of-mouth alone." },
  { icon: <Brain className="w-5 h-5" />, title: "Pillar 3: Build Your Tech Stack", content: "You need three things: a CRM to manage clients (FitCoach does this), an AI plan generator for workouts, and a payment system for billing. The best part? You can get all three free. Start with the free tier, upgrade when you hit your first paying client." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Pillar 4: Acquisition Engine", content: "Post 3 times/week on Instagram showing transformations. Run $5/day Facebook ads targeting your city + interests. Network with local restaurants and gyms. Create a lead magnet (free 7-day meal template). Every piece of content should end with 'Book a free consultation.' Track what works in your CRM." },
  { icon: <Briefcase className="w-5 h-5" />, title: "Pillar 5: Pricing & Packages", content: "Never sell single sessions. Sell packages: 8-week transformation ($999), monthly coaching ($199/month), semi-private ($79/person/session). Price signals quality. Your free CRM tool handles billing automatically so you focus on coaching, not invoicing." },
  { icon: <Clock className="w-5 h-5" />, title: "Pillar 6: Scale Without Burnout", content: "The ceiling for manual coaching is ~30 clients. Beyond that, you trade time for money and burn out. With AI plan generation and automated progress tracking, one coach can effectively serve 100+ clients. This is the margin unlock. This is the business model that pays $10K+/month consistently." },
];

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Link href="/blog" className="inline-flex items-center gap-2 text-amber-200 hover:text-white mb-8 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-amber-200 mb-4">
            <Calendar className="w-4 h-4" /> Jul 25, 2026
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span>Business Blueprint</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            How to Start a Personal Training Business in 2026
          </h1>
          <p className="text-xl text-amber-100 mt-4 max-w-2xl">
            The complete blueprint from zero to $10K/month — using AI tools that most coaches don't know about yet.
          </p>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          The personal training industry generated <strong className="text-gray-900">$29 billion in 2025</strong> and it's growing. 
          But while the market is huge, success isn't automatic. The trainers making $10K/month aren't stronger or smarter 
          — they've just built the right system. Here's exactly how.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-12">
          <p className="text-sm text-orange-800">
            <strong>Timeline:</strong> Month 1-2: First clients → Month 3-4: Consistent $3K/mo → Month 6: Hit $5-8K → Month 12: Scale past $10K with AI. 
            This timeline assumes you work it like a real business, not a hobby.
          </p>
        </div>

        <div className="space-y-16">
          {pillars.map((pillar, i) => (
            <div key={i}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-700">
                  {pillar.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{pillar.title}</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed pl-0 md:pl-16">{pillar.content}</p>
            </div>
          ))}
        </div>

        {/* Revenue Calculator */}
        <div className="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Projection (With CRM Tools)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-extrabold text-emerald-600 mb-1">50</div>
              <div className="text-sm text-gray-500">Monthly Clients</div>
              <div className="text-lg font-bold text-gray-900 mt-1">$9,950/mo</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-extrabold text-blue-600 mb-1">100</div>
              <div className="text-sm text-gray-500">Monthly Clients</div>
              <div className="text-lg font-bold text-gray-900 mt-1">$19,900/mo</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-extrabold text-purple-600 mb-1">200</div>
              <div className="text-sm text-gray-500">Monthly Clients</div>
              <div className="text-lg font-bold text-gray-900 mt-1">$39,800/mo</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">At $199/month per client. CRM automation makes serving 200+ clients feasible.</p>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Your Business Today — For Free</h3>
          <p className="text-gray-600 mb-6">
            The first 100 signups get 3 months of Premium features free. Don't wait until tomorrow.
          </p>
          <Link href="/promo" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-orange-200">
            Claim Your Free Promo →
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {["personal training business", "fitness entrepreneur", "start coaching business", "fitness income"].map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">#{tag}</span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
