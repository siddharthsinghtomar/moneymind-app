'use client';

import React from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { ShieldCheck, TrendingUp, TrendingDown, Landmark, LineChart, CreditCard, ArrowUpRight } from 'lucide-react';

export const NetWorthModule: React.FC = () => {
  const { totalBankBalance, totalInvestmentValue, accounts, netWorth, formatCurrency, currency } = useFinancial();

  const totalAssets = totalBankBalance + totalInvestmentValue;
  const totalLiabilities = accounts
    .filter(a => a.type === 'credit')
    .reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="cyber-card p-8 space-y-6 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-space">Net Worth Visualizer</h2>
            <p className="text-xs text-[#94A3B8]">Live breakdown of your total assets vs total liabilities</p>
          </div>
        </div>
      </div>

      {/* HERO NET WORTH DISPLAY */}
      <div className="bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/30 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1 relative z-10 font-mono">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#00FF9D]">Current Total Net Worth ({currency})</div>
          <div className="text-4xl sm:text-5xl font-extrabold font-space text-[#FBBF24]">{formatCurrency(netWorth)}</div>
          <p className="text-xs text-[#00FF9D] flex items-center gap-1.5 pt-1">
            <ArrowUpRight className="w-4 h-4 text-[#00FF9D]" /> Liquid Assets - Total Liabilities
          </p>
        </div>

        <div className="bg-[#040D0B]/90 p-4 rounded-2xl border border-[#00FF9D]/30 text-xs space-y-2 relative z-10 w-full md:w-auto font-mono">
          <div className="flex justify-between items-center gap-6">
            <span className="text-[#94A3B8] font-medium">Total Assets:</span>
            <strong className="text-[#00FF9D] font-mono text-sm">{formatCurrency(totalAssets)}</strong>
          </div>
          <div className="flex justify-between items-center gap-6">
            <span className="text-[#94A3B8] font-medium">Total Liabilities:</span>
            <strong className="text-rose-400 font-mono text-sm">-{formatCurrency(totalLiabilities)}</strong>
          </div>
        </div>
      </div>

      {/* 2 COLUMN BREAKDOWN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ASSETS COLUMN */}
        <div className="bg-[#081713] p-6 rounded-3xl border border-[#00FF9D]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white font-space flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00FF9D]" /> Assets Breakdown
            </h3>
            <span className="text-xs font-bold text-[#00FF9D] font-mono">{formatCurrency(totalAssets)}</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-[#040D0B] rounded-2xl border border-[#00FF9D]/20 flex justify-between items-center text-xs">
              <div className="flex items-center gap-3">
                <Landmark className="w-4 h-4 text-[#00FF9D]" />
                <span className="font-bold text-white font-space">Bank & Cash Accounts</span>
              </div>
              <span className="font-bold font-mono text-[#00FF9D]">{formatCurrency(totalBankBalance)}</span>
            </div>

            <div className="p-4 bg-[#040D0B] rounded-2xl border border-[#00FF9D]/20 flex justify-between items-center text-xs">
              <div className="flex items-center gap-3">
                <LineChart className="w-4 h-4 text-[#FBBF24]" />
                <span className="font-bold text-white font-space">Investment Portfolio</span>
              </div>
              <span className="font-bold font-mono text-[#00FF9D]">{formatCurrency(totalInvestmentValue)}</span>
            </div>
          </div>
        </div>

        {/* LIABILITIES COLUMN */}
        <div className="bg-[#081713] p-6 rounded-3xl border border-[#00FF9D]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white font-space flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" /> Liabilities Breakdown
            </h3>
            <span className="text-xs font-bold text-rose-400 font-mono">-{formatCurrency(totalLiabilities)}</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-[#040D0B] rounded-2xl border border-[#00FF9D]/20 flex justify-between items-center text-xs">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-white font-space">Credit Cards & Debt</span>
              </div>
              <span className="font-bold font-mono text-rose-400">{formatCurrency(totalLiabilities)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
