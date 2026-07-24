import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Users, TrendingUp, MessageSquare, Calendar, Shield, CheckCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

export const metadata: Metadata = {
  title: "FAQ - FitCoach CRM | Fitness Coach Client Management Questions",
  description: "Find answers to common questions about FitCoach CRM - AI-powered client management for fitness coaches. Pricing, features, security, and more.",
  keywords: ["fitness CRM FAQ", "personal trainer software questions", "AI workout planner help", "client management support"],
};

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Getting Started",
    question: "What is FitCoach CRM and who is it for?",
    answer: "FitCoach CRM is an AI-powered client management platform built specifically for fitness coaches and personal trainers. It helps you manage clients, generate workout plans, track progress, and run your coaching business more efficiently."
  },
  {
    category: "Getting Started",
    question: "How do I sign up for FitCoach CRM?",
    answer: "Signing up is simple! Click the Sign Up button on our homepage, create your account with email, and you can start using the free plan immediately. No credit card required."
  },
  {
    category: "Features",
    question: "What features are included in FitCoach CRM?",
    answer: "FitCoach includes AI training plan generation, client management, progress tracking with analytics, built-in messaging, smart scheduling, payment processing via Stripe, and enterprise-grade security. All features are available starting from the free plan."
  },
  {
    category: "Features",
    question: "How does the AI training plan generator work?",
    answer: "Simply describe your client's goals, fitness level, available equipment, and preferences. Our AI analyzes this information and generates a complete, science-backed training program with exercises, sets, reps, rest times, and progressive overload planning."
  },
  {
    category: "Pricing",
    question: "Is there a free plan available?",
    answer: "Yes! Our free plan supports up to 5 clients with core features including AI plan generation, progress tracking, and messaging. It's perfect for individual coaches just getting started."
  },
  {
    category: "Pricing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards through Stripe, including Visa, Mastercard, American Express, and Discover. All transactions are secure and encrypted."
  },
  {
    category: "Security",
    question: "Is my client data secure with FitCoach CRM?",
    answer: "Absolutely. We use industry-standard encryption with row-level security on Supabase. All data is GDPR compliant, regularly audited, and stored securely. Your client information is never shared or sold."
  },
  {
    category: "Support",
    question: "How can I get support if I have issues?",
    answer: "We offer multiple support channels: email support for all users, priority support for Pro and Enterprise plans, and a comprehensive help center with tutorials and guides."
  }
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
      >
        <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const categories = [...new Set(faqs.map(faq => faq.category))];
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Everything you need to know about FitCoach CRM. Can not find the answer you are looking for? Contact our support team.
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/ /g, '-')}`}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition border border-gray-200"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* FAQ Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        {categories.map((category) => (
          <section key={category} id={category.toLowerCase().replace(/ /g, '-')} className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              {category}
            </h2>
            <div className="space-y-4">
              {faqs
                .filter(faq => faq.category === category)
                .map((faq, index) => (
                  <FAQAccordion
                    key={index}
                    item={faq}
                    isOpen={openIndex === index}
                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                  />
                ))
              }
            </div>
          </section>
        ))}

        {/* Contact Section */}
        <section className="text-center py-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We are here to help! Contact our support team and we will get back to you within 24 hours.
          </p>
          <Link 
            href="mailto:support@fitcoach.app"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            Contact Support
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">FitCoach</span>
          </div>
          <p className="text-sm">© 2025 FitCoach CRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
