import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About FitCoach CRM ¡ª Built by Coaches, for Coaches",
  description: "Learn about FitCoach CRM, the AI-powered fitness coaching platform built by a personal trainer and developer to solve real coach pain points.",
  keywords: ["about FitCoach CRM", "fitness coaching platform", "coach software", "personal trainer tools"],
  openGraph: {
    title: "About FitCoach CRM",
    description: "Built by coaches, for coaches.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About FitCoach CRM</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          FitCoach CRM was born from frustration. As both a personal trainer and a developer, I couldn&apos;t find any tool that truly served fitness coaches.
        </p>
        
        <div className="space-y-6 text-gray-700">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">The Problem</h2>
            <p>Every existing CRM is designed for big gyms with 100+ members. Solo trainers and independent coaches were forced to juggle WhatsApp for messages, Excel for tracking, and spreadsheets for scheduling ¡ª with no single source of truth.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">The Solution</h2>
            <p>A purpose-built CRM where coaches come first. AI generates training plans in seconds, progress tracking is visual and motivating, and everything lives in one place.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What We Offer</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>AI-powered workout plan generation</li>
              <li>Visual client progress tracking</li>
              <li>Built-in messaging and payments via Stripe</li>
              <li>Smart scheduling and reminders</li>
              <li>10-language support for international clients</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Get Started Free</h2>
            <p className="text-blue-700 mb-4">No credit card required. Our free plan supports up to 5 clients with full core features.</p>
            <Link href="/register" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition">
              Start Free Today ¡ú
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-400">
          ? 2024 FitCoach CRM. All rights reserved.
        </div>
      </div>
    </div>
  );
}