'use client';

import React, { useEffect, useState } from 'react';

export const CyberParticleCanvas: React.FC = () => {
  const [booting, setBooting] = useState(false);
  const [bootPct, setBootPct] = useState(100);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mm_user_name');
      if (saved) setUserName(saved);
    }

    // 2. INTERACTIVE CANVAS CONSTELLATION PARTICLES (MINT & GOLD)
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }> = [];
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 20));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
        color: i % 4 === 0 ? '#c9a96e' : '#6db89a'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw constellation connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(109, 184, 154, ${0.14 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // 3. CURSOR GLOW FOLLOWER
    const cursorGlow = document.getElementById('cursor-glow');
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorGlow) {
        cursorGlow.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* BOOT SCREEN LOADER */}
      {booting && (
        <div className="fixed inset-0 z-[999] bg-[#141c22] flex flex-col items-center justify-center font-mono text-[#6db89a] transition-opacity duration-300">
          <div className="text-[11px] tracking-[0.2em] text-[#7a9e8e] mb-4">INITIALIZING MONEYMIND STUDIO...</div>
          <div className="w-64 h-1 bg-[#1f2e3a] rounded-full overflow-hidden border border-white/[0.08]">
            <div
              className="h-full bg-[#6db89a] transition-all duration-75 shadow-md"
              style={{ width: `${bootPct}%` }}
            />
          </div>
          <div className="mt-3 text-xs text-[#d4e4dc] font-bold">{bootPct}%</div>
          <div className="mt-6 text-sm text-[#c9a96e] font-bold tracking-wider">
            Welcome, {userName}.
          </div>
        </div>
      )}

      {/* PARTICLE CANVAS & CURSOR GLOW */}
      <canvas id="particle-canvas" className="fixed inset-0 pointer-events-none z-0 opacity-40" />
      <div id="cursor-glow" className="fixed top-0 left-0 w-[520px] h-[520px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(109,184,154,0.08),rgba(201,169,110,0.04)_45%,transparent_70%)] transition-transform duration-75" />
    </>
  );
};
