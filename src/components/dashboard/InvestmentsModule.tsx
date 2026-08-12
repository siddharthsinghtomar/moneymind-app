'use client';

import React, { useState } from 'react';
import { useFinancial, InvestmentItem } from '@/context/FinancialContext';
import { LineChart, Plus, Trash2, Edit2, X, RefreshCw, TrendingUp, DollarSign, ShieldCheck } from 'lucide-react';

export const InvestmentsModule: React.FC = () => {
  const { investments, addInvestment, deleteInvestment, totalInvestmentValue, formatCurrency, currency } = useFinancial();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState<'Stock' | 'Mutual Fund' | 'Crypto' | 'Gold'>('Stock');
  const [units, setUnits] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');

  const handleSaveInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !units || !buyPrice) return;

    addInvestment({
      name,
      type,
      units: parseFloat(units) || 0,
      buyPrice: parseFloat(buyPrice) || 0,
      currentPrice: parseFloat(currentPrice) || parseFloat(buyPrice) || 0
    });

    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setName('');
    setUnits('');
    setBuyPrice('');
    setCurrentPrice('');
    setType('Stock');
  };

  return (
    <div className="cyber-card p-8 space-y-6 text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-2xs">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-space tracking-tight">Investments Portfolio</h2>
            <p className="text-xs text-[#94A3B8]">Track stocks, ELSS mutual funds, crypto, and digital gold holdings</p>
          </div>
        </div>

        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn-primary px-5 py-2.5 rounded-full text-xs font-bold text-[#040D0B] shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#040D0B]" />
          <span>Add Holding</span>
        </button>
      </div>

      {/* PORTFOLIO SUMMARY BANNER */}
      <div className="p-6 bg-gradient-to-r from-[#081713] via-[#0E241E] to-[#040D0B] border border-[#00FF9D]/30 rounded-3xl text-white shadow-2xs flex justify-between items-center">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#00FF9D] font-mono">Portfolio Current Value ({currency})</div>
          <div className="text-3xl font-extrabold font-space text-[#00FF9D] mt-1">{formatCurrency(totalInvestmentValue)}</div>
        </div>

        <span className="px-4 py-2 bg-[#00FF9D]/20 border border-[#00FF9D]/40 text-[#00FF9D] rounded-full text-xs font-mono font-bold">
          {investments.length} Active Holdings
        </span>
      </div>

      {/* HOLDINGS LIST */}
      <div className="space-y-3 pt-2">
        {investments.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#94A3B8] border border-dashed border-[#00FF9D]/30 rounded-3xl space-y-3 font-mono">
            <LineChart className="w-10 h-10 text-[#00FF9D] opacity-40 mx-auto" />
            <p>No holdings added yet. Click <b>Add Holding</b> to track your stocks and funds!</p>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="px-5 py-2.5 rounded-full btn-primary text-[#040D0B] font-bold text-xs shadow-md cursor-pointer"
            >
              + Add First Holding
            </button>
          </div>
        ) : (
          investments.map(item => {
            const holdingVal = item.units * item.currentPrice;
            const profit = (item.currentPrice - item.buyPrice) * item.units;

            return (
              <div
                key={item.id}
                className="p-5 bg-[#040D0B]/80 border border-[#00FF9D]/20 rounded-2xl flex items-center justify-between text-xs hover:border-[#00FF9D]/50 transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-xl border border-[#00FF9D]/30">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-sm">{item.name}</div>
                    <div className="text-[10px] text-[#94A3B8] flex items-center gap-2 mt-0.5 font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#081713] text-[#00FF9D] font-bold border border-[#00FF9D]/30 uppercase">{item.type}</span>
                      <span>Units: {item.units}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right font-mono">
                    <div className="font-extrabold text-[#00FF9D] text-base">{formatCurrency(holdingVal)}</div>
                    <div className={`text-[10px] font-bold ${profit >= 0 ? 'text-[#00FF9D]' : 'text-rose-400'}`}>
                      {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteInvestment(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-[#94A3B8] hover:text-rose-400 transition-all cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
              <h3 className="font-extrabold text-base text-white font-space">Add Portfolio Holding</h3>
              <button onClick={resetForm} className="text-[#94A3B8] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveInvestment} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono mb-1">Asset Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Reliance Industries / Mirae Asset Large Cap"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#00FF9D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono mb-1">Asset Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-xl p-3 text-white outline-none focus:border-[#00FF9D]"
                  >
                    <option value="Stock" className="bg-[#040D0B]">Stocks / Equities</option>
                    <option value="Mutual Fund" className="bg-[#040D0B]">Mutual Funds (ELSS)</option>
                    <option value="Crypto" className="bg-[#040D0B]">Crypto</option>
                    <option value="Gold" className="bg-[#040D0B]">Digital Gold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono mb-1">Units Owned</label>
                  <input
                    required
                    type="number"
                    placeholder="10"
                    value={units}
                    onChange={e => setUnits(e.target.value)}
                    className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#00FF9D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono mb-1">Buy Price (₹)</label>
                  <input
                    required
                    type="number"
                    placeholder="2850"
                    value={buyPrice}
                    onChange={e => setBuyPrice(e.target.value)}
                    className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#00FF9D]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#00FF9D] font-mono mb-1">Current Price (₹)</label>
                  <input
                    type="number"
                    placeholder="3100"
                    value={currentPrice}
                    onChange={e => setCurrentPrice(e.target.value)}
                    className="w-full bg-[#040D0B] border border-[#00FF9D]/30 rounded-xl p-3 text-[#00FF9D] font-mono focus:outline-none focus:border-[#00FF9D]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#00FF9D]/20">
                <button type="button" onClick={resetForm} className="px-4 py-2 text-[#94A3B8]">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-full btn-primary text-[#040D0B] font-bold text-xs shadow-md cursor-pointer">
                  Save Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
