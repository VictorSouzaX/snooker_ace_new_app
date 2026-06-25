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

  // Vibrant green: hue drifts 132°–152°
  const hue  = 140 + Math.sin(time * 0.34) * 10;
  const hue2 = 155 + Math.sin(time * 0.21 + 1.4) * 8;
  const numLines = 38;

  const lines = Array.from({ length: numLines }).map((_, i) => {
    const mX = mouseRef.current.currentX;
    const mY = mouseRef.current.currentY;
    const isBright  = i % 4 === 0;
    const isAccent  = i % 9 === 3;
    const distFromCenter = Math.abs(i - numLines / 2) / (numLines / 2);
    const baseOpacity = 0.28 + (1 - distFromCenter) * 0.38;
    const opacity = isAccent
      ? Math.min(0.95, baseOpacity + 0.30)
      : isBright
      ? Math.min(0.72, baseOpacity + 0.18)
      : baseOpacity;
    const strokeWidth = isAccent ? 1.8 : isBright ? 1.1 : 0.72;
    const lineHue = i % 6 === 2 ? hue2 : hue;

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
      if (dist < 30) {
        const inf = Math.pow(1 - dist / 30, 2);
        cy += (dy / 30) * inf * 14;
      }
      path += x === 0 ? `M ${x} ${cy.toFixed(2)} ` : `L ${x} ${cy.toFixed(2)} `;
    }

    return (
      <path key={i} d={path} fill="none"
        stroke={`hsla(${lineHue.toFixed(1)}, 95%, 60%, ${opacity.toFixed(3)})`}
        strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    );
  });

  const particles = [
    { cx: 8,  cy: 22, r: 0.9,  o: 0.70 }, { cx: 92, cy: 18, r: 0.75, o: 0.65 },
    { cx: 3,  cy: 55, r: 1.0,  o: 0.60 }, { cx: 97, cy: 62, r: 0.85, o: 0.62 },
    { cx: 14, cy: 82, r: 0.80, o: 0.55 }, { cx: 88, cy: 78, r: 0.90, o: 0.58 },
    { cx: 25, cy: 12, r: 0.65, o: 0.60 }, { cx: 75, cy: 8,  r: 0.70, o: 0.58 },
    { cx: 50, cy: 5,  r: 0.85, o: 0.65 }, { cx: 50, cy: 95, r: 0.80, o: 0.55 },
    { cx: 35, cy: 45, r: 0.55, o: 0.50 }, { cx: 65, cy: 52, r: 0.60, o: 0.48 },
    { cx: 18, cy: 38, r: 0.70, o: 0.58 }, { cx: 82, cy: 42, r: 0.65, o: 0.55 },
    { cx: 42, cy: 72, r: 0.60, o: 0.52 }, { cx: 62, cy: 28, r: 0.55, o: 0.54 },
    { cx: 6,  cy: 88, r: 0.75, o: 0.48 }, { cx: 94, cy: 85, r: 0.70, o: 0.50 },
    { cx: 30, cy: 92, r: 0.65, o: 0.45 }, { cx: 70, cy: 88, r: 0.68, o: 0.47 },
    { cx: 22, cy: 65, r: 0.50, o: 0.45 }, { cx: 78, cy: 30, r: 0.52, o: 0.46 },
    { cx: 45, cy: 18, r: 0.58, o: 0.52 }, { cx: 55, cy: 80, r: 0.62, o: 0.50 },
  ];

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">

      {/* Base deep green */}
      <div className="absolute inset-0" style={{ background: '#020e05' }} />

      {/* Main center glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 110% 90% at 50% 50%, rgba(0,100,38,0.80) 0%, rgba(0,50,16,0.50) 55%, transparent 78%)',
      }} />

      {/* Bright top-center cone */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 55% at 50% -5%, rgba(0,220,88,0.55) 0%, rgba(0,140,52,0.28) 45%, transparent 68%)',
      }} />

      {/* Left edge bloom */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 55% 90% at -2% 50%, rgba(0,200,72,0.50) 0%, rgba(0,100,32,0.22) 48%, transparent 68%)',
      }} />

      {/* Right edge bloom */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 55% 90% at 102% 50%, rgba(0,210,80,0.48) 0%, rgba(0,110,36,0.20) 48%, transparent 68%)',
      }} />

      {/* Bottom reflection */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 50% at 50% 108%, rgba(0,180,68,0.52) 0%, rgba(0,90,28,0.24) 40%, transparent 60%)',
      }} />

      {/* Top-left corner accent */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 40% 40% at 0% 0%, rgba(0,230,90,0.28) 0%, transparent 65%)',
      }} />

      {/* Bottom-right corner accent */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 40% 40% at 100% 100%, rgba(0,230,90,0.24) 0%, transparent 65%)',
      }} />

      {/* Particles */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {particles.map((p, i) => {
          const pulse = 0.50 + 0.50 * Math.sin(time * 1.1 + i * 0.85);
          const sizeP = 0.75 + 0.25 * Math.sin(time * 0.7 + i * 1.3);
          const ph = i % 3 === 0 ? hue2 : hue;
          return (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r * sizeP}
              fill={`hsla(${ph.toFixed(0)}, 90%, 65%, ${(p.o * pulse).toFixed(3)})`} />
          );
        })}
      </svg>

      {/* Fluid lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="bgVig" cx="50%" cy="50%" r="70%">
            <stop offset="30%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </radialGradient>
          <linearGradient id="bgTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(0,0,0,0.30)" />
            <stop offset="20%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <linearGradient id="bgFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="80%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.30)" />
          </linearGradient>
        </defs>
        {lines}
        <rect width="100" height="100" fill="url(#bgVig)" />
        <rect width="100" height="100" fill="url(#bgTop)" />
        <rect width="100" height="100" fill="url(#bgFloor)" />
      </svg>

      {/* Geometry guide lines in green */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 1080 540" preserveAspectRatio="none">
        <line x1="540" y1="270" x2="0"    y2="140" stroke="#00e870" strokeWidth="0.6" strokeDasharray="4 8" />
        <line x1="540" y1="270" x2="1080" y2="400" stroke="#00e870" strokeWidth="0.6" strokeDasharray="4 8" />
        <line x1="540" y1="270" x2="280"  y2="540" stroke="#00d26a" strokeWidth="0.5" strokeDasharray="3 10" />
        <circle cx="540" cy="270" r="2.5" fill="#00e870" opacity="0.7" />
      </svg>

    </div>
  );
};

export default SvgFluidLinesBackground;
