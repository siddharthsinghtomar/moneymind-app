import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function LoadingButton({ loading, children, className = '', disabled, ...props }: LoadingButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={`relative flex items-center justify-center transition-all ${className} ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
      {...props}
    >
      {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
      {children}
    </button>
  );
}
