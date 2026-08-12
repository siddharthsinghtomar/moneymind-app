'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, TrendingUp, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import SocialLogin from '@/components/auth/SocialLogin';

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setAuthError('');
    try {
      const lowerEmail = data.email.toLowerCase().trim();
      const defaultName = lowerEmail.split('@')[0];
      const displayName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

      const res = await signIn('credentials', {
        email: lowerEmail,
        password: data.password,
        redirect: false,
      });

      if (res?.error && res?.status === 401) {
        setAuthError('Invalid email or password. Please check your credentials or create an account first.');
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('mm_user_name', displayName);
        localStorage.setItem('mm_user_email', lowerEmail);
        document.cookie = "mm_auth_session=true; path=/; max-age=2592000; SameSite=Lax";
      }

      window.location.href = '/dashboard';
    } catch {
      setAuthError('Authentication error. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[1080px] bg-[#141c22] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2 min-h-[640px]"
    >
      {/* LEFT PREVIEW & HERO PANEL */}
      <div className="p-8 sm:p-10 flex flex-col justify-between border-r border-white/[0.06] bg-[#141c22] relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          {/* BRAND HEADER */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#6db89a] text-[#0f1a15] font-extrabold flex items-center justify-center font-space text-sm shadow-[0_0_15px_rgba(109,184,154,0.4)]">
              M
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#d4e4dc] font-space">
              MoneyMind <span className="text-[#6db89a] font-mono text-xs font-semibold">AI</span>
            </span>
          </div>

          {/* EYEBROW & TITLE */}
          <div className="space-y-2 pt-2">
            <div className="text-[#6db89a] font-mono text-[10px] tracking-[0.2em] font-semibold uppercase flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#6db89a]"></span> INTELLIGENT WEALTH TRACKING
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#d4e4dc] tracking-tight leading-snug font-space">
              Your wealth, <br />
              <span className="text-[#6db89a] italic font-serif font-normal">intelligently managed.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#7a9e8e] leading-relaxed font-sans max-w-md pt-1">
              AI-powered insights across all your accounts — savings, investments, and spending — unified in one view.
            </p>
          </div>

          {/* PORTFOLIO CHART CARD PREVIEW */}
          <div className="bg-[#1b2530] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] font-mono text-[#7a9e8e] uppercase tracking-wider">Total Portfolio</div>
                <div className="text-2xl font-extrabold text-[#d4e4dc] font-space mt-0.5">₹14,50,000</div>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#6db89a]/15 text-[#6db89a] border border-[#6db89a]/30 text-xs font-mono font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +8.4% this year
              </div>
            </div>

            {/* CURVED SVG GRAPH */}
            <div className="relative h-16 w-full pt-1">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="mintGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6db89a" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6db89a" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,45 C 50,42 90,48 130,35 C 170,22 220,25 300,8 L 300,60 L 0,60 Z"
                  fill="url(#mintGrad)"
                />
                <path
                  d="M 0,45 C 50,42 90,48 130,35 C 170,22 220,25 300,8"
                  fill="none"
                  stroke="#6db89a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="300" cy="8" r="4" fill="#6db89a" className="animate-ping" />
                <circle cx="300" cy="8" r="4" fill="#6db89a" />
              </svg>
            </div>

            {/* METRICS BOTTOM ROW */}
            <div className="grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3 text-[11px] font-mono">
              <div>
                <div className="text-[10px] text-[#7a9e8e]">Net Worth</div>
                <div className="font-bold text-[#d4e4dc] font-space mt-0.5">₹14,50,000</div>
                <div className="text-[#6db89a] text-[10px] font-bold">+8.4%</div>
              </div>
              <div>
                <div className="text-[10px] text-[#7a9e8e]">Monthly Savings</div>
                <div className="font-bold text-[#d4e4dc] font-space mt-0.5">₹38,200</div>
                <div className="text-[#6db89a] text-[10px] font-bold">+12.1%</div>
              </div>
              <div>
                <div className="text-[10px] text-[#7a9e8e]">Investments</div>
                <div className="font-bold text-[#d4e4dc] font-space mt-0.5">₹9,12,000</div>
                <div className="text-[#6db89a] text-[10px] font-bold">+5.7%</div>
              </div>
            </div>
          </div>

          {/* AI INSIGHT CARD */}
          <div className="bg-[#1b2530] border border-[#c9a96e]/30 rounded-xl p-3.5 flex items-start gap-3 shadow-md">
            <div className="p-2 rounded-lg bg-[#c9a96e]/15 text-[#c9a96e] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-[#c9a96e] font-mono">AI Insight</div>
              <div className="text-[#7a9e8e] leading-snug">
                You could save ₹4,200/mo by switching to a zero-fee savings account.
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BADGES */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#7a9e8e] font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6db89a]" /> 256-bit SSL
          </span>
          <span className="flex items-center gap-1">
            <LockKeyhole className="w-3.5 h-3.5 text-[#c9a96e]" /> Bank-grade security
          </span>
          <span>• Read-only access</span>
        </div>
      </div>

      {/* RIGHT AUTH FORM PANEL */}
      <div className="p-8 sm:p-10 flex flex-col justify-between bg-[#141c22]">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#d4e4dc] font-space mb-1">Welcome back</h2>
            <p className="text-xs text-[#7a9e8e] font-mono">Sign in to your MoneyMind dashboard.</p>
          </div>

          {/* GOOGLE AUTH BUTTON */}
          <SocialLogin />

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/[0.08]"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-[#7a9e8e] font-mono">or sign in with email</span>
            <div className="flex-grow border-t border-white/[0.08]"></div>
          </div>

          {authError && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* EMAIL ADDRESS */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#7a9e8e]">Email address</label>
              <div className="relative flex items-center">
                <input 
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-[#1f2e3a] border border-white/[0.08] rounded-xl py-3 px-4 text-xs text-[#d4e4dc] placeholder-[#7a9e8e]/50 focus:outline-none focus:border-[#6db89a] transition-all font-mono"
                />
              </div>
              {errors.email && <p className="text-[11px] text-[#e07070] font-mono">{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-[#7a9e8e]">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#7a9e8e] hover:text-[#6db89a] transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-[#1f2e3a] border border-white/[0.08] rounded-xl py-3 pl-4 pr-10 text-xs text-[#d4e4dc] placeholder-[#7a9e8e]/50 focus:outline-none focus:border-[#6db89a] transition-all font-mono"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#7a9e8e] hover:text-[#d4e4dc] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-[#e07070] font-mono">{errors.password.message}</p>}
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center gap-2.5 pt-1">
              <input 
                type="checkbox" 
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-[#1f2e3a] text-[#6db89a] focus:ring-[#6db89a] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-[#7a9e8e] cursor-pointer">Remember me on this device</label>
            </div>

            {/* SIGN IN BUTTON */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#6db89a] hover:bg-[#5ca688] text-[#0f1a15] font-bold py-3.5 rounded-xl text-xs shadow-lg hover:shadow-[#6db89a]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? 'Signing In...' : 'Sign In To Dashboard'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="space-y-4 pt-6 mt-6 border-t border-white/[0.06] text-center">
          <div className="text-[11px] text-[#7a9e8e] font-mono flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6db89a]" /> Protected by 256-bit SSL encryption
          </div>
          <div className="text-xs text-[#7a9e8e]">
            New to MoneyMind?{' '}
            <Link href="/register" className="text-[#6db89a] hover:underline font-bold">
              Create a free account
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
