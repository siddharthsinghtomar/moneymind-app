'use client';

import React, { useState } from 'react';
import { useFinancial, IncomeItem } from '@/context/FinancialContext';
import { TrendingUp, Plus, Trash2, Edit2, X, DollarSign, Calendar, Tag, CheckCircle2, Sparkles, Building2, Briefcase, Zap, LineChart, Gift, ArrowUpRight, ShieldCheck, PieChart, Activity } from 'lucide-react';

export const IncomeModule: React.FC = () => {
  const { income, addIncome, editIncome, deleteIncome, totalIncome, formatCurrency, currency } = useFinancial();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Primary Salary');
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // CATEGORY BREAKDOWN CALCULATOR
  const categoryMap: Record<string, number> = {};
  income.forEach(item => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
  });
  const categoryBreakdown = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !amount) return;

    const finalCategory = category === 'CUSTOM' ? (customCategory.trim() || 'Other') : category;

    if (editingId) {
      editIncome(editingId, {
        source,
        amount: parseFloat(amount),
        category: finalCategory,
        date: date || new Date().toISOString().split('T')[0]
      });
    } else {
      addIncome({
        source,
        amount: parseFloat(amount),
        category: finalCategory,
        date: date || new Date().toISOString().split('T')[0]
      });
    }

    resetForm();
  };

  const startEdit = (item: IncomeItem) => {
    setEditingId(item.id);
    setSource(item.source);
    setAmount(item.amount.toString());
    setCategory(item.category);
    setDate(item.date);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setSource('');
    setAmount('');
    setCategory('Primary Salary');
    setCustomCategory('');
  };

  const getCategoryIcon = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('salary') || lower.includes('primary')) return <Briefcase className="w-5 h-5 text-[#00FF9D]" />;
    if (lower.includes('freelance') || lower.includes('side')) return <Zap className="w-5 h-5 text-[#FBBF24]" />;
    if (lower.includes('invest') || lower.includes('dividend') || lower.includes('stock')) return <LineChart className="w-5 h-5 text-[#00FF9D]" />;
    return <Gift className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="cyber-card p-6 sm:p-8 space-y-6 text-white relative overflow-hidden">
      
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
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[#00FF9D] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" /> // INFLOW_STREAM_STUDIO • LIVE
            </div>
            <h2 className="text-2xl font-extrabold text-white font-space tracking-tight">Income Streams & Revenue</h2>
            <p className="text-xs text-[#94A3B8]">Track salary, freelance retainer fees, and passive investment dividends</p>
          </div>
        </div>

        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn-primary px-6 py-3 rounded-full text-xs font-bold text-[#040D0B] shadow-[0_0_25px_#00FF9D] flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#040D0B]" />
          <span>Add Income Source</span>
        </button>
      </div>

      {/* RICH TOTAL MONTHLY INCOME BANNER WITH SPARKLINE & CATEGORY BREAKDOWN */}
      <div className="p-7 bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/40 rounded-3xl shadow-xl space-y-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00FF9D]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1 font-mono">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#00FF9D] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#00FF9D]" /> Active Monthly Inflow ({currency})
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold font-space text-[#00FF9D] tracking-tight">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-[#00FF9D] flex items-center gap-1.5 pt-1 font-mono font-bold">
              <ArrowUpRight className="w-4 h-4 text-[#00FF9D]" /> Real-time verified income ledger
            </p>
          </div>

          {/* SPARKLINE MINI SVG CURVE */}
          <div className="flex items-center gap-6 relative z-10 w-full lg:w-auto">
            <div className="hidden sm:block h-16 w-44 pt-2">
              <svg className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="incSparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FF9D" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00FF9D" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 0 50 Q 30 30 60 40 T 120 15 T 180 5 L 180 60 L 0 60 Z" fill="url(#incSparkGrad)" />
                <path d="M 0 50 Q 30 30 60 40 T 120 15 T 180 5" fill="none" stroke="#00FF9D" strokeWidth="2.5" />
              </svg>
            </div>

            <span className="px-4 py-2.5 bg-[#00FF9D]/20 border border-[#00FF9D]/40 text-[#00FF9D] rounded-full text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,157,0.25)] shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#00FF9D]" /> {income.length} Active Streams
            </span>
          </div>
        </div>

        {/* CATEGORY PERCENTAGE ALLOCATION PROGRESS BARS */}
        {categoryBreakdown.length > 0 && (
          <div className="pt-4 border-t border-[#00FF9D]/20 space-y-2.5 relative z-10 font-mono">
            <div className="text-[10px] font-extrabold uppercase text-[#94A3B8] tracking-wider flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-[#FBBF24]" /> Category Distribution Breakdown:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categoryBreakdown.map(([catName, amt], idx) => {
                const pct = Math.min(100, Math.round((amt / (totalIncome || 1)) * 100));
                return (
                  <div key={idx} className="p-3 bg-[#030A08]/80 rounded-2xl border border-[#00FF9D]/20 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-white truncate max-w-[130px]">{catName}</span>
                      <span className="font-extrabold text-[#00FF9D]">{pct}%</span>
                    </div>
                    <div className="w-full bg-[#081713] rounded-full h-1.5 border border-[#00FF9D]/20">
                      <div className="bg-gradient-to-r from-[#00FF9D] to-[#FBBF24] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* INCOME STREAMS LIST WITH HUD BRACKETS & GLOW */}
      <div className="space-y-3 pt-2">
        {income.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#94A3B8] border border-dashed border-[#00FF9D]/30 rounded-3xl space-y-4 font-mono bg-[#040D0B]/60">
            <TrendingUp className="w-12 h-12 text-[#00FF9D] opacity-50 mx-auto animate-pulse" />
            <div>
              <div className="font-extrabold text-base text-white font-space">No Income Sources Recorded</div>
              <p className="text-xs text-[#94A3B8] mt-1">Click below to record your salary, freelance, or dividend inflows.</p>
            </div>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="px-6 py-3 rounded-full btn-primary text-[#040D0B] font-bold text-xs shadow-[0_0_25px_#00FF9D] cursor-pointer"
            >
              + Add First Income Source
            </button>
          </div>
        ) : (
          income.map(item => (
            <div
              key={item.id}
              className="p-5 bg-gradient-to-r from-[#071612] via-[#0C221B] to-[#040D0B] border border-[#00FF9D]/30 rounded-2xl flex items-center justify-between text-xs hover:border-[#00FF9D]/70 hover:shadow-[0_0_30px_rgba(0,255,157,0.22)] transition-all group shadow-sm relative overflow-hidden"
            >
              {/* LEFT ACCENT STRIP */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#00FF9D] to-[#FBBF24]" />

              <div className="flex items-center gap-4 pl-2">
                <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="font-extrabold text-white text-base font-space">{item.source}</div>
                  <div className="text-[10px] text-[#94A3B8] flex items-center gap-2 mt-1 font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00FF9D]/15 text-[#00FF9D] font-bold border border-[#00FF9D]/30 uppercase tracking-wider">{item.category}</span>
                    <span>Received: {item.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="font-extrabold text-[#00FF9D] font-mono text-xl">
                  + {formatCurrency(item.amount)}
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 text-[#94A3B8] hover:text-[#00FF9D] transition-colors cursor-pointer bg-[#040D0B] rounded-xl border border-white/10"
                    title="Edit entry"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteIncome(item.id)}
                    className="p-2 text-[#94A3B8] hover:text-red-400 transition-colors cursor-pointer bg-[#040D0B] rounded-xl border border-white/10"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ULTRA-PREMIUM MIDNIGHT LUXE CYBER STUDIO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#030A08]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#081713] to-[#040D0B] p-6 sm:p-7 w-full max-w-lg max-h-[88vh] overflow-y-auto custom-scrollbar shadow-[0_25px_70px_rgba(0,0,0,0.95)] rounded-3xl border border-[#00FF9D]/40 space-y-4 sm:space-y-5 text-white relative">
            
            {/* TOP DUAL-TONE NEON ACCENT STRIP */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00FF9D] via-[#FBBF24] to-[#00FF9D]" />

            {/* AMBIENT GLOW */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FF9D]/10 rounded-full blur-3xl pointer-events-none" />

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#00FF9D]/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-[0_0_20px_rgba(0,255,157,0.25)]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-[#00FF9D] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" /> // DATA_INGESTION_STUDIO
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white font-space">
                    {editingId ? 'Edit Income Source' : 'Add Income Source'}
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

            {/* FORM WITH EMBEDDED ICONS */}
            <form onSubmit={handleSaveIncome} className="space-y-4 text-xs font-mono">
              
              {/* SOURCE NAME WITH ICON */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1 tracking-wider">
                  • Source Name / Payer
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#00FF9D]/70 pointer-events-none">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Monthly Salary / Client Payment"
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl pl-10 pr-4 py-2.5 sm:py-3 text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#00FF9D] focus:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all font-sans text-xs"
                  />
                </div>
              </div>

              {/* AMOUNT & CATEGORY GRID WITH ICONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1 tracking-wider">
                    • Amount ({currency})
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-[#FBBF24] font-bold text-sm pointer-events-none">
                      ₹
                    </div>
                    <input
                      required
                      type="number"
                      placeholder="125000"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl pl-9 pr-3.5 py-2.5 sm:py-3 text-[#00FF9D] font-mono font-bold text-xs focus:outline-none focus:border-[#00FF9D] focus:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1 tracking-wider">
                    • Category
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-[#00FF9D]/70 pointer-events-none">
                      <Tag className="w-4 h-4" />
                    </div>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl pl-10 pr-3.5 py-2.5 sm:py-3 text-white font-sans text-xs outline-none focus:border-[#00FF9D] focus:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all cursor-pointer"
                    >
                      <option value="Primary Salary" className="bg-[#030A08]">Primary Salary</option>
                      <option value="Freelance & Consulting" className="bg-[#030A08]">Freelance & Consulting</option>
                      <option value="Business Revenue" className="bg-[#030A08]">Business Revenue</option>
                      <option value="Investment Dividends" className="bg-[#030A08]">Investment Dividends</option>
                      <option value="Stock Capital Gains" className="bg-[#030A08]">Stock Capital Gains</option>
                      <option value="Crypto Gains" className="bg-[#030A08]">Crypto Gains</option>
                      <option value="Rental Income" className="bg-[#030A08]">Rental Income</option>
                      <option value="Royalty & IP" className="bg-[#030A08]">Royalty & IP</option>
                      <option value="Gift & Bonus" className="bg-[#030A08]">Gift & Bonus</option>
                      <option value="Refunds & Cashback" className="bg-[#030A08]">Refunds & Cashback</option>
                      <option value="Other" className="bg-[#030A08]">Other</option>
                      <option value="CUSTOM" className="bg-[#030A08] text-[#FBBF24] font-bold">+ Add Custom Category...</option>
                    </select>
                  </div>
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
                      placeholder="e.g. YouTube Sponsorship, E-commerce Store"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      className="w-full bg-[#030A08] border border-[#FBBF24]/40 rounded-2xl pl-10 pr-3.5 py-2.5 sm:py-3 text-[#FBBF24] font-bold text-xs focus:outline-none focus:border-[#FBBF24] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* QUICK CATEGORY CHIPS */}
              <div className="space-y-1">
                <div className="text-[9px] text-[#94A3B8] font-bold tracking-wider uppercase">• Quick Select Category:</div>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setCategory('Primary Salary')}
                    className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${category === 'Primary Salary' ? 'bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]' : 'bg-[#030A08] text-[#94A3B8] border-white/10 hover:border-[#00FF9D]/40'}`}
                  >
                    <Briefcase className="w-3 h-3" /> Salary
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('Freelance & Consulting')}
                    className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${category === 'Freelance & Consulting' ? 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]' : 'bg-[#030A08] text-[#94A3B8] border-white/10 hover:border-[#FBBF24]/40'}`}
                  >
                    <Zap className="w-3 h-3" /> Freelance
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('Investment Dividends')}
                    className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${category === 'Investment Dividends' ? 'bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]' : 'bg-[#030A08] text-[#94A3B8] border-white/10 hover:border-[#00FF9D]/40'}`}
                  >
                    <LineChart className="w-3 h-3" /> Dividends
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('CUSTOM')}
                    className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${category === 'CUSTOM' ? 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]' : 'bg-[#030A08] text-[#94A3B8] border-white/10 hover:border-[#FBBF24]/40'}`}
                  >
                    + Custom
                  </button>
                </div>
              </div>

              {/* DATE RECEIVED WITH ICON */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1 tracking-wider">
                  • Date Received
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#00FF9D]/70 pointer-events-none">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl pl-10 pr-4 py-2.5 sm:py-3 text-white font-mono text-xs focus:outline-none focus:border-[#00FF9D] focus:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all"
                  />
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
                  Save Income Source
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
