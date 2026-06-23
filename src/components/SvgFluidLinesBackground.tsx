import React, { useEffect, useRef, useState } from "react";

export const SvgFluidLinesBackground = () => {
  const [time, setTime] = useState(0);
  const mouseRef = useRef({ targetX: 50, targetY: 50, currentX: 50, currentY: 50 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 100;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 100;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = (e.touches[0].clientX / window.innerWidth) * 100;
        mouseRef.current.targetY = (e.touches[0].clientY / window.innerHeight) * 100;
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useEffect(() => {
    let id: number;
    const start = performance.now();
    const loop = (now: number) => {
      setTime((now - start) / 1000 * 0.22);
      const m = mouseRef.current;
      m.currentX += (m.targetX - m.currentX) * 0.055;
      m.currentY += (m.targetY - m.currentY) * 0.055;
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  // Hue locked to green/teal arena range: 128°–155° (breathes slowly)
  const hue = 138 + Math.sin(time * 0.38) * 13;
  const numLines = 24;

  const lines = Array.from({ length: numLines }).map((_, i) => {
    const mX = mouseRef.current.currentX;
    const mY = mouseRef.current.currentY;
    const isAccent = i % 5 === 0;
    const distFromCenter = Math.abs(i - numLines / 2) / (numLines / 2);
    const baseOpacity = 0.04 + (1 - distFromCenter) * 0.08;
    const opacity = isAccent ? Math.min(0.22, baseOpacity + 0.1) : baseOpacity;
    const strokeWidth = isAccent ? 1.1 : 0.55;

    let path = "";
    for (let x = 0; x <= 100; x += 1) {
      const baseY = -18 + (i / numLines) * 136;
      const y1 = Math.sin(x * 0.05 + time + i * 0.2) * 6;
      const y2 = Math.sin(x * 0.03 - time * 0.65 + i * 0.11) * 9;
      const y3 = Math.sin(x * 0.018 + time * 0.3) * 14;
      let cy = baseY + y1 + y2 + y3;

      const dx = x - mX;
      const dy = cy - mY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 28) {
        const inf = Math.pow(1 - dist / 28, 2);
        cy += (dy / 28) * inf * 10;
      }
      path += x === 0 ? `M ${x} ${cy.toFixed(2)} ` : `L ${x} ${cy.toFixed(2)} `;
    }

    return (
      <path key={i} d={path} fill="none"
        stroke={`hsla(${hue.toFixed(1)}, 78%, 58%, ${opacity.toFixed(3)})`}
        strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    );
  });

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
      {/* ── Deep arena base ── */}
      <div className="absolute inset-0" style={{ background: '#020508' }} />

      {/* ── Overhead arena lamp — green cone from top-center ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(0,55,22,0.62) 0%, rgba(0,28,10,0.22) 45%, transparent 72%)',
      }} />

      {/* ── Felt table reflection — warm green glow from below ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 50% at 50% 115%, rgba(0,90,32,0.42) 0%, rgba(0,45,16,0.16) 38%, transparent 62%)',
      }} />

      {/* ── Subtle side atmosphere — pinched darkness left & right ── */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.38) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.38) 100%)',
      }} />

      {/* ── Particle field — tiny floating dust motes ── */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[
          { cx: 18, cy: 32, r: 0.35, o: 0.18 }, { cx: 42, cy: 18, r: 0.28, o: 0.14 },
          { cx: 67, cy: 41, r: 0.4,  o: 0.12 }, { cx: 83, cy: 22, r: 0.3,  o: 0.16 },
          { cx: 29, cy: 58, r: 0.32, o: 0.13 }, { cx: 54, cy: 72, r: 0.38, o: 0.1 },
          { cx: 76, cy: 64, r: 0.25, o: 0.15 }, { cx: 11, cy: 75, r: 0.35, o: 0.11 },
          { cx: 92, cy: 48, r: 0.3,  o: 0.13 }, { cx: 35, cy: 85, r: 0.4,  o: 0.09 },
        ].map((p, i) => {
          const pulse = 0.6 + 0.4 * Math.sin(time * 0.8 + i * 1.3);
          return (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r}
              fill={`hsla(${hue.toFixed(0)}, 75%, 70%, ${(p.o * pulse).toFixed(3)})`} />
          );
        })}
      </svg>

      {/* ── Fluid lines SVG ── */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="arenaSpot" cx="50%" cy="110%" r="65%">
            <stop offset="0%" stopColor="rgba(0,55,20,0.25)" />
            <stop offset="55%" stopColor="rgba(0,22,8,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <radialGradient id="arenaVig" cx="50%" cy="50%" r="72%">
            <stop offset="20%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.68)" />
          </radialGradient>
          <linearGradient id="arenaTip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
            <stop offset="30%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <linearGradient id="arenaFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="70%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#arenaSpot)" />
        {lines}
        <rect width="100" height="100" fill="url(#arenaVig)" />
        <rect width="100" height="100" fill="url(#arenaTip)" />
        <rect width="100" height="100" fill="url(#arenaFloor)" />
      </svg>

      {/* ── Subtle green aiming line geometry ── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1080 540" preserveAspectRatio="none">
        {/* Trajectory lines emanating from center */}
        <line x1="540" y1="270" x2="0" y2="140" stroke="#00d26a" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="540" y1="270" x2="1080" y2="400" stroke="#00d26a" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="540" y1="270" x2="280" y2="540" stroke="#00d26a" strokeWidth="0.4" strokeDasharray="3 10" />
        <circle cx="540" cy="270" r="1.5" fill="#00d26a" opacity="0.5" />
      </svg>
    </div>
  );
};

export default SvgFluidLinesBackground;
