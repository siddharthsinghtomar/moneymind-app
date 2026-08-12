'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingDown, RefreshCw, Sparkles, CheckCircle2, 
  Brain, Tags, PieChart, LayoutGrid, Bell, TrendingUp, 
  ArrowRight, ShieldCheck, Clock, Check, ChevronDown, 
  Lock, ArrowUpRight, Play, ChevronRight, Star, Layers,
  CreditCard, Wallet, Activity, Zap, CheckCircle, Radio, ShieldAlert
} from 'lucide-react';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const integrationLogos = [
    { name: 'HDFC Bank', color: 'text-[#6db89a]' },
    { name: 'ICICI Bank', color: 'text-[#c9a96e]' },
    { name: 'Axis Bank', color: 'text-[#8fafc0]' },
    { name: 'State Bank of India', color: 'text-[#6db89a]' },
    { name: 'Kotak Mahindra', color: 'text-[#c9a96e]' },
    { name: 'Paytm UPI', color: 'text-[#8fafc0]' },
    { name: 'UPI AutoPay', color: 'text-[#6db89a]' },
    { name: 'Visa Secure', color: 'text-[#8fafc0]' },
    { name: 'Mastercard', color: 'text-[#c9a96e]' },
    { name: 'Razorpay', color: 'text-[#6db89a]' },
  ];

  const testimonials = [
    {
      name: 'Siddharth Singh Tomar',
      role: 'Founder & CEO, TechFlow',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      quote: 'MoneyMind entirely transformed how I manage my wealth. The AI coach caught ₹4,200 in recurring bills I forgot I was paying for.'
    },
    {
      name: 'Rajesh Sharma',
      role: 'Senior Product Manager',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      quote: 'The 99.4% categorization accuracy is insane. I connect my accounts, and MoneyMind handles everything in real-time.'
    },
    {
      name: 'Ananya Patel',
      role: 'Freelance Designer',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      quote: 'I hit my emergency fund goal 2 months early thanks to MoneyMind’s weekly spend forecasts. Absolutely essential tool.'
    }
  ];

  const faqs = [
    {
      q: 'How does MoneyMind connect to my bank accounts safely?',
      a: 'MoneyMind uses read-only bank-grade 256-bit SSL encryption via regulated financial data partners. We never store your login credentials and cannot initiate any transfers.'
    },
    {
      q: 'How accurate is the AI transaction categorization?',
      a: 'Our custom financial LLM categorizes transactions with 99.4% accuracy across UPI, credit cards, net banking, and wallets. You can also set custom tagging rules.'
    },
    {
      q: 'Can I track both personal and business accounts?',
      a: 'Yes! Pro and Enterprise plans allow you to segregate personal, freelance, and business entities in distinct workspaces.'
    },
    {
      q: 'Is there a free trial for Pro features?',
      a: 'Absolutely. You get 14 days of full Pro access with zero credit card required. You can downgrade to the free Starter plan anytime.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#141c22] text-[#d4e4dc] font-sans selection:bg-[#6db89a]/30 overflow-x-hidden relative">
      
      {/* CYBER BACKGROUND GRID & AMBIENT GLOW */}
      <div className="bg-grid" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#1b2530] border-b border-white/[0.06] py-2.5 px-4 text-center text-xs text-[#7a9e8e] flex items-center justify-center gap-2 relative z-50 font-mono">
        <span className="bg-[#6db89a] text-[#0f1a15] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">NEW</span>
        <span className="text-[#d4e4dc] font-medium">MoneyMind AI 2.0 with Automated Bill Radar & Conversational Insights is live!</span>
        <Link href="/login" className="text-[#6db89a] font-bold hover:underline flex items-center gap-0.5 ml-1">
          Launch Live App <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* STICKY GLASS NAVBAR */}
      <header className="sticky top-0 w-full z-50 bg-[#141c22]/90 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#6db89a] flex items-center justify-center font-bold text-[#0f1a15] shadow-[0_0_15px_rgba(109,184,154,0.4)]">
              <span className="font-space text-base font-extrabold">M</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight font-space text-[#d4e4dc]">
              MoneyMind <span className="text-[#6db89a] text-xs font-mono font-normal">AI 2.0</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-bold text-[#7a9e8e]">
            <a href="#features" className="hover:text-[#6db89a] transition-colors">Features</a>
            <a href="#ai-engine" className="hover:text-[#6db89a] transition-colors">AI Assistant</a>
            <a href="#platform" className="hover:text-[#6db89a] transition-colors">Platform</a>
            <a href="#pricing" className="hover:text-[#6db89a] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#6db89a] transition-colors">FAQ</a>
          </nav>
          
          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <Link href="/login" className="text-[#7a9e8e] hover:text-[#6db89a] transition-colors">
              Login
            </Link>
            <Link href="/login" className="bg-[#6db89a] hover:bg-[#5ca688] text-[#0f1a15] px-6 py-2.5 rounded-full text-xs font-bold shadow-lg transition-all">
              Launch Live App
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-16 pb-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* HERO LEFT */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1b2530] border border-[#6db89a]/30 text-xs font-mono font-bold text-[#6db89a]">
              <Sparkles className="w-4 h-4 text-[#c9a96e]" /> Next-Gen AI Financial Intelligence Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-[#d4e4dc] font-space">
              Take full control of your wealth with <span className="text-[#6db89a] italic font-serif font-normal">AI Precision.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#7a9e8e] leading-relaxed max-w-xl font-mono">
              MoneyMind consolidates your bank accounts, investments, credit cards, subscriptions, and spending into one intelligent AI workspace.
            </p>

            <div className="flex flex-wrap items-center gap-4 font-mono">
              <Link href="/login" className="bg-[#6db89a] hover:bg-[#5ca688] text-[#0f1a15] px-8 py-4 rounded-full font-bold flex items-center gap-2 text-xs shadow-xl transition-all">
                <span>Launch Live App</span> <ArrowRight className="w-4 h-4 text-[#0f1a15]" />
              </Link>
              <Link href="/register" className="px-7 py-4 rounded-full font-bold text-xs text-[#d4e4dc] bg-[#1b2530] border border-white/[0.08] hover:border-[#6db89a] transition-all flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6db89a]" /> Start Free Account
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-[#7a9e8e] pt-4 border-t border-white/[0.06] font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#6db89a] shrink-0" />
                <span>No Credit Card</span>
              </div>

              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#c9a96e] shrink-0" />
                <span>Bank Grade Security</span>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#6db89a] shrink-0" />
                <span>Instant Setup</span>
              </div>
            </div>
          </div>

          {/* HERO RIGHT: FLOATING PREVIEW CARDS */}
          <div className="relative">
            <div className="bg-[#1b2530] border border-white/[0.08] p-6 rounded-3xl shadow-2xl space-y-4 relative z-10">
              
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-[#141c22] p-4 rounded-2xl border border-white/[0.06]">
                  <div className="text-[10px] text-[#7a9e8e]">Total Net Worth</div>
                  <div className="text-xl font-bold text-[#6db89a] mt-1 font-space">₹14,50,000</div>
                  <div className="text-[10px] text-[#6db89a] font-semibold mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +8.4% this year
                  </div>
                </div>

                <div className="bg-[#141c22] p-4 rounded-2xl border border-white/[0.06]">
                  <div className="text-[10px] text-[#7a9e8e]">Monthly Savings</div>
                  <div className="text-xl font-bold text-[#c9a96e] mt-1 font-space">₹38,200</div>
                  <div className="text-[10px] text-[#7a9e8e] mt-1">+12.1% Savings Rate</div>
                </div>
              </div>

              {/* INSIGHT CARDS */}
              <div className="space-y-3 font-mono">
                <div className="p-3.5 bg-[#141c22] border border-white/[0.06] rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#6db89a]/15 rounded-xl text-[#6db89a]">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#d4e4dc]">Dining spend down 18%</div>
                      <div className="text-[10px] text-[#7a9e8e]">Saved ₹2,450 vs last month</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#6db89a] bg-[#6db89a]/15 px-2.5 py-1 rounded-full border border-[#6db89a]/30">-18%</span>
                </div>

                <div className="p-3.5 bg-[#141c22] border border-[#c9a96e]/30 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#c9a96e]/15 rounded-xl text-[#c9a96e]">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#d4e4dc]">Netflix Renews in 3 Days</div>
                      <div className="text-[10px] text-[#7a9e8e]">₹649 will be deducted from HDFC</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#c9a96e] bg-[#c9a96e]/15 px-2.5 py-1 rounded-full border border-[#c9a96e]/30">Bill Radar</span>
                </div>

                <div className="p-3.5 bg-[#141c22] border border-white/[0.06] rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#6db89a]/15 rounded-xl text-[#6db89a]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#d4e4dc]">Goa Vacation Goal</div>
                      <div className="text-[10px] text-[#7a9e8e]">₹40,000 / ₹50,000 (80% complete)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#6db89a] bg-[#6db89a]/15 px-2.5 py-1 rounded-full border border-[#6db89a]/30">On Track</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="border-y border-white/[0.06] bg-[#1b2530]/50 py-12 relative z-10 font-mono">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-[#141c22] border border-white/[0.06] p-6 rounded-2xl">
            <div className="text-3xl lg:text-4xl font-extrabold text-[#6db89a] font-space">₹100Cr+</div>
            <div className="text-xs text-[#7a9e8e] mt-1 font-bold uppercase">Transactions Audited</div>
          </div>
          <div className="bg-[#141c22] border border-white/[0.06] p-6 rounded-2xl">
            <div className="text-3xl lg:text-4xl font-extrabold text-[#c9a96e] font-space">50,000+</div>
            <div className="text-xs text-[#7a9e8e] mt-1 font-bold uppercase">Active Investors</div>
          </div>
          <div className="bg-[#141c22] border border-white/[0.06] p-6 rounded-2xl">
            <div className="text-3xl lg:text-4xl font-extrabold text-[#6db89a] font-space">99.4%</div>
            <div className="text-xs text-[#7a9e8e] mt-1 font-bold uppercase">AI Accuracy</div>
          </div>
          <div className="bg-[#141c22] border border-white/[0.06] p-6 rounded-2xl">
            <div className="text-3xl lg:text-4xl font-extrabold text-[#c9a96e] font-space">4.9★</div>
            <div className="text-xs text-[#7a9e8e] mt-1 font-bold uppercase">User Rating</div>
          </div>
        </div>
      </section>

      {/* PLATFORM DEMO FRAME (#PLATFORM) */}
      <section id="platform" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6db89a] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a96e]" /> Unified Financial Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4 text-[#d4e4dc] font-space">
            Your entire financial life in one studio.
          </h2>
          <p className="text-xs text-[#7a9e8e] font-mono">Track bank balances, credit caps, investments, and monthly envelope budgets seamlessly.</p>
        </div>

        <div className="bg-[#1b2530] p-4 sm:p-6 rounded-3xl border border-white/[0.08] shadow-2xl">
          <div className="bg-[#141c22] rounded-2xl overflow-hidden border border-white/[0.06]">
            
            {/* WINDOW CONTROLS */}
            <div className="px-5 py-3.5 bg-[#1f2e3a] border-b border-white/[0.06] flex items-center justify-between font-mono">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-[#c9a96e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#6db89a]"></div>
              </div>
              <div className="bg-[#141c22] px-4 py-1 rounded-lg border border-white/[0.08] text-xs text-[#6db89a] font-bold">
                app.moneymind.ai/dashboard
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#6db89a] font-bold bg-[#6db89a]/15 px-3 py-1 rounded-full border border-[#6db89a]/30">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted
              </div>
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="p-6 space-y-6 font-mono">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1b2530] border border-white/[0.06] p-4 rounded-2xl">
                  <div className="text-xs text-[#7a9e8e]">Net Worth</div>
                  <div className="text-xl font-bold text-[#6db89a] mt-1 font-space">₹14,50,000</div>
                  <div className="text-[11px] text-[#6db89a] mt-1 font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +8.4%
                  </div>
                </div>

                <div className="bg-[#1b2530] border border-white/[0.06] p-4 rounded-2xl">
                  <div className="text-xs text-[#7a9e8e]">Income</div>
                  <div className="text-xl font-bold text-[#6db89a] mt-1 font-space">₹1,25,000</div>
                  <div className="text-[11px] text-[#7a9e8e] mt-1">2 Sources</div>
                </div>

                <div className="bg-[#1b2530] border border-rose-500/30 p-4 rounded-2xl">
                  <div className="text-xs text-[#7a9e8e]">Expenses</div>
                  <div className="text-xl font-bold text-rose-400 mt-1 font-space">₹48,200</div>
                  <div className="text-[11px] text-[#6db89a] mt-1 font-bold">39% Under Budget</div>
                </div>

                <div className="bg-[#1b2530] border border-white/[0.06] p-4 rounded-2xl">
                  <div className="text-xs text-[#7a9e8e]">Savings Rate</div>
                  <div className="text-xl font-bold text-[#c9a96e] mt-1 font-space">61.4%</div>
                  <div className="text-[11px] text-[#6db89a] mt-1 font-bold">Top 5% Savers</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SUPPORTED BANKS CAROUSEL */}
      <section className="py-16 border-b border-white/[0.06] overflow-hidden relative z-10 font-mono">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6db89a]">Supported Banks & Integration Partners</span>
        </div>
        <div className="animate-marquee gap-12 text-xs font-bold opacity-80 flex items-center">
          {integrationLogos.concat(integrationLogos).map((item, idx) => (
            <div key={idx} className={`flex items-center gap-2 ${item.color} shrink-0`}>
              <ShieldCheck className="w-4 h-4" /> {item.name}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-[#1b2530]/40 border-y border-white/[0.06] relative z-10 font-mono">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6db89a]">Loved By Thousands</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-[#d4e4dc] font-space">
              What our users are saying.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <div key={idx} className="bg-[#141c22] border border-white/[0.06] p-8 rounded-2xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#c9a96e] text-[#c9a96e]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#7a9e8e] leading-relaxed italic mb-6">
                    "{item.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-[#6db89a]/40" />
                  <div>
                    <div className="font-bold text-xs text-[#d4e4dc]">{item.name}</div>
                    <div className="text-[10px] text-[#7a9e8e]">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LARGE CENTERED CTA BAND */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 text-center font-mono">
        <div className="bg-[#1b2530] border border-white/[0.08] p-12 md:p-16 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-space text-[#d4e4dc]">Ready to Master Your Wealth?</h2>
            <p className="text-[#7a9e8e] text-xs">Join over 50,000 users taking full control of their financial future with MoneyMind AI.</p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/login" className="bg-[#6db89a] hover:bg-[#5ca688] text-[#0f1a15] px-8 py-4 rounded-full font-bold text-xs shadow-xl transition-all">
                Launch Live App
              </Link>
              <Link href="/register" className="px-8 py-4 rounded-full font-bold text-xs text-[#d4e4dc] bg-[#141c22] border border-white/[0.08] hover:border-[#6db89a] transition-all">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/[0.06] bg-[#141c22] relative z-10 font-mono">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#6db89a] text-[#0f1a15] flex items-center justify-center font-bold text-xs">M</div>
              <span className="font-bold font-space text-[#d4e4dc]">MoneyMind AI</span>
            </div>
            <p className="text-xs text-[#7a9e8e] leading-relaxed">AI Financial Intelligence Platform.</p>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-4 text-[#d4e4dc] uppercase tracking-wider">• Product</h4>
            <ul className="space-y-2 text-xs text-[#7a9e8e]">
              <li><Link href="/login" className="hover:text-[#6db89a] transition-colors">Live Dashboard</Link></li>
              <li><Link href="#pricing" className="hover:text-[#6db89a] transition-colors">Pricing</Link></li>
              <li><Link href="#ai-engine" className="hover:text-[#6db89a] transition-colors">AI Assistant</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-4 text-[#d4e4dc] uppercase tracking-wider">• Resources</h4>
            <ul className="space-y-2 text-xs text-[#7a9e8e]">
              <li><span className="hover:text-[#6db89a] transition-colors">Security Protocol</span></li>
              <li><span className="hover:text-[#6db89a] transition-colors">Bank Integrations</span></li>
              <li><span className="hover:text-[#6db89a] transition-colors">API Reference</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-4 text-[#d4e4dc] uppercase tracking-wider">• Legal</h4>
            <ul className="space-y-2 text-xs text-[#7a9e8e]">
              <li><span className="hover:text-[#6db89a] transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-[#6db89a] transition-colors">Terms of Service</span></li>
              <li><span className="hover:text-[#6db89a] transition-colors">256-Bit SSL Encryption</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-[#7a9e8e]">
          © {new Date().getFullYear()} MoneyMind AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
