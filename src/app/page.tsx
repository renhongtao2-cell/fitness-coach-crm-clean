'use client';

import Link from 'next/link';
import {
  Dumbbell, Users, Brain, TrendingUp, MessageSquare, CreditCard,
  Star, ChevronDown, ArrowRight, Zap, Award, CheckCircle,
  BarChart3, Shield, Sparkles, Rocket, Heart,
  Play, Calendar, Target, Layers, Globe,
  Menu, X, UserPlus, Building2, Smartphone
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useState, useEffect, useRef } from "react";

/* Animated Counter */
function AnimatedNumber(props) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
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
    let s = 0;
    const inc = props.target / 125;
    const t = setInterval(() => {
      s += inc;
      if (s >= props.target) {
        setCount(props.target);
        clearInterval(t);
      } else {
        setCount(Math.floor(s));
      }
    }, 16);
    return () => clearInterval(t);
  }, [started.current, props.target]);
  return <div ref={ref}>{count.toLocaleString()}{props.suffix || ""}</div>;
}

/* Scroll Reveal */
function Reveal({ children, delay = 0, className = "" }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setV(true);
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const ds = delay || 0;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.7s ease ' + ds + 's, transform 0.7s ease ' + ds + 's',
      }}
    >
      {children}
    </div>
  );
}

/* Particles BG */
function ParticleBG() {
  var pts = [];
  for (var i = 0; i < 20; i++) {
    pts.push({
      w: Math.random() * 6 + 2,
      h: Math.random() * 6 + 2,
      l: Math.random() * 100,
      t: Math.random() * 100,
      d: Math.random() * 10 + 10,
      dl: Math.random() * 5
    });
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map(function(p, i) {
        return (
          <div key={i} className="absolute rounded-full opacity-20"
            style={{ width: p.w+'px', height: p.h+'px', left: p.l+'%', top: p.t+'%',
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              animation: 'float '+p.d+'s ease-in-out infinite',
              animationDelay: p.dl+'s' }} />
        );
      })}
      <style>{`@keyframes float{0%,100%{transform:translateY(0) translateX(0)}25%{transform:translateY(-30px) translateX(15px)}50%{transform:translateY(-10px) translateX(-20px)}75%{transform:translateY(-40px) translateX(10px)}}`}</style>
    </div>
  );
}

/* Dashboard Preview */
function DashboardPreview() {
  var bars = [60, 45, 70, 55, 80, 65, 90, 50, 75, 85, 60, 70];
  var plans = ['Free','Basic','Pro','Enterprise'];
  var percs = [12, 28, 35, 25];
  var colors = ['bg-gray-400','bg-blue-500','bg-purple-500','bg-orange-500'];
  var actItems = [
    { n: 'Sarah Chen', a: 'completed Leg Day', t: '2m ago', c: 'bg-pink-500' },
    { n: 'James Liu', a: 'submitted body measurement', t: '15m ago', c: 'bg-blue-500' },
    { n: 'Emma Wilson', a: 'AI plan generated: PPL', t: '1h ago', c: 'bg-purple-500' },
    { n: 'David Park', a: 'checked in: Upper Body', t: '2h ago', c: 'bg-green-500' },
  ];
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-3xl opacity-20 scale-105" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400 text-center">fitcoach.app/dashboard</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Coach Dashboard</h3>
              <p className="text-sm text-gray-500">Welcome back, Coach Mike</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
          </div>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { l: 'Active Clients', v: '48', ic: Users, c: 'blue', ch: '+12%' },
              { l: 'Weekly Workouts', v: '156', ic: Dumbbell, c: 'green', ch: '+8%' },
              { l: 'AI Plans Today', v: '7', ic: Brain, c: 'purple', ch: 'Fresh' },
              { l: 'Revenue', v: '$12.4K', ic: TrendingUp, c: 'orange', ch: '+23%' },
            ].map(function(s, i) {
              return (
                <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <s.ic className={'w-4 h-4 text-'+s.c+'-500'} />
                    <span className="text-xs text-green-500 font-medium">{s.ch}</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{s.v}</div>
                  <div className="text-xs text-gray-500">{s.l}</div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="col-span-2 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-900">Client Progress</h4>
                <span className="text-xs text-gray-400">Last 30 days</span>
              </div>
              <div className="flex items-end gap-1.5 h-24">
                {bars.map(function(h, i) {
                  return (
                    <div key={i} className={'flex-1 '+(i%3===0?'bg-purple-400':'bg-blue-500')} style={{height:h+'%'}} />
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Plan Distribution</h4>
              <div className="space-y-2">
                {plans.map(function(p, i) {
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={'w-2 h-2 rounded-full '+colors[i]} />
                        <span className="text-gray-600">{p}</span>
                      </div>
                      <span className="font-medium text-gray-900">{percs[i]}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
            {actItems.map(function(it, i) {
              return (
                <div key={i} className="flex items-center gap-3 py-2 border-t border-gray-50">
                  <div className={'w-8 h-8 rounded-full '+it.c+' flex items-center justify-center text-white text-xs font-medium'}>{it.n[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900"><span className="font-medium">{it.n}</span> <span className="text-gray-500">{it.a}</span></p>
                  </div>
                  <span className="text-xs text-gray-400">{it.t}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg border border-gray-100 p-3" style={{animation:'bounce 3s infinite'}}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Brain className="w-4 h-4 text-green-600" /></div>
          <div><div className="text-xs font-semibold text-gray-900">AI Generated</div><div className="text-xs text-gray-500">New Plan Ready</div></div>
        </div>
      </div>
      <div className="absolute -right-4 bottom-1/3 bg-white rounded-xl shadow-lg border border-gray-100 p-3" style={{animation:'bounce 4s infinite 1s'}}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-4 h-4 text-blue-600" /></div>
          <div><div className="text-xs font-semibold text-gray-900">+23%</div><div className="text-xs text-gray-500">Growth</div></div>
        </div>
      </div>
    </div>
  );
}

/* Feature Card */
function FeatureCard({ icon: Icon, title, desc, color, gradient }) {
  return (
    <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-500 overflow-hidden">
      <div className={'absolute inset-0 '+gradient+' opacity-0 group-hover:opacity-5 transition-opacity duration-500'} />
      <div className={'inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 '+color+' group-hover:scale-110 transition-transform duration-300'}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

/* Testimonial Card */
function TestimonialCard({ name, role, quote, avatar }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex gap-1 mb-4">
        {[1,2,3,4,5].map(function(i) {
          return <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
        })}
      </div>
      <p className="text-gray-700 leading-relaxed mb-6 italic">{'"'+quote+'"'}</p>
      <div className="flex items-center gap-3">
        <div className={'w-12 h-12 rounded-full '+avatar+' flex items-center justify-center text-white font-bold text-lg'}>{name[0]}</div>
        <div><div className="font-semibold text-gray-900">{name}</div><div className="text-sm text-gray-500">{role}</div></div>
      </div>
    </div>
  );
}

/* FAQ Accordion */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition">
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <ChevronDown className={'w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 '+(open ? 'rotate-180' : '')} />
      </button>
      {open && <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{answer}</div>}
    </div>
  );
}

/* Pricing Card */
function PricingCard({ tier, billingCycle, onUpgrade }) {
  var isDark = tier.popular;
  return (
    <div className={'relative rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] '+(isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl ring-4 ring-blue-200' : 'bg-white border border-gray-200 hover:shadow-xl')}>
      {tier.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className={""+(isDark?"bg-blue-500 text-white":"bg-gray-900 text-white")+" px-4 py-1.5 rounded-full text-xs font-bold"}>{tier.badge}</span></div>}
      <div className="flex items-center gap-3 mb-4">
        <div className={'w-12 h-12 rounded-xl flex items-center justify-center '+(isDark?'bg-white/10':'bg-gray-100')}><tier.icon className={'w-6 h-6 '+(isDark?'text-white':'text-gray-600')} /></div>
        <h3 className={'text-xl font-bold '+(isDark?'text-white':'text-gray-900')}>{tier.name}</h3>
      </div>
      <p className={'text-sm mb-6 '+(isDark?'text-gray-300':'text-gray-500')}>{tier.desc}</p>
      <div className="mb-6">
        <div className="flex items-baseline"><span className={'text-4xl font-bold '+(isDark?'text-white':'text-gray-900')}>{tier.price}</span><span className={'ml-1 '+(isDark?'text-gray-400':'text-gray-500')}>/mo</span></div>
        {billingCycle==='yearly' && tier.name !== 'Free' && <p className={'text-xs mt-1 '+(isDark?'text-gray-400':'text-gray-400')}>Billed annually - save ~20%</p>}
      </div>
      <div className="space-y-3 mb-8">
        {tier.features.map(function(f, i) {
          return (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className={'w-4 h-4 mt-0.5 shrink-0 '+(isDark?'text-blue-400':'text-green-500')} />
              <span className={'text-sm '+(isDark?'text-gray-300':'text-gray-600')}>{f}</span>
            </div>
          );
        })}
      </div>
      <button onClick={onUpgrade} className={'w-full py-3.5 rounded-xl font-semibold text-sm transition '+(isDark?'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30':'bg-gray-900 hover:bg-gray-800 text-white')}>{tier.cta}</button>
    </div>
  );
}

/* ===== MAIN PAGE ===== */
export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, setLanguage, language } = useTranslation();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const langMap = { "en-US": "English", "zh-CN": "简体中文", "ja-JP": "日本語", "ko-KR": "한국어", "es-ES": "Español", "fr-FR": "Français", "de-DE": "Deutsch", "pt-BR": "Português (Brasil)", "ar-SA": "العربية", "hi-IN": "हिन्दी" };
  const selectedLangName = langMap[language] || "English";
  const [billing, setBilling] = useState('monthly');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  const features = [
    { icon: Brain, title: 'AI Training Plans', desc: 'Generate science-backed, multi-phase training programs in seconds. Customize by goal, fitness level, equipment, and preferences.', color: 'bg-purple-100 text-purple-600', gradient: 'from-purple-500 to-pink-500' },
    { icon: Users, title: 'Client Management', desc: 'Organize unlimited clients with detailed profiles, fitness levels, goals, body measurements, and communication history.', color: 'bg-blue-100 text-blue-600', gradient: 'from-blue-500 to-cyan-500' },
    { icon: TrendingUp, title: 'Progress Analytics', desc: 'Beautiful charts for weight, body fat %, measurements, and workout logs. Visualize every client transformation journey.', color: 'bg-green-100 text-green-600', gradient: 'from-green-500 to-emerald-500' },
    { icon: MessageSquare, title: 'Built-in Messaging', desc: 'Real-time chat with clients. Share updates, motivate, and stay connected - all within the platform.', color: 'bg-orange-100 text-orange-600', gradient: 'from-orange-500 to-red-500' },
    { icon: Calendar, title: 'Smart Scheduling', desc: 'Track workout schedules, session dates, and deadlines. Never miss a check-in or follow-up again.', color: 'bg-indigo-100 text-indigo-600', gradient: 'from-indigo-500 to-purple-500' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade encryption with row-level security. Your client data stays private and protected at all times.', color: 'bg-teal-100 text-teal-600', gradient: 'from-teal-500 to-blue-500' },
  ];

  const steps = [
    { icon: UserPlus, num: '01', title: 'Sign Up Free', desc: 'Create your account in 30 seconds. No credit card required.' },
    { icon: Users, num: '02', title: 'Add Your Clients', desc: 'Import or manually add clients with goals, fitness level, and preferences.' },
    { icon: Sparkles, num: '03', title: 'AI Generates Plans', desc: 'Describe your client needs. AI creates a complete training program instantly.' },
    { icon: TrendingUp, num: '04', title: 'Track and Scale', desc: 'Monitor progress, send messages, and grow your coaching business effortlessly.' },
  ];

  const pricingTiers = [
    { name: 'Free', icon: Zap, price: '$0', desc: 'Perfect for getting started', features: ['Up to 5 clients', '5 training plans', '5 AI generations/month', '50 training logs stored', '50 messages'], cta: 'Get Started Free' },
    { name: 'Basic', icon: Star, price: billing==='yearly' ? '$290' : '$29', desc: 'For growing coaches', features: ['Up to 20 clients', '20 training plans', '20 AI generations/month', '200 training logs', 'Unlimited messages', 'Remove branding'], cta: 'Start Free Trial', popular: true, badge: 'MOST POPULAR' },
    { name: 'Pro', icon: Rocket, price: billing==='yearly' ? '$990' : '$99', desc: 'For professional coaches', features: ['Up to 50 clients', 'Unlimited plans', '50 AI generations/month', '1000 training logs', 'Priority support', 'Custom branding', 'API access'], cta: 'Start Free Trial' },
    { name: 'Enterprise', icon: Building2, price: billing==='yearly' ? '$2990' : '$299', desc: 'For agencies and teams', features: ['Unlimited everything', 'White-label solution', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'Team management'], cta: 'Contact Sales' },
  ];

  const testimonials = [
    { name: 'Mike Johnson', role: 'Personal Trainer, 5 years', quote: 'FitCoach completely transformed how I manage my 80+ clients. The AI plan generator saves me hours every week.', avatar: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { name: 'Sarah Chen', role: 'Online Fitness Coach', quote: 'I went from juggling 5 different apps to just FitCoach. Revenue doubled in 6 months.', avatar: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { name: 'David Park', role: 'CrossFit Box Owner', quote: 'Managing my CrossFit box with FitCoach is seamless. The analytics help me see which programs work best.', avatar: 'bg-gradient-to-br from-green-500 to-emerald-500' },
    { name: 'Emma Wilson', role: 'Yoga Instructor to Full Coach', quote: 'FitCoach gave me the tools to expand my services and double my client base.', avatar: 'bg-gradient-to-br from-orange-500 to-red-500' },
  ];

  const faqs = [
    { q: 'Is there really a free plan?', a: 'Yes! Our free plan supports up to 5 clients with core features. No credit card required.' },
    { q: 'How does the AI plan generator work?', a: 'Describe your client goals, fitness level, equipment, and preferences. Our AI generates a complete multi-phase training program with exercises, sets, reps, and rest times.' },
    { q: 'Can I import clients from other tools?', a: 'Currently you can add clients manually or via email referral links. CSV import is coming soon.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, Amex) through Stripe.' },
    { q: 'Is my client data secure?', a: 'Absolutely. We use industry-standard encryption with row-level security on Supabase. All data is GDPR compliant.' },
    { q: 'Can I cancel anytime?', a: 'Yes, cancel anytime. Access continues until the end of your billing period. No hidden fees.' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* NAV */}
      <nav className={'fixed top-0 left-0 right-0 z-50 transition-all duration-300 '+(scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' : 'bg-white/80 backdrop-blur-md border-b border-gray-100/50')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-blue-200">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">FitCoach</span>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(function(link) {
              return <a key={link.label} href={link.href} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all">{link.label}</a>;
            })}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => setShowLangPicker(!showLangPicker)} className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition flex items-center gap-1 rounded-lg hover:bg-gray-50 relative">
              <Globe className="w-4 h-4" />
              {selectedLangName === "English" ? "EN" : selectedLangName.length > 4 ? selectedLangName.substring(0,3) : selectedLangName}
              {showLangPicker && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 w-52">
                  {Object.entries(langMap).map(([code, name]) => (
                    <button key={code} onClick={() => { setLanguage(code as any); setShowLangPicker(false); }}
                      className={"w-full text-left px-3 py-2 text-sm rounded-lg transition " + (language === code ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50")}>
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </button>
            <Link href="/login" className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition">Sign In</Link>
            <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 flex items-center gap-1">
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
            {navLinks.map(function(link) {
              return <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">{link.label}</a>;
            })}
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <button onClick={() => setMobileOpen(false)} className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">{selectedLangName}</button>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 px-4 py-3 text-center text-sm font-medium text-gray-700 bg-gray-50 rounded-xl">Sign In</Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 px-4 py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">Start Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6">
        <ParticleBG />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay:'2s'}} />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay:'4s'}} />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 mb-8 shadow-sm">
              <Sparkles className="w-4 h-4" />AI-Powered Fitness CRM - Trusted by 500+ Coaches
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-[1.1] tracking-tight">
              The CRM Built{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" style={{backgroundImage:'linear-gradient(135deg,#2563eb,#7c3aed,#db2777)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                Specifically
              </span>
              <br />for Fitness Coaches
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Manage clients, generate AI training plans, track progress, and scale your coaching business - all in one powerful platform.
              <span className="block mt-2 font-medium text-gray-900">No spreadsheets. No chaos. Just results.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/register" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all shadow-xl shadow-blue-200 hover:shadow-2xl text-lg flex items-center justify-center gap-2 hover:scale-105">
                Start Free - No Card Needed <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl transition-all border-2 border-gray-200 text-lg flex items-center justify-center gap-2 hover:border-gray-300 hover:shadow-lg">
                <Play className="w-5 h-5" />See How It Works
              </a>
            </div>
            <p className="text-sm text-gray-400">Free plan available - Upgrade anytime - Cancel with one click</p>
          </div>
          <Reveal><DashboardPreview /></Reveal>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[{v:10000,s:'+',l:'AI Plans Generated'},{v:500,s:'+',l:'Active Coaches'},{v:50000,s:'+',l:'Clients Managed'},{v:4,s:'',d:'.9',l:'Avg Rating'}].map(function(st,i) {
              return (
                <div key={i}>
                  <div className="text-4xl md:text-5xl font-extrabold text-white mb-2"><AnimatedNumber target={st.v} />{st.s}{st.d||''}</div>
                  <div className="text-sm text-slate-400">{st.l}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 px-4 sm:px-6 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-600 mb-6"><Zap className="w-4 h-4" />Powerful Features</div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Everything You Need to{' '}<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Scale Your Coaching</span></h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">From client onboarding to progress tracking, FitCoach handles it all.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(function(f,i) {
              return <Reveal key={i} delay={i*0.1}><FeatureCard {...f} /></Reveal>;
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-100 rounded-full text-sm font-medium text-purple-600 mb-6"><Rocket className="w-4 h-4" />Simple Setup</div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Up and Running in{' '}<span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Minutes</span></h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">Four simple steps to transform how you coach.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(function(step,i) {
              return (
                <Reveal key={i} delay={i*0.15}>
                  <div className="relative text-center">
                    {i < steps.length-1 && <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-blue-300 to-purple-300" />}
                    <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 mb-6">
                      <step.icon className="w-10 h-10 text-blue-600" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg">{step.num}</div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI SHOWCASE */}
      <section className="py-28 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-blue-300 mb-8"><Sparkles className="w-4 h-4" />AI-Powered Engine</div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Let AI Build Your{' '}<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Training Plans</span></h2>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">Stop spending hours creating programs. Describe your client needs and our AI generates comprehensive training plans in seconds.</p>
                <div className="space-y-4">
                  {[
                    { icon: Target, t: 'Goal-Based', d: 'Strength, hypertrophy, fat loss - tailored to every objective' },
                    { icon: Layers, t: 'Multi-Phase', d: 'Periodized programs with progressive overload built in' },
                    { icon: Dumbbell, t: 'Equipment Aware', d: 'Works with gym, home, or bodyweight setups' },
                    { icon: Brain, t: 'Smart Adjustments', d: 'AI learns from feedback and refines future plans' },
                  ].map(function(item,i) {
                    return (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0"><item.icon className="w-5 h-5 text-blue-400" /></div>
                        <div><div className="font-semibold mb-1">{item.t}</div><div className="text-sm text-slate-400">{item.d}</div></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0"><Brain className="w-4 h-4 text-white" /></div>
                    <div className="bg-white/10 rounded-2xl rounded-tl-md p-4 flex-1">
                      <p className="text-sm text-slate-200"><strong>Coach Mike:</strong> Create a 12-week hypertrophy program for intermediate level, dumbbells and barbell. Focus on chest and back.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-tr-md p-4 max-w-lg flex-1">
                      <p className="text-sm text-white font-medium mb-2">AI-Generated: Home Hypertrophy 12-Week</p>
                      <div className="space-y-2 text-xs text-blue-100">
                        <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /><span>Phase 1 (Wk 1-4): Volume Accumulation</span></div>
                        <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /><span>Phase 2 (Wk 5-8): Intensity Progression</span></div>
                        <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /><span>Phase 3 (Wk 9-12): Peak Loading</span></div>
                        <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /><span>4-day split: Push / Pull / Legs / Upper</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full text-sm font-medium text-green-600 mb-6"><Award className="w-4 h-4" />Transparent Pricing</div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Plans That{' '}<span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Grow With You</span></h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">Start free. Upgrade when ready. Every paid plan includes a 14-day free trial.</p>
              <div className="inline-flex items-center gap-3 bg-white rounded-xl p-1.5 border border-gray-200 shadow-sm">
                <button onClick={() => setBilling('monthly')} className={'px-5 py-2.5 rounded-lg text-sm font-medium transition-all '+(billing==='monthly'?'bg-gray-900 text-white shadow-md':'text-gray-500 hover:text-gray-700')}>Monthly</button>
                <button onClick={() => setBilling('yearly')} className={'px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 '+(billing==='yearly'?'bg-gray-900 text-white shadow-md':'text-gray-500 hover:text-gray-700')}>
                  Yearly <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">Save 20%</span>
                </button>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map(function(tier,i) {
              return <Reveal key={i} delay={i*0.1}><PricingCard tier={tier} billingCycle={billing} onUpgrade={() => window.location.href='/register'} /></Reveal>;
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 rounded-full text-sm font-medium text-yellow-700 mb-6"><Star className="w-4 h-4" />Loved by Coaches</div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Trusted by{' '}<span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">500+ Fitness Coaches</span></h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">Real coaches, real results.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(function(t,i) {
              return <Reveal key={i} delay={i*0.1}><TestimonialCard {...t} /></Reveal>;
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-500">Need more help? Reach out to our support team.</p>
            </div>
          </Reveal>
          <div className="space-y-3">
            {faqs.map(function(faq,i) {
              return <Reveal key={i} delay={i*0.05}><FAQItem question={faq.q} answer={faq.a} /></Reveal>;
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8"><Heart className="w-4 h-4" />Join 500+ Coaches Already Growing</div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Ready to Transform<br />Your Coaching Business?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">Start free today. No credit card required. Scale when you are ready.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="group px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-2xl text-lg flex items-center justify-center gap-2 hover:scale-105">
                Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all border-2 border-white/30 text-lg backdrop-blur-sm">Already a Member? Sign In</Link>
            </div>
            <div className="flex items-center justify-center gap-8 mt-10 text-sm text-blue-200">
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />Free forever plan</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />No credit card</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />Cancel anytime</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-4 sm:px-6 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl">FitCoach</span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-xs">The modern CRM for fitness coaches. AI-powered, beautifully designed, and built to scale your coaching business.</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition cursor-pointer"><Globe className="w-4 h-4" /></div>
                <div className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition cursor-pointer"><MessageSquare className="w-4 h-4" /></div>
                <div className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition cursor-pointer"><Smartphone className="w-4 h-4" /></div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><Link href="/register" className="hover:text-white transition">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="mailto:support@fitcoach.app" className="hover:text-white transition">Email Us</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">2025 FitCoach. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}