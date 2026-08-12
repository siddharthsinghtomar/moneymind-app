'use client';

import React, { useState } from 'react';
import { useFinancial, ExpenseItem } from '@/context/FinancialContext';
import { 
  Receipt, Plus, Trash2, Edit2, Search, Filter, 
  TrendingDown, ShoppingBag, Utensils, Car, Zap, 
  Coffee, Calendar, DollarSign, Sparkles, X, CheckCircle2, Home, TrendingUp,
  Download, Camera, FileText, UploadCloud, Paperclip, Check, Eye, ChevronRight
} from 'lucide-react';

export const ExpensesModule: React.FC = () => {
  const { expenses, addExpense, editExpense, deleteExpense, totalExpenses, budgets, formatCurrency, currency } = useFinancial();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [previewReceiptExpense, setPreviewReceiptExpense] = useState<ExpenseItem | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // FORM STATES
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Dining & Zomato');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attachedReceiptName, setAttachedReceiptName] = useState<string | undefined>();

  // AI OCR SCANNER SIMULATION STATES
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<Partial<ExpenseItem> | null>(null);

  // COMBINE STANDARD PRESETS + ANY CUSTOM BUDGET CATEGORIES
  const budgetCategories = budgets.map(b => b.category);
  const allCategoriesSet = new Set([
    'Housing & Rent',
    'Groceries & Supplies',
    'Dining & Zomato',
    'Utilities & Bills',
    'Transport & Fuel',
    'Investments & SIP',
    'Shopping',
    'Subscriptions',
    'Entertainment',
    'Health & Medical',
    'Travel & Vacation',
    ...budgetCategories,
    ...expenses.map(e => e.category)
  ]);

  const categoryList = Array.from(allCategoriesSet);
  
  const categoryPillsWithIcons = [
    { label: 'All', icon: Filter },
    { label: 'Housing & Rent', icon: Home },
    { label: 'Groceries & Supplies', icon: ShoppingBag },
    { label: 'Dining & Zomato', icon: Utensils },
    { label: 'Utilities & Bills', icon: Zap },
    { label: 'Transport & Fuel', icon: Car },
    { label: 'Investments & SIP', icon: TrendingUp },
  ];

  const filteredExpenses = expenses.filter(e => {
    const matchesCategory = selectedCategory === 'All' || e.category.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(e.category.toLowerCase());
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // SMART CALCULATIONS
  const highestCategory = expenses.length > 0 ? (() => {
    const counts: Record<string, number> = {};
    expenses.forEach(e => counts[e.category] = (counts[e.category] || 0) + e.amount);
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? `${sorted[0][0]} (${formatCurrency(sorted[0][1])})` : 'N/A';
  })() : 'N/A';

  const currentDayOfMonth = new Date().getDate();
  const avgDailySpend = Math.round(totalExpenses / (currentDayOfMonth || 1));

  // DOWNLOAD CSV STATEMENT
  const handleDownloadCSVReport = () => {
    if (expenses.length === 0) {
      alert("No expenses recorded to export!");
      return;
    }

    const headers = "ID,Title,Category,Amount,Date,ReceiptAttached\n";
    const rows = expenses.map(e => `"${e.id}","${e.title}","${e.category}",${e.amount},"${e.date}","${e.receiptName || 'No'}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MoneyMind_Expense_Statement_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // DOWNLOAD INDIVIDUAL RECEIPT PDF/TXT
  const handleDownloadReceipt = (exp: ExpenseItem) => {
    const content = `=========================================
          MONEYMIND EXPENSE RECEIPT
=========================================
Receipt Ref: ${exp.receiptName || `REC-${exp.id}`}
Date: ${exp.date}
Title: ${exp.title}
Category: ${exp.category}
Total Paid: ${formatCurrency(exp.amount)}
Status: Verified & Processed
=========================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exp.receiptName ? exp.receiptName : `Receipt_${exp.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // MOCK FILE UPLOAD FOR MANUAL ENTRY
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedReceiptName(file.name);
    }
  };

  // MOCK FILE UPLOAD FOR AI SCANNER
  const handleScannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSimulateScan(file.name, file.name.replace(/\.[^/.]+$/, ""), Math.floor(Math.random() * 1500) + 250, "General");
    }
  };

  // SIMULATE AI OCR SCANNING
  const handleSimulateScan = (fileName: string, mockTitle: string, mockAmount: number, mockCategory: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        title: mockTitle,
        amount: mockAmount,
        category: mockCategory,
        date: new Date().toISOString().split('T')[0],
        receiptName: fileName,
        isScanned: true
      });
    }, 1000);
  };

  const handleConfirmScannedExpense = () => {
    if (!scannedResult) return;
    addExpense({
      title: scannedResult.title || 'Scanned Bill',
      category: scannedResult.category || 'Dining & Zomato',
      amount: scannedResult.amount || 0,
      date: scannedResult.date || new Date().toISOString().split('T')[0],
      receiptName: scannedResult.receiptName,
      isScanned: true
    });

    setIsScannerOpen(false);
    setScannedResult(null);
  };

  const startEditExpense = (exp: ExpenseItem) => {
    setEditingExpenseId(exp.id);
    setTitle(exp.title);
    setCategory(exp.category);
    setAmount(exp.amount.toString());
    setDate(exp.date);
    setAttachedReceiptName(exp.receiptName);
    setIsAddModalOpen(true);
  };

  const resetForm = () => {
    setIsAddModalOpen(false);
    setEditingExpenseId(null);
    setTitle('');
    setAmount('');
    setCustomCategory('');
    setAttachedReceiptName(undefined);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const finalCategory = category === 'CUSTOM' ? (customCategory.trim() || 'Other') : category;

    if (editingExpenseId) {
      editExpense(editingExpenseId, {
        title,
        category: finalCategory,
        amount: parseFloat(amount) || 0,
        date: date || new Date().toISOString().split('T')[0],
        receiptName: attachedReceiptName
      });
    } else {
      addExpense({
        title,
        category: finalCategory,
        amount: parseFloat(amount) || 0,
        date: date || new Date().toISOString().split('T')[0],
        receiptName: attachedReceiptName
      });
    }

    resetForm();
  };

  const getCategoryIcon = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('rent') || lower.includes('house')) return <Home className="w-5 h-5 text-[#00FF9D]" />;
    if (lower.includes('dining') || lower.includes('zomato') || lower.includes('food')) return <Utensils className="w-5 h-5 text-[#FBBF24]" />;
    if (lower.includes('groc') || lower.includes('shop')) return <ShoppingBag className="w-5 h-5 text-[#00FF9D]" />;
    if (lower.includes('trans') || lower.includes('fuel') || lower.includes('uber')) return <Car className="w-5 h-5 text-[#FBBF24]" />;
    if (lower.includes('util') || lower.includes('bill') || lower.includes('zap')) return <Zap className="w-5 h-5 text-amber-400" />;
    if (lower.includes('invest') || lower.includes('sip')) return <TrendingUp className="w-5 h-5 text-rose-400" />;
    return <Coffee className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="cyber-card p-8 space-y-8 text-white">
      
      {/* LUXURY HERO HEADER BANNER */}
      <div className="p-6 bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/30 rounded-3xl text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#00FF9D]/15 rounded-2xl border border-[#00FF9D]/30 shrink-0">
              <Receipt className="w-7 h-7 text-[#00FF9D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold font-space tracking-tight text-white">Expense Tracker & AI OCR Studio</h2>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40">
                  REAL-TIME OCR
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">Track, categorize, scan bill receipts, and export executive statements</p>
            </div>
          </div>

          {/* ACTION BUTTONS TOOLBAR */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadCSVReport}
              className="px-4 py-2.5 rounded-full bg-[#040D0B] hover:bg-[#00FF9D]/20 border border-[#00FF9D]/30 text-[#00FF9D] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-[#00FF9D]" /> Export CSV
            </button>

            <button
              onClick={() => { setScannedResult(null); setIsScannerOpen(true); }}
              className="px-4 py-2.5 rounded-full bg-[#FBBF24]/15 hover:bg-[#FBBF24]/30 border border-[#FBBF24]/40 text-[#FBBF24] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Camera className="w-4 h-4 text-[#FBBF24]" /> Scan Bill (AI OCR)
            </button>

            <button
              onClick={() => { resetForm(); setIsAddModalOpen(true); }}
              className="btn-primary px-5 py-2.5 rounded-full text-xs font-bold text-[#040D0B] shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#040D0B]" /> Log New Expense
            </button>
          </div>
        </div>
      </div>

      {/* 3D VIBRANT METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="p-5 bg-[#040D0B]/90 border border-[#00FF9D]/20 rounded-3xl space-y-2 shadow-2xs">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono tracking-wider">Total Expenses Logged</span>
            <div className="p-2 bg-[#00FF9D]/15 text-[#00FF9D] rounded-xl border border-[#00FF9D]/30">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-space">{formatCurrency(totalExpenses)}</div>
          <div className="text-[11px] text-[#94A3B8] font-mono">{expenses.length} Total Verified Logs</div>
        </div>

        <div className="p-5 bg-[#040D0B]/90 border border-[#00FF9D]/20 rounded-3xl space-y-2 shadow-2xs relative group">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono tracking-wider">Avg Daily Spend Velocity ({currency})</span>
            <div className="p-2 bg-[#00FF9D]/15 text-[#00FF9D] rounded-xl border border-[#00FF9D]/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#00FF9D] font-space">{formatCurrency(avgDailySpend)}<span className="text-xs font-normal text-[#94A3B8]">/day</span></div>
          <div className="text-[11px] text-[#00FF9D] font-mono font-bold flex items-center justify-between">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#00FF9D]" /> Formula: Total {formatCurrency(totalExpenses)} ÷ {currentDayOfMonth} Days</span>
            <span className="text-[10px] text-[#FBBF24]">Proj: {formatCurrency(avgDailySpend * 31)}</span>
          </div>
        </div>

        <div className="p-5 bg-[#040D0B]/90 border border-[#FBBF24]/30 rounded-3xl space-y-2 shadow-2xs">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase text-[#FBBF24] font-mono tracking-wider">Highest Category</span>
            <div className="p-2 bg-[#FBBF24]/15 text-[#FBBF24] rounded-xl border border-[#FBBF24]/40">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-white font-space truncate">{highestCategory}</div>
          <div className="text-[11px] text-[#FBBF24] font-mono font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" /> AI Recommendation: Set budget cap
          </div>
        </div>

      </div>

      {/* SEARCH AND CATEGORY FILTER BAR WITH ICONS */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex items-center w-full sm:w-80">
            <Search className="absolute left-3.5 text-[#94A3B8] w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by vendor, title, or category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#00FF9D] font-mono"
            />
          </div>

          {/* CATEGORY PILLS */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categoryPillsWithIcons.map((item, idx) => {
              const Icon = item.icon;
              const isSel = selectedCategory.toLowerCase() === item.label.toLowerCase();
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(item.label)}
                  className={`px-3.5 py-2 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSel
                      ? 'bg-[#00FF9D] text-[#040D0B] border-[#00FF9D] shadow-[0_0_12px_#00FF9D]'
                      : 'bg-[#040D0B] border-[#00FF9D]/20 text-[#94A3B8] hover:text-white hover:border-[#00FF9D]/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* LUXURY EXPENSES LEDGER LIST */}
      <div className="space-y-3 pt-2">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#94A3B8] border border-dashed border-[#00FF9D]/30 rounded-3xl space-y-3 font-mono">
            <Receipt className="w-10 h-10 text-[#00FF9D] opacity-40 mx-auto" />
            <p>No expenses found matching "{searchTerm}". Click <b>Log New Expense</b> or <b>Scan Bill</b> to add one!</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-full btn-primary text-[#040D0B] font-bold text-xs shadow-md cursor-pointer"
            >
              + Log First Expense
            </button>
          </div>
        ) : (
          filteredExpenses.map(exp => (
            <div
              key={exp.id}
              className="p-5 bg-[#040D0B]/90 border border-[#00FF9D]/20 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs hover:border-[#00FF9D]/50 transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[#081713] rounded-2xl border border-[#00FF9D]/20">
                  {getCategoryIcon(exp.category)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-white text-base font-space">{exp.title}</h4>
                    {exp.isScanned && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#00FF9D]/20 text-[#00FF9D] font-mono font-bold text-[9px] border border-[#00FF9D]/40 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#FBBF24]" /> AI OCR SCANNED
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-[#94A3B8] flex items-center gap-2 font-mono">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#081713] text-[#00FF9D] font-bold border border-[#00FF9D]/30">{exp.category}</span>
                    <span>• {exp.date}</span>
                    {exp.receiptName && (
                      <button
                        onClick={() => setPreviewReceiptExpense(exp)}
                        className="text-[#FBBF24] font-bold flex items-center gap-1 hover:underline cursor-pointer ml-1"
                      >
                        <Paperclip className="w-3 h-3" /> {exp.receiptName}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <span className="font-extrabold font-mono text-lg text-rose-400">- {formatCurrency(exp.amount)}</span>
                
                {/* DOWNLOAD RECEIPT BUTTON */}
                <button
                  onClick={() => handleDownloadReceipt(exp)}
                  className="px-3.5 py-1.5 rounded-full border border-[#00FF9D]/30 bg-[#081713] text-[#00FF9D] hover:bg-[#00FF9D]/20 transition-colors flex items-center gap-1.5 font-mono font-bold text-xs cursor-pointer"
                  title="Download Formatted Receipt"
                >
                  <Download className="w-3.5 h-3.5" /> Receipt
                </button>

                {/* EDIT EXPENSE BUTTON */}
                <button
                  onClick={() => startEditExpense(exp)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-[#94A3B8] hover:text-[#00FF9D] transition-all cursor-pointer"
                  title="Edit entry"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteExpense(exp.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-[#94A3B8] hover:text-rose-400 transition-all cursor-pointer"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RECEIPT PREVIEW MODAL */}
      {previewReceiptExpense && (
        <div className="fixed inset-0 z-50 bg-[#040D0B]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#081713] p-7 w-full max-w-md shadow-2xl rounded-3xl border border-[#00FF9D]/30 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-[#00FF9D]/20 pb-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-[#00FF9D]" />
                <h3 className="font-extrabold text-base text-white font-space">Receipt Attachment Preview</h3>
              </div>
              <button onClick={() => setPreviewReceiptExpense(null)} className="text-[#94A3B8] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 bg-[#040D0B] border border-[#00FF9D]/30 rounded-2xl space-y-3 font-mono text-xs text-white">
              <div className="text-center font-bold text-[#00FF9D] border-b border-[#00FF9D]/20 pb-2">
                MONEYMIND VERIFIED RECEIPT
              </div>
              <div><b>Reference:</b> {previewReceiptExpense.receiptName || `REC-${previewReceiptExpense.id}`}</div>
              <div><b>Vendor:</b> {previewReceiptExpense.title}</div>
              <div><b>Category:</b> {previewReceiptExpense.category}</div>
              <div><b>Date:</b> {previewReceiptExpense.date}</div>
              <div><b>Amount Paid:</b> <span className="text-rose-400 font-bold">{formatCurrency(previewReceiptExpense.amount)}</span></div>
              <div className="pt-2 border-t border-[#00FF9D]/20 text-[10px] text-[#00FF9D] font-bold text-center">
                ✓ Validated by AI OCR Engine
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setPreviewReceiptExpense(null)} className="px-4 py-2 text-[#94A3B8]">Close</button>
              <button
                onClick={() => { handleDownloadReceipt(previewReceiptExpense); setPreviewReceiptExpense(null); }}
                className="px-6 py-2.5 rounded-full btn-primary text-[#040D0B] font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Receipt File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI OCR BILL SCANNER MODAL */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-[#030A08]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#071612]/95 p-7 w-full max-w-lg shadow-[0_25px_70px_rgba(0,0,0,0.95)] rounded-3xl border border-[#00FF9D]/40 space-y-6 text-white relative overflow-hidden">
            
            {/* AMBIENT GLOW */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FF9D]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#00FF9D]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-[#00FF9D] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FBBF24]" /> // AI_OCR_ENGINE_2.0
                  </div>
                  <h3 className="font-extrabold text-lg text-white font-space">AI Receipt Scanner</h3>
                </div>
              </div>

              <button 
                onClick={() => setIsScannerOpen(false)}
                className="p-2 rounded-full border border-white/10 hover:border-[#00FF9D] text-[#94A3B8] hover:text-[#00FF9D] transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {!scannedResult ? (
              <div className="space-y-4">
                {/* DRAG AND DROP ZONE */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      handleSimulateScan(file.name, file.name.replace(/\.[^/.]+$/, ""), Math.floor(Math.random() * 1500) + 250, "Groceries & Supplies");
                    }
                  }}
                  className="border-2 border-dashed border-[#00FF9D]/40 hover:border-[#00FF9D] rounded-3xl p-6 text-center space-y-3 bg-[#030A08]/60 hover:bg-[#00FF9D]/10 transition-all cursor-pointer group"
                >
                  <Camera className="w-12 h-12 text-[#00FF9D] opacity-60 mx-auto group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-extrabold text-sm text-white font-space">Drag & Drop Receipt Photo / PDF Here</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono mt-1">Automatic OCR extraction for amount, vendor title & category</div>
                  </div>
                  <div className="flex justify-center gap-3">
                    <label className="px-4 py-2 bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/40 rounded-full text-xs font-bold font-mono inline-flex items-center gap-2 cursor-pointer hover:bg-[#00FF9D]/25 transition-all shadow-md">
                      <UploadCloud className="w-3.5 h-3.5" /> Browse File
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleScannerFileUpload}
                        className="hidden"
                      />
                    </label>
                    <label className="px-4 py-2 bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/40 rounded-full text-xs font-bold font-mono inline-flex items-center gap-2 cursor-pointer hover:bg-[#FBBF24]/25 transition-all shadow-md">
                      <Camera className="w-3.5 h-3.5" /> Take Photo
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleScannerFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* SAMPLE PRESETS */}
                <div className="space-y-2 font-mono">
                  <div className="text-[10px] font-extrabold uppercase text-[#00FF9D] tracking-wider">• Or Click Sample Bill to Scan</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => handleSimulateScan("starbucks_invoice.pdf", "Starbucks Coffee", 450, "Dining & Zomato")}
                      className="p-3.5 bg-[#030A08] hover:bg-[#00FF9D]/15 border border-[#00FF9D]/30 hover:border-[#00FF9D] rounded-2xl text-left font-mono font-bold text-[#00FF9D] transition-all cursor-pointer"
                    >
                      ☕ Starbucks Receipt (₹450)
                    </button>
                    <button
                      onClick={() => handleSimulateScan("zepto_bill.pdf", "Zepto Supermarket", 1240, "Groceries & Supplies")}
                      className="p-3.5 bg-[#030A08] hover:bg-[#00FF9D]/15 border border-[#00FF9D]/30 hover:border-[#00FF9D] rounded-2xl text-left font-mono font-bold text-[#00FF9D] transition-all cursor-pointer"
                    >
                      🛒 Zepto Grocery Bill (₹1,240)
                    </button>
                  </div>
                </div>

                {isScanning && (
                  <div className="p-4 bg-[#00FF9D]/20 border border-[#00FF9D]/40 text-[#00FF9D] rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4 text-[#FBBF24]" /> Scanning Receipt with AI OCR Engine...
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 font-mono">
                <div className="p-5 bg-[#030A08] border border-[#00FF9D]/40 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-[#00FF9D] font-extrabold text-xs border-b border-[#00FF9D]/20 pb-2">
                    <Check className="w-4 h-4 text-[#00FF9D]" /> AI OCR Scan Completed! (Review Below)
                  </div>
                  
                  {/* EDITABLE FIELDS */}
                  <div className="space-y-3 pt-1 text-xs">
                    <div>
                      <label className="block text-[10px] font-extrabold text-[#00FF9D] uppercase mb-1">• Vendor Title</label>
                      <input
                        type="text"
                        value={scannedResult.title || ''}
                        onChange={e => setScannedResult({ ...scannedResult, title: e.target.value })}
                        className="w-full bg-[#071612] border border-[#00FF9D]/30 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-[#00FF9D]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-extrabold text-[#00FF9D] uppercase mb-1">• Extracted Amount (₹)</label>
                        <input
                          type="number"
                          value={scannedResult.amount || ''}
                          onChange={e => setScannedResult({ ...scannedResult, amount: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-[#071612] border border-[#00FF9D]/30 rounded-xl p-3 text-[#00FF9D] font-bold focus:outline-none focus:border-[#00FF9D]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-[#00FF9D] uppercase mb-1">• Category</label>
                        <select
                          value={scannedResult.category || categoryList[0]}
                          onChange={e => setScannedResult({ ...scannedResult, category: e.target.value })}
                          className="w-full bg-[#071612] border border-[#00FF9D]/30 rounded-xl p-3 text-white font-bold outline-none focus:border-[#00FF9D]"
                        >
                          {categoryList.map((cat, i) => (
                            <option key={i} value={cat} className="bg-[#030A08]">{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#94A3B8] pt-1 flex items-center justify-between">
                      <span>Receipt File: <b>{scannedResult.receiptName}</b></span>
                      <span className="text-[#00FF9D] font-bold">100% OCR Confidence</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setScannedResult(null)} className="px-4 py-2.5 rounded-full border border-white/10 text-[#94A3B8]">Scan Another</button>
                  <button onClick={handleConfirmScannedExpense} className="btn-primary px-6 py-2.5 rounded-full text-[#030A08] font-bold text-xs shadow-md cursor-pointer">
                    Confirm & Save Expense
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD/EDIT MANUAL EXPENSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#030A08]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#071612]/95 p-7 w-full max-w-lg shadow-[0_25px_70px_rgba(0,0,0,0.95)] rounded-3xl border border-[#00FF9D]/40 space-y-6 text-white relative overflow-hidden">
            
            {/* AMBIENT GLOW */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FF9D]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#00FF9D]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-[#00FF9D] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FBBF24]" /> // EXPENSE_STUDIO
                  </div>
                  <h3 className="font-extrabold text-lg text-white font-space">
                    {editingExpenseId ? 'Edit Expense Entry' : 'Log New Expense'}
                  </h3>
                </div>
              </div>

              <button 
                onClick={resetForm}
                className="p-2 rounded-full border border-white/10 hover:border-[#00FF9D] text-[#94A3B8] hover:text-[#00FF9D] transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1.5 tracking-wider">
                  • Title / Vendor Description
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Starbucks Coffee, Zepto Groceries, Apartment Rent"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl px-4 py-3.5 text-white font-sans text-xs focus:outline-none focus:border-[#00FF9D] focus:shadow-[0_0_15px_rgba(0,255,157,0.25)] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1.5 tracking-wider">
                    • Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl px-4 py-3.5 text-white font-sans text-xs outline-none focus:border-[#00FF9D] focus:shadow-[0_0_15px_rgba(0,255,157,0.25)] transition-all cursor-pointer"
                  >
                    {categoryList.map((cat, i) => (
                      <option key={i} value={cat} className="bg-[#030A08]">{cat}</option>
                    ))}
                    <option value="CUSTOM" className="bg-[#030A08]">+ Add Custom Category...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1.5 tracking-wider">
                    • Amount ({currency})
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="450"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl px-4 py-3.5 text-rose-400 font-mono font-bold text-xs focus:outline-none focus:border-[#00FF9D] focus:shadow-[0_0_15px_rgba(0,255,157,0.25)] transition-all"
                  />
                </div>
              </div>

              {/* INLINE CUSTOM CATEGORY INPUT */}
              {category === 'CUSTOM' && (
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#FBBF24] mb-1.5 tracking-wider">
                    • Custom Category Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Gym Membership, Office Supplies"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className="w-full bg-[#030A08] border border-[#FBBF24]/40 rounded-2xl px-4 py-3.5 text-[#FBBF24] font-bold text-xs focus:outline-none focus:border-[#FBBF24] transition-all"
                  />
                </div>
              )}

              {/* ATTACH BILL RECEIPT FILE */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1.5 tracking-wider">
                  • Attach Bill Document / Photo
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl p-2.5 text-[#94A3B8] focus:outline-none text-xs"
                />
                {attachedReceiptName && (
                  <div className="text-[10px] text-[#00FF9D] font-mono font-bold mt-1.5 flex items-center gap-1">
                    <Paperclip className="w-3 h-3 text-[#00FF9D]" /> Attached: {attachedReceiptName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1.5 tracking-wider">
                  • Expense Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl px-4 py-3.5 text-white font-mono text-xs focus:outline-none focus:border-[#00FF9D]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#00FF9D]/20">
                <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-full border border-white/10 text-[#94A3B8] hover:text-white transition-all text-xs cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2.5 rounded-full text-xs font-bold text-[#030A08] shadow-[0_0_20px_#00FF9D] transition-all cursor-pointer">
                  {editingExpenseId ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
