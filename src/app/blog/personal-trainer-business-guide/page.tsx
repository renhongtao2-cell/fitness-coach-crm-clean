import Link from 'next/link';

export const metadata = { title: 'Personal Trainer Business Guide · FitCoach CRM', description: 'A complete guide to building, pricing, and scaling a profitable personal training business.' };

export default function PTBusinessGuide() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-emerald-600 text-sm hover:underline">← Back to blog</Link>
      <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Personal Trainer Business Guide</h1>
      <p className="text-gray-700 mb-4">Building a training business is three jobs in one: coaching, marketing, and operations. Most trainers burn out because they try to do all three manually.</p>
      <p className="text-gray-700 mb-4">A modern CRM handles the operations layer — scheduling, billing, progress tracking, messaging — so you can focus on coaching and growing your audience. FitCoach CRM was built exactly for this.</p>
    </article>
  );
}