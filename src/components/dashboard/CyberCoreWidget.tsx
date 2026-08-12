'use client';

import React from 'react';
import { Cpu, ShieldCheck, Zap, Globe, Sparkles, TrendingUp, Lock } from 'lucide-react';
import { useFinancial } from '@/context/FinancialContext';

export const CyberCoreWidget: React.FC = () => {
  const { netWorth, formatCurrency, currency } = useFinancial();

  return (
    <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#0B1220]/90 via-[#070D1B]/95 to-[#030712] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
      
      {/* BACKGROUND GLOW ORBS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* LEFT CONTENT AREA */}
      <div className="space-y-4 max-w-xl z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          SYSTEM ONLINE • CYBER FINANCIAL CORE
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-space tracking-tight leading-none">
          Welcome to the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 text-neon-cyan">
            digital workspace of Aditi Rao.
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          An AI-powered executive financial cockpit that monitors live transactions, forecasts 12-month wealth trajectories, and protects assets with TOTP 2-Step Verification.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-xs space-y-1">
            <span className="text-cyan-400 font-mono font-bold text-[10px] uppercase block">ACTIVE NET WORTH</span>
            <span className="text-xl font-extrabold text-white font-space">{formatCurrency(netWorth)}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-xs space-y-1">
            <span className="text-purple-400 font-mono font-bold text-[10px] uppercase block">CURRENCY CONVERTER</span>
            <span className="text-xl font-extrabold text-white font-space">{currency} READY</span>
          </div>
        </div>
      </div>

      {/* RIGHT HOLOGRAPHIC 3D CYBER ORBIT CORE (MATCHING USER SCREENSHOT) */}
      <div className="relative w-72 h-72 flex items-center justify-center shrink-0 z-10">
        
        {/* OUTER ROTATING NEON RING 1 */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 border-dashed animate-[spin_20s_linear_infinite]" />
        
        {/* MIDDLE ROTATING NEON RING 2 */}
        <div className="absolute inset-4 rounded-full border border-purple-500/50 animate-[spin_12s_linear_infinite_reverse]" />
        
        {/* INNER GLOWING CYBER NUCLEUS */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-600 to-indigo-600 p-1 shadow-[0_0_40px_rgba(0,240,255,0.6)] flex items-center justify-center animate-pulse">
          <div className="w-full h-full rounded-full bg-[#030712] flex flex-col items-center justify-center text-center p-2 border border-cyan-300/40">
            <Cpu className="w-8 h-8 text-cyan-400 mb-1" />
            <span className="text-[10px] font-mono font-extrabold text-cyan-400 uppercase tracking-widest">MONEYMIND</span>
            <span className="text-[8px] text-purple-300 font-mono">CORE 2.0</span>
          </div>
        </div>

        {/* FLOATING HOLOGRAPHIC BADGES AROUND ORBIT */}
        <div className="absolute -top-2 left-6 px-3 py-1 rounded-xl bg-slate-900/90 border border-cyan-400/50 text-cyan-300 text-[10px] font-mono font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
          <Globe className="w-3 h-3 text-cyan-400" /> Multi-FX
        </div>

        <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 px-3 py-1 rounded-xl bg-slate-900/90 border border-purple-400/50 text-purple-300 text-[10px] font-mono font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-purple-400" /> AI OCR
        </div>

        <div className="absolute -bottom-2 right-8 px-3 py-1 rounded-xl bg-slate-900/90 border border-emerald-400/50 text-emerald-300 text-[10px] font-mono font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
          <Lock className="w-3 h-3 text-emerald-400" /> 2FA Secured
        </div>

        <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 px-3 py-1 rounded-xl bg-slate-900/90 border border-indigo-400/50 text-indigo-300 text-[10px] font-mono font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
          <TrendingUp className="w-3 h-3 text-indigo-400" /> Wealth Engine
        </div>

      </div>

    </div>
  );
};
