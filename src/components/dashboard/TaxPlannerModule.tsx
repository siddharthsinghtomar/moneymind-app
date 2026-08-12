'use client';

import React, { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { Calculator, ShieldCheck, Sparkles, TrendingUp, DollarSign, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const TaxPlannerModule: React.FC = () => {
  const { totalIncome, investments, totalExpenses, formatCurrency, currency } = useFinancial();

  // TAX STATES
  const [elssInvestment, setElssInvestment] = useState(150000);
  const [healthInsurance, setHealthInsurance] = useState(25000);
  const [npsContribution, setNpsContribution] = useState(50000);
  const [hraExemption, setHraExemption] = useState(120000);

  const annualIncome = totalIncome * 12 || 1500000;

  // OLD REGIME TAX CALCULATION
  const totalDeductions = Math.min(150000, elssInvestment) + Math.min(25000, healthInsurance) + Math.min(50000, npsContribution) + hraExemption + 50000; // 50k standard deduction
  const taxableOld = Math.max(0, annualIncome - totalDeductions);
  
  let oldTax = 0;
  if (taxableOld > 1000000) oldTax = 112500 + (taxableOld - 1000000) * 0.3;
  else if (taxableOld > 500000) oldTax = 12500 + (taxableOld - 500000) * 0.2;
  else if (taxableOld > 250000) oldTax = (taxableOld - 250000) * 0.05;

  // NEW REGIME TAX CALCULATION
  const taxableNew = Math.max(0, annualIncome - 75000); // 75k std deduction in FY2024-25
  let newTax = 0;
  if (taxableNew > 1500000) newTax = 150000 + (taxableNew - 1500000) * 0.3;
  else if (taxableNew > 1200000) newTax = 90000 + (taxableNew - 1200000) * 0.2;
  else if (taxableNew > 900000) newTax = 45000 + (taxableNew - 900000) * 0.15;
  else if (taxableNew > 600000) newTax = 15000 + (taxableNew - 600000) * 0.1;
  else if (taxableNew > 300000) newTax = (taxableNew - 300000) * 0.05;

  if (taxableNew <= 700000) newTax = 0; // Rebate u/s 87A

  const taxSaved = Math.max(0, Math.round(oldTax - newTax));
  const recommendedRegime = newTax < oldTax ? 'New Tax Regime' : 'Old Tax Regime';

  return (
    <div className="cyber-card p-8 space-y-8 text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-2xs">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-space tracking-tight">AI Tax Planner & Deduction Optimizer</h2>
            <p className="text-xs text-[#94A3B8]">Compare Old vs New Tax Regime liability and maximize Section 80C/80D tax savings</p>
          </div>
        </div>

        <span className="px-4 py-2 bg-[#00FF9D]/10 text-[#00FF9D] font-mono font-bold text-xs rounded-full border border-[#00FF9D]/30 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#FBBF24]" /> FY 2025-26 Tax Engine
        </span>
      </div>

      {/* REGIME COMPARISON BANNER */}
      <div className="p-6 bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/30 rounded-3xl text-white shadow-lg space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono font-bold tracking-widest text-[#00FF9D] uppercase">AI Tax Recommendation</span>
          <span className="px-3 py-1 bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40 rounded-full text-[10px] font-mono font-bold">
            OPTIMIZED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-4 bg-[#040D0B]/80 rounded-2xl border border-[#00FF9D]/20">
            <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Annualized Income ({currency})</div>
            <div className="text-2xl font-extrabold font-space text-white mt-1">{formatCurrency(annualIncome)}</div>
          </div>

          <div className="p-4 bg-[#040D0B]/80 rounded-2xl border border-[#FBBF24]/30">
            <div className="text-[10px] font-mono text-[#FBBF24] uppercase">Old Regime Est. Tax</div>
            <div className="text-2xl font-extrabold font-space text-[#FBBF24] mt-1">{formatCurrency(Math.round(oldTax))}</div>
          </div>

          <div className="p-4 bg-[#00FF9D]/15 rounded-2xl border border-[#00FF9D]/40">
            <div className="text-[10px] font-mono text-[#00FF9D] uppercase">New Regime Est. Tax</div>
            <div className="text-2xl font-extrabold font-space text-[#00FF9D] mt-1">{formatCurrency(Math.round(newTax))}</div>
          </div>
        </div>

        <div className="p-4 bg-[#040D0B]/90 rounded-2xl flex items-center justify-between text-xs text-[#00FF9D] font-mono border border-[#00FF9D]/30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00FF9D]" />
            <span>Recommended Choice: <b>{recommendedRegime}</b> (Saves {formatCurrency(Math.abs(Math.round(oldTax - newTax)))} in tax!)</span>
          </div>
        </div>
      </div>

      {/* INPUTS FOR SECTION DEDUCTIONS */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-white font-space">Section 80C & 80D Deductions Simulator (Old Regime)</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div className="p-5 bg-[#040D0B]/80 border border-[#00FF9D]/20 rounded-2xl space-y-2">
            <label className="block font-bold text-white">Section 80C (ELSS Mutual Funds / PPF / EPF) - Max ₹1.5L</label>
            <input
              type="number"
              value={elssInvestment}
              onChange={e => setElssInvestment(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#081713] border border-[#00FF9D]/30 rounded-xl p-3 text-[#00FF9D] font-mono font-bold focus:outline-none focus:border-[#00FF9D]"
            />
            <div className="text-[10px] text-[#94A3B8] font-mono">Claimed: {formatCurrency(Math.min(150000, elssInvestment))} / ₹1.5L</div>
          </div>

          <div className="p-5 bg-[#040D0B]/80 border border-[#00FF9D]/20 rounded-2xl space-y-2">
            <label className="block font-bold text-white">Section 80D (Health Insurance Premium) - Max ₹25k</label>
            <input
              type="number"
              value={healthInsurance}
              onChange={e => setHealthInsurance(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#081713] border border-[#00FF9D]/30 rounded-xl p-3 text-[#00FF9D] font-mono font-bold focus:outline-none focus:border-[#00FF9D]"
            />
            <div className="text-[10px] text-[#94A3B8] font-mono">Claimed: {formatCurrency(Math.min(25000, healthInsurance))} / ₹25k</div>
          </div>

          <div className="p-5 bg-[#040D0B]/80 border border-[#00FF9D]/20 rounded-2xl space-y-2">
            <label className="block font-bold text-white">Section 80CCD(1B) NPS Tier-1 - Additional ₹50k</label>
            <input
              type="number"
              value={npsContribution}
              onChange={e => setNpsContribution(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#081713] border border-[#00FF9D]/30 rounded-xl p-3 text-[#00FF9D] font-mono font-bold focus:outline-none focus:border-[#00FF9D]"
            />
            <div className="text-[10px] text-[#94A3B8] font-mono">Claimed: {formatCurrency(Math.min(50000, npsContribution))} / ₹50k</div>
          </div>

          <div className="p-5 bg-[#040D0B]/80 border border-[#00FF9D]/20 rounded-2xl space-y-2">
            <label className="block font-bold text-white">HRA Exemption (House Rent Allowance)</label>
            <input
              type="number"
              value={hraExemption}
              onChange={e => setHraExemption(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#081713] border border-[#00FF9D]/30 rounded-xl p-3 text-[#00FF9D] font-mono font-bold focus:outline-none focus:border-[#00FF9D]"
            />
            <div className="text-[10px] text-[#94A3B8] font-mono">Estimated HRA Exemption Limit</div>
          </div>
        </div>
      </div>

    </div>
  );
};
