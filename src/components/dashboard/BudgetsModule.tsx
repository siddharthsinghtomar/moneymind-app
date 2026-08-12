'use client';

import React, { useState } from 'react';
import { useFinancial, BudgetItem } from '@/context/FinancialContext';
import { 
  PieChart, Plus, Trash2, Edit2, X, AlertTriangle, CheckCircle2, TrendingUp, 
  DollarSign, Sparkles, Tag, ShieldCheck, Utensils, ShoppingBag, Car, Zap, 
  Coffee, Film, HeartPulse, ShieldAlert, Activity, ArrowUpRight, Check, Bell 
} from 'lucide-react';

export const BudgetsModule: React.FC = () => {
  const { budgets, setBudget, deleteBudget, totalExpenses, expenses, addExpense, formatCurrency, currency } = useFinancial();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [category, setCategory] = useState('Dining & Food');
  const [customCategory, setCustomCategory] = useState('');
  const [allocated, setAllocated] = useState('15000');
  const [alertThreshold, setAlertThreshold] = useState<number>(85);

  // QUICK ADD EXPENSE TO BUDGET STATE
  const [quickAddCategory, setQuickAddCategory] = useState<string | null>(null);
  const [quickAddAmount, setQuickAddAmount] = useState('');
  const [quickAddTitle, setQuickAddTitle] = useState('');

  const totalAllocated = budgets.reduce((acc, curr) => acc + curr.allocated, 0);

  // CALCULATE EXACT MATCHING ENVELOPES SPENT
  const totalBudgetSpent = budgets.reduce((acc, b) => {
    const categorySpent = expenses
      .filter(e => e.category.toLowerCase().includes(b.category.toLowerCase()) || b.category.toLowerCase().includes(e.category.toLowerCase()))
      .reduce((s, curr) => s + curr.amount, 0);
    return acc + categorySpent;
  }, 0);

  const overallBudgetPct = totalAllocated > 0 ? Math.min(100, Math.round((totalBudgetSpent / totalAllocated) * 100)) : 0;

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === 'CUSTOM' ? (customCategory.trim() || 'Custom Category') : category;
    if (!finalCategory || !allocated) return;

    setBudget(finalCategory, parseFloat(allocated) || 0);
    resetForm();
  };

  const handleQuickAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddCategory || !quickAddAmount || !quickAddTitle) return;

    addExpense({
      title: quickAddTitle,
      category: quickAddCategory,
      amount: parseFloat(quickAddAmount) || 0,
      date: new Date().toISOString().split('T')[0]
    });

    setQuickAddCategory(null);
    setQuickAddAmount('');
    setQuickAddTitle('');
  };

  const startEdit = (item: BudgetItem) => {
    setEditingId(item.id);
    setCategory(item.category);
    setAllocated(item.allocated.toString());
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setCategory('Dining & Food');
    setCustomCategory('');
    setAllocated('15000');
    setAlertThreshold(85);
  };

  const getCategoryIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes('din') || lower.includes('food') || lower.includes('zomato')) return <Utensils className="w-5 h-5 text-[#00FF9D]" />;
    if (lower.includes('groc') || lower.includes('super')) return <ShoppingBag className="w-5 h-5 text-[#FBBF24]" />;
    if (lower.includes('trans') || lower.includes('fuel') || lower.includes('uber')) return <Car className="w-5 h-5 text-[#00FF9D]" />;
    if (lower.includes('util') || lower.includes('bill') || lower.includes('power')) return <Zap className="w-5 h-5 text-amber-400" />;
    if (lower.includes('entert') || lower.includes('mov') || lower.includes('netfl')) return <Film className="w-5 h-5 text-violet-400" />;
    if (lower.includes('health') || lower.includes('med')) return <HeartPulse className="w-5 h-5 text-rose-400" />;
    return <PieChart className="w-5 h-5 text-[#00FF9D]" />;
  };

  const VISUAL_CATEGORIES_PRESET = [
    { label: 'Dining & Zomato', icon: '🍽️', val: 'Dining & Food' },
    { label: 'Groceries', icon: '🛒', val: 'Groceries & Supplies' },
    { label: 'Transport', icon: '🚕', val: 'Transport & Fuel' },
    { label: 'Utilities', icon: '⚡', val: 'Utilities & Bills' },
    { label: 'Movies & Fun', icon: '🎮', val: 'Entertainment & Movies' },
    { label: 'Shopping', icon: '🛍️', val: 'Shopping & Apparel' },
    { label: 'Healthcare', icon: '🏥', val: 'Healthcare & Wellness' },
    { label: '+ Custom Name', icon: '✨', val: 'CUSTOM' },
  ];

  return (
    <div className="cyber-card p-6 sm:p-8 space-y-6 text-white relative overflow-hidden pb-16">
      
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
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[#00FF9D] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" /> // BUDGET_ENVELOPE_ENGINE
            </div>
            <h2 className="text-2xl font-extrabold text-white font-space tracking-tight">Smart Budgets & Envelopes</h2>
            <p className="text-xs text-[#94A3B8]">Set category spending caps and receive real-time overspend alerts</p>
          </div>
        </div>

        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn-primary px-6 py-3 rounded-full text-xs font-bold text-[#040D0B] shadow-[0_0_25px_#00FF9D] flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#040D0B]" />
          <span>Create Budget Envelope</span>
        </button>
      </div>

      {/* RICH OVERALL BUDGET HEALTH BANNER */}
      <div className="p-7 bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/40 rounded-3xl shadow-xl space-y-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00FF9D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 font-mono">
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#00FF9D] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#00FF9D]" /> Total Allocated Monthly Cap ({currency})
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-space text-[#00FF9D] tracking-tight">{formatCurrency(totalAllocated)}</div>
            <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 pt-1">
              Spent: <span className="font-bold text-white">{formatCurrency(totalBudgetSpent)}</span> ({overallBudgetPct}% Utilized)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-4 py-2.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 border shadow-md ${
              overallBudgetPct > 90 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]/40 shadow-[0_0_15px_rgba(0,255,157,0.25)]'
            }`}>
              {overallBudgetPct > 90 ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-[#00FF9D]" />}
              {overallBudgetPct > 90 ? 'Tight Spending Alert' : 'Healthy Envelope Velocity'}
            </span>
          </div>
        </div>

        {/* OVERALL PORTFOLIO BUDGET PROGRESS BAR */}
        <div className="space-y-1.5 relative z-10 font-mono">
          <div className="w-full bg-[#030A08] rounded-full h-3 border border-[#00FF9D]/30 p-0.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                overallBudgetPct > 90 ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_12px_#F43F5E]' : 'bg-gradient-to-r from-[#00FF9D] via-[#FBBF24] to-[#00FF9D]'
              }`}
              style={{ width: `${Math.min(100, overallBudgetPct)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#94A3B8]">
            <span>0%</span>
            <span>50% Allocation</span>
            <span>{totalAllocated > 0 ? `${formatCurrency(Math.max(0, totalAllocated - totalBudgetSpent))} Cushion Left` : '100%'}</span>
          </div>
        </div>
      </div>

      {/* BUDGET ENVELOPES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {budgets.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-xs text-[#94A3B8] border border-dashed border-[#00FF9D]/30 rounded-3xl space-y-4 font-mono bg-[#040D0B]/60">
            <PieChart className="w-12 h-12 text-[#00FF9D] opacity-50 mx-auto animate-pulse" />
            <div>
              <div className="font-extrabold text-base text-white font-space">No Budget Envelopes Created</div>
              <p className="text-xs text-[#94A3B8] mt-1">Create budget caps to monitor dining, groceries, and travel spending limits.</p>
            </div>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="px-6 py-3 rounded-full btn-primary text-[#040D0B] font-bold text-xs shadow-[0_0_25px_#00FF9D] cursor-pointer"
            >
              + Create First Budget Envelope
            </button>
          </div>
        ) : (
          budgets.map(b => {
            const categorySpent = expenses
              .filter(e => e.category.toLowerCase().includes(b.category.toLowerCase()) || b.category.toLowerCase().includes(e.category.toLowerCase()))
              .reduce((acc, curr) => acc + curr.amount, 0);

            const spentPct = Math.min(100, Math.round((categorySpent / (b.allocated || 1)) * 100));
            const isOver = categorySpent > b.allocated;
            const isWarning = spentPct >= 75 && !isOver;

            return (
              <div
                key={b.id}
                className={`p-6 bg-gradient-to-r from-[#071612] via-[#0C221B] to-[#040D0B] border rounded-3xl space-y-4 transition-all group shadow-md relative overflow-hidden ${
                  isOver 
                    ? 'border-rose-500/50 hover:border-rose-500 hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]' 
                    : isWarning 
                    ? 'border-[#FBBF24]/50 hover:border-[#FBBF24] hover:shadow-[0_0_25px_rgba(251,191,36,0.22)]' 
                    : 'border-[#00FF9D]/30 hover:border-[#00FF9D]/70 hover:shadow-[0_0_25px_rgba(0,255,157,0.2)]'
                }`}
              >
                {/* LEFT ACCENT INDICATOR STRIP */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isOver ? 'bg-rose-500 shadow-[0_0_10px_#F43F5E]' : isWarning ? 'bg-[#FBBF24]' : 'bg-[#00FF9D]'
                }`} />

                <div className="flex justify-between items-start pl-2">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
                      {getCategoryIcon(b.category)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base font-space">{b.category}</h3>
                      <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                        Spent: <span className="font-bold text-white">{formatCurrency(categorySpent)}</span> of {formatCurrency(b.allocated)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isOver 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]' 
                        : isWarning 
                        ? 'bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40' 
                        : 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40'
                    }`}>
                      {spentPct}%
                    </span>

                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                      <button 
                        onClick={() => setQuickAddCategory(b.category)} 
                        className="p-1.5 text-[#00FF9D] bg-[#00FF9D]/15 rounded-xl border border-[#00FF9D]/40" 
                        title="Add expense to this budget"
                      >
                        <Plus size={14} />
                      </button>
                      <button onClick={() => startEdit(b)} className="p-1.5 text-[#94A3B8] hover:text-[#00FF9D] bg-[#040D0B] rounded-xl border border-white/10" title="Edit cap"><Edit2 size={14} /></button>
                      <button onClick={() => deleteBudget(b.id)} className="p-1.5 text-[#94A3B8] hover:text-rose-400 bg-[#040D0B] rounded-xl border border-white/10" title="Delete envelope"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>

                {/* INLINE QUICK ADD EXPENSE FORM */}
                {quickAddCategory === b.category && (
                  <form onSubmit={handleQuickAddExpense} className="p-3 bg-[#030A08] border border-[#00FF9D]/40 rounded-2xl space-y-2 text-xs font-mono">
                    <div className="text-[10px] text-[#00FF9D] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FBBF24]" /> Log Expense to {b.category}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        required
                        type="text"
                        placeholder="Expense title"
                        value={quickAddTitle}
                        onChange={e => setQuickAddTitle(e.target.value)}
                        className="bg-[#081713] border border-[#00FF9D]/30 rounded-xl px-3 py-1.5 text-white text-xs outline-none"
                      />
                      <input
                        required
                        type="number"
                        placeholder="Amount (₹)"
                        value={quickAddAmount}
                        onChange={e => setQuickAddAmount(e.target.value)}
                        className="bg-[#081713] border border-[#00FF9D]/30 rounded-xl px-3 py-1.5 text-[#00FF9D] font-bold text-xs outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={() => setQuickAddCategory(null)} className="px-2.5 py-1 text-[#94A3B8] text-[10px]">Cancel</button>
                      <button type="submit" className="px-3 py-1 bg-[#00FF9D] text-[#030A08] font-bold rounded-full text-[10px]">Save</button>
                    </div>
                  </form>
                )}

                {/* PROGRESS BAR */}
                <div className="w-full bg-[#030A08] rounded-full h-2.5 border border-white/10 p-0.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver 
                        ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_10px_#F43F5E]' 
                        : isWarning 
                        ? 'bg-gradient-to-r from-[#FBBF24] to-amber-500' 
                        : 'bg-gradient-to-r from-[#00FF9D] to-[#FBBF24]'
                    }`}
                    style={{ width: `${Math.min(100, spentPct)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono pl-2">
                  <span className="text-[#94A3B8]">Remaining Cap:</span>
                  <span className={`font-bold ${isOver ? 'text-rose-400' : 'text-[#00FF9D]'}`}>
                    {isOver ? `Over budget by ${formatCurrency(categorySpent - b.allocated)}` : `${formatCurrency(b.allocated - categorySpent)} remaining`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ULTRA-PREMIUM MIDNIGHT LUXE CYBER STUDIO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#030A08]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#081713] to-[#040D0B] p-6 sm:p-7 w-full max-w-lg max-h-[88vh] overflow-y-auto custom-scrollbar shadow-[0_25px_70px_rgba(0,0,0,0.95)] rounded-3xl border border-[#00FF9D]/40 space-y-5 text-white relative">
            
            {/* TOP DUAL-TONE NEON ACCENT STRIP */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00FF9D] via-[#FBBF24] to-[#00FF9D]" />

            {/* AMBIENT GLOW */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FF9D]/10 rounded-full blur-3xl pointer-events-none" />

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#00FF9D]/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-[0_0_20px_rgba(0,255,157,0.25)]">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-[#00FF9D] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" /> // BUDGET_ENVELOPE_STUDIO
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white font-space">
                    {editingId ? 'Edit Budget Cap' : 'Create New Budget Envelope'}
                  </h3>
                </div>
              </div>

              <button 
                onClick={resetForm}
                className="p-1.5 rounded-full border border-white/10 hover:border-[#00FF9D] text-[#94A3B8] hover:text-[#00FF9D] transition-all cursor-pointer bg-[#040D0B]"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM WITH VISUAL CATEGORY GRID & SLIDER */}
            <form onSubmit={handleSaveBudget} className="space-y-4 text-xs font-mono">
              
              {/* VISUAL CATEGORY SELECTION TILES GRID */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-2 tracking-wider">
                  • Select Category Target
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {VISUAL_CATEGORIES_PRESET.map((c, idx) => {
                    const isSelected = category === c.val;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCategory(c.val)}
                        className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#00FF9D]/20 border-[#00FF9D] text-[#00FF9D] shadow-[0_0_15px_rgba(0,255,157,0.3)] font-bold'
                            : 'bg-[#030A08] border-white/10 text-[#94A3B8] hover:border-[#00FF9D]/40'
                        }`}
                      >
                        <span className="text-base">{c.icon}</span>
                        <span className="text-[10px] truncate max-w-full">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* INLINE CUSTOM CATEGORY INPUT */}
              {category === 'CUSTOM' && (
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#FBBF24] mb-1 tracking-wider">
                    • Custom Category Name
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-[#FBBF24] pointer-events-none">
                      <Tag className="w-4 h-4" />
                    </div>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Gym Membership, Office Supplies"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      className="w-full bg-[#030A08] border border-[#FBBF24]/40 rounded-2xl pl-10 pr-3.5 py-2.5 sm:py-3 text-[#FBBF24] font-bold text-xs focus:outline-none focus:border-[#FBBF24] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* MONTHLY BUDGET CAP INPUT WITH CURRENCY ICON */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1 tracking-wider">
                  • Monthly Budget Cap ({currency})
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#FBBF24] font-bold text-sm pointer-events-none">
                    ₹
                  </div>
                  <input
                    required
                    type="number"
                    placeholder="15000"
                    value={allocated}
                    onChange={e => setAllocated(e.target.value)}
                    className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl pl-9 pr-3.5 py-2.5 sm:py-3 text-[#00FF9D] font-mono font-bold text-xs focus:outline-none focus:border-[#00FF9D] focus:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all"
                  />
                </div>
              </div>

              {/* ALERT THRESHOLD TRIGGER SELECTOR */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-extrabold uppercase text-[#00FF9D] tracking-wider flex items-center gap-1">
                    <Bell className="w-3 h-3 text-[#FBBF24]" /> • Overspend Alert Sensitivity
                  </label>
                  <span className="text-[10px] font-bold text-[#FBBF24]">{alertThreshold}% Limit Trigger</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { pct: 75, label: 'Early Warning (75%)' },
                    { pct: 85, label: 'Standard (85%)' },
                    { pct: 95, label: 'Strict Limit (95%)' },
                  ].map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAlertThreshold(t.pct)}
                      className={`py-2 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                        alertThreshold === t.pct
                          ? 'bg-[#FBBF24]/20 border-[#FBBF24] text-[#FBBF24]'
                          : 'bg-[#030A08] border-white/10 text-[#94A3B8] hover:border-[#FBBF24]/40'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-3 flex justify-end gap-3 border-t border-[#00FF9D]/20">
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-4 py-2 rounded-full border border-white/10 hover:border-[#00FF9D]/40 text-[#94A3B8] hover:text-white transition-all text-xs cursor-pointer bg-[#030A08]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary px-6 py-2.5 rounded-full text-xs font-bold text-[#030A08] shadow-[0_0_20px_#00FF9D] transition-all cursor-pointer"
                >
                  {editingId ? 'Update Budget Cap' : 'Save Budget Cap'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
