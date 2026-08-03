import Link from 'next/link';
import { DollarSign, Clock, TrendingUp, Users } from 'lucide-react';

export const metadata = {
  title: 'Personal Trainer Business Guide: Pricing, Scaling & Operations · FitCoach CRM',
  description: 'Complete guide to building, pricing, and scaling a profitable personal training business in 2026. From $50/hr to $10K/month revenue.',
  keywords: ['personal trainer business', 'fitness business pricing', 'scale personal training', 'personal trainer operations', 'fitness coach income'],
  openGraph: {
    title: 'Personal Trainer Business Guide: Pricing, Scaling & Operations',
    description: 'From $50/hr to $10K/month — the complete business guide.',
    url: 'https://fitness-coach-crm-five.vercel.app/blog/personal-trainer-business-guide',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function PTBusinessGuide() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-emerald-600 text-sm hover:underline">← Back to blog</Link>
      <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">Personal Trainer Business Guide: Pricing, Scaling & Operations</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
        <span>2026 Guide</span>
        <span>·</span>
        <span>10 min read</span>
      </div>

      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="text-xl leading-relaxed text-gray-600 mb-6">
          Most personal trainers succeed at coaching but fail at business. They undercharge, overwork, and burn out. Here's how to build a profitable training business that doesn't require 60-hour weeks.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Three Jobs You're Actually Doing</h2>
        <p>
          Personal training is three businesses in one: <strong>coaching</strong> (delivering results), <strong>marketing</strong> (getting clients), and <strong>operations</strong> (scheduling, billing, tracking). Most trainers try to do all three manually and fail at all three.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          {[
            { icon: Users, title: 'Coaching (40%)', desc: 'Deliver results, build relationships, refine programs' },
            { icon: TrendingUp, title: 'Marketing (30%)', desc: 'Content, partnerships, referrals, ads' },
            { icon: Clock, title: 'Operations (30%)', desc: 'Scheduling, billing, tracking, messaging' },
          ].map((j, i) => (
            <div key={i} className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <j.icon className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{j.title}</h3>
              <p className="text-sm text-gray-600">{j.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pricing Strategies That Work</h2>
        <p>
          <strong>Hourly rate ($50-150/hr):</strong> Good for starting out, bad for scaling. You trade time for money with no leverage.
        </p>
        <p className="mt-2">
          <strong>Package pricing ($500-2000/month):</strong> The sweet spot. Commitment from both sides, predictable revenue, better client outcomes.
        </p>
        <p className="mt-2">
          <strong>Group coaching ($100-300/person/month):</strong> Scale without scaling hours. 10 people in a group session = 4x the revenue of 1-on-1.
        </p>
        <p className="mt-2">
          <strong>Online coaching ($150-500/month):</strong> Location-independent, infinite scale. AI-generated programs + weekly check-ins.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Operations Trap</h2>
        <p>
          The #1 reason trainers hit a ceiling isn't client acquisition — it's operations overload. Spreadsheet scheduling, manual invoicing, scattered messaging, forgotten progress check-ins.
        </p>
        <p className="mt-3">
          A dedicated CRM handles the operations layer: automated scheduling, Stripe billing, in-app messaging, progress analytics, and AI-assisted program creation. That's 30+ hours per month you get back.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Revenue Targets by Stage</h2>
        <div className="bg-gray-50 rounded-2xl p-6 my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-600">Stage</th>
                <th className="text-left py-2 text-gray-600">Clients</th>
                <th className="text-left py-2 text-gray-600">Monthly Revenue</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr><td className="py-2">Starting Out</td><td className="py-2">5-10</td><td className="py-2">$500-1,500</td></tr>
              <tr><td className="py-2">Growing</td><td className="py-2">15-30</td><td className="py-2">$3,000-6,000</td></tr>
              <tr><td className="py-2">Scaling</td><td className="py-2">40-60</td><td className="py-2">$8,000-15,000</td></tr>
              <tr><td className="py-2">Agency</td><td className="py-2">80+</td><td className="py-2">$20,000+</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Tool Stack for Scaling</h2>
        <p>
          You can't manage 50+ clients with Instagram DMs and spreadsheets. The trainers who scale to $10K+/month use:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>All-in-one CRM:</strong> Client profiles, programs, messaging, billing in one place</li>
          <li><strong>AI program generation:</strong> Create periodized plans in seconds, not hours</li>
          <li><strong>Automated billing:</strong> Stripe integration, recurring payments, no chasing invoices</li>
          <li><strong>Referral system:</strong> Turn existing clients into your marketing team</li>
          <li><strong>Analytics dashboard:</strong> See revenue, retention, and capacity at a glance</li>
        </ul>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white my-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Build Your Coaching Business</h3>
          <p className="text-emerald-100 mb-6">All the tools you need in one platform. Free plan available.</p>
          <Link href="/register" className="inline-block px-8 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition shadow-lg">
            Get Started Free
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          Last updated: August 2026
        </p>
      </div>
    </article>
  );
}
