import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/Toast";
import { TranslationProvider } from "@/hooks/use-translation";

export const metadata: Metadata = {
  title: {
    default: "FitCoach CRM - AI-Powered Client Management for Fitness Coaches",
    template: "%s | FitCoach CRM"
  },
  description: "The #1 AI-powered CRM built specifically for fitness coaches and personal trainers. Generate workout plans, track client progress, manage payments & messaging all in one platform. Start free today.",
  keywords: [
    "fitness CRM",
    "personal trainer software",
    "client management for trainers",
    "AI workout planner",
    "fitness coach tools",
    "personal trainer CRM",
    "fitness business software",
    "workout plan generator",
    "client tracking app",
    "fitness coaching platform",
    "personal training management",
    "gym owner software"
  ],
  authors: [{ name: "FitCoach Team" }],
  creator: "FitCoach CRM",
  publisher: "FitCoach CRM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://fitcoach.app"),
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en',
      'zh-CN': '/zh',
      'es-ES': '/es',
      'fr-FR': '/fr',
      'de-DE': '/de',
      'ja-JP': '/ja',
      'ko-KR': '/ko',
      'pt-BR': '/pt',
      'ar-SA': '/ar',
      'hi-IN': '/hi',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "FitCoach CRM",
    title: "FitCoach CRM - AI-Powered Client Management for Fitness Coaches",
    description: "Generate AI training plans, track client progress, accept payments & manage all your fitness clients in one place. Free forever plan available.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FitCoach CRM - AI-Powered Fitness Coach Client Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitCoach CRM - AI-Powered Client Management for Fitness Coaches",
    description: "The only CRM built for coaches, not gyms. AI generates training plans in seconds.",
    images: ["/og-image.png"],
    creator: "@fitcoach_crm",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "757wpQShfL4xbnKRqb4mRHek-7z8O9XErpm2k6XpWHM",
    // Add other verifications as needed:
    // yandex: "your-yandex-code",
    // yahoo: "your-yahoo-code",
    // apple: "your-apple-verification",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || "https://fitcoach.app"} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="msapplication-TileColor" content="#4F46E5" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KWRJ77SQPV"></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KWRJ77SQPV');
        `}} />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "FitCoach CRM",
          description: "AI-Powered Client Management for Fitness Coaches",
          url: process.env.NEXT_PUBLIC_APP_URL || "https://fitcoach.app",
          image: "/og-image.png",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web Browser",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1250"
          },
          softwareVersion: "1.0",
          copyrightYear: 2025,
          author: {
            "@type": "Organization",
            name: "FitCoach CRM",
            url: process.env.NEXT_PUBLIC_APP_URL || "https://fitcoach.app"
          }
        })}} />
      </head>
      <body className="antialiased">
        <TranslationProvider>
          {children}
          <ToastContainer />
        </TranslationProvider>
      </body>
    </html>
  );
}
