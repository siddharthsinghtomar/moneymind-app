'use client';

import React, { useState } from 'react';
import { useFinancial, AccountItem } from '@/context/FinancialContext';
import { CreditCard, Plus, Trash2, Edit2, X, AlertCircle, CheckCircle2, ShieldCheck, DollarSign, Calendar } from 'lucide-react';

export const CreditCardsModule: React.FC = () => {
  const { accounts, addAccount, deleteAccount, formatCurrency, currency } = useFinancial();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [bankName, setBankName] = useState('');
  const [last4Digits, setLast4Digits] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');

  const creditCardAccounts = accounts.filter(a => a.type === 'credit');
  const totalCreditDebt = creditCardAccounts.reduce((acc, curr) => acc + curr.balance, 0);

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !currentBalance) return;

    addAccount({
      name: bankName,
      institution: bankName,
      type: 'credit',
      balance: parseFloat(currentBalance) || 0,
      accountNumberOrVpa: last4Digits ? `•••• ${last4Digits}` : '•••• 8821',
      color: '#EF4444',
      lastSynced: 'Just now'
    });

    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setBankName('');
    setLast4Digits('');
    setCreditLimit('');
    setCurrentBalance('');
  };

  return (
    <div className="cyber-card p-8 space-y-6 text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-2xs">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-space tracking-tight">Credit Cards & Bill Radar</h2>
            <p className="text-xs text-[#94A3B8]">Track credit limits, active outstanding balances, and due dates</p>
          </div>
        </div>

        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn-primary px-5 py-2.5 rounded-full text-xs font-bold text-[#040D0B] shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#040D0B]" />
          <span>Add Credit Card</span>
        </button>
      </div>

      {/* TOTAL OUTSTANDING DEBT BANNER */}
      <div className="p-6 bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/30 rounded-3xl text-white shadow-2xs flex justify-between items-center">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#00FF9D] font-mono">Total Outstanding Credit Card Debt ({currency})</div>
          <div className="text-3xl font-extrabold font-space text-rose-400 mt-1">{formatCurrency(totalCreditDebt)}</div>
        </div>

        <span className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full text-xs font-mono font-bold">
          {creditCardAccounts.length} Active Cards
        </span>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {creditCardAccounts.length === 0 ? (
          <div className="col-span-2 p-10 text-center text-xs text-[#94A3B8] border border-dashed border-[#00FF9D]/30 rounded-3xl space-y-3 font-mono">
            <CreditCard className="w-10 h-10 text-[#00FF9D] opacity-40 mx-auto" />
            <p>No credit cards linked yet. Click <b>Add Credit Card</b> to track statement due dates!</p>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="px-5 py-2.5 rounded-full btn-primary text-[#040D0B] font-bold text-xs shadow-md cursor-pointer"
            >
              + Add First Credit Card
            </button>
          </div>
        ) : (
          creditCardAccounts.map((c: AccountItem) => (
            <div
              key={c.id}
              className="p-6 bg-gradient-to-br from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/30 rounded-3xl space-y-4 hover:border-[#00FF9D]/60 transition-all group shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-white text-base font-space">{c.name}</h3>
                  <div className="text-xs text-[#94A3B8] font-mono">{c.accountNumberOrVpa}</div>
                </div>

                <button onClick={() => deleteAccount(c.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-[#94A3B8] hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="text-xs font-mono pt-1">
                <div className="text-[10px] text-[#94A3B8]">Current Outstanding Balance</div>
                <div className="font-extrabold text-rose-400 text-2xl mt-0.5">{formatCurrency(c.balance)}</div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono pt-2 border-t border-[#00FF9D]/20">
                <span className="text-[#00FF9D]">✓ Active Card • {c.institution}</span>
                <span className="text-[#FBBF24]">Synced: {c.lastSynced}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#040D0B]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#081713] p-7 w-full max-w-md shadow-2xl rounded-3xl border border-[#00FF9D]/30 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-[#00FF9D]/20 pb-3">
              <h3 className="font-extrabold text-base text-white font-space">Add Credit Card</h3>
              <button onClick={resetForm} className="text-[#94A3B8] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono mb-1">Bank Name / Card Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. HDFC Regalia / ICICI Amazon Pay"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#00FF9D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="8821"
                    value={last4Digits}
                    onChange={e => setLast4Digits(e.target.value)}
                    className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#00FF9D]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono mb-1">Outstanding Balance (₹)</label>
                  <input
                    required
                    type="number"
                    placeholder="45000"
                    value={currentBalance}
                    onChange={e => setCurrentBalance(e.target.value)}
                    className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-xl p-3 text-rose-400 font-mono focus:outline-none focus:border-[#00FF9D]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#00FF9D]/20">
                <button type="button" onClick={resetForm} className="px-4 py-2 text-[#94A3B8]">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-full btn-primary text-[#040D0B] font-bold text-xs shadow-md cursor-pointer">
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
