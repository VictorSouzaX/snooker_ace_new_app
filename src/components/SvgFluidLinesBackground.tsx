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

  // Hue drifts gently through blue-indigo: 205°–238°
  const hue = 220 + Math.sin(time * 0.34) * 16;
  // Secondary hue for accent — sits in the violet-blue range
  const hue2 = 248 + Math.sin(time * 0.21 + 1.4) * 12;
  const numLines = 26;

  const lines = Array.from({ length: numLines }).map((_, i) => {
    const mX = mouseRef.current.currentX;
    const mY = mouseRef.current.currentY;
    const isAccent = i % 5 === 0;
    const distFromCenter = Math.abs(i - numLines / 2) / (numLines / 2);
    const baseOpacity = 0.035 + (1 - distFromCenter) * 0.075;
    const opacity = isAccent ? Math.min(0.2, baseOpacity + 0.09) : baseOpacity;
    const strokeWidth = isAccent ? 1.05 : 0.52;
    // Alternate some lines toward the violet accent hue for richness
    const lineHue = i % 7 === 3 ? hue2 : hue;

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
        stroke={`hsla(${lineHue.toFixed(1)}, 72%, 62%, ${opacity.toFixed(3)})`}
        strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    );
  });

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">

      {/* ── Deep midnight base ── */}
      <div className="absolute inset-0" style={{ background: '#01040e' }} />

      {/* ── Overhead blue cone — cool overhead lighting ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 82% 58% at 50% -8%, rgba(18,45,165,0.52) 0%, rgba(10,22,90,0.22) 42%, transparent 68%)',
      }} />

      {/* ── Left-side indigo/violet bloom ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 55% 75% at -8% 48%, rgba(62,20,148,0.22) 0%, rgba(30,10,80,0.08) 50%, transparent 70%)',
      }} />

      {/* ── Right-side sky-blue accent ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 48% 65% at 108% 38%, rgba(16,80,210,0.16) 0%, rgba(8,40,110,0.06) 50%, transparent 70%)',
      }} />

      {/* ── Floor reflection — deep blue from below ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 88% 48% at 50% 118%, rgba(24,55,190,0.34) 0%, rgba(12,28,100,0.14) 36%, transparent 58%)',
      }} />

      {/* ── Centre depth — very faint blue haze at screen middle ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 52%, rgba(14,35,140,0.12) 0%, transparent 68%)',
      }} />

      {/* ── Edge vignette ── */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.46) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.46) 100%)',
      }} />

      {/* ── Particle dust motes ── */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[
          { cx: 18, cy: 32, r: 0.35, o: 0.18 }, { cx: 42, cy: 18, r: 0.28, o: 0.14 },
          { cx: 67, cy: 41, r: 0.4,  o: 0.11 }, { cx: 83, cy: 22, r: 0.3,  o: 0.15 },
          { cx: 29, cy: 58, r: 0.32, o: 0.12 }, { cx: 54, cy: 72, r: 0.38, o: 0.10 },
          { cx: 76, cy: 64, r: 0.25, o: 0.14 }, { cx: 11, cy: 75, r: 0.35, o: 0.10 },
          { cx: 92, cy: 48, r: 0.30, o: 0.12 }, { cx: 35, cy: 85, r: 0.4,  o: 0.08 },
          { cx: 58, cy: 28, r: 0.28, o: 0.13 }, { cx: 88, cy: 70, r: 0.32, o: 0.10 },
        ].map((p, i) => {
          const pulse = 0.6 + 0.4 * Math.sin(time * 0.8 + i * 1.3);
          // Alternate between main blue and violet-blue
          const ph = i % 3 === 0 ? hue2 : hue;
          return (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r}
              fill={`hsla(${ph.toFixed(0)}, 72%, 72%, ${(p.o * pulse).toFixed(3)})`} />
          );
        })}
      </svg>

      {/* ── Fluid lines ── */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="bgSpot" cx="50%" cy="110%" r="65%">
            <stop offset="0%" stopColor="rgba(18,45,160,0.2)" />
            <stop offset="55%" stopColor="rgba(8,20,70,0.07)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <radialGradient id="bgVig" cx="50%" cy="50%" r="72%">
            <stop offset="20%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.72)" />
          </radialGradient>
          <linearGradient id="bgTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0.65)" />
            <stop offset="28%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <linearGradient id="bgFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="72%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.58)" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#bgSpot)" />
        {lines}
        <rect width="100" height="100" fill="url(#bgVig)" />
        <rect width="100" height="100" fill="url(#bgTop)" />
        <rect width="100" height="100" fill="url(#bgFloor)" />
      </svg>

      {/* ── Subtle geometry lines — blue-cyan ── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.055]" viewBox="0 0 1080 540" preserveAspectRatio="none">
        <line x1="540" y1="270" x2="0"    y2="140" stroke="#4488ff" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="540" y1="270" x2="1080" y2="400" stroke="#4488ff" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="540" y1="270" x2="280"  y2="540" stroke="#6644ff" strokeWidth="0.4" strokeDasharray="3 10" />
        <circle cx="540" cy="270" r="1.5" fill="#4488ff" opacity="0.5" />
      </svg>

    </div>
  );
};

export default SvgFluidLinesBackground;
