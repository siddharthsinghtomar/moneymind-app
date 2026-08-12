import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#141c22] text-[#d4e4dc] relative flex flex-col justify-center items-center py-8 px-4 font-sans selection:bg-[#6db89a]/30">
      {/* AMBIENT GLOW ORBS */}
      <div className="glow glow-1 pointer-events-none" />
      <div className="glow glow-2 pointer-events-none" />
      <div className="bg-grid" />
      
      <div className="w-full max-w-[1100px] relative z-10 my-auto flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
