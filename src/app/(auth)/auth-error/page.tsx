'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An unexpected error occurred during authentication.';
  
  if (error === 'OAuthAccountNotLinked') {
    errorMessage = 'This email is already associated with another sign-in method. Please sign in with the original provider.';
  } else if (error === 'OAuthSignin' || error === 'OAuthCallback') {
    errorMessage = 'Could not sign in with this provider. Please try again or use another method.';
  } else if (error === 'AccessDenied') {
    errorMessage = 'You do not have permission to sign in.';
  } else if (error === 'Configuration') {
    errorMessage = 'There is a problem with the server configuration.';
  } else if (error === 'Verification') {
    errorMessage = 'The sign in link is no longer valid. It may have been used already or it expired.';
  } else if (error) {
    errorMessage = decodeURIComponent(error);
  }

  return (
    <div className="p-8 sm:p-10 relative z-10 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#F2645A]/10 flex items-center justify-center border border-[#F2645A]/20">
          <AlertTriangle className="w-8 h-8 text-[#F2645A]" />
        </div>
      </div>
      
      <h2 className="text-2xl font-space font-bold mb-4">Authentication Error</h2>
      
      <div className="bg-[var(--ink)] border border-[#F2645A]/20 rounded-xl p-4 mb-8">
        <p className="text-[#F2645A] text-sm">{errorMessage}</p>
      </div>

      <div className="space-y-3">
        <Link href="/login" className="w-full py-3 px-4 bg-gradient-to-r from-[#E8823D] to-[#F29455] text-white rounded-xl font-medium shadow-lg shadow-[#E8823D]/20 hover:shadow-[#E8823D]/40 transition-all flex justify-center items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Try Again
        </Link>
        
        <a href="mailto:support@moneymind.com" className="w-full py-3 px-4 bg-transparent border border-[var(--border)] text-white rounded-xl font-medium hover:bg-white/5 transition-colors flex justify-center items-center text-sm">
          <ExternalLink className="w-4 h-4 mr-2" />
          Contact Support
        </a>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#F2645A]/10 rounded-full blur-[128px] mix-blend-screen pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md glass-panel"
      >
        <Suspense fallback={<div className="p-10 text-center"><p className="text-[var(--text-lo)]">Loading...</p></div>}>
          <AuthErrorContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
