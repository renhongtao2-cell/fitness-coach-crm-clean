import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowLeft, BookOpen, TrendingUp, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Get Your First 100 Fitness Clients in 2026 (Step-by-Step)",
  description: "Proven strategies to grow your fitness coaching business from zero to 100 paying clients. AI-powered methods, social media tactics, and retention secrets.",
  keywords: ["fitness client acquisition", "personal training business", "get fitness clients", "fitness marketing 2026"],
  openGraph: {
    title: "How to Get Your First 100 Fitness Clients in 2026",
    description: "Proven strategies to grow your fitness coaching business from zero to 100 paying clients.",
    type: "article",
  },
};

const sections = [
  { icon: <Zap className="w-5 h-5" />, title: "Leverage AI as Your Secret Weapon", content: "In 2026, the best coaches don't just train — they use AI. Tools like FitCoach CRM let you generate personalized workout plans in seconds, track client progress automatically, and communicate through built-in messaging. The key differentiator? Speed and personalization at scale." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Build a Content Engine, Not Just Social Media Posts", content: "Stop posting random workouts. Build a system: share 3 pieces of content per week (client transformations, training tips, behind-the-scenes). Each piece should drive people to a single CTA — sign up for your free plan. Consistency beats virality every time." },
  { icon: <Users className="w-5 h-5" />, title: "Create a Referral Loop That Pays Itself", content: "Your existing clients are your best sales team. Give them something valuable to share: a referral code that rewards both parties. Add it to every interaction — after each session, during check-ins, in your messaging. Make sharing easy and rewarding." },
  { icon: <BookOpen className="w-5 h-5" />, title: "Master the Free-to-Paid Funnel", content: "Offer a free tier with real value (5 client limit, basic features, AI workout generation). Once a client sees results through your app, upgrading becomes natural. The friction-free onboarding means they never wonder 'what's next?'" },
];

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-8 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-blue-100 mb-4">
            <Calendar className="w-4 h-4" /> Jul 24, 2026
            <span>•</span>
            <span>8 min read</span>
            <span>•</span>
            <span>Business Growth</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            How to Get Your First 100 Fitness Clients in 2026
          </h1>
          <p className="text-xl text-blue-100 mt-4 max-w-2xl">
            A step-by-step playbook used by the top 1% of fitness coaches who scaled from zero to six figures.
          </p>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          Every successful coaching business starts with one client. But getting to 100? That requires a system. 
          In this guide, I'll show you exactly how the fastest-growing coaches are acquiring and retaining clients 
          in 2026 using AI tools, content systems, and smart funnels.
        </p>

        <div className="space-y-16">
          {sections.map((section, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed pl-0 md:pl-13">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Start Scaling?</h3>
          <p className="text-gray-600 mb-6">
            Join 7+ coaches already using FitCoach CRM. Free forever plan available — no credit card required.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-blue-200">
            Start Free Today →
          </Link>
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {["fitness marketing", "client acquisition", "personal trainer", "AI coaching", "fitness business"].map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">#{tag}</span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
