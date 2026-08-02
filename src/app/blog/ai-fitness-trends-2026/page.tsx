import Link from 'next/link';

export const metadata = { title: 'AI Fitness Trends 2026 · FitCoach CRM', description: 'Explore the top AI-powered fitness trends shaping 2026 for personal trainers and coaches.' };

export default function AIFitnessTrends() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-emerald-600 text-sm hover:underline">← Back to blog</Link>
      <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-6">AI Fitness Trends 2026</h1>
      <p className="text-gray-700 mb-4">AI is reshaping how personal trainers design workouts, track progress, and engage clients. In 2026, expect AI workout generators, real-time form feedback, and predictive analytics to become standard tools in every coach's toolkit.</p>
      <p className="text-gray-700 mb-4">FitCoach CRM's AI generator already lets coaches produce structured, periodized programs in seconds — and we're shipping more AI features throughout the year.</p>
    </article>
  );
}