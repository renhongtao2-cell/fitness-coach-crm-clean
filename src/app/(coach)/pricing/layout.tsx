import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - FitCoach CRM | Free to Start, Plans from /mo',
  description: 'Compare FitCoach CRM plans: Free forever for up to 5 clients, Basic /mo, Pro /mo, Enterprise /mo. AI workout planning, progress tracking, Stripe payments. No credit card required.',
  alternates: {
    canonical: '/coach/pricing',
  },
  openGraph: {
    title: 'FitCoach CRM Pricing - Plans from Free to Enterprise',
    description: 'Start free with up to 5 clients. Upgrade as you grow. Basic /mo, Pro /mo, Enterprise /mo. AI-generated workout plans included.',
    type: 'website',
    url: '/coach/pricing',
    siteName: 'FitCoach CRM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitCoach CRM Pricing — Start Free Today',
    description: 'Free forever plan for up to 5 clients. Paid plans from /mo with AI training plan generation.',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}