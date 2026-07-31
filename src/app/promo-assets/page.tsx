import React from 'react';

export default function PromoAssets() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
      {/* Screen 1: Hero */}
      <section className="py-24 px-12 max-w-6xl mx-auto">
        <div className="mb-4 flex items-center gap-2 text-purple-400 font-semibold text-sm tracking-wider uppercase">
          <span>⚡ AI-Powered</span>
        </div>
        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
          The CRM Built Specifically<br />for Fitness Coaches
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl">
          Manage clients, generate AI training plans, track progress - all in one powerful platform.
          No spreadsheets. No chaos. Just results.
        </p>
      </section>

      {/* Screen 2: Features Grid */}
      <section className="py-24 px-12 max-w-6xl mx-auto border-t border-white/10">
        <h2 className="text-4xl font-bold mb-12">Everything You Need to Scale Your Coaching</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            {icon:'🤖',title:'AI Training Plans',desc:'Generate full workout programs from plain text. 12-week plans with progressive overload.'},
            {icon:'📊',title:'Progress Tracking',desc:'Real-time analytics dashboard. Track body measurements and client milestones.'},
            {icon:'💬',title:'Built-in Messaging',desc:'Chat with clients directly. Send messages, reminders, and feedback.'},
            {icon:'💳',title:'Stripe Payments',desc:'Accept payments automatically. Free, Pro, and Enterprise tiers.'},
            {icon:'👥',title:'Client Management',desc:'Manage unlimited clients with detailed profiles, notes, and measurements.'},
            {icon:'🌍',title:'10 Languages',desc:'EN, ZH, JP, KO, ES, FR, DE, PT, AR, HI supported out of the box.'},
          ].map(f => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
