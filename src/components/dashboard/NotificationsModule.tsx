'use client';

import React, { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { Bell, ShieldAlert, CheckCircle2, Trash2 } from 'lucide-react';

export const NotificationsModule: React.FC = () => {
  const { aiInsights } = useFinancial();
  const [alerts, setAlerts] = useState([
    { id: '1', title: 'Dining Budget Alert', message: 'Your dining spend reached 80% of your allocated monthly limit.', type: 'warning', date: '2 hours ago' },
    { id: '2', title: 'Recurring Bill Reminder', message: 'Netflix Subscription (₹649) auto-renews in 3 days.', type: 'info', date: 'Yesterday' },
    { id: '3', title: 'Security Audit Passed', message: '256-bit bank aggregation layer synced smoothly with HDFC & ICICI.', type: 'success', date: '01 Aug 2026' },
  ]);

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="cyber-card p-8 flex flex-col space-y-6 text-white">
      <div className="flex items-center justify-between pb-4 border-b border-[#00FF9D]/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00FF9D]/15 text-[#00FF9D] rounded-2xl border border-[#00FF9D]/30">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white font-space">Alerts & System Notifications</h2>
            <p className="text-xs text-[#94A3B8]">Real-time alerts, budget warnings, and AI security audit notifications</p>
          </div>
        </div>

        {alerts.length > 0 && (
          <button onClick={clearAlerts} className="px-3.5 py-1.5 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono font-bold rounded-full flex items-center gap-1.5 cursor-pointer">
            <Trash2 className="w-3.5 h-3.5 text-red-400" /> Clear Alerts
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#94A3B8] text-center space-y-3 font-mono">
            <CheckCircle2 className="w-12 h-12 text-[#00FF9D] opacity-60" />
            <p className="text-xs font-medium text-white">All caught up! No unread notifications or budget warnings.</p>
          </div>
        ) : (
          alerts.map(a => (
            <div key={a.id} className="p-4 bg-[#040D0B]/90 border border-[#00FF9D]/20 rounded-2xl flex items-start gap-4 hover:border-[#00FF9D]/50 transition-all">
              <div className={`p-2.5 rounded-xl shrink-0 ${a.type === 'warning' ? 'bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40' : a.type === 'success' ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40' : 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40'}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-white text-sm font-space">{a.title}</h3>
                  <span className="text-[10px] text-[#94A3B8] font-mono">{a.date}</span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{a.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
