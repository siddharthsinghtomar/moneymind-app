'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) return;
    
    const verify = async () => {
      setStatus('loading');
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Verification failed');
        
        setStatus('success');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err: any) {
        setErrorMsg(err.message);
        setStatus('error');
      }
    };
    
    verify();
  }, [token, router]);

  if (!token) {
    return (
      <div className="text-center p-8">
        <XCircle className="w-12 h-12 text-[#F2645A] mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No verification token found</h2>
        <p className="text-[var(--text-lo)] text-sm mb-6">
          The link you followed seems to be broken or incomplete.
        </p>
        <Link href="/login" className="inline-flex items-center text-[#E8823D] hover:underline font-medium">
          Back to login <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 text-center">
      {status === 'loading' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-[#E8823D] mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-xl font-semibold mb-2">Verifying your email...</h2>
          <p className="text-[var(--text-lo)] text-sm">Please wait a moment.</p>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#34D399]/10 flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-[#34D399]" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Email verified successfully!</h2>
          <p className="text-[var(--text-lo)] text-sm mb-2">Thank you for confirming your email address.</p>
          <p className="text-[#34D399] text-sm animate-pulse">Redirecting to login...</p>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#F2645A]/10 flex items-center justify-center mb-6">
            <XCircle className="w-8 h-8 text-[#F2645A]" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Verification failed</h2>
          <p className="text-[var(--text-lo)] text-sm mb-6">{errorMsg}</p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full py-3 px-4 bg-[var(--ink)] border border-[var(--border)] text-white rounded-xl font-medium hover:bg-white/5 transition-colors"
          >
            Request new link
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel"
      >
        <Suspense fallback={<div className="p-10 text-center"><p className="text-[var(--text-lo)]">Loading...</p></div>}>
          <VerifyEmailContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
