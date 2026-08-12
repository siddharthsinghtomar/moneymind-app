import React from 'react';

export default function Divider({ text = 'OR' }: { text?: string }) {
  return (
    <div className="relative flex items-center py-4">
      <div className="flex-grow border-t border-white/10"></div>
      <span className="flex-shrink-0 mx-4 text-sm text-[#8B93A7]">{text}</span>
      <div className="flex-grow border-t border-white/10"></div>
    </div>
  );
}
