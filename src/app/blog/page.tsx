import Link from 'next/link';

const posts = [
  { slug: 'ai-fitness-trends-2026', title: 'AI Fitness Trends 2026' },
  { slug: 'ai-workout-plan-guide', title: 'AI Workout Plan Guide' },
  { slug: 'how-to-get-first-100-clients', title: 'How to Get Your First 100 Clients' },
  { slug: 'personal-trainer-business-guide', title: 'Personal Trainer Business Guide' },
];

export const metadata = { title: 'Blog · FitCoach CRM', description: 'Insights on fitness coaching, AI workout planning, and growing your personal training business.' };

export default function BlogIndex() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">FitCoach CRM Blog</h1>
      <p className="text-gray-600 mb-8">Insights, guides, and trends for fitness coaches.</p>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition">
            <Link href={`/blog/${p.slug}`} className="text-emerald-600 font-medium hover:underline">{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}