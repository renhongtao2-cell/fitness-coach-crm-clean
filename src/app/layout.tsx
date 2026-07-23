import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/Toast";

export const metadata: Metadata = {
  title: "FitCoach CRM - Modern CRM for Fitness Coaches",
  description: "AI-powered training plans, coachee management, progress tracking, and messaging.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KWRJ77SQPV"></script>
        <script dangerouslySetInnerHTML={{__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-KWRJ77SQPV');`}}/>
      </head>
      <body className="antialiased">
                  {children}
          <ToastContainer />
              </body>
    </html>
  );
}
