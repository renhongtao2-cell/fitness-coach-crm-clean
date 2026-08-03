import Link from 'next/link';
import { Brain, Users, TrendingUp, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'How to Get Your First 100 Clients as a Personal Trainer (2026 Guide) · FitCoach CRM',
  description: 'Proven strategies for personal trainers to land their first 100 paying clients: local partnerships, content marketing, referral systems, and the tools that scale your business.',
  keywords: ['personal trainer clients', 'get first 100 clients', 'fitness coach marketing', 'personal training business', 'fitness client acquisition'],
  openGraph: {
    title: 'How to Get Your First 100 Clients as a Personal Trainer',
    description: 'Step-by-step guide to building a client base from 0 to 100+ paying clients.',
    url: 'https://fitness-coach-crm-five.vercel.app/blog/how-to-get-first-100-clients',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function First100Clients() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-emerald-600 text-sm hover:underline">← Back to blog</Link>
      <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">How to Get Your First 100 Clients as a Personal Trainer</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
        <span>2026 Guide</span>
        <span>·</span>
        <span>12 min read</span>
      </div>

      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="text-xl leading-relaxed text-gray-600 mb-6">
          Most new trainers quit within 18 months — not because they can't coach, but because they can't fill their book. Here's the exact system that takes you from 0 to 100 paying clients.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Three-Channel System</h2>
        <p>
          Building a sustainable client base requires working three channels simultaneously. Relying on just one is the #1 reason trainers plateau at 5-10 clients.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          {[
            { icon: Users, title: 'Local Partnerships', desc: 'Gyms, physios, nutritionists — referrals that convert at 40%+' },
            { icon: TrendingUp, title: 'Content Marketing', desc: 'Instagram Reels and YouTube Shorts showing your coaching style' },
            { icon: DollarSign, title: 'Referral Engine', desc: 'Turn every client into an acquisition channel' },
          ].map((ch, i) => (
            <div key={i} className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <ch.icon className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{ch.title}</h3>
              <p className="text-sm text-gray-600">{ch.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Channel 1: Local Partnerships (Fastest Path)</h2>
        <p>
          Physical therapists, chiropractors, and nutritionists see clients who need structured exercise programs every day. They just don't have the time to manage them. That's where you come in.
        </p>
        <p className="mt-3">
          <strong>The pitch:</strong> "I'm a certified personal trainer specializing in post-rehab strength training. I'd love to send you clients who need structured programming between their PT sessions. I'll handle all client communication and tracking — you just refer and I send you a progress report every 30 days."
        </p>
        <p className="mt-3">
          Start with 3-5 practices in your area. Bring coffee. Ask about their current exercise referral process. Most will say they don't have one — that's your opening.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Channel 2: Content That Converts</h2>
        <p>
          Your potential clients are scrolling Instagram and YouTube Shorts right now. They're searching for "how to build muscle at home" or "best workout for back pain." Show up there.
        </p>
        <p className="mt-3">
          <strong>The 30-60-90 content plan:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Days 1-30:</strong> Post 1 Reel/day showing your coaching style (form tips, exercise demos, client wins)</li>
          <li><strong>Days 31-60:</strong> Add YouTube Shorts with deeper tutorials (10+ min videos repurposed)</li>
          <li><strong>Days 61-90:</strong> Start a weekly newsletter with training tips — capture emails</li>
        </ul>
        <p className="mt-3">
          The key is <em>consistency over perfection</em>. A 30-second video showing proper squat form gets more engagement than a polished 5-minute production.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Channel 3: The Referral Machine</h2>
        <p>
          Your current clients are your best marketers. But most trainers just hope people talk about them — they never build a system.
        </p>
        <p className="mt-3">
          <strong>FitCoach CRM's referral program</strong> gives every client a unique code. When someone signs up using that code, both parties get a month free. This turns your client base into a self-reinforcing acquisition channel.
        </p>
        <p className="mt-3">
          <strong>The math:</strong> If you have 20 clients and each refers 1 new client per quarter, that's 80 new clients per year — without spending a dollar on ads.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The 100-Client Timeline</h2>
        <p>
          Here's what the first year looks like when you execute all three channels:
        </p>
        <div className="bg-gray-50 rounded-2xl p-6 my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-600">Month</th>
                <th className="text-left py-2 text-gray-600">Clients</th>
                <th className="text-left py-2 text-gray-600">Focus</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr><td className="py-2">1-2</td><td className="py-2">5-10</td><td className="py-2">Warm contacts, social media launch</td></tr>
              <tr><td className="py-2">3-4</td><td className="py-2">15-25</td><td className="py-2">Local partnerships, content scale</td></tr>
              <tr><td className="py-2">5-6</td><td className="py-2">35-50</td><td className="py-2">Referral program active, testimonials</td></tr>
              <tr><td className="py-2">7-9</td><td className="py-2">60-80</td><td className="py-2">Paid ads, group programs</td></tr>
              <tr><td className="py-2">10-12</td><td className="py-2">80-100+</td><td className="py-2">Scale, hire assistant coach</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Tool Stack</h2>
        <p>
          You can't manage 100 clients with spreadsheets and DMs. As you grow, you'll need:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Client management:</strong> Track profiles, goals, measurements, communication history</li>
          <li><strong>AI program generation:</strong> Create science-backed training plans in seconds, not hours</li>
          <li><strong>Progress analytics:</strong> Visual charts for weight, body fat %, and workout logs</li>
          <li><strong>Built-in messaging:</strong> Real-time chat without switching apps</li>
          <li><strong>Payment collection:</strong> Automated billing through Stripe</li>
        </ul>
        <p className="mt-3">
          <strong>FitCoach CRM</strong> is built specifically for this — it handles the operations layer so you can focus on coaching. The free plan supports up to 5 clients, so you can start today with no credit card.
        </p>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white my-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Scale Your Coaching?</h3>
          <p className="text-emerald-100 mb-6">Join 500+ fitness coaches who manage their entire business in one platform.</p>
          <Link href="/register" className="inline-block px-8 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition shadow-lg">
            Start Free — No Card Needed
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          Last updated: August 2026 · Written by the FitCoach CRM team
        </p>
      </div>
    </article>
  );
}
