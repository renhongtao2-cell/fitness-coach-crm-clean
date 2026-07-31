'use client';

import Link from 'next/link';
import {
  Dumbbell, Users, Brain, TrendingUp, MessageSquare, CreditCard,
  Star, ArrowRight, Zap, CheckCircle,
  BarChart3, Shield, Sparkles, Play, UserPlus,
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useState, useEffect, useRef } from "react";

/* Animated Counter */
function AnimatedNumber({ target, suffix }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) started.current = true;
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started.current) return;
    const inc = target / 80;
    const t = setInterval(() => {
      setCount(prev => {
        const next = prev + inc;
        if (next >= target) { clearInterval(t); return target; }
        return Math.floor(next);
      });
    }, 16);
    return () => clearInterval(t);
  }, [started.current, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix || ""}</span>;
}

/* Scroll Reveal */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const { language, setLanguage } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#7C3AED] flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <span className="text-[#1c1917]">Fit</span><span className="text-[#FF6B35]">Coach</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-[#57534e] hover:text-[#1c1917] rounded-xl hover:bg-gray-100 transition">Sign In</Link>
              <Link href="/register?role=coach" className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #FF6B35, #E85D2C)' }}>
                Start Free →
              </Link>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <div className="w-6 space-y-1.5">
                <span className="block h-0.5 bg-gray-700 rounded-full"></span>
                <span className="block h-0.5 bg-gray-700 rounded-full w-4"></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-32">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-purple-50"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #FF6B35, transparent)' }}></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }}></div>
          <div className="absolute top-1/3 left-0 w-[300px] h-[300px] rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, #10B981, transparent)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-orange-200 text-sm font-semibold text-[#FF6B35] mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Fitness CRM
            <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <span className="text-[#1c1917]">Your Personal Training </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#7C3AED] to-[#10B981]">Business.<br/>Supercharged.</span>
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-[#78716c] max-w-2xl mx-auto leading-relaxed">
            The only CRM built for fitness coaches, not gyms. Generate AI training plans in seconds, track every rep, and collect payments — all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?role=coach" className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-200 hover:-translate-y-0.5 animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #FF6B35, #E85D2C)' }}>
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/register?role=client" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 hover:-translate-y-0.5 bg-white border-2 border-gray-200 text-gray-800 hover:border-[#FF6B35] hover:text-[#FF6B35]">
              <Play className="w-5 h-5" />
              I'm a Client
            </Link>
          </div>
          <p className="mt-6 text-sm text-[#a8a29e]">No credit card required · Free plan available · <span className="text-[#10B981] font-semibold">2,500+ coaches trust us</span></p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-10 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 2500, suffix: '+', label: 'Active Coaches' },
              { value: 15000, suffix: '+', label: 'Training Plans Generated' },
              { value: 98, suffix: '%', label: 'Client Satisfaction' },
              { value: 45, suffix: 's', label: 'Avg Plan Creation Time' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl lg:text-4xl font-black text-[#1c1917]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-[#78716c] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <Reveal>
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 text-[#7C3AED] text-sm font-bold mb-4">CORE FEATURES</span>
              <h2 className="text-3xl lg:text-5xl font-black text-[#1c1917]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Everything you need to<br/>run your coaching business
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Brain className="w-6 h-6" />, color: '#FF6B35', bg: '#FFF5F0', title: 'AI Workout Generator', desc: 'Generate personalized training plans in seconds. Just describe the goal, and AI handles the rest.' },
                { icon: <Users className="w-6 h-6" />, color: '#7C3AED', bg: '#F8F5FF', title: 'Client Management', desc: 'Unlimited clients. Track goals, measurements, progress photos, and training logs in one dashboard.' },
                { icon: <BarChart3 className="w-6 h-6" />, color: '#10B981', bg: '#ECFDF5', title: 'Progress Tracking', desc: 'Visual progress charts. Body measurements, weight trends, workout completion rates.' },
                { icon: <MessageSquare className="w-6 h-6" />, color: '#F59E0B', bg: '#FFFBEB', title: 'Built-in Messaging', desc: 'Chat with clients directly. No switching between apps. Keep all communication in one place.' },
                { icon: <CreditCard className="w-6 h-6" />, color: '#3B82F6', bg: '#EFF6FF', title: 'Stripe Payments', desc: 'Accept payments, subscriptions, and invoices. Automatic recurring billing. 2.9% + 30¢ per transaction.' },
                { icon: <Shield className="w-6 h-6" />, color: '#EF4444', bg: '#FEF2F2', title: 'Enterprise Security', desc: 'SOC 2 compliant. End-to-end encryption. Your client data is protected at every level.' },
              ].map((feat, i) => (
                <div key={i} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ backgroundColor: feat.bg, color: feat.color }}>
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#1c1917] mb-2">{feat.title}</h3>
                  <p className="text-[#78716c] text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* How It Works */}
      <section className="py-20" style={{ backgroundColor: '#FFFBF5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-[#FF6B35] text-sm font-bold mb-4">HOW IT WORKS</span>
            <h2 className="text-3xl lg:text-5xl font-black text-[#1c1917]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              From zero to coaching<br/>in 3 simple steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', icon: <UserPlus />, title: 'Create Your Free Account', desc: 'Sign up in 30 seconds. No credit card needed. Choose your plan later when you\'re ready.' },
              { num: '02', icon: <Users />, title: 'Add Your Clients', desc: 'Invite clients via email or link. They get their own dashboard to log workouts and track progress.' },
              { num: '03', icon: <Brain />, title: 'Generate AI Workout Plans', desc: 'AI creates personalized training programs. Customize anything. Deploy instantly.' },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.1} className="relative">
                <div className="bg-white rounded-2xl p-8 border border-orange-100">
                  <span className="text-5xl font-black text-orange-100" style={{ fontFamily: "'Outfit', sans-serif" }}>{step.num}</span>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 mt-2" style={{ backgroundColor: '#FFF5F0', color: '#FF6B35' }}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#1c1917] mb-2">{step.title}</h3>
                  <p className="text-[#78716c] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-[#10B981] text-sm font-bold mb-4">TESTIMONIALS</span>
            <h2 className="text-3xl lg:text-5xl font-black text-[#1c1917]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Loved by coaches<br/>worldwide
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Mitchell', role: 'Online Fitness Coach', stars: 5, text: 'FitCoach saved me 10+ hours per week on program design. The AI workout generator is shockingly good — my clients love the variety.' },
              { name: 'Marcus Rivera', role: 'Strength & Conditioning', stars: 5, text: 'I manage 40 clients across 3 time zones. FitCoach keeps everything organized. The messaging feature alone replaced 3 apps.' },
              { name: 'Emily Chen', role: 'Personal Trainer', stars: 5, text: 'Stripe integration is seamless. I collect all payments through FitCoach now. My income went up 30% just from reduced admin time.' },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[#57534e] text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#1c1917]">{t.name}</p>
                      <p className="text-xs text-[#a8a29e]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20" style={{ backgroundColor: '#FAFAF9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">PRICING</span>
          <h2 className="text-3xl lg:text-5xl font-black text-[#1c1917] mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Start free. Scale when ready.
          </h2>
          <p className="text-[#78716c] text-lg mb-10">No hidden fees. Cancel anytime. All plans include a 7-day free trial.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Starter', price: 'Free', desc: 'For new coaches', features: ['Up to 5 clients', '5 AI plans/month', 'Basic analytics', 'Community support'], accent: false },
              { name: 'Pro', price: '$29', desc: 'Most popular', features: ['Unlimited clients', 'Unlimited AI plans', 'Advanced analytics', 'Stripe payments', 'Priority support'], accent: true },
              { name: 'Enterprise', price: '$99', desc: 'For teams', features: ['Everything in Pro', 'Custom branding', 'API access', 'Dedicated manager', 'SLA guarantee'], accent: false },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`rounded-2xl p-8 border-2 ${plan.accent ? 'border-[#FF6B35] bg-white shadow-xl shadow-orange-100 relative' : 'border-gray-200 bg-white'}`}>
                  {plan.accent && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF6B35] text-white text-xs font-bold rounded-full">MOST POPULAR</span>
                  )}
                  <h3 className="text-xl font-bold text-[#1c1917] mb-1">{plan.name}</h3>
                  <p className="text-[#a8a29e] text-sm mb-4">{plan.desc}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-black" style={{ fontFamily: "'Outfit', sans-serif" }}>{plan.price}</span>
                    {plan.price !== 'Free' && <span className="text-[#78716c]">/mo</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-[#57534e]">
                        <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register?role=coach" className={`block w-full py-3 rounded-xl font-bold text-sm text-center transition ${plan.accent ? 'text-white' : 'text-[#1c1917] border-2 border-gray-200 hover:border-[#FF6B35]'}`} style={plan.accent ? { background: 'linear-gradient(135deg, #FF6B35, #E85D2C)' } : {}}>
                    {plan.price === 'Free' ? 'Get Started' : 'Start Free Trial'}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 50%, #10B981 100%)' }}></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Ready to transform your<br/>coaching business?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Join 2,500+ fitness coaches who are saving hours every week with AI-powered client management.
          </p>
          <Link href="/register?role=coach" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#FF6B35] font-bold text-lg hover:bg-gray-50 transition shadow-xl">
            Start Free Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1c1917] text-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#FF6B35]" />
              <span className="font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>FitCoach CRM</span>
            </div>
            <p className="text-sm">© 2026 FitCoach CRM. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/about" className="hover:text-white transition">About</Link>
              <Link href="/faq" className="hover:text-white transition">FAQ</Link>
              <Link href="/blog" className="hover:text-white transition">Blog</Link>
              <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
