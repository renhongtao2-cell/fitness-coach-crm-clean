import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/Toast";
import { TranslationProvider } from "@/hooks/use-translation";
import AdsenseBanner from "@/components/AdsenseBanner";

export const metadata: Metadata = {
  title: {
    default: "FitCoach CRM ¡ª AI Workout Plans, Client Tracking & Payments for Fitness Coaches",
    template: "%s | FitCoach CRM"
  },
  description: "The #1 AI-powered CRM built specifically for fitness coaches and personal trainers. Generate custom workout plans in seconds, track client progress visually, send messages, and collect payments all in one platform. Free plan available.",
  keywords: [
    "fitness CRM",
    "personal trainer software",
    "personal training CRM",
    "fitness coach CRM",
    "client management for trainers",
    "AI workout planner",
    "workout plan generator",
    "fitness coaching platform",
    "trainer business software",
    "client tracking app",
    "fitness business tools",
    "AI personal trainer",
    "workout program creator",
    "trainer payment software",
    "fitness client management",
    "coach scheduling tool",
    "trainer progress tracker",
    "gym owner software",
    "personal training business",
    "fitness coaching app"
  ],
  authors: [{ name: "FitCoach Team", url: "https://fitness-coach-crm-five.vercel.app" }],
  creator: "FitCoach CRM",
  publisher: "FitCoach CRM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://fitness-coach-crm-five.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "FitCoach CRM",
    title: "FitCoach CRM ¡ª AI Workout Plans for Fitness Coaches",
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
    title: "FitCoach CRM ¡ª AI Workout Plans for Fitness Coaches",
    description: "The only CRM built for coaches, not gyms. AI generates training plans in seconds. Free to start.",
    images: ["/og-image.png"],
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
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || "https://fitness-coach-crm-five.vercel.app"} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="msapplication-TileColor" content="#4F46E5" />
        
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9901133369141996"
                 crossOrigin="anonymous"></script>
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KWRJ77SQPV"></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KWRJ77SQPV');
        `}} />
        
        {/* SoftwareApplication Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              "name": "FitCoach CRM",
              "url": process.env.NEXT_PUBLIC_APP_URL || "https://fitness-coach-crm-five.vercel.app",
              "description": "AI-powered client management CRM built specifically for fitness coaches and personal trainers.",
              "image": "/og-image.png",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250",
                "bestRating": "5",
                "worstRating": "1"
              },
              "featureList": [
                "AI workout plan generation",
                "Client progress tracking",
                "Built-in messaging",
                "Payment collection via Stripe",
                "Smart scheduling",
                "Mobile responsive design"
              ]
            },
            {
              "@type": "Organization",
              "name": "FitCoach CRM",
              "url": process.env.NEXT_PUBLIC_APP_URL || "https://fitness-coach-crm-five.vercel.app",
              "logo": "/og-image.png",
              "sameAs": [],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "email": "renhongtao2@gmail.com"
              }
            }
          ]
        })}} />
        
        {/* WebSite Schema with SearchAction */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "FitCoach CRM",
          "url": process.env.NEXT_PUBLIC_APP_URL || "https://fitness-coach-crm-five.vercel.app",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "{search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}} />
      </head>
      <body className="antialiased">
        <TranslationProvider>
          {children}
          <AdsenseBanner position="top" />
          <ToastContainer />
        </TranslationProvider>
      </body>
    </html>
  );
}
