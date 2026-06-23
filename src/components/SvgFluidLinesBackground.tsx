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

  // Hue drifts through blue-indigo: 210°–240°
  const hue  = 222 + Math.sin(time * 0.34) * 14;
  const hue2 = 250 + Math.sin(time * 0.21 + 1.4) * 10;
  const numLines = 26;

  const lines = Array.from({ length: numLines }).map((_, i) => {
    const mX = mouseRef.current.currentX;
    const mY = mouseRef.current.currentY;
    const isAccent = i % 5 === 0;
    const distFromCenter = Math.abs(i - numLines / 2) / (numLines / 2);
    const baseOpacity = 0.10 + (1 - distFromCenter) * 0.16;
    const opacity = isAccent ? Math.min(0.38, baseOpacity + 0.14) : baseOpacity;
    const strokeWidth = isAccent ? 1.2 : 0.65;
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
        stroke={`hsla(${lineHue.toFixed(1)}, 80%, 68%, ${opacity.toFixed(3)})`}
        strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    );
  });

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">

      {/* ── Base — dark navy, clearly blue ── */}
      <div className="absolute inset-0" style={{ background: '#070e24' }} />

      {/* ── Large blue radial fill — most of the visible color ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 120% 100% at 50% 50%, rgba(15,35,130,0.72) 0%, rgba(8,18,70,0.38) 55%, transparent 80%)',
      }} />

      {/* ── Overhead blue-white cone ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 75% 55% at 50% -10%, rgba(60,100,255,0.55) 0%, rgba(25,55,180,0.28) 42%, transparent 65%)',
      }} />

      {/* ── Left violet/indigo bloom ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 80% at -5% 50%, rgba(90,30,200,0.32) 0%, rgba(45,15,110,0.12) 52%, transparent 70%)',
      }} />

      {/* ── Right sky-blue accent ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 55% 70% at 108% 42%, rgba(30,100,240,0.28) 0%, rgba(15,55,160,0.10) 52%, transparent 70%)',
      }} />

      {/* ── Bottom blue reflection ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 50% at 50% 115%, rgba(35,70,210,0.48) 0%, rgba(18,38,130,0.20) 38%, transparent 58%)',
      }} />

      {/* ── Particle dust motes ── */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[
          { cx: 18, cy: 32, r: 0.4,  o: 0.35 }, { cx: 42, cy: 18, r: 0.32, o: 0.28 },
          { cx: 67, cy: 41, r: 0.45, o: 0.24 }, { cx: 83, cy: 22, r: 0.35, o: 0.30 },
          { cx: 29, cy: 58, r: 0.38, o: 0.26 }, { cx: 54, cy: 72, r: 0.42, o: 0.22 },
          { cx: 76, cy: 64, r: 0.30, o: 0.28 }, { cx: 11, cy: 75, r: 0.40, o: 0.22 },
          { cx: 92, cy: 48, r: 0.35, o: 0.25 }, { cx: 35, cy: 85, r: 0.45, o: 0.18 },
          { cx: 58, cy: 28, r: 0.32, o: 0.28 }, { cx: 88, cy: 70, r: 0.36, o: 0.22 },
        ].map((p, i) => {
          const pulse = 0.65 + 0.35 * Math.sin(time * 0.8 + i * 1.3);
          const ph = i % 3 === 0 ? hue2 : hue;
          return (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r}
              fill={`hsla(${ph.toFixed(0)}, 85%, 75%, ${(p.o * pulse).toFixed(3)})`} />
          );
        })}
      </svg>

      {/* ── Fluid lines ── */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {/* Light vignette only at the very edges — no heavy darkening */}
          <radialGradient id="bgVig" cx="50%" cy="50%" r="72%">
            <stop offset="35%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.42)" />
          </radialGradient>
          <linearGradient id="bgTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(0,0,0,0.40)" />
            <stop offset="22%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <linearGradient id="bgFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="78%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.38)" />
          </linearGradient>
        </defs>
        {lines}
        <rect width="100" height="100" fill="url(#bgVig)" />
        <rect width="100" height="100" fill="url(#bgTop)" />
        <rect width="100" height="100" fill="url(#bgFloor)" />
      </svg>

      {/* ── Subtle geometry guide lines ── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.09]" viewBox="0 0 1080 540" preserveAspectRatio="none">
        <line x1="540" y1="270" x2="0"    y2="140" stroke="#6699ff" strokeWidth="0.6" strokeDasharray="4 8" />
        <line x1="540" y1="270" x2="1080" y2="400" stroke="#6699ff" strokeWidth="0.6" strokeDasharray="4 8" />
        <line x1="540" y1="270" x2="280"  y2="540" stroke="#8866ff" strokeWidth="0.5" strokeDasharray="3 10" />
        <circle cx="540" cy="270" r="2" fill="#6699ff" opacity="0.6" />
      </svg>

    </div>
  );
};

export default SvgFluidLinesBackground;
