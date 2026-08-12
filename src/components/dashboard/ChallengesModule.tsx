'use client';

import React from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { Trophy, ShieldCheck, Flame, Zap, Award, Sparkles, CheckCircle2, ArrowRight, Lock, Target } from 'lucide-react';

export const ChallengesModule: React.FC = () => {
  const { expenses, totalExpenses, totalIncome, goals, autoSavePct, setAutoSavePct, autoSaveGoalId, setAutoSaveGoalId, formatCurrency } = useFinancial();

  // CHALLENGE PROGRESS CALCULATIONS
  const diningExpenses = expenses.filter(e => e.category.toLowerCase().includes('dining') || e.category.toLowerCase().includes('zomato'));
  const noZomatoDays = Math.max(0, 7 - diningExpenses.length);
  const isNoZomatoUnlocked = diningExpenses.length <= 1;

  const totalSaved = Math.max(0, totalIncome - totalExpenses);
  const isSave5kUnlocked = totalSaved >= 5000;
  const save5kPct = Math.min(100, Math.round((totalSaved / 5000) * 100));

  return (
    <div className="cyber-card p-8 space-y-8 text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-2xs">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-space tracking-tight">Cyber Savings Challenges & Wealth Badges</h2>
            <p className="text-xs text-[#94A3B8]">Gamify your spending discipline, unlock collectible badges, and automate auto-save cushion rules</p>
          </div>
        </div>

        <span className="px-4 py-2 bg-[#FBBF24]/20 text-[#FBBF24] font-mono font-bold text-xs rounded-full border border-[#FBBF24]/40 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#FBBF24]" /> Tier 1 Cyber Achiever
        </span>
      </div>

      {/* AI AUTO-SAVE & WEALTH CUSHION RULE SETUP BANNER */}
      <div className="p-6 bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/30 rounded-3xl text-white shadow-lg space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-xs font-mono font-bold tracking-widest text-[#00FF9D] uppercase flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FBBF24]" /> AI Autonomous Auto-Save Rule Engine
          </div>
          <span className="px-3 py-1 bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40 rounded-full text-[10px] font-mono font-bold">
            AUTONOMOUS CUSHION
          </span>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Whenever you log a new income deposit, MoneyMind automatically calculates and deposits your chosen <b>Auto-Save Cushion %</b> directly into your savings goals!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* AUTO-SAVE PERCENTAGE SELECTOR */}
          <div className="p-4 bg-[#040D0B]/80 rounded-2xl border border-[#00FF9D]/20 space-y-2">
            <label className="block text-[10px] font-mono text-[#00FF9D] uppercase font-bold">Auto-Save Cushion % Per Deposit</label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setAutoSavePct(pct)}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    autoSavePct === pct
                      ? 'bg-[#00FF9D] text-[#040D0B] shadow-md font-bold'
                      : 'bg-[#081713] hover:bg-[#00FF9D]/20 text-white border border-[#00FF9D]/30'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* TARGET DESTINATION GOAL SELECTOR */}
          <div className="p-4 bg-[#040D0B]/80 rounded-2xl border border-[#00FF9D]/20 space-y-2">
            <label className="block text-[10px] font-mono text-[#00FF9D] uppercase font-bold">Target Savings Cushion Goal</label>
            <select
              value={autoSaveGoalId || ''}
              onChange={e => setAutoSaveGoalId(e.target.value || null)}
              className="w-full bg-[#081713] border border-[#00FF9D]/30 rounded-xl p-2.5 text-xs text-white font-mono font-bold outline-none focus:border-[#00FF9D]"
            >
              {goals.length === 0 ? (
                <option value="" className="bg-[#040D0B]">Default (Create a goal under Wealth Goals)</option>
              ) : (
                goals.map(g => (
                  <option key={g.id} value={g.id} className="bg-[#040D0B]">{g.title} ({formatCurrency(g.currentAmount)} / {formatCurrency(g.targetAmount)})</option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* GAMIFIED BADGES GRID */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-white font-space flex items-center gap-2">
          <Award className="w-4 h-4 text-[#FBBF24]" /> Collectible Cyber Financial Badges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* BADGE 1: NO ZOMATO STREAK */}
          <div className={`p-5 rounded-3xl border transition-all space-y-3 relative overflow-hidden ${
            isNoZomatoUnlocked ? 'bg-[#081713] border-[#00FF9D]/40 shadow-2xs' : 'bg-[#040D0B]/60 border-[#00FF9D]/15 opacity-75'
          }`}>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#FBBF24]/15 text-[#FBBF24] rounded-2xl border border-[#FBBF24]/30">
                <Flame className="w-6 h-6" />
              </div>
              <span className={`text-[9px] font-mono font-extrabold px-2.5 py-1 rounded-full ${
                isNoZomatoUnlocked ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40' : 'bg-slate-800 text-slate-400'
              }`}>
                {isNoZomatoUnlocked ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-white text-sm font-space">7-Day No-Zomato Streak</h4>
              <p className="text-xs text-[#94A3B8] mt-1">Cook at home for 7 consecutive days without dining out apps.</p>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs border-t border-[#00FF9D]/20 font-mono">
              <span className="font-bold text-[#FBBF24]">Reward: +150 XP</span>
              <span className="text-[#94A3B8]">{diningExpenses.length} dining logs</span>
            </div>
          </div>

          {/* BADGE 2: SAVE 5K CHALLENGE */}
          <div className={`p-5 rounded-3xl border transition-all space-y-3 relative overflow-hidden ${
            isSave5kUnlocked ? 'bg-[#081713] border-[#00FF9D]/40 shadow-2xs' : 'bg-[#040D0B]/60 border-[#00FF9D]/15 opacity-75'
          }`}>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className={`text-[9px] font-mono font-extrabold px-2.5 py-1 rounded-full ${
                isSave5kUnlocked ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40' : 'bg-slate-800 text-slate-400'
              }`}>
                {isSave5kUnlocked ? 'UNLOCKED' : `${save5kPct}%`}
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-white text-sm font-space">Save Cushion Challenge</h4>
              <p className="text-xs text-[#94A3B8] mt-1">Accumulate at least ₹5,000 net surplus after monthly expenses.</p>
            </div>

            <div className="w-full bg-[#040D0B] rounded-full h-2 border border-[#00FF9D]/20 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#00FF9D] to-[#FBBF24] transition-all" style={{ width: `${save5kPct}%` }} />
            </div>

            <div className="pt-1 flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-[#00FF9D]">Saved: {formatCurrency(totalSaved)}</span>
              <span className="text-[#94A3B8]">Goal: {formatCurrency(5000)}</span>
            </div>
          </div>

          {/* BADGE 3: ZERO DEBT CLUB */}
          <div className="p-5 bg-[#081713] border border-[#00FF9D]/40 rounded-3xl space-y-3 relative overflow-hidden shadow-2xs">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40">
                UNLOCKED
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-white text-sm font-space">Debt-Free Samurai</h4>
              <p className="text-xs text-[#94A3B8] mt-1">Maintain zero revolving high-interest credit card debt.</p>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs border-t border-[#00FF9D]/20 font-mono">
              <span className="font-bold text-[#FBBF24]">Reward: Executive Badge</span>
              <span className="text-[#00FF9D] font-bold">100% Compliant</span>
            </div>
          </div>

          {/* BADGE 4: WEALTH GROWTH PIONEER */}
          <div className="p-5 bg-[#081713] border border-[#00FF9D]/40 rounded-3xl space-y-3 relative overflow-hidden shadow-2xs">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#FBBF24]/15 text-[#FBBF24] rounded-2xl border border-[#FBBF24]/30">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40">
                UNLOCKED
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-white text-sm font-space">Wealth Growth Pioneer</h4>
              <p className="text-xs text-[#94A3B8] mt-1">Maintain positive net worth across all linked bank & investment assets.</p>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs border-t border-[#00FF9D]/20 font-mono">
              <span className="font-bold text-[#FBBF24]">Reward: +300 XP</span>
              <span className="text-[#00FF9D] font-bold">Active Pioneer</span>
            </div>
          </div>

          {/* BADGE 5: AUTO-SAVE COMMANDER */}
          <div className="p-5 bg-[#081713] border border-[#00FF9D]/40 rounded-3xl space-y-3 relative overflow-hidden shadow-2xs">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40">
                UNLOCKED ({autoSavePct}%)
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-white text-sm font-space">Auto-Save Commander</h4>
              <p className="text-xs text-[#94A3B8] mt-1">Enable autonomous auto-save cushion rule on every income deposit.</p>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs border-t border-[#00FF9D]/20 font-mono">
              <span className="font-bold text-[#FBBF24]">Reward: Gold Crown</span>
              <span className="text-[#00FF9D] font-bold">Active Engine</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
