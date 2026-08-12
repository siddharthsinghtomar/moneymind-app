'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="w-12 h-12 text-[#F2645A] mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Invalid Reset Link</h2>
        <p className="text-[var(--text-lo)] text-sm mb-6">
          This password reset link is missing or invalid.
        </p>
        <button onClick={() => router.push('/forgot-password')} className="text-[#E8823D] hover:underline">
          Request a new link
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 relative z-10">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#E8823D]/10 flex items-center justify-center border border-[#E8823D]/20">
          <Lock className="w-8 h-8 text-[#E8823D]" />
        </div>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-space font-bold mb-2">Create new password</h2>
        <p className="text-[var(--text-lo)] text-sm">
          Enter a strong password for your MoneyMind account.
        </p>
      </div>

      {success ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#34D399]/10 border border-[#34D399]/20 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 text-[#34D399] text-center"
        >
          <CheckCircle className="w-8 h-8 flex-shrink-0" />
          <div>
            <p className="font-medium">Password updated!</p>
            <p className="text-sm opacity-80 mt-1">Redirecting to login...</p>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[var(--text-lo)]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 bg-[var(--ink)] border border-[var(--border)] rounded-xl text-sm placeholder:text-[var(--text-lo)] focus:outline-none focus:border-[#E8823D] focus:ring-1 focus:ring-[#E8823D] transition-all"
                placeholder="New password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-[var(--text-lo)] hover:text-white" />
                ) : (
                  <Eye className="h-5 w-5 text-[var(--text-lo)] hover:text-white" />
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[var(--text-lo)]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 bg-[var(--ink)] border border-[var(--border)] rounded-xl text-sm placeholder:text-[var(--text-lo)] focus:outline-none focus:border-[#E8823D] focus:ring-1 focus:ring-[#E8823D] transition-all"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-[#F2645A]/10 border border-[#F2645A]/20 rounded-xl p-3 flex items-start space-x-2 text-[#F2645A]">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#E8823D] to-[#F29455] text-white rounded-xl font-medium shadow-lg shadow-[#E8823D]/20 hover:shadow-[#E8823D]/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-6"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E8823D]/10 rounded-full blur-[128px] mix-blend-screen pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md glass-panel"
      >
        <Suspense fallback={<div className="p-10 text-center"><p className="text-[var(--text-lo)]">Loading...</p></div>}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
