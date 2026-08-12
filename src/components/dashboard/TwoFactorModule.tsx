'use client';

import React, { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { 
  TrendingDown, Plus, Trash2, Edit2, X, Tag, Sparkles, Utensils, 
  ShoppingBag, Car, Zap, Film, HeartPulse, Plane, GraduationCap, 
  Home, Gift, Briefcase, DollarSign, Activity, PieChart, ShieldCheck, 
  ArrowUpRight, ChevronRight, Layers, SlidersHorizontal, CheckCircle2 
} from 'lucide-react';

export const TwoFactorModule: React.FC = () => {
  const { expenses, totalExpenses, addExpense, deleteExpense, formatCurrency, currency } = useFinancial();

  const [selectedCategory, setSelectedCategory] = useState<string | 'ALL'>('ALL');
  const [customCatInput, setCustomCatInput] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ALL EXPENSE CATEGORIES LIST WITH ICONS & METRICS
  const PRESET_EXPENSE_CATEGORIES = [
    { name: 'Dining & Zomato', icon: <Utensils className="w-5 h-5 text-[#00FF9D]" />, color: '#00FF9D' },
    { name: 'Groceries & Supplies', icon: <ShoppingBag className="w-5 h-5 text-[#FBBF24]" />, color: '#FBBF24' },
    { name: 'Transport & Fuel', icon: <Car className="w-5 h-5 text-[#00FF9D]" />, color: '#00FF9D' },
    { name: 'Utilities & Bills', icon: <Zap className="w-5 h-5 text-amber-400" />, color: '#F59E0B' },
    { name: 'Entertainment & Movies', icon: <Film className="w-5 h-5 text-violet-400" />, color: '#8B5CF6' },
    { name: 'Shopping & Fashion', icon: <ShoppingBag className="w-5 h-5 text-[#00FF9D]" />, color: '#00FF9D' },
    { name: 'Healthcare & Wellness', icon: <HeartPulse className="w-5 h-5 text-rose-400" />, color: '#F43F5E' },
    { name: 'Travel & Vacations', icon: <Plane className="w-5 h-5 text-[#00FF9D]" />, color: '#00FF9D' },
    { name: 'Education & Courses', icon: <GraduationCap className="w-5 h-5 text-cyan-400" />, color: '#06B6D4' },
    { name: 'Housing & Rent', icon: <Home className="w-5 h-5 text-[#FBBF24]" />, color: '#FBBF24' },
    { name: 'Gifts & Donations', icon: <Gift className="w-5 h-5 text-amber-400" />, color: '#F59E0B' },
    { name: 'Office & Work Supplies', icon: <Briefcase className="w-5 h-5 text-[#00FF9D]" />, color: '#00FF9D' },
  ];

  // CALCULATE CATEGORY SPENDING TOTALS
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const sortedCategories = PRESET_EXPENSE_CATEGORIES.map(cat => {
    const total = categoryTotals[cat.name] || 0;
    const pct = totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0;
    const itemsCount = expenses.filter(e => e.category === cat.name).length;
    return { ...cat, total, pct, itemsCount };
  }).sort((a, b) => b.total - a.total);

  // FILTERED EXPENSES
  const filteredExpenses = selectedCategory === 'ALL'
    ? expenses
    : expenses.filter(e => e.category === selectedCategory);

  return (
    <div className="cyber-card p-6 sm:p-8 space-y-8 text-white relative overflow-hidden">
      
      {/* HUD CORNER BRACKETS */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      {/* TOP NEON GRADIENT ACCENT STRIP */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00FF9D] via-[#FBBF24] to-[#00FF9D]" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-[0_0_20px_rgba(0,255,157,0.25)]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[#00FF9D] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" /> // CATEGORY_EXPENSE_MASTER_STUDIO
            </div>
            <h2 className="text-2xl font-extrabold text-white font-space tracking-tight">Expense Categories & In-Depth Breakdown</h2>
            <p className="text-xs text-[#94A3B8]">Comprehensive expense category distribution, spending breakdown, and custom category management</p>
          </div>
        </div>

        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            selectedCategory === 'ALL'
              ? 'bg-[#00FF9D] text-[#040D0B] border-[#00FF9D] shadow-[0_0_15px_#00FF9D]'
              : 'bg-[#040D0B] text-[#94A3B8] border-white/10 hover:border-[#00FF9D]/40'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" /> View All Categories ({PRESET_EXPENSE_CATEGORIES.length})
        </button>
      </div>

      {/* OVERALL EXPENSE SUMMARY BANNER */}
      <div className="p-7 bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/40 rounded-3xl shadow-xl space-y-5 text-white relative overflow-hidden font-mono">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00FF9D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#00FF9D] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#00FF9D]" /> Total Logged Expenses ({currency})
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-space text-rose-400 tracking-tight">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 pt-1">
              Active Category Filter: <span className="font-bold text-[#00FF9D] uppercase">{selectedCategory}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2.5 bg-[#00FF9D]/20 border border-[#00FF9D]/40 text-[#00FF9D] rounded-full text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,157,0.25)]">
              <ShieldCheck className="w-4 h-4 text-[#00FF9D]" /> {expenses.length} Expense Logs
            </span>
          </div>
        </div>
      </div>

      {/* ALL EXPENSE CATEGORIES GRID (12+ CATEGORIES) */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-white font-space flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#00FF9D]" /> All Expense Categories Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedCategories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <div
                key={idx}
                onClick={() => setSelectedCategory(isSelected ? 'ALL' : cat.name)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#081713] to-[#040D0B] border-[#00FF9D] shadow-[0_0_25px_rgba(0,255,157,0.3)] scale-[1.02]'
                    : 'bg-gradient-to-br from-[#071612]/90 to-[#040D0B]/90 border-[#00FF9D]/25 hover:border-[#00FF9D]/60 hover:shadow-[0_0_20px_rgba(0,255,157,0.15)]'
                }`}
              >
                {/* LEFT NEON ACCENT BAR */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#00FF9D] to-[#FBBF24]" />

                <div className="flex justify-between items-start pl-2">
                  <div className="p-3 bg-[#00FF9D]/15 rounded-2xl border border-[#00FF9D]/30 shadow-[0_0_12px_rgba(0,255,157,0.2)]">
                    {cat.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00FF9D]/15 text-[#00FF9D] font-mono text-[10px] font-bold border border-[#00FF9D]/30">
                    {cat.pct}% Total
                  </span>
                </div>

                <div className="pl-2 space-y-1">
                  <h4 className="font-extrabold text-white text-sm font-space truncate">{cat.name}</h4>
                  <div className="text-xs font-mono font-extrabold text-[#00FF9D]">
                    {formatCurrency(cat.total)}
                  </div>
                  <div className="text-[10px] text-[#94A3B8] font-mono">
                    {cat.itemsCount} Recorded logs
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full bg-[#030A08] rounded-full h-1.5 border border-[#00FF9D]/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#00FF9D] to-[#FBBF24] h-1.5 rounded-full" style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTERED EXPENSE TRANSACTIONS TABLE */}
      <div className="space-y-4 pt-4 border-t border-[#00FF9D]/20">
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-lg text-white font-space flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#00FF9D]" /> 
            {selectedCategory === 'ALL' ? 'All Logged Expenses' : `${selectedCategory} Expense Logs`} ({filteredExpenses.length})
          </h3>
        </div>

        <div className="space-y-3 font-mono">
          {filteredExpenses.length === 0 ? (
            <div className="p-10 text-center text-xs text-[#94A3B8] border border-dashed border-[#00FF9D]/30 rounded-3xl font-mono bg-[#040D0B]/60">
              No expense records found for category: <b>{selectedCategory}</b>
            </div>
          ) : (
            filteredExpenses.map(item => (
              <div
                key={item.id}
                className="p-4 bg-gradient-to-r from-[#071612] via-[#0C221B] to-[#040D0B] border border-[#00FF9D]/25 rounded-2xl flex items-center justify-between text-xs hover:border-[#00FF9D]/60 hover:shadow-[0_0_20px_rgba(0,255,157,0.15)] transition-all shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-rose-500/15 text-rose-400 rounded-xl border border-rose-500/30">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-base font-space">{item.title}</span>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#00FF9D]/15 text-[#00FF9D] font-bold border border-[#00FF9D]/30 uppercase tracking-wider">{item.category}</span>
                      <span className="ml-2 font-mono">{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-extrabold text-rose-400 font-mono text-base">
                    - {formatCurrency(item.amount)}
                  </span>
                  <button
                    onClick={() => deleteExpense(item.id)}
                    className="p-2 text-[#94A3B8] hover:text-rose-400 transition-colors cursor-pointer bg-[#040D0B] rounded-xl border border-white/10"
                    title="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
