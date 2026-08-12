import React from 'react';

interface PasswordStrengthProps {
  password?: string;
}

export default function PasswordStrength({ password = '' }: PasswordStrengthProps) {
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getStrength(password);

  const getLabel = () => {
    switch (strength) {
      case 0: return 'Too short';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const getColor = () => {
    if (strength <= 1) return 'bg-[#F2645A]';
    if (strength === 2) return 'bg-[#E8823D]';
    if (strength >= 3) return 'bg-[#34D399]';
    return 'bg-white/10';
  };

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex gap-1 h-1.5 w-full">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`flex-1 rounded-full transition-all duration-300 ${password.length > 0 && strength >= level ? getColor() : 'bg-white/10'}`}
          />
        ))}
      </div>
      {password.length > 0 && (
        <span className="text-xs text-[#8B93A7] text-right font-medium">{getLabel()}</span>
      )}
    </div>
  );
}
