'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FinancialProvider, useFinancial, CurrencyCode } from '@/context/FinancialContext';
import { DashboardTab } from '@/components/dashboard/DashboardSidebar';
import { CyberParticleCanvas } from '@/components/dashboard/CyberParticleCanvas';

// MODULE IMPORTS FOR ALL TABS
import { TotalBalanceModule } from '@/components/dashboard/TotalBalanceModule';
import { NetWorthModule } from '@/components/dashboard/NetWorthModule';
import { ExpensesModule } from '@/components/dashboard/ExpensesModule';
import { IncomeModule } from '@/components/dashboard/IncomeModule';
import { BudgetsModule } from '@/components/dashboard/BudgetsModule';
import { GoalsModule } from '@/components/dashboard/GoalsModule';
import { InvestmentsModule } from '@/components/dashboard/InvestmentsModule';
import { CreditCardsModule } from '@/components/dashboard/CreditCardsModule';
import { AIAssistantModule } from '@/components/dashboard/AIAssistantModule';
import { ReportsModule } from '@/components/dashboard/ReportsModule';
import { NotificationsModule } from '@/components/dashboard/NotificationsModule';
import { SubscriptionBillingModule } from '@/components/dashboard/SubscriptionBillingModule';
import { TaxPlannerModule } from '@/components/dashboard/TaxPlannerModule';
import { ChallengesModule } from '@/components/dashboard/ChallengesModule';
import { TwoFactorModule } from '@/components/dashboard/TwoFactorModule';
import { ProfileModule } from '@/components/dashboard/ProfileModule';
import { TransactionsModule } from '@/components/dashboard/TransactionsModule';

import { 
  Wallet, TrendingUp, TrendingDown, PieChart, Landmark, Target, FileText,
  Search, Bell, Mail, Info, Plus, ArrowUpRight, ArrowDownRight,
  Bot, Sparkles, AlertTriangle, Zap, CheckCircle2, ChevronDown, ShoppingBag, Car, RefreshCw, Globe, ShieldCheck, Layers, Camera, Radio, Trash2, Palette, LogOut
} from 'lucide-react';

function DashboardContent() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | 'month' | '7d'>('month');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { 
    expenses, income, accounts, budgets, totalIncome, totalExpenses, netWorth, savingsRate, 
    currency, setCurrency, formatCurrency, loadDemoData, clearAllData,
    theme, setTheme, userName, workspaceName
  } = useFinancial();

  // TOP CATEGORIES CALCULATOR FROM REAL EXPENSES
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // DYNAMIC SPENDING OVERVIEW BUCKET CALCULATOR
  const spendingBuckets = useMemo(() => {
    const buckets = [
      { label: 'Week 1', total: 0, count: 0 },
      { label: 'Week 2', total: 0, count: 0 },
      { label: 'Week 3', total: 0, count: 0 },
      { label: 'Week 4', total: 0, count: 0 },
      { label: 'Week 5', total: 0, count: 0 }
    ];

    expenses.forEach(e => {
      const parts = e.date ? e.date.split('-') : [];
      const dayNum = parseInt(parts[2] || '15', 10);
      let idx = 0;
      if (dayNum <= 6) idx = 0;
      else if (dayNum <= 12) idx = 1;
      else if (dayNum <= 18) idx = 2;
      else if (dayNum <= 24) idx = 3;
      else idx = 4;

      buckets[idx].total += e.amount;
      buckets[idx].count += 1;
    });

    const maxVal = Math.max(...buckets.map(b => b.total), 1);
    return buckets.map(b => ({
      ...b,
      pct: b.total > 0 ? Math.max(18, Math.round((b.total / maxVal) * 100)) : 0
    }));
  }, [expenses]);

  const totalAllocatedBudget = budgets.reduce((acc, curr) => acc + curr.allocated, 0);
  const budgetSpentPct = totalAllocatedBudget > 0 ? Math.min(100, Math.round((totalExpenses / totalAllocatedBudget) * 100)) : 0;

  return (
    <div className="min-h-screen bg-[#141c22] text-[#d4e4dc] flex flex-col font-sans w-full overflow-x-hidden relative select-none">
      
      {/* CANVAS PARTICLES & AMBIENT GLOW */}
      <CyberParticleCanvas />
      <div className="bg-grid" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      {/* FLOATING PILL NAVBAR */}
      <header className="px-4 sm:px-8 py-3 sticky top-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-[1700px] bg-[#1b2530]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl px-4 py-2 shadow-xl flex items-center justify-between gap-3 font-mono text-xs">
          
          {/* LOGO */}
          <div className="logo flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setActiveTab('overview')}>
            <div className="w-7 h-7 rounded-full bg-[#6db89a] text-[#0f1a15] font-extrabold flex items-center justify-center font-space text-xs shadow-sm">
              M
            </div>
            <span className="font-mono text-xs font-bold text-[#d4e4dc] tracking-tight hidden sm:inline">moneymind.dev</span>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#6db89a]/15 text-[#6db89a] border border-[#6db89a]/30">
              AI 2.0
            </span>
          </div>

          {/* NAV LINKS */}
          <nav className="hidden xl:flex items-center gap-3 text-[11px] font-mono overflow-x-auto no-scrollbar whitespace-nowrap shrink py-1">
            <button onClick={() => setActiveTab('overview')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'overview' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Cockpit
            </button>
            <button onClick={() => setActiveTab('total-balance')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'total-balance' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Accounts
            </button>
            <button onClick={() => setActiveTab('expenses')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'expenses' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Expenses
            </button>
            <button onClick={() => setActiveTab('income')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'income' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Income
            </button>
            <button onClick={() => setActiveTab('budgets')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'budgets' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Budgets
            </button>
            <button onClick={() => setActiveTab('goals')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'goals' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Goals
            </button>
            <button onClick={() => setActiveTab('investments')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'investments' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Investments
            </button>
            <button onClick={() => setActiveTab('credit-cards')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'credit-cards' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Credit Cards
            </button>
            <button onClick={() => setActiveTab('2fa')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === '2fa' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Categories
            </button>
            <button onClick={() => setActiveTab('tax-planner')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'tax-planner' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Tax Studio
            </button>
            <button onClick={() => setActiveTab('challenges')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'challenges' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Challenges
            </button>
            <button onClick={() => setActiveTab('reports')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'reports' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              Reports
            </button>
            <button onClick={() => setActiveTab('ai-assistant')} className={`hover:text-[#6db89a] transition-colors cursor-pointer text-[11px] ${activeTab === 'ai-assistant' ? 'text-[#6db89a] font-bold border-b-2 border-[#6db89a]' : 'text-[#7a9e8e]'}`}>
              AI Advisor
            </button>
          </nav>

          {/* ALL MODULES SELECTOR DROPDOWN + FX + USER CHIP */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* MODULE SELECTOR DROPDOWN */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#1f2e3a] rounded-full border border-white/[0.08] text-[11px] font-mono font-bold text-[#c9a96e] shrink-0 transition-all">
              <Layers className="w-3.5 h-3.5 text-[#c9a96e]" />
              <select
                value={activeTab}
                onChange={e => setActiveTab(e.target.value as DashboardTab)}
                className="bg-transparent text-[#c9a96e] font-bold outline-none cursor-pointer text-[11px] py-0.5 max-w-[120px] sm:max-w-none"
              >
                <option value="overview" className="bg-[#141c22] text-[#d4e4dc]">Cockpit ({workspaceName})</option>
                <option value="profile" className="bg-[#141c22] text-[#d4e4dc]">Profile Settings</option>
                <option value="total-balance" className="bg-[#141c22] text-[#d4e4dc]">Accounts</option>
                <option value="expenses" className="bg-[#141c22] text-[#d4e4dc]">Expenses</option>
                <option value="income" className="bg-[#141c22] text-[#d4e4dc]">Income</option>
                <option value="budgets" className="bg-[#141c22] text-[#d4e4dc]">Budgets</option>
                <option value="goals" className="bg-[#141c22] text-[#d4e4dc]">Goals</option>
                <option value="investments" className="bg-[#141c22] text-[#d4e4dc]">Investments</option>
                <option value="credit-cards" className="bg-[#141c22] text-[#d4e4dc]">Credit Cards</option>
                <option value="2fa" className="bg-[#141c22] text-[#d4e4dc]">Expense Categories</option>
                <option value="tax-planner" className="bg-[#141c22] text-[#d4e4dc]">Tax Studio</option>
                <option value="challenges" className="bg-[#141c22] text-[#d4e4dc]">Challenges</option>
                <option value="reports" className="bg-[#141c22] text-[#d4e4dc]">Reports</option>
                <option value="ai-assistant" className="bg-[#141c22] text-[#d4e4dc]">AI Advisor</option>
              </select>
            </div>

            {/* MULTI-CURRENCY FX SWITCHER */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#1f2e3a] rounded-full border border-white/[0.08] text-[11px] font-mono font-bold text-[#6db89a] shrink-0">
              <Globe className="w-3.5 h-3.5 text-[#6db89a]" />
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-[#6db89a] font-bold outline-none cursor-pointer text-[11px] py-0.5"
              >
                <option value="INR" className="bg-[#141c22] text-[#d4e4dc]">₹ INR</option>
                <option value="USD" className="bg-[#141c22] text-[#d4e4dc]">$ USD</option>
                <option value="EUR" className="bg-[#141c22] text-[#d4e4dc]">€ EUR</option>
                <option value="GBP" className="bg-[#141c22] text-[#d4e4dc]">£ GBP</option>
              </select>
            </div>

            {/* CLEAR DATA BUTTON */}
            <button
              onClick={clearAllData}
              className="px-2.5 py-1 rounded-full bg-[#e07070]/15 border border-[#e07070]/30 text-[#e07070] text-[11px] font-mono font-bold hover:bg-[#e07070]/25 transition-all flex items-center gap-1 cursor-pointer shrink-0"
              title="Clear all transactions and reset data"
            >
              <Trash2 className="w-3 h-3 text-[#e07070]" /> Clear
            </button>

            {/* USER BADGE & AUTH CONTROL */}
            {mounted && (session?.user || userName) ? (
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded-full bg-[#6db89a] text-[#0f1a15] font-mono font-bold text-[10px] flex items-center justify-center shadow-[0_0_10px_#6db89a] shrink-0"
                  title={`Logged in as ${userName}`}
                >
                  {userName ? userName.trim().charAt(0).toUpperCase() : 'S'}
                </div>

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.clear();
                      document.cookie = "mm_auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                      document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                      document.cookie = "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                      document.cookie = "authjs.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                      document.cookie = "__Secure-authjs.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }
                    clearAllData();
                    signOut({ callbackUrl: '/', redirect: true });
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#e07070]/15 border border-[#e07070]/30 text-[#e07070] text-[11px] font-mono font-bold hover:bg-[#e07070]/25 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  title="Sign out of your account"
                >
                  <LogOut className="w-3 h-3 text-[#e07070]" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <a
                href="/login"
                onClick={() => {
                  clearAllData();
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('mm_user_name');
                    localStorage.removeItem('mm_user_email');
                    localStorage.removeItem('mm_demo_loaded');
                  }
                }}
                className="px-3 py-1 rounded-full bg-[#6db89a] text-[#0f1a15] text-[11px] font-mono font-bold hover:bg-[#5ca688] transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
              >
                Sign In
              </a>
            )}
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 z-10 px-6 md:px-12 py-6 max-w-[1700px] mx-auto w-full space-y-6">
        
        {activeTab === 'total-balance' && <TotalBalanceModule />}
        {activeTab === 'transactions' && <TransactionsModule />}
        {activeTab === 'net-worth' && <NetWorthModule />}
        {activeTab === 'expenses' && <ExpensesModule />}
        {activeTab === 'income' && <IncomeModule />}
        {activeTab === 'budgets' && <BudgetsModule />}
        {activeTab === 'goals' && <GoalsModule />}
        {activeTab === 'investments' && <InvestmentsModule />}
        {activeTab === 'credit-cards' && <CreditCardsModule />}
        {activeTab === 'loans' && <CreditCardsModule />}
        {activeTab === 'savings' && <GoalsModule />}
        {activeTab === 'ai-assistant' && <AIAssistantModule />}
        {activeTab === 'reports' && <ReportsModule />}
        {activeTab === 'notifications' && <NotificationsModule />}
        {activeTab === 'subscriptions' && <SubscriptionBillingModule />}
        {activeTab === 'tax-planner' && <TaxPlannerModule />}
        {activeTab === 'challenges' && <ChallengesModule />}
        {activeTab === '2fa' && <TwoFactorModule />}
        {activeTab === 'profile' && <ProfileModule />}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* HUD STATUS CAPSULE BANNER */}
            <div className="px-6 py-3.5 bg-[#1b2530] border border-white/[0.08] rounded-full flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#7a9e8e] shadow-md">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[#6db89a] font-bold">
                  <Radio className="w-3.5 h-3.5 text-[#6db89a] animate-pulse" /> SYSTEM ONLINE
                </span>
                <span>•</span>
                <span>256-BIT ENCRYPTED</span>
                <span>•</span>
                <span className="text-[#c9a96e] font-bold">REAL-TIME OCR 2.0</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#d4e4dc] font-bold">FX Conversion: 1 USD = ₹85.00 INR</span>
                <span>•</span>
                <span className="text-[#6db89a] font-bold">
                  User: {userName || session?.user?.name || 'Siddharth Singh'} (PRO)
                </span>
              </div>
            </div>

            {/* NEW USER ONBOARDING HERO BANNER IF ACCOUNTS & EXPENSES ARE EMPTY */}
            {accounts.length === 0 && expenses.length === 0 && (
              <div className="p-7 bg-[#1b2530] border border-white/[0.08] rounded-3xl shadow-xl space-y-4 text-[#d4e4dc] font-mono relative overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#6db89a] uppercase tracking-wider flex items-center gap-1.5 font-space">
                      <Sparkles className="w-4 h-4 text-[#c9a96e]" /> Welcome to MoneyMind AI Studio!
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#d4e4dc] font-space">Set up your new workspace in 3 quick steps</h3>
                    <p className="text-xs text-[#7a9e8e]">Start logging your financial assets, income streams, and monthly expense budgets.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('total-balance')}
                    className="p-4 bg-[#141c22] hover:bg-[#1f2e3a] border border-white/[0.06] hover:border-[#6db89a] rounded-2xl text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[10px] text-[#6db89a] font-bold">STEP 1</div>
                    <div className="font-bold text-xs text-[#d4e4dc] group-hover:text-[#6db89a] mt-0.5">🏦 Add Bank / Wallet Account →</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('income')}
                    className="p-4 bg-[#141c22] hover:bg-[#1f2e3a] border border-white/[0.06] hover:border-[#6db89a] rounded-2xl text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[10px] text-[#6db89a] font-bold">STEP 2</div>
                    <div className="font-bold text-xs text-[#d4e4dc] group-hover:text-[#6db89a] mt-0.5">💸 Add Salary / Income Stream →</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('budgets')}
                    className="p-4 bg-[#141c22] hover:bg-[#1f2e3a] border border-white/[0.06] hover:border-[#6db89a] rounded-2xl text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[10px] text-[#6db89a] font-bold">STEP 3</div>
                    <div className="font-bold text-xs text-[#d4e4dc] group-hover:text-[#6db89a] mt-0.5">🎯 Set Spending Budget Cap →</div>
                  </button>
                </div>
              </div>
            )}

            {/* 4 SUMMARY METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* CARD 1: NET WORTH (METALLIC GOLD) */}
              <div className="bg-[#1b2530] border border-white/[0.08] p-6 rounded-2xl space-y-3 hover:border-[#c9a96e]/50 transition-all shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <div className="eyebrow text-[#c9a96e] tracking-widest font-mono text-[10px]">ACTIVE NET WORTH</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#c9a96e] mt-1 font-space tracking-tight">{formatCurrency(netWorth)}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#c9a96e]/15 text-[#c9a96e] border border-[#c9a96e]/30 shadow-md">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-[11px] text-[#c9a96e] font-semibold flex items-center justify-between font-mono pt-2 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" /> Real-time Net Worth</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#c9a96e]/20 text-[9px] font-bold text-[#c9a96e]">{currency}</span>
                </div>
              </div>

              {/* CARD 2: MONTHLY INFLOW (NEON MINT) */}
              <div className="bg-[#1b2530] border border-white/[0.08] p-6 rounded-2xl space-y-3 hover:border-[#6db89a]/50 transition-all shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <div className="eyebrow text-[#6db89a] tracking-widest font-mono text-[10px]">MONTHLY INFLOW</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#6db89a] mt-1 font-space tracking-tight">{formatCurrency(totalIncome)}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#6db89a]/15 text-[#6db89a] border border-[#6db89a]/30 shadow-md">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-[11px] text-[#6db89a] font-semibold flex items-center justify-between font-mono pt-2 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" /> {income.length} Income streams</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#6db89a]/20 text-[9px] font-bold text-[#6db89a]">+100% Active</span>
                </div>
              </div>

              {/* CARD 3: TOTAL EXPENSES (ROSE GOLD) */}
              <div className="bg-[#1b2530] border border-white/[0.08] p-6 rounded-2xl space-y-3 hover:border-[#e07070]/50 transition-all shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <div className="eyebrow text-[#e07070] tracking-widest font-mono text-[10px]">MONTHLY OUTFLOW</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#e07070] mt-1 font-space tracking-tight">{formatCurrency(totalExpenses)}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#e07070]/15 text-[#e07070] border border-[#e07070]/30 shadow-md">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-[11px] text-[#e07070] font-semibold flex items-center justify-between font-mono pt-2 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1">{expenses.length} Logged expenses</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#e07070]/20 text-[9px] font-bold text-[#e07070]">Live Ledger</span>
                </div>
              </div>

              {/* CARD 4: SAVINGS RATE (CYBER GOLD) */}
              <div className="bg-[#1b2530] border border-white/[0.08] p-6 rounded-2xl space-y-3 hover:border-[#6db89a]/50 transition-all shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <div className="eyebrow text-[#6db89a] tracking-widest font-mono text-[10px]">SAVINGS YIELD</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#6db89a] mt-1 font-space tracking-tight">{savingsRate}%</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#6db89a]/15 text-[#6db89a] border border-[#6db89a]/30 shadow-md">
                    <PieChart className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-[11px] text-[#6db89a] font-semibold flex items-center justify-between font-mono pt-2 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" /> Dynamic yield rate</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#6db89a]/20 text-[9px] font-bold text-[#6db89a]">{savingsRate >= 30 ? 'Healthy' : 'Optimal'}</span>
                </div>
              </div>

            </div>

            {/* MIDDLE SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT WIDE COLUMN */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* SPENDING OVERVIEW CARD */}
                <div className="bg-[#1b2530] border border-white/[0.08] p-6 rounded-3xl space-y-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="eyebrow text-[#6db89a]">ANALYTICS ENGINE</div>
                      <h3 className="font-extrabold text-lg text-[#d4e4dc] font-space">Spending Overview</h3>
                    </div>
                    
                    <div className="flex items-center gap-1.5 p-1 bg-[#141c22] border border-white/[0.08] rounded-full font-mono text-[10px]">
                      {(['month', '30d', '7d'] as const).map(tf => (
                        <button
                          key={tf}
                          onClick={() => setSelectedTimeframe(tf)}
                          className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                            selectedTimeframe === tf 
                              ? 'bg-[#6db89a] text-[#0f1a15] shadow-md' 
                              : 'text-[#7a9e8e] hover:text-[#d4e4dc]'
                          }`}
                        >
                          {tf === 'month' ? 'August 2026' : tf === '30d' ? 'Last 30D' : 'Last 7D'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* SPENDING BARS GRAPH */}
                    <div className="md:col-span-2 relative h-48 flex flex-col justify-between pt-2">
                      {totalExpenses === 0 ? (
                        <div className="h-36 flex flex-col items-center justify-center border border-dashed border-white/[0.1] rounded-2xl p-4 text-center font-mono space-y-2">
                          <p className="text-xs text-[#7a9e8e]">No logged expenses recorded for this period.</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setActiveTab('expenses')}
                              className="px-4 py-2 rounded-full bg-[#6db89a] text-[#0f1a15] font-bold text-xs cursor-pointer shadow-md"
                            >
                              + Log First Expense
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="h-36 flex items-end justify-between gap-3 px-2 pt-6 border-b border-white/[0.08]">
                          {spendingBuckets.map((bucket, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                              
                              {/* HOVER TOOLTIP */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#1f2e3a] border border-[#6db89a] text-[#6db89a] font-mono font-bold text-[10px] px-2 py-1 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-20">
                                {bucket.label}: {formatCurrency(bucket.total)}
                              </div>

                              {/* DYNAMIC HEIGHT BAR */}
                              <div 
                                className="w-full max-w-[36px] bg-gradient-to-t from-[#6db89a]/20 via-[#6db89a]/60 to-[#6db89a] rounded-t-xl border-t-2 border-[#6db89a] shadow-md group-hover:scale-105 transition-all duration-300 relative"
                                style={{ height: `${bucket.pct}%` }}
                              >
                                {bucket.total > 0 && (
                                  <div className="w-2 h-2 rounded-full bg-[#c9a96e] absolute -top-1 left-1/2 -translate-x-1/2 shadow-sm" />
                                )}
                              </div>

                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between text-[10px] text-[#7a9e8e] font-mono pt-2">
                        <span>1 Aug - 6 Aug</span>
                        <span>7 Aug - 12 Aug</span>
                        <span>13 Aug - 18 Aug</span>
                        <span>19 Aug - 24 Aug</span>
                        <span>25 Aug - 31 Aug</span>
                      </div>
                    </div>

                    {/* TOP CATEGORIES */}
                    <div className="space-y-3 pl-2 border-l border-white/[0.08]">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#d4e4dc] font-mono text-[11px] uppercase">Top Categories</span>
                        <button onClick={() => setActiveTab('expenses')} className="text-[#6db89a] font-mono hover:underline text-[10px]">View All</button>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        {topCategories.length === 0 ? (
                          <p className="text-[11px] text-[#7a9e8e] py-4 text-center font-mono">No expenses recorded yet.</p>
                        ) : (
                          topCategories.map(([catName, amt], idx) => {
                            const pct = Math.min(100, Math.round((amt / (totalExpenses || 1)) * 100));
                            return (
                              <div key={idx}>
                                <div className="flex justify-between text-[11px] mb-1">
                                  <span className="text-[#7a9e8e] font-medium">{catName}</span>
                                  <span className="font-bold font-mono text-[#6db89a]">{formatCurrency(amt)} <span className="text-[#7a9e8e] text-[10px]">{pct}%</span></span>
                                </div>
                                <div className="w-full bg-[#141c22] rounded-full h-1.5 border border-white/[0.06]">
                                  <div className="bg-gradient-to-r from-[#6db89a] to-[#c9a96e] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RECENT TRANSACTIONS */}
                <div className="bg-[#1b2530] border border-white/[0.08] p-6 rounded-3xl space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="eyebrow text-[#6db89a]">REAL-TIME LEDGER</div>
                      <h3 className="font-extrabold text-lg text-[#d4e4dc] font-space">Recent Transactions</h3>
                    </div>
                    <button onClick={() => setActiveTab('expenses')} className="text-xs text-[#6db89a] font-mono hover:underline">View All</button>
                  </div>

                  <div className="space-y-3">
                    {expenses.length === 0 && income.length === 0 ? (
                      <div className="p-8 text-center text-xs text-[#7a9e8e] border border-dashed border-white/[0.1] rounded-2xl space-y-2 font-mono">
                        <p>No transactions logged yet.</p>
                        <button
                          onClick={() => setActiveTab('expenses')}
                          className="px-4 py-2 bg-[#6db89a] text-[#0f1a15] font-bold rounded-full text-xs cursor-pointer shadow-md"
                        >
                          + Log First Expense
                        </button>
                      </div>
                    ) : (
                      [...expenses.map(e => ({ ...e, isIncome: false })), ...income.map(i => ({ title: i.source, category: i.category, amount: i.amount, date: i.date, isIncome: true, id: i.id }))]
                        .slice(0, 4)
                        .map((tx, idx) => (
                          <div key={idx} className="p-4 bg-[#141c22] border border-white/[0.06] rounded-2xl flex items-center justify-between text-xs hover:border-[#6db89a]/50 transition-all">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${tx.isIncome ? 'bg-[#6db89a]/20 text-[#6db89a] border border-[#6db89a]/30' : 'bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/30'} font-bold flex items-center justify-center text-sm font-space`}>
                                {tx.title.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-extrabold text-[#d4e4dc] text-sm">{tx.title}</div>
                                <div className="text-[10px] text-[#7a9e8e] font-mono">{tx.category}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-extrabold font-mono text-sm ${tx.isIncome ? 'text-[#6db89a]' : 'text-[#e07070]'}`}>
                                {tx.isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                              </div>
                              <div className="text-[10px] text-[#7a9e8e] font-mono">{tx.date}</div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                
                {/* AI ADVISOR */}
                <div className="bg-[#1b2530] border border-white/[0.08] p-6 rounded-3xl space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#6db89a]/20 border border-[#6db89a]/40 text-[#6db89a] flex items-center justify-center font-mono font-bold text-xs">
                        AI
                      </div>
                      <span className="font-extrabold text-sm text-[#d4e4dc] font-space">AI Financial Advisor</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#c9a96e]" /> LUXE AI
                    </span>
                  </div>

                  <p className="text-xs text-[#7a9e8e] leading-relaxed font-sans">
                    {totalExpenses === 0 ? "Log transactions to receive real-time AI spending optimization tips." : `Your total logged spend is ${formatCurrency(totalExpenses)}. Want optimization tips?`}
                  </p>

                  <button 
                    onClick={() => setActiveTab('ai-assistant')}
                    className="w-full bg-[#6db89a] hover:bg-[#5ca688] py-3 rounded-full text-xs font-bold text-[#0f1a15] transition-all cursor-pointer shadow-md"
                  >
                    Ask AI Advisor →
                  </button>
                </div>

                {/* BUDGET OVERVIEW CARD */}
                <div className="bg-[#1b2530] border border-white/[0.08] p-6 rounded-3xl space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm text-[#d4e4dc] font-space">Budget Overview</h3>
                    <button onClick={() => setActiveTab('budgets')} className="text-[11px] text-[#6db89a] font-mono hover:underline">View All</button>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="38" stroke="#1f2e3a" strokeWidth="8" fill="transparent" />
                        <circle cx="48" cy="48" r="38" stroke="#6db89a" strokeWidth="8" fill="transparent" strokeDasharray="238" strokeDashoffset={238 - (238 * budgetSpentPct) / 100} strokeLinecap="round" />
                      </svg>
                      <div className="absolute text-center">
                        <div className="font-extrabold text-base text-[#6db89a] font-mono">{budgetSpentPct}%</div>
                        <div className="text-[9px] text-[#7a9e8e] font-mono">Spent</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs flex-1 font-mono">
                      <div>
                        <div className="text-[10px] text-[#7a9e8e]">Monthly Budget</div>
                        <div className="font-bold text-[#d4e4dc]">{formatCurrency(totalAllocatedBudget)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#7a9e8e]">Spent</div>
                        <div className="font-bold text-[#6db89a]">{formatCurrency(totalExpenses)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#7a9e8e]">Remaining</div>
                        <div className="font-bold text-[#c9a96e]">{formatCurrency(Math.max(0, totalAllocatedBudget - totalExpenses))}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </>
        )}

      </main>

      {/* FLOATING SPEED-DIAL QUICK ACTION CAPSULE */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-mono">
        {speedDialOpen && (
          <div className="space-y-2 flex flex-col items-end animate-in fade-in slide-in-from-bottom-4 duration-200">
            <button
              onClick={() => { setActiveTab('expenses'); setSpeedDialOpen(false); }}
              className="px-4 py-2.5 rounded-full bg-[#1f2e3a] hover:bg-[#253746] border border-white/[0.08] text-[#6db89a] text-xs font-bold shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
            >
              <TrendingDown className="w-4 h-4 text-[#6db89a]" /> 💸 Log Quick Expense
            </button>
            <button
              onClick={() => { setActiveTab('income'); setSpeedDialOpen(false); }}
              className="px-4 py-2.5 rounded-full bg-[#1f2e3a] hover:bg-[#253746] border border-white/[0.08] text-[#6db89a] text-xs font-bold shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
            >
              <TrendingUp className="w-4 h-4 text-[#6db89a]" /> 💰 Add Income Stream
            </button>
            <button
              onClick={() => { setActiveTab('total-balance'); setSpeedDialOpen(false); }}
              className="px-4 py-2.5 rounded-full bg-[#1f2e3a] hover:bg-[#253746] border border-white/[0.08] text-[#c9a96e] text-xs font-bold shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
            >
              <Landmark className="w-4 h-4 text-[#c9a96e]" /> 🏛️ Link Bank / Wallet
            </button>
            <button
              onClick={() => { setActiveTab('budgets'); setSpeedDialOpen(false); }}
              className="px-4 py-2.5 rounded-full bg-[#1f2e3a] hover:bg-[#253746] border border-white/[0.08] text-[#c9a96e] text-xs font-bold shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
            >
              <PieChart className="w-4 h-4 text-[#c9a96e]" /> 🎯 Set Budget Cap
            </button>
          </div>
        )}

        <button
          onClick={() => setSpeedDialOpen(!speedDialOpen)}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer ${
            speedDialOpen 
              ? 'bg-[#e07070] text-[#0f1a15] rotate-45' 
              : 'bg-[#6db89a] text-[#0f1a15] hover:scale-110'
          }`}
          title="Quick Actions"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <FinancialProvider>
      <DashboardContent />
    </FinancialProvider>
  );
}
