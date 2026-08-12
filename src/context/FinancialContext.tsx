'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';
export type ColorTheme = 'emerald' | 'violet' | 'cyan' | 'amber' | 'cyber';

export interface AccountItem {
  id: string;
  name: string;
  type: 'bank' | 'upi' | 'credit' | 'investment' | 'manual';
  institution: string;
  accountNumberOrVpa: string;
  balance: number;
  color: string;
  lastSynced: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  receiptUrl?: string;
  receiptName?: string;
  isScanned?: boolean;
}

export interface IncomeItem {
  id: string;
  source: string;
  category: string;
  amount: number;
  date: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
}

export interface GoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface InvestmentItem {
  id: string;
  name: string;
  type: 'Stock' | 'Mutual Fund' | 'Crypto' | 'Gold';
  units: number;
  buyPrice: number;
  currentPrice: number;
}

interface FinancialContextType {
  accounts: AccountItem[];
  expenses: ExpenseItem[];
  income: IncomeItem[];
  budgets: BudgetItem[];
  goals: GoalItem[];
  investments: InvestmentItem[];
  
  // MULTI-CURRENCY FX ENGINE & COLOR THEMES
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatCurrency: (amountInINR: number) => string;
  theme: ColorTheme;
  setTheme: (t: ColorTheme) => void;

  // USER & WORKSPACE PROFILE
  userName: string;
  userEmail: string;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  workspaceName: string;

  // AI AUTO-SAVE & WEALTH CUSHION RULES
  autoSavePct: number;
  setAutoSavePct: (pct: number) => void;
  autoSaveGoalId: string | null;
  setAutoSaveGoalId: (id: string | null) => void;

  // CRUD Actions
  addAccount: (item: Omit<AccountItem, 'id'>) => void;
  editAccount: (id: string, item: Partial<AccountItem>) => void;
  deleteAccount: (id: string) => void;
  
  addExpense: (item: Omit<ExpenseItem, 'id'>) => void;
  editExpense: (id: string, item: Partial<ExpenseItem>) => void;
  deleteExpense: (id: string) => void;
  
  addIncome: (item: Omit<IncomeItem, 'id'>) => void;
  editIncome: (id: string, item: Partial<IncomeItem>) => void;
  deleteIncome: (id: string) => void;
  
  setBudget: (category: string, allocated: number) => void;
  deleteBudget: (id: string) => void;
  
  addGoal: (item: Omit<GoalItem, 'id' | 'currentAmount'>) => void;
  depositGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  
  addInvestment: (item: Omit<InvestmentItem, 'id'>) => void;
  editInvestment: (id: string, item: Partial<InvestmentItem>) => void;
  deleteInvestment: (id: string) => void;
  
  clearAllData: () => void;
  loadDemoData: () => void;

  // Real-Time Analytics Metrics
  totalBankBalance: number;
  totalInvestmentValue: number;
  totalIncome: number;
  totalExpenses: number;
  netWorth: number;
  savingsRate: number;
  aiInsights: string[];
  isHydrated: boolean;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const DEMO_ACCOUNTS_SAMPLE: AccountItem[] = [
  { id: '1', name: 'HDFC Savings Account', type: 'bank', institution: 'HDFC Bank', accountNumberOrVpa: '•••• 4892', balance: 850000, color: '#0284C7', lastSynced: 'Just now' },
  { id: '2', name: 'ICICI Direct Portfolio', type: 'investment', institution: 'ICICI Direct', accountNumberOrVpa: '•••• 1102', balance: 480000, color: '#10B981', lastSynced: '2 mins ago' },
  { id: '3', name: 'SBI Platinum Card', type: 'credit', institution: 'State Bank of India', accountNumberOrVpa: '•••• 9021', balance: 120000, color: '#EF4444', lastSynced: '1 hour ago' },
];

const DEMO_EXPENSES_SAMPLE: ExpenseItem[] = [
  { id: '1', title: 'Starbucks Coffee', category: 'Dining & Zomato', amount: 450, date: '2026-08-05', receiptName: 'starbucks_receipt.pdf', isScanned: true },
  { id: '2', title: 'Zepto Groceries', category: 'Groceries & Supplies', amount: 1240, date: '2026-08-04', receiptName: 'zepto_invoice.pdf', isScanned: true },
  { id: '3', title: 'Uber Premier Ride', category: 'Transport & Fuel', amount: 620, date: '2026-08-03' },
  { id: '4', title: 'Netflix Subscription', category: 'Utilities & Bills', amount: 649, date: '2026-08-01' },
];

const DEMO_INCOME_SAMPLE: IncomeItem[] = [
  { id: '1', source: 'Monthly Salary', category: 'Primary', amount: 125000, date: '2026-08-01' },
  { id: '2', source: 'Freelance Design Client', category: 'Side Hustle', amount: 25000, date: '2026-08-03' },
];

const DEMO_BUDGETS_SAMPLE: BudgetItem[] = [
  { id: '1', category: 'Dining & Zomato', allocated: 10000 },
  { id: '2', category: 'Groceries & Supplies', allocated: 15000 },
  { id: '3', category: 'Transport & Fuel', allocated: 5000 },
  { id: '4', category: 'Utilities & Bills', allocated: 8000 },
];

const DEMO_GOALS_SAMPLE: GoalItem[] = [
  { id: '1', title: 'Goa Vacation Goal', targetAmount: 50000, currentAmount: 40000, deadline: '2026-09-30' },
  { id: '2', title: 'Emergency Fund', targetAmount: 200000, currentAmount: 150000, deadline: '2026-12-31' },
];

const DEMO_INVESTMENTS_SAMPLE: InvestmentItem[] = [
  { id: '1', name: 'Nifty 50 Index Fund', type: 'Mutual Fund', units: 450, buyPrice: 210, currentPrice: 280 },
  { id: '2', name: 'Reliance Industries', type: 'Stock', units: 50, buyPrice: 2400, currentPrice: 2950 },
];

const getInitialUserIdentifier = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('mm_user_email') || localStorage.getItem('mm_user_name') || '';
};

const getInitialUserData = <T,>(dataKey: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const uName = getInitialUserIdentifier();
    if (!uName) return fallback;
    const userSlug = uName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const key = `mm_usr_${userSlug}_${dataKey}`;
    const val = localStorage.getItem(key);
    if (val && val !== '[]') return JSON.parse(val);
  } catch {}
  return fallback;
};

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<AccountItem[]>(() => getInitialUserData('accounts', []));
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => getInitialUserData('expenses', []));
  const [income, setIncome] = useState<IncomeItem[]>(() => getInitialUserData('income', []));
  const [budgets, setBudgets] = useState<BudgetItem[]>(() => getInitialUserData('budgets', []));
  const [goals, setGoals] = useState<GoalItem[]>(() => getInitialUserData('goals', []));
  const [investments, setInvestments] = useState<InvestmentItem[]>(() => getInitialUserData('investments', []));
  const [currency, setCurrency] = useState<CurrencyCode>(() => getInitialUserData('currency', 'INR') as CurrencyCode);
  const [theme, setThemeState] = useState<ColorTheme>('emerald');
  const [userName, setUserNameState] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const savedName = localStorage.getItem('mm_user_name');
    const savedEmail = localStorage.getItem('mm_user_email');
    const userDisplayName = savedName || (savedEmail ? savedEmail.split('@')[0] : '');
    return userDisplayName ? userDisplayName.charAt(0).toUpperCase() + userDisplayName.slice(1) : '';
  });
  const [userEmail, setUserEmailState] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('mm_user_email') || '';
  });
  const [autoSavePct, setAutoSavePct] = useState<number>(10);
  const [autoSaveGoalId, setAutoSaveGoalId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // CONSISTENT IMMUTABLE STORAGE KEY HELPER
  const getUserKey = (dataKey: string, overrideIdentifier?: string): string => {
    if (typeof window === 'undefined') return `mm_${dataKey}`;
    const userIdentifier = overrideIdentifier || localStorage.getItem('mm_user_email') || localStorage.getItem('mm_user_name') || userName || 'user';
    const userSlug = userIdentifier.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `mm_usr_${userSlug}_${dataKey}`;
  };

  const getStorageItemWithFallback = (dataKey: string, targetName?: string): string | null => {
    if (typeof window === 'undefined') return null;

    const emailStr = localStorage.getItem('mm_user_email');
    if (emailStr) {
      const emailKey = getUserKey(dataKey, emailStr);
      const emailVal = localStorage.getItem(emailKey);
      if (emailVal && emailVal !== '[]') return emailVal;
    }
    
    const nameStr = targetName || localStorage.getItem('mm_user_name');
    if (nameStr) {
      const nameKey = getUserKey(dataKey, nameStr);
      const nameVal = localStorage.getItem(nameKey);
      if (nameVal && nameVal !== '[]') return nameVal;
    }

    return null;
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_user_name', name);
    }
    loadUserDataForUser(name);
  };

  const setUserEmail = (email: string) => {
    setUserEmailState(email);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_user_email', email);
    }
  };

  const workspaceName = `${userName || 'User'}'s Workspace`;

  const setTheme = (t: ColorTheme) => {
    setThemeState(t);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', t);
    }
    localStorage.setItem('mm_color_theme', t);
  };

  // LOAD ISOLATED USER DATA WITH UNIFIED FALLBACK PRESERVATION
  const loadUserDataForUser = (targetUserName?: string) => {
    try {
      const isLoadedDemo = localStorage.getItem('mm_demo_loaded') === 'true';
      const uName = targetUserName || localStorage.getItem('mm_user_name') || localStorage.getItem('mm_user_email') || userName;
      
      // 1. ACCOUNTS
      const keyAcc = getUserKey('accounts', uName);
      const savedAcc = getStorageItemWithFallback('accounts', uName);
      if (savedAcc) {
        setAccounts(JSON.parse(savedAcc));
      } else if (isLoadedDemo) {
        setAccounts(DEMO_ACCOUNTS_SAMPLE);
      } else {
        setAccounts([]);
      }

      // 2. EXPENSES
      const keyExp = getUserKey('expenses', uName);
      const savedExp = getStorageItemWithFallback('expenses', uName);
      if (savedExp) {
        setExpenses(JSON.parse(savedExp));
      } else if (isLoadedDemo) {
        setExpenses(DEMO_EXPENSES_SAMPLE);
      } else {
        setExpenses([]);
      }

      // 3. INCOME
      const keyInc = getUserKey('income', uName);
      const savedInc = getStorageItemWithFallback('income', uName);
      if (savedInc) {
        setIncome(JSON.parse(savedInc));
      } else if (isLoadedDemo) {
        setIncome(DEMO_INCOME_SAMPLE);
      } else {
        setIncome([]);
      }

      // 4. BUDGETS
      const keyBud = getUserKey('budgets', uName);
      const savedBud = getStorageItemWithFallback('budgets', uName);
      if (savedBud) {
        setBudgets(JSON.parse(savedBud));
      } else if (isLoadedDemo) {
        setBudgets(DEMO_BUDGETS_SAMPLE);
      } else {
        setBudgets([]);
      }

      // 5. GOALS
      const keyGoal = getUserKey('goals', uName);
      const savedGoal = getStorageItemWithFallback('goals', uName);
      if (savedGoal) {
        setGoals(JSON.parse(savedGoal));
      } else if (isLoadedDemo) {
        setGoals(DEMO_GOALS_SAMPLE);
      } else {
        setGoals([]);
      }

      // 6. INVESTMENTS
      const keyInv = getUserKey('investments', uName);
      const savedInv = getStorageItemWithFallback('investments', uName);
      if (savedInv) {
        setInvestments(JSON.parse(savedInv));
      } else if (isLoadedDemo) {
        setInvestments(DEMO_INVESTMENTS_SAMPLE);
      } else {
        setInvestments([]);
      }

      // 7. CURRENCY
      const keyCurr = getUserKey('currency', uName);
      const savedCurr = getStorageItemWithFallback('currency', uName) as CurrencyCode;
      if (savedCurr) {
        setCurrency(savedCurr);
      }

    } catch {
      // Clean fallback
    }
  };

  // PERSIST USER DATA SAFELY TO LOCALSTORAGE AND PRISMA DATABASE
  const persistUserData = (
    accs: AccountItem[] = accounts,
    exps: ExpenseItem[] = expenses,
    incs: IncomeItem[] = income,
    buds: BudgetItem[] = budgets,
    gls: GoalItem[] = goals,
    invs: InvestmentItem[] = investments,
    curr: CurrencyCode = currency
  ) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getUserKey('accounts'), JSON.stringify(accs));
      localStorage.setItem(getUserKey('expenses'), JSON.stringify(exps));
      localStorage.setItem(getUserKey('income'), JSON.stringify(incs));
      localStorage.setItem(getUserKey('budgets'), JSON.stringify(buds));
      localStorage.setItem(getUserKey('goals'), JSON.stringify(gls));
      localStorage.setItem(getUserKey('investments'), JSON.stringify(invs));
      localStorage.setItem(getUserKey('currency'), curr);

      fetch('/api/financials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts: accs, expenses: exps, income: incs, budgets: buds, goals: gls, currency: curr }),
      }).catch(() => {});
    } catch {
      // Storage safety catch
    }
  };

  // INSTANT HYDRATION & PARALLEL DATABASE SYNC
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('mm_user_email');
      const savedName = localStorage.getItem('mm_user_name');
      if (savedEmail) setUserEmailState(savedEmail);

      const userDisplayName = savedName || (savedEmail ? savedEmail.split('@')[0] : '');
      const finalName = userDisplayName ? userDisplayName.charAt(0).toUpperCase() + userDisplayName.slice(1) : '';
      
      if (finalName) {
        setUserNameState(finalName);
        loadUserDataForUser(finalName);
      }

      const savedTheme = localStorage.getItem('mm_color_theme') as ColorTheme;
      if (savedTheme) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }

      const savedAutoPct = localStorage.getItem('mm_autosave_pct');
      if (savedAutoPct) setAutoSavePct(parseFloat(savedAutoPct));
    } catch {
      // Clean fallback
    } finally {
      setIsHydrated(true);
    }

    // SILENT BACKGROUND DATABASE SYNC (NON-BLOCKING 0MS DELAY)
    fetch('/api/financials')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) return;
        if (data.user?.name) {
          setUserNameState(data.user.name);
          if (typeof window !== 'undefined') localStorage.setItem('mm_user_name', data.user.name);
        }
        if (data.user?.email) {
          setUserEmailState(data.user.email);
          if (typeof window !== 'undefined') localStorage.setItem('mm_user_email', data.user.email);
        }
        if (Array.isArray(data.accounts) && data.accounts.length > 0) setAccounts(data.accounts);
        if (Array.isArray(data.expenses) && data.expenses.length > 0) setExpenses(data.expenses);
        if (Array.isArray(data.income) && data.income.length > 0) setIncome(data.income);
        if (Array.isArray(data.budgets) && data.budgets.length > 0) setBudgets(data.budgets);
        if (Array.isArray(data.goals) && data.goals.length > 0) setGoals(data.goals);
        if (data.settings?.currency) setCurrency(data.settings.currency);
      })
      .catch(() => {});
  }, []);

  // FORMAT CURRENCY HELPER
  const formatCurrency = (amountInINR: number): string => {
    switch (currency) {
      case 'USD':
        return `$${(amountInINR / 85).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'EUR':
        return `€${(amountInINR / 92).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'GBP':
        return `£${(amountInINR / 108).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      default:
        return `₹${amountInINR.toLocaleString('en-IN')}`;
    }
  };

  // AUTOMATED REAL-TIME ACCOUNT BALANCE UPDATER FOR INCOMING & OUTGOING TRANSACTIONS
  const updatePrimaryAccountBalance = (deltaAmount: number) => {
    setAccounts(prevAccounts => {
      if (prevAccounts.length === 0) {
        // Automatically provision primary bank account if none exists
        return [{
          id: Date.now().toString(),
          name: 'HDFC Savings Account',
          institution: 'HDFC Bank',
          type: 'bank',
          accountNumberOrVpa: '•••• 4892',
          balance: Math.max(0, deltaAmount),
          color: '#00FF9D',
          lastSynced: 'Just now'
        }];
      }

      // Update the first bank/wallet account or primary account
      const targetIdx = prevAccounts.findIndex(a => a.type === 'bank' || a.type === 'upi') !== -1 
        ? prevAccounts.findIndex(a => a.type === 'bank' || a.type === 'upi')
        : 0;

      return prevAccounts.map((acc, idx) => {
        if (idx === targetIdx) {
          const updatedBal = Math.max(0, acc.balance + deltaAmount);
          return { ...acc, balance: updatedBal, lastSynced: 'Just now' };
        }
        return acc;
      });
    });
  };

  // ACTIONS WITH AUTOMATED BALANCE CALCULATION & EXPLICIT PERSISTENCE
  const addAccount = (item: Omit<AccountItem, 'id'>) => {
    const nextAccs = [...accounts, { ...item, id: Date.now().toString() }];
    setAccounts(nextAccs);
    persistUserData(nextAccs, expenses, income, budgets, goals, investments, currency);
  };
  const editAccount = (id: string, updated: Partial<AccountItem>) => {
    const nextAccs = accounts.map(a => a.id === id ? { ...a, ...updated } : a);
    setAccounts(nextAccs);
    persistUserData(nextAccs, expenses, income, budgets, goals, investments, currency);
  };
  const deleteAccount = (id: string) => {
    const nextAccs = accounts.filter(a => a.id !== id);
    setAccounts(nextAccs);
    persistUserData(nextAccs, expenses, income, budgets, goals, investments, currency);
  };

  const addExpense = (item: Omit<ExpenseItem, 'id'>) => {
    const nextExps = [{ ...item, id: Date.now().toString() }, ...expenses];
    setExpenses(nextExps);
    updatePrimaryAccountBalance(-item.amount);
    persistUserData(accounts, nextExps, income, budgets, goals, investments, currency);
  };

  const editExpense = (id: string, updated: Partial<ExpenseItem>) => {
    const existing = expenses.find(e => e.id === id);
    if (existing && updated.amount !== undefined) {
      const diff = updated.amount - existing.amount;
      updatePrimaryAccountBalance(-diff);
    }
    const nextExps = expenses.map(e => e.id === id ? { ...e, ...updated } : e);
    setExpenses(nextExps);
    persistUserData(accounts, nextExps, income, budgets, goals, investments, currency);
  };

  const deleteExpense = (id: string) => {
    const existing = expenses.find(e => e.id === id);
    if (existing) {
      updatePrimaryAccountBalance(existing.amount);
    }
    const nextExps = expenses.filter(e => e.id !== id);
    setExpenses(nextExps);
    persistUserData(accounts, nextExps, income, budgets, goals, investments, currency);
  };

  const addIncome = (item: Omit<IncomeItem, 'id'>) => {
    const nextIncs = [{ ...item, id: Date.now().toString() }, ...income];
    setIncome(nextIncs);
    updatePrimaryAccountBalance(item.amount);

    if (autoSavePct > 0 && goals.length > 0) {
      const targetGoal = autoSaveGoalId ? goals.find(g => g.id === autoSaveGoalId) : goals[0];
      if (targetGoal) {
        const autoCushionAmount = Math.round(item.amount * (autoSavePct / 100));
        depositGoal(targetGoal.id, autoCushionAmount);
      }
    }
    persistUserData(accounts, expenses, nextIncs, budgets, goals, investments, currency);
  };

  const editIncome = (id: string, updated: Partial<IncomeItem>) => {
    const existing = income.find(i => i.id === id);
    if (existing && updated.amount !== undefined) {
      const diff = updated.amount - existing.amount;
      updatePrimaryAccountBalance(diff);
    }
    const nextIncs = income.map(i => i.id === id ? { ...i, ...updated } : i);
    setIncome(nextIncs);
    persistUserData(accounts, expenses, nextIncs, budgets, goals, investments, currency);
  };

  const deleteIncome = (id: string) => {
    const existing = income.find(i => i.id === id);
    if (existing) {
      updatePrimaryAccountBalance(-existing.amount);
    }
    const nextIncs = income.filter(i => i.id !== id);
    setIncome(nextIncs);
    persistUserData(accounts, expenses, nextIncs, budgets, goals, investments, currency);
  };

  const setBudget = (category: string, allocated: number) => {
    let nextBuds: BudgetItem[] = [];
    const exists = budgets.find(b => b.category.toLowerCase() === category.toLowerCase());
    if (exists) {
      nextBuds = budgets.map(b => b.category.toLowerCase() === category.toLowerCase() ? { ...b, allocated } : b);
    } else {
      nextBuds = [...budgets, { id: Date.now().toString(), category, allocated }];
    }
    setBudgets(nextBuds);
    persistUserData(accounts, expenses, income, nextBuds, goals, investments, currency);
  };

  const deleteBudget = (id: string) => {
    const nextBuds = budgets.filter(b => b.id !== id);
    setBudgets(nextBuds);
    persistUserData(accounts, expenses, income, nextBuds, goals, investments, currency);
  };

  const addGoal = (item: Omit<GoalItem, 'id' | 'currentAmount'>) => {
    const nextGoals = [...goals, { ...item, id: Date.now().toString(), currentAmount: 0 }];
    setGoals(nextGoals);
    persistUserData(accounts, expenses, income, budgets, nextGoals, investments, currency);
  };
  const depositGoal = (id: string, amount: number) => {
    const nextGoals = goals.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g);
    setGoals(nextGoals);
    persistUserData(accounts, expenses, income, budgets, nextGoals, investments, currency);
  };
  const deleteGoal = (id: string) => {
    const nextGoals = goals.filter(g => g.id !== id);
    setGoals(nextGoals);
    persistUserData(accounts, expenses, income, budgets, nextGoals, investments, currency);
  };

  const addInvestment = (item: Omit<InvestmentItem, 'id'>) => {
    const nextInvs = [...investments, { ...item, id: Date.now().toString() }];
    setInvestments(nextInvs);
    persistUserData(accounts, expenses, income, budgets, goals, nextInvs, currency);
  };
  const editInvestment = (id: string, updated: Partial<InvestmentItem>) => {
    const nextInvs = investments.map(i => i.id === id ? { ...i, ...updated } : i);
    setInvestments(nextInvs);
    persistUserData(accounts, expenses, income, budgets, goals, nextInvs, currency);
  };
  const deleteInvestment = (id: string) => {
    const nextInvs = investments.filter(i => i.id !== id);
    setInvestments(nextInvs);
    persistUserData(accounts, expenses, income, budgets, goals, nextInvs, currency);
  };

  const clearAllData = () => {
    if (typeof window !== 'undefined') {
      const uName = localStorage.getItem('mm_user_email') || localStorage.getItem('mm_user_name') || userName;
      localStorage.removeItem(getUserKey('accounts', uName));
      localStorage.removeItem(getUserKey('expenses', uName));
      localStorage.removeItem(getUserKey('income', uName));
      localStorage.removeItem(getUserKey('budgets', uName));
      localStorage.removeItem(getUserKey('goals', uName));
      localStorage.removeItem(getUserKey('investments', uName));
      localStorage.removeItem(getUserKey('currency', uName));
      localStorage.removeItem('mm_demo_loaded');
    }
    setAccounts([]);
    setExpenses([]);
    setIncome([]);
    setBudgets([]);
    setGoals([]);
    setInvestments([]);
  };

  const loadDemoData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_demo_loaded', 'true');
    }
    setAccounts(DEMO_ACCOUNTS_SAMPLE);
    setExpenses(DEMO_EXPENSES_SAMPLE);
    setIncome(DEMO_INCOME_SAMPLE);
    setBudgets(DEMO_BUDGETS_SAMPLE);
    setGoals(DEMO_GOALS_SAMPLE);
    setInvestments(DEMO_INVESTMENTS_SAMPLE);
    persistUserData(
      DEMO_ACCOUNTS_SAMPLE,
      DEMO_EXPENSES_SAMPLE,
      DEMO_INCOME_SAMPLE,
      DEMO_BUDGETS_SAMPLE,
      DEMO_GOALS_SAMPLE,
      DEMO_INVESTMENTS_SAMPLE,
      currency
    );
  };

  // REAL-TIME ANALYTICS CALCULATIONS
  const totalBankBalance = accounts
    .filter(a => a.type !== 'credit')
    .reduce((acc, curr) => acc + curr.balance, 0);

  const totalCreditDebt = accounts
    .filter(a => a.type === 'credit')
    .reduce((acc, curr) => acc + curr.balance, 0);

  const totalInvestmentValue = investments
    .reduce((acc, curr) => acc + (curr.units * curr.currentPrice), 0);

  const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const netWorth = (totalBankBalance + totalInvestmentValue) - totalCreditDebt;
  const savingsRate = totalIncome > 0 
    ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)) 
    : 0;

  // DYNAMIC AI INSIGHT GENERATOR
  const aiInsights: string[] = [];
  if (totalExpenses > totalIncome && totalIncome > 0) {
    aiInsights.push(`⚠️ Alert: Your total expenses (${formatCurrency(totalExpenses)}) exceed your total income (${formatCurrency(totalIncome)}) by ${formatCurrency(totalExpenses - totalIncome)}.`);
  } else if (savingsRate >= 50) {
    aiInsights.push(`🎉 Outstanding: Your savings rate is ${savingsRate}%. You are in the top 5% of disciplined savers!`);
  } else if (savingsRate > 0) {
    aiInsights.push(`📈 Good Progress: You saved ${savingsRate}% of your total income (${formatCurrency(totalIncome - totalExpenses)}).`);
  }

  if (accounts.length === 0) {
    aiInsights.push(`ℹ️ Start by adding your bank accounts or wallet balances under the 'Accounts' tab.`);
  }

  return (
    <FinancialContext.Provider value={{
      accounts, expenses, income, budgets, goals, investments,
      currency, setCurrency, formatCurrency,
      theme, setTheme,
      userName, setUserName, userEmail, setUserEmail, workspaceName,
      autoSavePct, setAutoSavePct, autoSaveGoalId, setAutoSaveGoalId,
      addAccount, editAccount, deleteAccount,
      addExpense, editExpense, deleteExpense,
      addIncome, editIncome, deleteIncome,
      setBudget, deleteBudget,
      addGoal, depositGoal, deleteGoal,
      addInvestment, editInvestment, deleteInvestment,
      clearAllData, loadDemoData,
      totalBankBalance, totalInvestmentValue, totalIncome, totalExpenses,
      netWorth, savingsRate, aiInsights, isHydrated
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
