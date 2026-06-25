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

  const hue  = 140 + Math.sin(time * 0.34) * 10;
  const hue2 = 155 + Math.sin(time * 0.21 + 1.4) * 8;
  const numLines = 42;

  const lines = Array.from({ length: numLines }).map((_, i) => {
    const mX = mouseRef.current.currentX;
    const mY = mouseRef.current.currentY;
    const isBright  = i % 4 === 0;
    const isAccent  = i % 7 === 3;
    const distFromCenter = Math.abs(i - numLines / 2) / (numLines / 2);
    // Lower base opacity and reduce accent boosts for subtler lines
    const baseOpacity = 0.22 + (1 - distFromCenter) * 0.22;
    const opacity = isAccent
      ? Math.min(0.60, baseOpacity + 0.20)
      : isBright
      ? Math.min(0.48, baseOpacity + 0.12)
      : baseOpacity;
    const strokeWidth = isAccent ? 1.6 : isBright ? 1.0 : 0.65;
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
        stroke={`hsla(${lineHue.toFixed(1)}, 80%, 62%, ${opacity.toFixed(3)})`}
        strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    );
  });

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">

      {/* Green base */}
      <div className="absolute inset-0" style={{ background: '#0a2614' }} />

      {/* Soft center depth */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 110% 95% at 50% 45%, rgba(0,120,56,0.50) 0%, rgba(0,72,34,0.34) 55%, rgba(0,42,20,0.18) 80%)',
      }} />

      {/* Gentle edge glows */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 50% 95% at 0% 50%, rgba(0,210,84,0.30) 0%, transparent 62%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 50% 95% at 100% 50%, rgba(0,210,84,0.30) 0%, transparent 62%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 85% 45% at 50% 105%, rgba(0,200,80,0.28) 0%, transparent 62%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 75% 40% at 50% -5%, rgba(0,215,88,0.28) 0%, transparent 62%)',
      }} />

      {/* Fluid lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="bgVig" cx="50%" cy="50%" r="75%">
            <stop offset="45%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.14)" />
          </radialGradient>
          <linearGradient id="bgTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(0,0,0,0.12)" />
            <stop offset="18%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <linearGradient id="bgFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="82%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
          </linearGradient>
        </defs>
        {lines}
        <rect width="100" height="100" fill="url(#bgVig)" />
        <rect width="100" height="100" fill="url(#bgTop)" />
        <rect width="100" height="100" fill="url(#bgFloor)" />
      </svg>

    </div>
  );
};

export default SvgFluidLinesBackground;
