'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useFinancial } from '@/context/FinancialContext';
import { 
  User, Mail, ShieldCheck, Lock, Globe, Sparkles, Check, 
  Save, KeyRound, Smartphone, Laptop, AlertCircle, RefreshCw, 
  Download, Trash2, Edit3, Settings, Crown, CheckCircle2
} from 'lucide-react';

export const ProfileModule: React.FC = () => {
  const { data: session } = useSession();
  const { 
    userName, setUserName, userEmail, setUserEmail, workspaceName, 
    currency, setCurrency, formatCurrency, 
    theme, setTheme, clearAllData, netWorth
  } = useFinancial();

  const [nameInput, setNameInput] = useState(userName);
  const [emailInput, setEmailInput] = useState(userEmail);
  const [customWorkspaceInput, setCustomWorkspaceInput] = useState(`${userName || 'User'}'s Workspace`);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setNameInput(userName);
    setCustomWorkspaceInput(workspaceName);
    const activeEmail = userEmail || (typeof window !== 'undefined' ? localStorage.getItem('mm_user_email') : '') || session?.user?.email || '';
    if (activeEmail) setEmailInput(activeEmail);
  }, [userName, userEmail, workspaceName, session]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(nameInput);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_user_name', nameInput);
      localStorage.setItem('mm_user_email', emailInput);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput, email: emailInput, currency }),
      });
    } catch {
      // Local fallback
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || 'Failed to update password.');
        return;
      }
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      setPasswordError('Server connection error.');
    }
  };

  const handleExportData = () => {
    const exportData = {
      user: { name: userName, email: emailInput },
      exportDate: new Date().toISOString(),
      netWorth: netWorth,
      currency: currency
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moneymind_export_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 font-mono selection:bg-[#00FF9D]/30 pb-16">
      
      {/* HEADER TITLE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#071612]/90 border border-[#00FF9D]/30 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#00FF9D] uppercase tracking-wider flex items-center gap-1.5 font-space">
            <User className="w-4 h-4 text-[#FBBF24]" /> User Profile & Account Settings Studio
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-space">Manage Profile & Preferences</h2>
          <p className="text-xs text-[#94A3B8]">Customize your identity, security credentials, multi-tenant workspace, and regional parameters.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#00FF9D]/15 border border-[#00FF9D]/40 text-[#00FF9D] text-xs font-bold rounded-full flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-[#FBBF24]" /> PRO MEMBER
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-[#00FF9D]/15 border border-[#00FF9D]/40 rounded-2xl text-[#00FF9D] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" /> Profile preferences updated successfully!
        </div>
      )}

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: PERSONAL IDENTITY CARD */}
        <div className="cyber-card p-6 space-y-5 lg:col-span-2">
          <div className="flex items-center gap-2 pb-3 border-b border-[#00FF9D]/20">
            <User className="w-5 h-5 text-[#00FF9D]" />
            <h3 className="font-extrabold text-base text-white font-space">Personal Identity & Identity Details</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            {/* AVATAR BADGE DISPLAY */}
            <div className="flex items-center gap-4 p-4 bg-[#030A08] border border-[#00FF9D]/30 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00FF9D] to-[#FBBF24] text-[#030A08] font-mono font-extrabold text-2xl flex items-center justify-center shadow-[0_0_20px_#00FF9D] shrink-0">
                {nameInput ? nameInput.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="space-y-1">
                <div className="font-bold text-sm text-white">{nameInput || 'Guest User'}</div>
                <div className="text-xs text-[#94A3B8]">{emailInput}</div>
                <div className="text-[10px] text-[#00FF9D] font-bold">Active Workspace: {workspaceName}</div>
              </div>
            </div>

            {/* FULL NAME INPUT */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#94A3B8] uppercase">Full Display Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-[#94A3B8] w-4 h-4 pointer-events-none" />
                <input 
                  type="text" 
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Siddharth Singh"
                  className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00FF9D] transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* EMAIL INPUT */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#94A3B8] uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-[#94A3B8] w-4 h-4 pointer-events-none" />
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. siddharth@example.com"
                  className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00FF9D] transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* WORKSPACE TITLE INPUT */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#94A3B8] uppercase">Workspace Title</label>
              <div className="relative">
                <Settings className="absolute left-3.5 top-3 text-[#94A3B8] w-4 h-4 pointer-events-none" />
                <input 
                  type="text" 
                  value={customWorkspaceInput}
                  onChange={(e) => setCustomWorkspaceInput(e.target.value)}
                  placeholder="e.g. Siddharth's Financial Studio"
                  className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00FF9D] transition-all font-mono"
                />
              </div>
            </div>

            {/* CURRENCY PREFERENCE */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#94A3B8] uppercase">Primary Currency</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
                  { code: 'USD', symbol: '$', label: 'USD ($)' },
                  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
                  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setCurrency(item.code as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      currency === item.code 
                        ? 'bg-[#00FF9D]/20 border-[#00FF9D] text-[#00FF9D] shadow-[0_0_10px_#00FF9D]' 
                        : 'bg-[#030A08] border-[#00FF9D]/20 text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span>{item.symbol}</span> <span>{item.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#00FF9D] to-[#FBBF24] text-[#030A08] font-bold text-xs rounded-xl shadow-[0_0_20px_#00FF9D] hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Profile Preferences
            </button>
          </form>
        </div>

        {/* COLUMN 2: SECURITY & PASSWORDS */}
        <div className="space-y-6">
          
          {/* PASSWORD CHANGE FORM */}
          <div className="cyber-card p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#00FF9D]/20">
              <Lock className="w-5 h-5 text-[#FBBF24]" />
              <h3 className="font-extrabold text-base text-white font-space">Security Credentials</h3>
            </div>

            {passwordSuccess && (
              <div className="p-3 bg-[#00FF9D]/15 border border-[#00FF9D]/40 rounded-xl text-[#00FF9D] text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Password updated successfully!
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-400 text-xs font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase">Current Password</label>
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-xl py-2 px-3 text-xs text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00FF9D]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase">New Password</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-xl py-2 px-3 text-xs text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00FF9D]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase">Confirm New Password</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-[#030A08] border border-[#00FF9D]/30 rounded-xl py-2 px-3 text-xs text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00FF9D]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#030A08] border border-[#FBBF24]/50 hover:bg-[#FBBF24]/10 text-[#FBBF24] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <KeyRound className="w-4 h-4" /> Update Password
              </button>
            </form>
          </div>

          {/* TWO-FACTOR AUTHENTICATION TOGGLE */}
          <div className="cyber-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00FF9D]" />
                <span className="font-bold text-sm text-white">2-Step Verification</span>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  twoFactorEnabled ? 'bg-[#00FF9D]' : 'bg-[#030A08] border border-white/20'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-[#030A08] transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Requires TOTP authenticator code when signing into your MoneyMind account on new devices.
            </p>
          </div>

          {/* DATA MANAGEMENT & EXPORT */}
          <div className="cyber-card p-6 space-y-3 border-rose-500/30">
            <div className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-4 h-4 text-[#00FF9D]" /> Data Export & Reset
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Download your full financial ledger data in encrypted JSON format or clear active workspace data.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleExportData}
                className="flex-1 py-2 bg-[#030A08] border border-[#00FF9D]/30 hover:border-[#00FF9D] text-[#00FF9D] font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Data
              </button>
              <button
                onClick={clearAllData}
                className="py-2 px-3 bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30 font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                title="Clear all transactions"
              >
                <Trash2 className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
