import type { Metadata } from "next";
import Link from "next/link";
import { Brain, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ - FitCoach CRM | Fitness Coach Client Management Questions",
  description: "Find answers to common questions about FitCoach CRM.",
};

const faqs = [
  { q: "What is FitCoach CRM?", a: "An AI-powered client management platform built for fitness coaches and personal trainers." },
  { q: "How do I sign up?", a: "Click Sign Up on our homepage. No credit card required." },
  { q: "Is there a free plan?", a: "Yes! Free plan supports up to 5 clients with core features." },
  { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express via Stripe." },
  { q: "Is my data secure?", a: "Yes. We use industry-standard encryption. All data is GDPR compliant." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel anytime. Access continues until end of billing period." },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-100">Everything you need to know about FitCoach CRM.</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        {faqs.map((faq, i) => (
          <details key={i} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition group">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition">
              <span className="font-semibold text-gray-900">{faq.q}</span>
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{faq.a}</div>
          </details>
        ))}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"><Brain className="w-5 h-5 text-white" /></div>
            <span className="text-white font-bold text-xl">FitCoach</span>
          </div>
          <p className="text-sm">© 2025 FitCoach CRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
