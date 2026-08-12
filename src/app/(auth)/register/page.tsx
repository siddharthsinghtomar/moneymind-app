'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';

import SocialLogin from '@/components/auth/SocialLogin';
import PasswordStrength from '@/components/auth/PasswordStrength';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must agree to the Terms of Service'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password, confirmPassword: data.confirmPassword }),
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(resData.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('mm_user_name', data.name);
        localStorage.setItem('mm_user_email', data.email);
        document.cookie = "mm_auth_session=true; path=/; max-age=2592000; SameSite=Lax";
      }

      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto bg-[#141c22] border border-white/[0.08] p-8 text-center rounded-3xl shadow-2xl space-y-4"
      >
        <div className="w-16 h-16 bg-[#6db89a]/20 text-[#6db89a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#6db89a]/30">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-space font-extrabold text-[#d4e4dc]">Account Created!</h2>
        <p className="text-xs text-[#7a9e8e] leading-relaxed">
          Your MoneyMind workspace has been prepared. Click below to jump straight to your dashboard.
        </p>
        <div className="pt-2 space-y-3">
          <Link href="/dashboard" className="block w-full bg-[#6db89a] text-[#0f1a15] font-bold py-3.5 rounded-xl text-xs text-center shadow-lg hover:brightness-110 transition-all">
            Continue to Dashboard →
          </Link>
          <Link href="/login" className="block w-full bg-[#1f2e3a] hover:bg-[#253746] border border-white/[0.08] py-3 rounded-xl font-semibold text-xs text-[#7a9e8e] hover:text-[#d4e4dc] text-center transition-colors">
            Back to Login
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[1080px] bg-[#141c22] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2"
    >
      {/* LEFT FORM PANEL */}
      <div className="p-8 sm:p-10 space-y-5 bg-[#141c22]">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-full bg-[#6db89a] text-[#0f1a15] font-extrabold flex items-center justify-center font-space text-xs">
              M
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[#d4e4dc] font-space">
              MoneyMind <span className="text-[#6db89a] font-mono text-[10px]">AI</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-space font-extrabold text-[#d4e4dc] mb-1">Create your account</h2>
          <p className="text-xs text-[#7a9e8e] font-mono">Start your 14-day free trial. No credit card required.</p>
        </div>

        <SocialLogin />

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-white/[0.08]"></div>
          <span className="flex-shrink-0 mx-4 text-xs text-[#7a9e8e] font-mono">or register with email</span>
          <div className="flex-grow border-t border-white/[0.08]"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {error && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono">
              {error}
            </div>
          )}

          {/* FULL NAME */}
          <div>
            <label className="block text-xs font-semibold text-[#7a9e8e] mb-1">Full Name</label>
            <div className="relative">
              <input 
                {...register('name')}
                type="text"
                placeholder="Jane Doe"
                className="w-full bg-[#1f2e3a] border border-white/[0.08] rounded-xl py-2.5 px-3.5 text-xs text-[#d4e4dc] placeholder-[#7a9e8e]/50 focus:outline-none focus:border-[#6db89a] transition-all font-mono"
              />
            </div>
            {errors.name && <p className="text-[11px] text-[#e07070] font-mono mt-1">{errors.name.message}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-semibold text-[#7a9e8e] mb-1">Email Address</label>
            <div className="relative">
              <input 
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#1f2e3a] border border-white/[0.08] rounded-xl py-2.5 px-3.5 text-xs text-[#d4e4dc] placeholder-[#7a9e8e]/50 focus:outline-none focus:border-[#6db89a] transition-all font-mono"
              />
            </div>
            {errors.email && <p className="text-[11px] text-[#e07070] font-mono mt-1">{errors.email.message}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-[#7a9e8e] mb-1">Password</label>
            <div className="relative mb-1">
              <input 
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-[#1f2e3a] border border-white/[0.08] rounded-xl py-2.5 pl-3.5 pr-9 text-xs text-[#d4e4dc] placeholder-[#7a9e8e]/50 focus:outline-none focus:border-[#6db89a] transition-all font-mono"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#7a9e8e] hover:text-[#d4e4dc] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrength password={passwordValue} />
            {errors.password && <p className="text-[11px] text-[#e07070] font-mono mt-1">{errors.password.message}</p>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-[#7a9e8e] mb-1">Confirm Password</label>
            <div className="relative">
              <input 
                {...register('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-[#1f2e3a] border border-white/[0.08] rounded-xl py-2.5 pl-3.5 pr-9 text-xs text-[#d4e4dc] placeholder-[#7a9e8e]/50 focus:outline-none focus:border-[#6db89a] transition-all font-mono"
              />
            </div>
            {errors.confirmPassword && <p className="text-[11px] text-[#e07070] font-mono mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* TERMS */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" {...register('terms')} className="mt-0.5 rounded border-white/20 bg-[#1f2e3a] text-[#6db89a] focus:ring-[#6db89a]" />
              <span className="text-xs text-[#7a9e8e] leading-relaxed">
                I agree to the <Link href="/terms" className="text-[#6db89a] hover:underline font-medium">Terms of Service</Link> and <Link href="/privacy" className="text-[#6db89a] hover:underline font-medium">Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <p className="text-[11px] text-[#e07070] font-mono mt-1">{errors.terms.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#6db89a] hover:bg-[#5ca688] text-[#0f1a15] font-bold py-3.5 rounded-xl text-xs shadow-lg hover:shadow-[#6db89a]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Free Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#7a9e8e] pt-2 border-t border-white/[0.06]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#6db89a] hover:underline font-bold">
            Log in
          </Link>
        </p>
      </div>

      {/* RIGHT FEATURE PANEL */}
      <div className="hidden md:flex bg-[#141c22] p-10 flex-col justify-between relative border-l border-white/[0.06]">
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#6db89a] text-[#0f1a15] flex items-center justify-center shadow-lg shadow-[#6db89a]/20">
            <span className="text-xl font-bold font-space">M</span>
          </div>
          <h2 className="text-3xl font-space font-extrabold text-[#d4e4dc] leading-tight">
            Your AI-powered <br/>
            <span className="text-[#6db89a] italic font-serif font-normal">financial companion</span>
          </h2>
          
          <div className="space-y-3 pt-2 text-xs text-[#7a9e8e]">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1b2530] border border-white/[0.06] text-[#d4e4dc] font-medium shadow-sm">
              <Sparkles className="w-4 h-4 text-[#6db89a]" /> Automated Expense Tagging & OCR Scanner
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1b2530] border border-white/[0.06] text-[#d4e4dc] font-medium shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#c9a96e]" /> Real-time Overspending Radar
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1b2530] border border-white/[0.06] text-[#d4e4dc] font-medium shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#6db89a]" /> Bank-grade 256-bit SSL Security
            </div>
          </div>
        </div>

        <div className="bg-[#1b2530] border border-white/[0.06] p-5 rounded-2xl text-xs space-y-2 mt-8 shadow-md">
          <p className="text-[#d4e4dc] italic leading-relaxed">
            "MoneyMind caught ₹4,200 in recurring bills I forgot I was paying for. The AI coach is essential!"
          </p>
          <div className="font-bold text-[#6db89a] pt-1 font-mono">— Siddharth Singh Tomar, Founder & CEO</div>
        </div>
      </div>
    </motion.div>
  );
}
