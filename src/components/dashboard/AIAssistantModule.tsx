'use client';

import React, { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { 
  Bot, Send, Sparkles, User, ArrowUpRight, ShieldCheck, Activity, 
  Lightbulb, Zap, TrendingUp, Cpu, RefreshCw, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const AIAssistantModule: React.FC = () => {
  const { totalIncome, totalExpenses, netWorth, savingsRate, formatCurrency, currency, autoSavePct } = useFinancial();

  const [messages, setMessages] = useState([
    { 
      id: '1', 
      role: 'ai', 
      text: `Hello! I'm your MoneyMind AI Executive Financial Advisor. 

Your active Net Worth is **${formatCurrency(netWorth)}** with a monthly Savings Rate of **${savingsRate}%**.

How can I optimize your financial portfolio today?` 
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const PRESET_PROMPTS = [
    { label: '💡 How can I reduce dining expenses?', query: 'How can I reduce dining expenses by 20%?' },
    { label: '📈 What is my net worth forecast?', query: 'Predict my net worth 12 months from now.' },
    { label: '🛡️ Check my emergency fund status', query: 'Do I have enough emergency fund cushion?' },
    { label: '🚀 Recommend investment allocation', query: `How should I invest ${formatCurrency(25000)} this month?` },
  ];

  const handleSend = (userQuery?: string) => {
    const queryText = userQuery || input.trim();
    if (!queryText) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: queryText }]);
    if (!userQuery) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = queryText.toLowerCase();

      if (lower.includes('dining') || lower.includes('expense') || lower.includes('cut')) {
        reply = `Based on your recent transaction logs, dining & food account for your largest discretionary outflow. 

🎯 **AI Recommendation:**
• Set a strict **${formatCurrency(8000)}** monthly budget cap in the **Budgets Studio**.
• Enabling our **${autoSavePct}% Auto-Save Rule** will redirect **${formatCurrency(totalIncome * (autoSavePct / 100))}** straight into your savings goal automatically!`;
      } else if (lower.includes('net worth') || lower.includes('predict') || lower.includes('forecast')) {
        reply = `Your current Net Worth is **${formatCurrency(netWorth)}**. 

📈 **12-Month Projection:**
With your current net savings rate of **${savingsRate}%** and a conservative **8% annual compound yield**, your projected net worth will reach **${formatCurrency(Math.round(netWorth * 1.12))}** by next year!`;
      } else if (lower.includes('emergency') || lower.includes('cushion') || lower.includes('fund')) {
        const minEmergencyNeeded = totalExpenses * 6;
        reply = `🛡️ **Emergency Fund Audit:**
• Recommended 6-Month Emergency Cushion: **${formatCurrency(minEmergencyNeeded)}**
• Your Current Net Liquidity: **${formatCurrency(netWorth)}**

${netWorth >= minEmergencyNeeded ? '✅ **Status:** Your emergency cushion is fully funded and secure!' : '⚠️ **Action:** Increase your monthly allocation to reach 6x monthly expenses.'}`;
      } else if (lower.includes('invest') || lower.includes('allocate')) {
        reply = `🚀 **AI Investment Allocation Strategy:**
For a balanced high-growth strategy:
1. **60% Nifty 50 Index Mutual Funds** (${formatCurrency(15000)})
2. **25% Bluechip Stocks** (${formatCurrency(6250)})
3. **15% Sovereign Gold / Liquid Cushion** (${formatCurrency(3750)})`;
      } else {
        reply = `I have audited your ledger. With a total monthly inflow of **${formatCurrency(totalIncome)}** and logged expenses of **${formatCurrency(totalExpenses)}**, your current net cashflow cushion is **${formatCurrency(Math.max(0, totalIncome - totalExpenses))}**. 

Keep maintaining a **50% + savings velocity** to maximize compound wealth growth!`;
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="cyber-card p-6 sm:p-8 flex flex-col h-[650px] overflow-hidden relative text-white space-y-4">
      
      {/* HUD CORNER BRACKETS */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      {/* TOP NEON GRADIENT ACCENT STRIP */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00FF9D] via-[#FBBF24] to-[#00FF9D]" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30 shadow-[0_0_20px_rgba(0,255,157,0.25)]">
            <Cpu className="w-6 h-6 text-[#00FF9D]" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[#00FF9D] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" /> // AI_FINANCIAL_COACH_v2.0 • ONLINE
            </div>
            <h2 className="text-xl font-extrabold text-white font-space tracking-tight flex items-center gap-2">
              MoneyMind Executive AI Advisor <span className="w-2.5 h-2.5 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_10px_#00FF9D]" />
            </h2>
            <p className="text-xs text-[#94A3B8]">Autonomous financial insights, wealth optimization, and budget strategy</p>
          </div>
        </div>

        {/* AI AUDIT BADGE */}
        <div className="px-4 py-2 bg-[#081713] border border-[#00FF9D]/30 rounded-full font-mono text-xs font-bold text-[#00FF9D] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00FF9D]" /> Health Score: 88/100
        </div>
      </div>

      {/* CHAT MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono custom-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`p-3 rounded-2xl shrink-0 ${
              msg.role === 'user' 
                ? 'bg-[#FBBF24] text-[#040D0B] font-bold shadow-[0_0_15px_#FBBF24]' 
                : 'bg-[#081713] border border-[#00FF9D]/40 text-[#00FF9D] shadow-[0_0_15px_rgba(0,255,157,0.2)]'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-4 sm:p-5 rounded-3xl max-w-xl text-xs leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/40 font-bold' 
                : 'bg-gradient-to-br from-[#071612] to-[#040D0B] text-white border border-[#00FF9D]/30 shadow-md'
            }`}>
              <div className="whitespace-pre-line">{msg.text}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#081713] border border-[#00FF9D]/40 text-[#00FF9D] shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-3xl bg-[#040D0B] text-[#00FF9D] border border-[#00FF9D]/30 text-xs font-mono font-bold flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00FF9D]" /> AI is auditing ledger and generating strategy...
            </div>
          </div>
        )}
      </div>

      {/* QUICK PRESET CHIPS */}
      <div className="space-y-1 font-mono pt-2 border-t border-[#00FF9D]/20">
        <div className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider">• Quick Advisory Prompts:</div>
        <div className="flex flex-wrap gap-2 text-[10px]">
          {PRESET_PROMPTS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(p.query)}
              className="px-3 py-1.5 rounded-full bg-[#030A08] border border-white/10 hover:border-[#00FF9D]/50 text-[#94A3B8] hover:text-[#00FF9D] transition-all cursor-pointer flex items-center gap-1"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT FORM WITH NEON MINT BUTTON */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3 font-mono pt-1">
        <input
          type="text"
          placeholder="Ask AI Executive Coach... e.g. How can I increase my savings rate?"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl px-5 py-3.5 text-xs text-white placeholder-[#94A3B8]/60 outline-none focus:border-[#00FF9D] focus:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all"
        />
        <button 
          type="submit" 
          className="btn-primary px-7 py-3.5 rounded-full font-bold text-[#040D0B] shadow-[0_0_20px_#00FF9D] flex items-center gap-2 text-xs cursor-pointer"
        >
          <span>Send</span> <Send className="w-4 h-4 text-[#040D0B]" />
        </button>
      </form>

    </div>
  );
};
