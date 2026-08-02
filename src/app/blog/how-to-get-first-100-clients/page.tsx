import Link from 'next/link';

export const metadata = { title: 'How to Get Your First 100 Clients · FitCoach CRM', description: 'Proven strategies for personal trainers to land their first 100 paying clients.' };

export default function First100Clients() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-emerald-600 text-sm hover:underline">← Back to blog</Link>
      <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-6">How to Get Your First 100 Clients</h1>
      <p className="text-gray-700 mb-4">Most new trainers overcomplicate client acquisition. Focus on three channels: local partnerships (gyms, physios, nutritionists), content (Instagram Reels and YouTube Shorts showing your coaching style), and referral systems (every current client should bring one more).</p>
      <p className="text-gray-700 mb-4">FitCoach CRM's referral program gives every paying client a unique code — turning your existing base into a self-reinforcing acquisition channel.</p>
    </article>
  );
}