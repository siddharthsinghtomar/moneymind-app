'use client';

import React, { useRef, useState, KeyboardEvent } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function OTPInput({ value, onChange, disabled }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array.from({ length: 6 }).fill('') as string[]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^[0-9]*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    onChange(newOtp.join(''));

    if (val && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between w-full max-w-sm mx-auto gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled}
          className="w-12 h-14 text-center text-xl font-bold bg-[#121A2B] border border-white/10 rounded-xl focus:border-[#E8823D] focus:ring-1 focus:ring-[#E8823D] outline-none text-[#F5F3EE] transition-all disabled:opacity-50"
        />
      ))}
    </div>
  );
}
