'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFinancial, AccountItem } from '@/context/FinancialContext';
import { Wallet, Plus, Trash2, Landmark, CreditCard, CheckCircle2, Edit2, X, Building2, IndianRupee, Hash, Sparkles } from 'lucide-react';

export const TotalBalanceModule: React.FC = () => {
  const { accounts, addAccount, editAccount, deleteAccount, formatCurrency, currency } = useFinancial();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [type, setType] = useState<'bank' | 'upi' | 'credit' | 'investment' | 'manual'>('bank');
  const [balance, setBalance] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const totalBalance = accounts.reduce((acc, curr) => acc + (curr.type === 'credit' ? -curr.balance : curr.balance), 0);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !balance) return;

    if (editingId) {
      editAccount(editingId, {
        name,
        institution,
        type,
        balance: parseFloat(balance) || 0,
        accountNumberOrVpa: accountNumber ? `•••• ${accountNumber.slice(-4)}` : '•••• 4242'
      });
    } else {
      addAccount({
        name,
        type,
        institution: institution || name,
        accountNumberOrVpa: accountNumber ? `•••• ${accountNumber.slice(-4)}` : '•••• 4242',
        balance: parseFloat(balance) || 0,
        color: type === 'bank' ? '#00FF9D' : type === 'credit' ? '#EF4444' : '#FBBF24',
        lastSynced: 'Just now'
      });
    }

    resetForm();
  };

  const startEdit = (acc: AccountItem) => {
    setEditingId(acc.id);
    setName(acc.name);
    setInstitution(acc.institution);
    setType(acc.type);
    setBalance(acc.balance.toString());
    setAccountNumber(acc.accountNumberOrVpa.replace('•••• ', ''));
    setIsAddModalOpen(true);
  };

  const resetForm = () => {
    setIsAddModalOpen(false);
    setEditingId(null);
    setName('');
    setInstitution('');
    setBalance('');
    setAccountNumber('');
  };

  const getAccountIcon = (t: string) => {
    switch (t) {
      case 'bank': return <Landmark className="w-5 h-5 text-[#00FF9D]" />;
      case 'credit': return <CreditCard className="w-5 h-5 text-red-400" />;
      default: return <Wallet className="w-5 h-5 text-[#FBBF24]" />;
    }
  };

  return (
    <div className="cyber-card p-8 space-y-6 text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-space">Accounts & Connected Banks</h2>
            <p className="text-xs text-[#94A3B8]">Manage your connected savings accounts, UPI wallets, and portfolio balances</p>
          </div>
        </div>

        <button
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="btn-primary px-5 py-2.5 rounded-full text-xs font-bold text-[#040D0B] shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#040D0B]" /> Link New Account
        </button>
      </div>

      {/* TOTAL NET BALANCE BANNER */}
      <div className="p-6 bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/30 rounded-3xl text-white shadow-md flex justify-between items-center">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#00FF9D] font-mono">Total Account Net Balance ({currency})</div>
          <div className="text-3xl font-extrabold font-space text-[#00FF9D] mt-1">{formatCurrency(totalBalance)}</div>
        </div>
        <span className="px-4 py-2 bg-[#00FF9D]/20 border border-[#00FF9D]/40 rounded-full text-xs font-mono font-bold text-[#00FF9D]">
          {accounts.length} Active Accounts
        </span>
      </div>

      {/* ACCOUNTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {accounts.length === 0 ? (
          <div className="col-span-2 p-8 text-center text-xs text-[#94A3B8] border border-dashed border-[#00FF9D]/30 rounded-2xl font-mono">
            No accounts linked yet. Click <b>Link New Account</b> to connect your bank!
          </div>
        ) : (
          accounts.map(acc => (
            <div
              key={acc.id}
              className="p-5 bg-[#040D0B]/80 border border-[#00FF9D]/20 rounded-2xl space-y-3 relative group hover:border-[#00FF9D]/50 transition-all overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: acc.color }} />

              <div className="flex justify-between items-start pl-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#081713] rounded-xl border border-[#00FF9D]/20 shadow-2xs">
                    {getAccountIcon(acc.type)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{acc.name}</h3>
                    <p className="text-[11px] text-[#94A3B8] font-mono">{acc.institution}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-extrabold font-mono text-base ${acc.type === 'credit' ? 'text-red-400' : 'text-[#00FF9D]'}`}>
                    {acc.type === 'credit' ? '-' : ''}{formatCurrency(acc.balance)}
                  </div>
                  <div className="text-[#94A3B8] text-[11px] font-mono">{acc.accountNumberOrVpa}</div>
                </div>
              </div>

              <div className="flex justify-between items-center pl-2 pt-2 border-t border-[#00FF9D]/15">
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF9D]" /> Active • {acc.lastSynced}
                </span>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => startEdit(acc)}
                    className="p-1.5 text-[#94A3B8] hover:text-[#00FF9D] transition-colors cursor-pointer"
                    title="Edit account"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAccount(acc.id)}
                    className="p-1.5 text-[#94A3B8] hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* REDESIGNED MIDNIGHT LUXE CYBER STUDIO MODAL PORTAL */}
      {isAddModalOpen && mounted && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-[9999] bg-[#030A08]/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <div className="bg-[#071612] p-6 sm:p-8 w-full max-w-3xl max-h-[92vh] overflow-y-auto custom-scrollbar shadow-[0_25px_80px_rgba(0,255,157,0.25)] rounded-3xl border border-[#00FF9D]/50 space-y-6 text-white relative my-auto font-mono">
                
                {/* AMBIENT GLOW */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF9D]/15 rounded-full blur-3xl pointer-events-none" />

                {/* MODAL HEADER */}
                <div className="flex items-center justify-between border-b border-[#00FF9D]/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#00FF9D] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#FBBF24]" /> // BANK_AGGREGATION_STUDIO_2.0
                      </div>
                      <h3 className="font-extrabold text-lg sm:text-xl text-white font-space">
                        {editingId ? 'Edit Account Entry' : 'Link New Bank / Wallet Account'}
                      </h3>
                    </div>
                  </div>

                  <button 
                    onClick={resetForm}
                    className="p-2.5 rounded-full border border-white/10 hover:border-[#00FF9D] text-[#94A3B8] hover:text-[#00FF9D] transition-all cursor-pointer bg-[#030A08]"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* 2-COLUMN STUDIO GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* LEFT COLUMN: QUICK BANK TILES */}
                  <div className="space-y-3 md:col-span-1 border-b md:border-b-0 md:border-r border-[#00FF9D]/20 pb-4 md:pb-0 md:pr-4">
                    <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] tracking-wider">
                      • Quick Select Institution
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                      {[
                        { name: 'HDFC Bank', type: 'bank', color: '#00FF9D', label: '🏛️ HDFC Bank' },
                        { name: 'ICICI Bank', type: 'bank', color: '#FBBF24', label: '📙 ICICI Bank' },
                        { name: 'SBI Bank', type: 'bank', color: '#38BDF8', label: '🏦 State Bank' },
                        { name: 'Axis Bank', type: 'bank', color: '#F43F5E', label: '🔴 Axis Bank' },
                        { name: 'Paytm Wallet', type: 'upi', color: '#38BDF8', label: '📲 Paytm UPI' },
                        { name: 'Zerodha / Crypto', type: 'investment', color: '#A855F7', label: '📈 Investment' },
                      ].map((bank, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setInstitution(bank.name);
                            setName(`${bank.name} ${bank.type === 'upi' ? 'Wallet' : 'Account'}`);
                            setType(bank.type as any);
                          }}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            institution === bank.name 
                              ? 'bg-[#00FF9D]/20 border-[#00FF9D] text-[#00FF9D] shadow-[0_0_12px_rgba(0,255,157,0.3)]' 
                              : 'bg-[#030A08] border-[#00FF9D]/20 text-[#94A3B8] hover:text-white hover:border-[#00FF9D]/40'
                          }`}
                        >
                          <span className="truncate">{bank.label}</span>
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: bank.color }} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: ACCOUNT FORM FIELDS */}
                  <form onSubmit={handleSaveAccount} className="space-y-4 md:col-span-2 text-xs">
                    
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1 tracking-wider">
                        • Account Display Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. HDFC Salary Account"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-xl px-3.5 py-2.5 text-white font-sans text-xs focus:outline-none focus:border-[#00FF9D] focus:shadow-[0_0_15px_rgba(0,255,157,0.25)] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1 tracking-wider">
                        • Financial Institution / Bank Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                        value={institution}
                        onChange={e => setInstitution(e.target.value)}
                        className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-xl px-3.5 py-2.5 text-white font-sans text-xs focus:outline-none focus:border-[#00FF9D] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1 tracking-wider">
                          • Asset / Account Type
                        </label>
                        <select
                          value={type}
                          onChange={e => setType(e.target.value as any)}
                          className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-xl px-3.5 py-2.5 text-white font-sans text-xs outline-none focus:border-[#00FF9D] transition-all cursor-pointer"
                        >
                          <option value="bank" className="bg-[#030A08]">Bank Account</option>
                          <option value="upi" className="bg-[#030A08]">UPI / Digital Wallet</option>
                          <option value="credit" className="bg-[#030A08]">Credit Card Cap</option>
                          <option value="investment" className="bg-[#030A08]">Investment Portfolio</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1 tracking-wider">
                          • Current Balance ({currency})
                        </label>
                        <input
                          required
                          type="number"
                          placeholder="850000"
                          value={balance}
                          onChange={e => setBalance(e.target.value)}
                          className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-xl px-3.5 py-2.5 text-[#00FF9D] font-mono font-extrabold text-xs focus:outline-none focus:border-[#00FF9D] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] mb-1 tracking-wider">
                        • Account Identifier (Last 4 Digits / VPA)
                      </label>
                      <input
                        type="text"
                        placeholder="4892"
                        maxLength={15}
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value)}
                        className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-[#00FF9D] transition-all"
                      />
                    </div>

                    {/* FORM ACTIONS */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#00FF9D]/20">
                      <button 
                        type="button" 
                        onClick={resetForm} 
                        className="px-5 py-2.5 rounded-full border border-white/10 hover:border-[#00FF9D]/40 text-[#94A3B8] hover:text-white transition-all text-xs cursor-pointer bg-[#030A08]"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn-primary px-7 py-2.5 rounded-full text-xs font-extrabold text-[#030A08] shadow-[0_0_25px_#00FF9D] hover:scale-105 transition-all cursor-pointer"
                      >
                        {editingId ? 'Update Account Entry →' : 'Link Account Entry →'}
                      </button>
                    </div>
                  </form>

                </div>

              </div>
            </div>,
            document.body
          )
        : null}

    </div>
  );
};
