'use client';

import React, { useState, useMemo } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';

export const TransactionsModule: React.FC = () => {
  const { expenses, income, addExpense, addIncome, deleteExpense, deleteIncome, currency } = useFinancial();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Unified Transactions List
  const transactions = useMemo(() => {
    const exp = expenses.map(e => ({
      id: e.id,
      type: 'EXPENSE' as const,
      title: e.title,
      amount: e.amount,
      category: e.category,
      date: e.date,
    }));
    
    const inc = income.map(i => ({
      id: i.id,
      type: 'INCOME' as const,
      title: i.source,
      amount: i.amount,
      category: i.category,
      date: i.date,
    }));

    return [...exp, ...inc].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, income]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (type === 'EXPENSE') {
      addExpense({
        title,
        amount: parsedAmount,
        category,
        date,
      });
    } else {
      addIncome({
        source: title,
        amount: parsedAmount,
        category,
        date,
      });
    }

    setIsModalOpen(false);
    setTitle('');
    setAmount('');
    setCategory('');
  };

  const handleDeleteTransaction = (id: string, txType: 'INCOME' | 'EXPENSE') => {
    if (txType === 'EXPENSE') {
      deleteExpense(id);
    } else {
      deleteIncome(id);
    }
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-space">
            All Transactions
          </h2>
          <p className="text-[#94A3B8] text-sm mt-1 font-inter">
            Unified view of your income and expenses.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#00FF9D] text-[#030A08] px-4 py-2 rounded-xl font-bold hover:bg-[#00FF9D]/90 transition-colors shadow-[0_0_15px_rgba(0,255,157,0.3)]"
        >
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-20 bg-[#0A1A16] rounded-2xl border border-[#00FF9D]/10">
          <p className="text-[#94A3B8] font-inter">No transactions found.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-[#00FF9D] font-bold text-sm hover:underline"
          >
            Add your first transaction
          </button>
        </div>
      ) : (
        <div className="bg-[#0A1A16] rounded-2xl border border-[#00FF9D]/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#00FF9D]/10 bg-[#05100D]/50 text-[#94A3B8] text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4 w-1/4">Transaction</th>
                  <th className="p-4 w-1/5">Category</th>
                  <th className="p-4 w-1/5">Date</th>
                  <th className="p-4 w-1/5 text-right">Amount</th>
                  <th className="p-4 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00FF9D]/5">
                {transactions.map((tx) => (
                  <tr key={`${tx.id}-${tx.type}`} className="hover:bg-[#05100D]/40 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${tx.type === 'INCOME' ? 'bg-[#00FF9D]/10 text-[#00FF9D]' : 'bg-rose-500/10 text-rose-500'}`}>
                          {tx.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <span className="font-semibold text-white font-inter truncate">{tx.title}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#1A2C27] text-[#94A3B8] text-xs font-medium border border-[#2A3F38]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="p-4 text-[#94A3B8] text-sm font-mono">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      <div className={`font-bold font-mono flex items-center justify-end gap-1 ${tx.type === 'INCOME' ? 'text-[#00FF9D]' : 'text-white'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'} {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'} {tx.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(tx.id, tx.type)}
                        className="p-1.5 text-[#94A3B8] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD TRANSACTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1A16] border border-[#00FF9D]/20 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-5 font-space">Add Transaction</h2>
            
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="flex bg-[#05100D] p-1 rounded-xl border border-[#00FF9D]/10">
                <button
                  type="button"
                  onClick={() => setType('EXPENSE')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'EXPENSE' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'text-[#94A3B8] hover:text-white'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('INCOME')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'INCOME' ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30' : 'text-[#94A3B8] hover:text-white'}`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Amount ({currency})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#05100D] border border-[#00FF9D]/20 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#00FF9D] transition-colors font-mono"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">
                  {type === 'INCOME' ? 'Source' : 'Title'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#05100D] border border-[#00FF9D]/20 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#00FF9D] transition-colors"
                  placeholder={type === 'INCOME' ? 'e.g., Salary' : 'e.g., Groceries'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#05100D] border border-[#00FF9D]/20 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#00FF9D] transition-colors"
                    placeholder={type === 'INCOME' ? 'e.g., Job' : 'e.g., Food'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#05100D] border border-[#00FF9D]/20 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#00FF9D] transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold bg-[#1A2C27] hover:bg-[#2A3F38] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-[#030A08] font-bold bg-[#00FF9D] hover:bg-[#00FF9D]/90 transition-colors shadow-[0_0_15px_rgba(0,255,157,0.2)]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
