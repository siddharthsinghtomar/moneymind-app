'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Wallet, Receipt, TrendingUp, PieChart, Target, 
  LineChart, CreditCard, Landmark, FileSpreadsheet, Bot, 
  PlusCircle, Radio, PiggyBank, Calculator, Crown, ChevronsUpDown, Cpu, Zap, Trophy, ShieldCheck, User
} from 'lucide-react';

export type DashboardTab = 
  | 'overview' | 'total-balance' | 'transactions' | 'net-worth'
  | 'expenses' | 'income' | 'budgets' | 'goals' 
  | 'investments' | 'credit-cards' | 'loans' | 'savings'
  | 'ai-assistant' | 'reports' | 'notifications' | 'subscriptions' | 'tax-planner' | 'challenges' | '2fa' | 'profile';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  userEmail?: string;
  userName?: string;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userEmail = 'siddharth@moneymind.app',
  userName = 'Siddharth Singh'
}) => {

  const navItems = [
    { id: 'overview' as DashboardTab, label: 'Dashboard Cockpit', icon: LayoutDashboard },
    { id: 'profile' as DashboardTab, label: 'Profile & Account', icon: User, badge: 'USER' },
    { id: 'total-balance' as DashboardTab, label: 'Accounts & Balances', icon: Wallet },
    { id: 'transactions' as DashboardTab, label: 'Transactions', icon: Receipt },
    { id: 'expenses' as DashboardTab, label: 'Expense Tracker', icon: Receipt, badge: 'FAST' },
    { id: 'income' as DashboardTab, label: 'Income Streams', icon: TrendingUp },
    { id: 'budgets' as DashboardTab, label: 'Smart Budgets', icon: PieChart, badge: 'AI' },
    { id: '2fa' as DashboardTab, label: '2-Step Verification', icon: ShieldCheck, badge: '2FA' },
    { id: 'challenges' as DashboardTab, label: 'Savings Challenges', icon: Trophy, badge: 'HOT' },
    { id: 'tax-planner' as DashboardTab, label: 'Tax Center & Planner', icon: Calculator, badge: 'NEW' },
    { id: 'goals' as DashboardTab, label: 'Wealth Goals', icon: Target },
    { id: 'investments' as DashboardTab, label: 'Investments', icon: LineChart },
    { id: 'credit-cards' as DashboardTab, label: 'Credit Cards', icon: CreditCard },
    { id: 'loans' as DashboardTab, label: 'Loans & EMI', icon: Landmark },
    { id: 'reports' as DashboardTab, label: 'Reports & Insights', icon: FileSpreadsheet },
    { id: 'ai-assistant' as DashboardTab, label: 'AI Financial Advisor', icon: Bot, badge: 'LUXE' },
  ];

  const shortcuts = [
    { id: 'expenses' as DashboardTab, label: 'Add Transaction', icon: PlusCircle },
    { id: '2fa' as DashboardTab, label: '2FA Security', icon: ShieldCheck },
    { id: 'savings' as DashboardTab, label: 'Savings Vault', icon: PiggyBank },
    { id: 'tax-planner' as DashboardTab, label: 'Tax Center', icon: Calculator },
  ];

  return (
    <aside className="w-64 bg-[#141c22] border-r border-white/[0.06] flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-40 shadow-2xl">
      <div className="overflow-y-auto custom-scrollbar p-5 space-y-6">
        
        {/* BRAND HEADER */}
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="w-7 h-7 rounded-full bg-[#6db89a] text-[#0f1a15] font-extrabold flex items-center justify-center font-space text-xs">
            M
          </div>
          <span className="font-mono text-sm font-bold text-[#d4e4dc] tracking-tight">moneymind.dev</span>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#6db89a]/15 text-[#6db89a] border border-[#6db89a]/30">AI 2.0</span>
        </div>

        {/* NAVIGATION LIST */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all relative group cursor-pointer ${
                  isActive
                    ? 'bg-[#1b2530] border border-[#6db89a]/40 text-[#6db89a] font-bold shadow-md'
                    : 'text-[#7a9e8e] hover:text-[#d4e4dc] hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-[#6db89a]' : 'text-[#7a9e8e] group-hover:text-[#6db89a]'}`} />
                <span className={`truncate ${isActive ? 'text-[#6db89a] font-bold' : 'text-[#7a9e8e]'}`}>{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto text-[8px] font-mono font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-[#6db89a]/20 text-[#6db89a]' : 'bg-[#c9a96e]/15 text-[#c9a96e] border border-[#c9a96e]/30'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* SHORTCUTS SECTION */}
        <div className="space-y-2 pt-3 border-t border-white/[0.06]">
          <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#6db89a] flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-[#6db89a]" /> SHORTCUTS
          </div>
          <div className="space-y-1">
            {shortcuts.map((sc, i) => {
              const Icon = sc.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(sc.id)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#7a9e8e] hover:text-[#d4e4dc] hover:bg-white/[0.04] transition-all cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-[#6db89a]" />
                  <span className="truncate text-[#7a9e8e] hover:text-[#d4e4dc]">{sc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PRO BANNER */}
        <div className="p-4 rounded-2xl bg-[#1b2530] border border-white/[0.08] space-y-3 relative overflow-hidden shadow-md">
          <div className="font-bold text-xs text-[#d4e4dc] font-mono tracking-tight flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-[#c9a96e]" /> Executive AI Pro
          </div>
          <p className="text-[11px] text-[#7a9e8e] leading-snug">
            Unlock 10-year Monte Carlo forecasting & real-time bank webhooks.
          </p>
          <button 
            onClick={() => setActiveTab('subscriptions')}
            className="w-full py-2.5 rounded-full bg-[#6db89a] text-[#0f1a15] font-bold text-xs shadow-md transition-all cursor-pointer hover:bg-[#5ca688]"
          >
            Upgrade Now →
          </button>
        </div>

      </div>

      {/* USER FOOTER */}
      <div className="p-4 border-t border-white/[0.06] flex items-center justify-between bg-[#141c22]">
        <div className="flex items-center gap-3 truncate">
          <div className="w-9 h-9 rounded-full bg-[#6db89a] text-[#0f1a15] font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
            {userName ? userName.trim().charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-[#d4e4dc] truncate">{userName}</div>
            <div className="text-[10px] text-[#7a9e8e] font-mono truncate">{userEmail}</div>
          </div>
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
            signOut({ callbackUrl: '/', redirect: true });
          }}
          className="text-[#7a9e8e] hover:text-[#e07070] p-1.5 rounded-xl hover:bg-[#e07070]/10 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <ChevronsUpDown className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
