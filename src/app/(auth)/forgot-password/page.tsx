'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E8823D]/10 rounded-full blur-[128px] mix-blend-screen pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 sm:p-10 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#E8823D]/10 flex items-center justify-center border border-[#E8823D]/20">
              <Mail className="w-8 h-8 text-[#E8823D]" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-space font-bold mb-2">Forgot your password?</h2>
            <p className="text-[var(--text-lo)] text-sm">
              No worries. Enter your email and we'll send you a secure reset link.
            </p>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#34D399]/10 border border-[#34D399]/20 rounded-xl p-4 flex items-center space-x-3 text-[#34D399] mb-6"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">Reset link sent! Check your inbox.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[var(--text-lo)]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-[var(--ink)] border border-[var(--border)] rounded-xl text-sm placeholder:text-[var(--text-lo)] focus:outline-none focus:border-[#E8823D] focus:ring-1 focus:ring-[#E8823D] transition-all"
                    placeholder="name@example.com"
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
                className="w-full py-3 px-4 bg-gradient-to-r from-[#E8823D] to-[#F29455] text-white rounded-xl font-medium shadow-lg shadow-[#E8823D]/20 hover:shadow-[#E8823D]/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center text-sm text-[var(--text-lo)] hover:text-[#E8823D] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
