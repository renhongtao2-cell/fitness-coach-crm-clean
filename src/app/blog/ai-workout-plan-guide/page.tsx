import Link from 'next/link';

export const metadata = { title: 'AI Workout Plan Guide · FitCoach CRM', description: 'A practical guide to using AI to generate personalized workout plans for your fitness clients.' };

export default function AIWorkoutPlanGuide() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-emerald-600 text-sm hover:underline">← Back to blog</Link>
      <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-6">AI Workout Plan Guide</h1>
      <p className="text-gray-700 mb-4">AI workout generators help you create structured, personalized programs in seconds. The key is providing clear client context — goals, equipment, experience level, and injuries.</p>
      <p className="text-gray-700 mb-4">FitCoach CRM's generator builds periodized plans with weekly structure, exercise selection, and progression rules. Review and adjust before assigning — your coaching judgment still matters.</p>
    </article>
  );
}