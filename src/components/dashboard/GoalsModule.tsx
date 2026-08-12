'use client';

import React, { useState } from 'react';
import { useFinancial, GoalItem } from '@/context/FinancialContext';
import { Target, Plus, Trash2, Edit2, X, Trophy, DollarSign, Calendar } from 'lucide-react';

export const GoalsModule: React.FC = () => {
  const { goals, addGoal, depositGoal, deleteGoal, formatCurrency, currency } = useFinancial();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    addGoal({
      title,
      targetAmount: parseFloat(targetAmount) || 0,
      deadline: deadline || '2026-12-31'
    });

    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setTitle('');
    setTargetAmount('');
    setDeadline('');
  };

  return (
    <div className="cyber-card p-8 space-y-6 text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-2xs">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-space tracking-tight">Wealth & Savings Goals</h2>
            <p className="text-xs text-[#94A3B8]">Set milestone targets for emergency funds, vacations, and house downpayments</p>
          </div>
        </div>

        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn-primary px-5 py-2.5 rounded-full text-xs font-bold text-[#040D0B] shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#040D0B]" />
          <span>Create Wealth Goal</span>
        </button>
      </div>

      {/* GOALS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {goals.length === 0 ? (
          <div className="col-span-2 p-10 text-center text-xs text-[#94A3B8] border border-dashed border-[#00FF9D]/30 rounded-3xl space-y-3 font-mono">
            <Target className="w-10 h-10 text-[#00FF9D] opacity-40 mx-auto" />
            <p>No wealth goals set yet. Click <b>Create Wealth Goal</b> to track your targets!</p>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="px-5 py-2.5 rounded-full btn-primary text-[#040D0B] font-bold text-xs shadow-md cursor-pointer"
            >
              + Create First Goal
            </button>
          </div>
        ) : (
          goals.map(g => {
            const pct = Math.min(100, Math.round((g.currentAmount / (g.targetAmount || 1)) * 100));

            return (
              <div
                key={g.id}
                className="p-5 bg-[#040D0B]/80 border border-[#00FF9D]/20 rounded-3xl space-y-4 hover:border-[#00FF9D]/50 transition-all group shadow-2xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-white text-base font-space">{g.title}</h3>
                    <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                      Deadline: {g.deadline}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40 text-xs font-mono font-bold">
                      {pct}%
                    </span>

                    <button onClick={() => deleteGoal(g.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-[#94A3B8] hover:text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">Saved: <b className="text-[#00FF9D]">{formatCurrency(g.currentAmount)}</b></span>
                  <span className="text-[#94A3B8]">Target: <b className="text-white">{formatCurrency(g.targetAmount)}</b></span>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full bg-[#081713] rounded-full h-2.5 border border-[#00FF9D]/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00FF9D] to-[#FBBF24] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="pt-1 flex justify-between items-center">
                  <button
                    onClick={() => depositGoal(g.id, 5000)}
                    className="px-3.5 py-1.5 rounded-full bg-[#00FF9D]/15 hover:bg-[#00FF9D]/30 border border-[#00FF9D]/40 text-[#00FF9D] text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    + Deposit ₹5,000
                  </button>

                  <span className="text-[10px] text-[#FBBF24] font-mono font-bold">
                    {formatCurrency(Math.max(0, g.targetAmount - g.currentAmount))} remaining
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#040D0B]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#081713] p-7 w-full max-w-md shadow-2xl rounded-3xl border border-[#00FF9D]/30 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-[#00FF9D]/20 pb-3">
              <h3 className="font-extrabold text-base text-white font-space">Create Wealth Goal</h3>
              <button onClick={resetForm} className="text-[#94A3B8] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono mb-1">Goal Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Goa Trip, Emergency Fund, New Laptop"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#00FF9D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono mb-1">Target Amount (₹)</label>
                <input
                  required
                  type="number"
                  placeholder="250000"
                  value={targetAmount}
                  onChange={e => setTargetAmount(e.target.value)}
                  className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-xl p-3 text-[#00FF9D] font-mono font-bold focus:outline-none focus:border-[#00FF9D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#00FF9D]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#00FF9D]/20">
                <button type="button" onClick={resetForm} className="px-4 py-2 text-[#94A3B8]">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-full btn-primary text-[#040D0B] font-bold text-xs shadow-md cursor-pointer">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
