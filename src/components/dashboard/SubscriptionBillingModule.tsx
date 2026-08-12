'use client';

import React from 'react';
import { RefreshCw, CheckCircle2, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export const SubscriptionBillingModule: React.FC = () => {
  return (
    <div className="cyber-card p-8 flex flex-col space-y-6 text-white">
      <div className="flex items-center justify-between pb-4 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white font-space">Subscription & Plan Management</h2>
            <p className="text-xs text-[#94A3B8]">Manage your MoneyMind AI Pro tier and billing invoices</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#00FF9D]/20 border border-[#00FF9D]/40 text-[#00FF9D] text-xs font-mono font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" /> PRO Active Plan
        </span>
      </div>

      <div className="bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] p-8 rounded-3xl text-white border border-[#00FF9D]/30 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-[#00FF9D] font-mono tracking-wider">Active Subscription</span>
          <h3 className="text-3xl font-extrabold font-space">MoneyMind Pro Tier</h3>
          <p className="text-xs text-[#94A3B8]">Unlimited AI financial coaching, 256-bit bank sync, and instant bill radar</p>
        </div>

        <div className="text-right font-mono">
          <div className="text-2xl font-extrabold font-space text-[#00FF9D]">₹999 <span className="text-xs text-[#94A3B8] font-normal">/ month</span></div>
          <div className="text-[10px] text-[#94A3B8] mt-1">Renews on Sept 01, 2026</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-[#040D0B]/90 rounded-2xl border border-[#00FF9D]/20 space-y-2">
          <ShieldCheck className="w-6 h-6 text-[#00FF9D]" />
          <div className="font-extrabold text-sm text-white font-space">256-Bit SSL Encryption</div>
          <p className="text-xs text-[#94A3B8]">Read-only account aggregation powered by OAuth & bank security protocols.</p>
        </div>

        <div className="p-5 bg-[#040D0B]/90 rounded-2xl border border-[#00FF9D]/20 space-y-2">
          <Zap className="w-6 h-6 text-[#FBBF24]" />
          <div className="font-extrabold text-sm text-white font-space">Instant Bill Radar</div>
          <p className="text-xs text-[#94A3B8]">Automated overspending alerts and subscription renewal tracking.</p>
        </div>

        <div className="p-5 bg-[#040D0B]/90 rounded-2xl border border-[#00FF9D]/20 space-y-2">
          <Sparkles className="w-6 h-6 text-[#00FF9D]" />
          <div className="font-extrabold text-sm text-white font-space">Unlimited AI Assistant</div>
          <p className="text-xs text-[#94A3B8]">Personalized wealth recommendations updated on every transaction.</p>
        </div>
      </div>
    </div>
  );
};
