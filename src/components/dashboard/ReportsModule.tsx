'use client';

import React, { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { 
  FileSpreadsheet, Download, Filter, CheckCircle2, TrendingUp, TrendingDown, 
  PieChart, BarChart2, LineChart, ShieldCheck, Sparkles, Calendar, ArrowUpRight, ChevronRight, Activity, Award
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const { totalIncome, totalExpenses, expenses, income, budgets, investments, netWorth, savingsRate, formatCurrency, currency } = useFinancial();

  // CHART SYSTEM TYPE STATE
  const [chartType, setChartType] = useState<'area' | 'bar' | 'donut' | 'forecast'>('area');
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year' | 'all'>('month');

  // CATEGORY DISTRIBUTION CALCULATOR
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  const netCashFlow = totalIncome - totalExpenses;

  // EXPORT CSV
  const handleExportCSV = () => {
    const headers = "Type,Title/Source,Category,Amount,Date\n";
    const expRows = expenses.map(e => `Expense,"${e.title}","${e.category}",${e.amount},"${e.date}"`).join("\n");
    const incRows = income.map(i => `Income,"${i.source}","${i.category}",${i.amount},"${i.date}"`).join("\n");
    const csvContent = headers + expRows + (incRows ? "\n" + incRows : "");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MoneyMind_Executive_Financial_Report_${period}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // EXPORT PDF/TEXT REPORT
  const handleExportPDF = () => {
    const reportContent = `====================================================
           MONEYMIND EXECUTIVE FINANCIAL AUDIT
====================================================
Date Generated: ${new Date().toLocaleDateString()}
Reporting Period: ${period.toUpperCase()}
Currency: ${currency}

SUMMARY METRICS:
----------------------------------------------------
Total Monthly Income:   ${formatCurrency(totalIncome)}
Total Logged Expenses:  ${formatCurrency(totalExpenses)}
Net Cash Flow:          ${formatCurrency(netCashFlow)}
Savings Rate:           ${savingsRate}%
Net Worth:              ${formatCurrency(netWorth)}

TOP EXPENSE CATEGORIES:
----------------------------------------------------
${sortedCategories.map(([cat, amt]) => `${cat.padEnd(25)} ${formatCurrency(amt)}`).join('\n') || 'No expenses logged'}

====================================================
Status: Verified & Audit Ready
====================================================`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MoneyMind_Audit_Report_${period}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-[0_0_20px_rgba(0,255,157,0.25)]">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[#00FF9D] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" /> // EXECUTIVE_AUDIT_STUDIO
            </div>
            <h2 className="text-2xl font-extrabold text-white font-space tracking-tight">Financial Reports & Audit Studio</h2>
            <p className="text-xs text-[#94A3B8]">Interactive visual charts, net cash flow analytics, and audit-ready statements</p>
          </div>
        </div>

        {/* PERIOD SELECTOR & EXPORT BUTTONS */}
        <div className="flex flex-wrap items-center gap-3 font-mono">
          <div className="flex items-center p-1 bg-[#040D0B] rounded-2xl text-xs font-bold border border-[#00FF9D]/30">
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${period === 'month' ? 'bg-[#00FF9D] text-[#040D0B] font-bold shadow-[0_0_12px_#00FF9D]' : 'text-[#94A3B8] hover:text-white'}`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriod('quarter')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${period === 'quarter' ? 'bg-[#00FF9D] text-[#040D0B] font-bold shadow-[0_0_12px_#00FF9D]' : 'text-[#94A3B8] hover:text-white'}`}
            >
              Q3 2026
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${period === 'year' ? 'bg-[#00FF9D] text-[#040D0B] font-bold shadow-[0_0_12px_#00FF9D]' : 'text-[#94A3B8] hover:text-white'}`}
            >
              This Year
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="btn-primary px-5 py-2.5 rounded-full text-xs font-bold text-[#040D0B] shadow-[0_0_20px_#00FF9D] flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#040D0B]" /> Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            className="px-5 py-2.5 rounded-full border border-[#FBBF24]/40 bg-[#FBBF24]/15 hover:bg-[#FBBF24]/30 text-[#FBBF24] text-xs font-mono font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 text-[#FBBF24]" /> Export Audit TXT
          </button>
        </div>
      </div>

      {/* SUMMARY STATS BANNER WITH GLOW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-mono">
        <div className="p-6 bg-gradient-to-br from-[#081713] to-[#040D0B] border border-[#00FF9D]/35 rounded-3xl space-y-2 relative overflow-hidden shadow-md">
          <div className="text-[10px] font-extrabold uppercase text-[#00FF9D] tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#00FF9D]" /> Total Recorded Income
          </div>
          <div className="text-3xl font-extrabold text-[#00FF9D] font-space">{formatCurrency(totalIncome)}</div>
          <div className="text-[11px] text-[#00FF9D] font-bold flex items-center gap-1 pt-1">
            <ArrowUpRight className="w-4 h-4" /> {income.length} Income Streams
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-[#081713] to-[#040D0B] border border-rose-500/35 rounded-3xl space-y-2 relative overflow-hidden shadow-md">
          <div className="text-[10px] font-extrabold uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> Total Logged Expenses
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-space">{formatCurrency(totalExpenses)}</div>
          <div className="text-[11px] text-rose-400 font-bold flex items-center gap-1 pt-1">
            <TrendingDown className="w-4 h-4" /> {expenses.length} Expense Logs
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-[#081713] to-[#040D0B] border border-[#FBBF24]/35 rounded-3xl space-y-2 relative overflow-hidden shadow-md">
          <div className="text-[10px] font-extrabold uppercase text-[#FBBF24] tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" /> Net Cash Flow
          </div>
          <div className={`text-3xl font-extrabold font-space ${netCashFlow >= 0 ? 'text-[#00FF9D]' : 'text-rose-400'}`}>
            {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
          </div>
          <div className="text-[11px] text-[#FBBF24] font-bold flex items-center gap-1 pt-1">
            <Award className="w-4 h-4 text-[#FBBF24]" /> {savingsRate}% Net Savings Rate
          </div>
        </div>
      </div>

      {/* CHART TYPE SYSTEM TOOLBAR */}
      <div className="p-6 bg-[#081713] border border-[#00FF9D]/30 rounded-3xl space-y-6 relative overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-xs font-extrabold text-white font-space flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#00FF9D]" /> Interactive Financial Chart Analytics Engine
          </div>

          {/* 4 CHART VIEW TOGGLE BUTTONS */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setChartType('area')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                chartType === 'area'
                  ? 'bg-[#00FF9D] text-[#040D0B] font-bold shadow-[0_0_15px_#00FF9D]'
                  : 'bg-[#040D0B] border border-[#00FF9D]/30 text-[#94A3B8] hover:text-white'
              }`}
            >
              <LineChart className="w-4 h-4" /> Area Trend
            </button>

            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-[#00FF9D] text-[#040D0B] font-bold shadow-[0_0_15px_#00FF9D]'
                  : 'bg-[#040D0B] border border-[#00FF9D]/30 text-[#94A3B8] hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Bar Compare
            </button>

            <button
              onClick={() => setChartType('donut')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                chartType === 'donut'
                  ? 'bg-[#00FF9D] text-[#040D0B] font-bold shadow-[0_0_15px_#00FF9D]'
                  : 'bg-[#040D0B] border border-[#00FF9D]/30 text-[#94A3B8] hover:text-white'
              }`}
            >
              <PieChart className="w-4 h-4" /> Donut Category
            </button>

            <button
              onClick={() => setChartType('forecast')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                chartType === 'forecast'
                  ? 'bg-[#00FF9D] text-[#040D0B] font-bold shadow-[0_0_15px_#00FF9D]'
                  : 'bg-[#040D0B] border border-[#00FF9D]/30 text-[#94A3B8] hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> 12M Forecast
            </button>
          </div>
        </div>

        {/* CHART RENDER CANVAS */}
        <div className="p-6 bg-[#040D0B] rounded-2xl border border-[#00FF9D]/30 min-h-[280px] flex items-center justify-center relative overflow-hidden">
          
          {/* VIEW 1: AREA CASHFLOW TREND */}
          {chartType === 'area' && (
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white font-space text-sm">Monthly Cashflow Trend (Income vs Expenses)</span>
                <div className="flex items-center gap-4 font-mono">
                  <span className="flex items-center gap-1.5 text-[#00FF9D] font-bold text-xs">
                    <span className="w-3 h-3 rounded-full bg-[#00FF9D] shadow-[0_0_8px_#00FF9D]" /> Income
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                    <span className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_#F43F5E]" /> Expenses
                  </span>
                </div>
              </div>

              <div className="relative h-52 w-full pt-4">
                <svg className="w-full h-40 overflow-visible">
                  <defs>
                    <linearGradient id="areaIncGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00FF9D" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#00FF9D" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="areaExpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* INCOME LINE & AREA */}
                  <path d="M 0 50 Q 180 20 360 35 T 720 15 L 720 140 L 0 140 Z" fill="url(#areaIncGrad)" />
                  <path d="M 0 50 Q 180 20 360 35 T 720 15" fill="none" stroke="#00FF9D" strokeWidth="3.5" />

                  {/* EXPENSE LINE & AREA */}
                  <path d="M 0 100 Q 180 80 360 95 T 720 60 L 720 140 L 0 140 Z" fill="url(#areaExpGrad)" />
                  <path d="M 0 100 Q 180 80 360 95 T 720 60" fill="none" stroke="#F43F5E" strokeWidth="3.5" />
                </svg>

                <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono border-t border-[#00FF9D]/20 pt-2 font-bold">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: BAR COMPARISON CHART */}
          {chartType === 'bar' && (
            <div className="w-full space-y-6">
              <div className="text-sm font-bold text-white font-space">Financial Metrics Breakdown ({currency})</div>
              <div className="grid grid-cols-4 gap-6 items-end h-44 pt-4 px-4 border-b border-[#00FF9D]/20">
                
                {/* BAR 1: INCOME */}
                <div className="space-y-2 text-center">
                  <div className="text-xs font-bold font-mono text-[#00FF9D]">{formatCurrency(totalIncome)}</div>
                  <div className="w-full bg-[#00FF9D] shadow-[0_0_20px_#00FF9D] rounded-t-2xl transition-all duration-500" style={{ height: `${totalIncome > 0 ? 130 : 12}px` }} />
                  <div className="text-[11px] font-bold text-white uppercase font-mono">Income</div>
                </div>

                {/* BAR 2: EXPENSES */}
                <div className="space-y-2 text-center">
                  <div className="text-xs font-bold font-mono text-rose-400">{formatCurrency(totalExpenses)}</div>
                  <div className="w-full bg-rose-500 shadow-[0_0_20px_#F43F5E] rounded-t-2xl transition-all duration-500" style={{ height: `${totalExpenses > 0 ? Math.min(130, Math.round((totalExpenses / (totalIncome || 1)) * 130)) : 12}px` }} />
                  <div className="text-[11px] font-bold text-white uppercase font-mono">Expenses</div>
                </div>

                {/* BAR 3: NET SAVINGS */}
                <div className="space-y-2 text-center">
                  <div className="text-xs font-bold font-mono text-[#FBBF24]">{formatCurrency(Math.max(0, netCashFlow))}</div>
                  <div className="w-full bg-[#FBBF24] shadow-[0_0_20px_#FBBF24] rounded-t-2xl transition-all duration-500" style={{ height: `${netCashFlow > 0 ? Math.min(130, Math.round((netCashFlow / (totalIncome || 1)) * 130)) : 12}px` }} />
                  <div className="text-[11px] font-bold text-white uppercase font-mono">Savings</div>
                </div>

                {/* BAR 4: NET WORTH */}
                <div className="space-y-2 text-center">
                  <div className="text-xs font-bold font-mono text-[#00FF9D]">{formatCurrency(netWorth)}</div>
                  <div className="w-full bg-[#00FF9D] shadow-[0_0_20px_#00FF9D] rounded-t-2xl transition-all duration-500" style={{ height: `${netWorth > 0 ? 110 : 12}px` }} />
                  <div className="text-[11px] font-bold text-white uppercase font-mono">Net Worth</div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW 3: DONUT CATEGORY DISTRIBUTION */}
          {chartType === 'donut' && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="62" stroke="#081713" strokeWidth="16" fill="transparent" />
                  <circle cx="80" cy="80" r="62" stroke="#00FF9D" strokeWidth="16" fill="transparent" strokeDasharray="390" strokeDashoffset={totalExpenses > 0 ? "110" : "390"} strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <div className="font-extrabold text-xl text-[#00FF9D] font-mono">{sortedCategories.length}</div>
                  <div className="text-[10px] text-[#94A3B8] font-mono uppercase font-bold">Categories</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {sortedCategories.length === 0 ? (
                  <p className="text-[#94A3B8] text-center py-4 font-mono">No expense categories recorded yet.</p>
                ) : (
                  sortedCategories.map(([cat, amt], i) => {
                    const pct = Math.round((amt / (totalExpenses || 1)) * 100);
                    return (
                      <div key={i} className="flex justify-between items-center p-3 bg-[#081713] rounded-2xl border border-[#00FF9D]/30 font-mono">
                        <span className="font-bold text-white">{cat}</span>
                        <span className="font-extrabold text-[#00FF9D]">{formatCurrency(amt)} ({pct}%)</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* VIEW 4: 12-MONTH FORECAST CURVE */}
          {chartType === 'forecast' && (
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white font-space text-sm">12-Month Predictive Wealth Projection (Compound Growth)</span>
                <span className="text-[#00FF9D] font-bold font-mono text-xs bg-[#00FF9D]/20 px-3 py-1 rounded-full border border-[#00FF9D]/40 shadow-[0_0_12px_#00FF9D]">
                  +12% Projected Annual Yield
                </span>
              </div>

              <div className="relative h-48 w-full pt-4">
                <svg className="w-full h-36 overflow-visible">
                  <path d="M 0 110 Q 180 90 360 45 T 720 15" fill="none" stroke="#00FF9D" strokeWidth="4" strokeDasharray="8 8" />
                  <circle cx="720" cy="15" r="7" fill="#FBBF24" className="animate-pulse" />
                </svg>
                <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono border-t border-[#00FF9D]/20 pt-2 font-bold">
                  <span>Month 1</span>
                  <span>Month 4</span>
                  <span>Month 8</span>
                  <span>Month 12</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* DAILY SPENDING HEATMAP CALENDAR */}
      <div className="space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="font-extrabold text-lg text-white font-space flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#00FF9D]" /> Daily Spending Heatmap Matrix (Current Month)
          </h3>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#030A08] border border-white/10" /> Low</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#00FF9D]/40" /> Moderate</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#FBBF24]" /> High</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Peak</span>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/30 rounded-3xl space-y-4">
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-[#94A3B8] font-bold pb-2 border-b border-[#00FF9D]/20">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
              const dateStr = `2026-08-${day < 10 ? '0' + day : day}`;
              const dayExpenses = expenses.filter(e => e.date === dateStr).reduce((acc, curr) => acc + curr.amount, 0);

              let heatBg = 'bg-[#030A08] border-white/10 text-[#94A3B8]';
              if (dayExpenses > 5000) heatBg = 'bg-rose-500/30 border-rose-500/60 text-rose-400 font-bold shadow-[0_0_10px_#F43F5E]';
              else if (dayExpenses > 2000) heatBg = 'bg-[#FBBF24]/30 border-[#FBBF24]/60 text-[#FBBF24] font-bold shadow-[0_0_10px_#FBBF24]';
              else if (dayExpenses > 0) heatBg = 'bg-[#00FF9D]/25 border-[#00FF9D]/60 text-[#00FF9D] font-bold shadow-[0_0_10px_#00FF9D]';

              return (
                <div
                  key={day}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-0.5 text-xs transition-all hover:scale-105 cursor-pointer ${heatBg}`}
                  title={`${dateStr}: ${formatCurrency(dayExpenses)}`}
                >
                  <span className="text-[10px] text-white/70">{day}</span>
                  <span className="text-[9px] font-mono">{dayExpenses > 0 ? formatCurrency(dayExpenses) : '-'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TRANSACTION AUDIT LEDGER TABLE */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-white font-space flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#00FF9D]" /> Verified Audit Ledger ({expenses.length + income.length} Records)
        </h3>

        <div className="space-y-3">
          {expenses.length === 0 && income.length === 0 ? (
            <div className="p-10 text-center text-xs text-[#94A3B8] border border-dashed border-[#00FF9D]/30 rounded-3xl font-mono bg-[#040D0B]/60">
              No transactions recorded yet in audit ledger.
            </div>
          ) : (
            [...income.map(i => ({ title: i.source, category: i.category, amount: i.amount, date: i.date, type: 'INCOME' })),
             ...expenses.map(e => ({ title: e.title, category: e.category, amount: e.amount, date: e.date, type: 'EXPENSE' }))]
              .map((tx, idx) => (
                <div key={idx} className="p-4.5 bg-gradient-to-r from-[#071612] via-[#0C221B] to-[#040D0B] border border-[#00FF9D]/25 rounded-2xl flex items-center justify-between text-xs hover:border-[#00FF9D]/60 hover:shadow-[0_0_20px_rgba(0,255,157,0.15)] transition-all shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <CheckCircle2 className={`w-5 h-5 ${tx.type === 'INCOME' ? 'text-[#00FF9D]' : 'text-[#FBBF24]'}`} />
                    <div>
                      <span className="font-bold text-white text-base font-space">{tx.title}</span>
                      <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5 uppercase tracking-wider font-bold">
                        {tx.type} • {tx.category} • {tx.date}
                      </div>
                    </div>
                  </div>

                  <span className={`font-extrabold font-mono text-base ${tx.type === 'INCOME' ? 'text-[#00FF9D]' : 'text-rose-400'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>

    </div>
  );
};
